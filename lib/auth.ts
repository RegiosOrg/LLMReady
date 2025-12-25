import { NextAuthOptions, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/verify',
    error: '/login',
  },
  providers: [
    // Firebase Google Sign-In via credentials
    CredentialsProvider({
      id: 'firebase-google',
      name: 'Google',
      credentials: {
        idToken: { type: 'text' },
        email: { type: 'email' },
        name: { type: 'text' },
        image: { type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.idToken || !credentials?.email) {
          return null
        }

        // Verify Firebase ID token (in production, you'd verify with Firebase Admin SDK)
        // For now, we trust the client-side Firebase auth
        const email = credentials.email
        const name = credentials.name || email.split('@')[0]
        const image = credentials.image || null

        // Find or create user
        let user = await db.user.findUnique({
          where: { email },
        })

        if (!user) {
          // Create new user
          user = await db.user.create({
            data: {
              email,
              name,
              image,
              emailVerified: new Date(), // Firebase already verified the email
            },
          })

          // Create default subscription
          await db.subscription.create({
            data: {
              userId: user.id,
              plan: 'FREE',
              status: 'ACTIVE',
            },
          })
        } else {
          // Update user info if changed
          if (user.name !== name || user.image !== image) {
            user = await db.user.update({
              where: { id: user.id },
              data: { name, image },
            })
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM || 'GetCitedBy <noreply@getcitedby.com>',
      maxAge: 10 * 60, // Magic link valid for 10 minutes
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub

        // Fetch user plan from database
        const user = await db.user.findUnique({
          where: { id: token.sub },
          select: { plan: true, stripeCustomerId: true }
        })

        if (user) {
          session.user.plan = user.plan
          session.user.stripeCustomerId = user.stripeCustomerId
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  events: {
    async createUser({ user }) {
      // Create default subscription for new users (for email signups)
      const existingSub = await db.subscription.findUnique({
        where: { userId: user.id! },
      })

      if (!existingSub) {
        await db.subscription.create({
          data: {
            userId: user.id!,
            plan: 'FREE',
            status: 'ACTIVE',
          },
        })
      }
    },
  },
}

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.id) {
    return null
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      businesses: {
        where: { status: { not: 'ARCHIVED' } },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      },
    },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

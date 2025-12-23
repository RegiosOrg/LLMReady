import { NextAuthOptions, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
      // Create default subscription for new users
      await db.subscription.create({
        data: {
          userId: user.id!,
          plan: 'FREE',
          status: 'ACTIVE',
        },
      })
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

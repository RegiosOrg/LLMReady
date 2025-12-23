import { Plan } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      plan?: Plan
      stripeCustomerId?: string | null
    }
  }

  interface User {
    id: string
    email: string
    plan?: Plan
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    plan?: Plan
  }
}

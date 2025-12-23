import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserLimits } from '@/lib/subscription'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limits = await getUserLimits(session.user.id)

    return NextResponse.json(limits)
  } catch (error) {
    console.error('Error fetching user limits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch limits' },
      { status: 500 }
    )
  }
}

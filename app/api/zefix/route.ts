import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchByName, getByUID, isValidUID } from '@/lib/zefix'

// GET /api/zefix?q=search_term or GET /api/zefix?uid=CHE-xxx.xxx.xxx
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const uid = searchParams.get('uid')
    const canton = searchParams.get('canton')

    // Lookup by UID
    if (uid) {
      if (!isValidUID(uid)) {
        return NextResponse.json(
          { error: 'Invalid UID format. Expected: CHE-XXX.XXX.XXX' },
          { status: 400 }
        )
      }

      const company = await getByUID(uid)
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(company)
    }

    // Search by name
    if (query) {
      if (query.length < 2) {
        return NextResponse.json(
          { error: 'Search query must be at least 2 characters' },
          { status: 400 }
        )
      }

      const results = await searchByName(query, {
        canton: canton || undefined,
        maxRecords: 10,
      })

      return NextResponse.json(results)
    }

    return NextResponse.json(
      { error: 'Please provide a search query (q) or UID' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Zefix API error:', error)
    return NextResponse.json(
      { error: 'Failed to query Zefix' },
      { status: 500 }
    )
  }
}

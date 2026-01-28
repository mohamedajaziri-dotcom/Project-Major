import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { parseDate } from '@/lib/date-utils'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, energy, note } = body

    // Validate required fields
    if (!date || !energy) {
      return NextResponse.json(
        { error: 'Missing required fields (date, energy)' },
        { status: 400 }
      )
    }

    // Validate energy range
    if (energy < 1 || energy > 10) {
      return NextResponse.json(
        { error: 'Energy must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Create or update daily check-in
    const checkin = await prisma.dailyCheckin.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: parseDate(date),
        },
      },
      update: {
        energy,
        note,
      },
      create: {
        userId: user.id,
        date: parseDate(date),
        energy,
        note,
      },
    })

    return NextResponse.json({ success: true, checkin })
  } catch (error: any) {
    console.error('Error creating check-in:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

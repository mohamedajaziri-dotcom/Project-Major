import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { startTime, endTime, durationMinutes, leverageType, context, taskId, note } = body

    // Validate required fields
    if (!startTime || !endTime || !durationMinutes || !leverageType) {
      return NextResponse.json(
        { error: 'Missing required fields: startTime, endTime, durationMinutes, leverageType' },
        { status: 400 }
      )
    }

    // Validate leverageType
    if (!['HL', 'MT', 'LL'].includes(leverageType)) {
      return NextResponse.json(
        { error: 'Invalid leverageType. Must be HL, MT, or LL' },
        { status: 400 }
      )
    }

    // Validate timestamps and duration
    const start = new Date(startTime)
    const end = new Date(endTime)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for startTime or endTime' },
        { status: 400 }
      )
    }
    if (end <= start) {
      return NextResponse.json(
        { error: 'endTime must be after startTime' },
        { status: 400 }
      )
    }
    if (durationMinutes <= 0) {
      return NextResponse.json(
        { error: 'durationMinutes must be positive' },
        { status: 400 }
      )
    }

    // Calculate XP earned
    const xpPerHour = leverageType === 'HL' ? 10 : leverageType === 'MT' ? 5 : 2
    const xpEarned = Math.round((durationMinutes / 60) * xpPerHour)

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        startTime: start,
        endTime: end,
        durationMinutes,
        leverageType,
        context,
        taskId,
        note,
        xpEarned,
      },
    })

    // Update user stats
    await prisma.userStats.upsert({
      where: { userId: user.id },
      update: {
        totalXP: { increment: xpEarned },
      },
      create: {
        userId: user.id,
        totalXP: xpEarned,
        weeklyHLTarget: 10,
      },
    })

    return NextResponse.json({ success: true, session })
  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
      take: 50,
    })

    return NextResponse.json({ sessions })
  } catch (error: any) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions. Please try again.' },
      { status: 500 }
    )
  }
}

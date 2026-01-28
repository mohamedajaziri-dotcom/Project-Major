import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getWeekStart, getWeekEnd, formatDate } from '@/lib/date-utils'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weekStartParam = searchParams.get('weekStart')
    
    // Calculate week boundaries
    const referenceDate = weekStartParam ? new Date(weekStartParam) : new Date()
    const weekStart = getWeekStart(referenceDate)
    const weekEnd = getWeekEnd(referenceDate)

    // Get user stats for target
    const userStats = await prisma.userStats.findUnique({
      where: { userId: user.id },
    })
    const target = userStats?.weeklyHLTarget || 10

    // Get all sessions for this week
    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    })

    // Calculate hours by leverage type
    const hlMinutes = sessions
      .filter((s) => s.leverageType === 'HL')
      .reduce((sum, s) => sum + s.durationMinutes, 0)
    const mtMinutes = sessions
      .filter((s) => s.leverageType === 'MT')
      .reduce((sum, s) => sum + s.durationMinutes, 0)
    const llMinutes = sessions
      .filter((s) => s.leverageType === 'LL')
      .reduce((sum, s) => sum + s.durationMinutes, 0)

    const hlHours = hlMinutes / 60
    const mtHours = mtMinutes / 60
    const llHours = llMinutes / 60
    const totalHours = (hlMinutes + mtMinutes + llMinutes) / 60

    // Calculate remaining HL hours
    const remaining = Math.max(0, target - hlHours)

    // Calculate XP this week
    const xpThisWeek = sessions.reduce((sum, s) => sum + s.xpEarned, 0)

    // Get today's XP
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySessions = sessions.filter((s) => {
      const sessionDate = new Date(s.startTime)
      sessionDate.setHours(0, 0, 0, 0)
      return sessionDate.getTime() === today.getTime()
    })
    const xpToday = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0)

    // Group by context
    const contextMap = new Map<string, number>()
    sessions.forEach((s) => {
      const ctx = s.context || 'General'
      const hours = s.durationMinutes / 60
      contextMap.set(ctx, (contextMap.get(ctx) || 0) + hours)
    })
    const byContext = Array.from(contextMap.entries()).map(([context, hours]) => ({
      context,
      hours,
    }))

    // Get quests for this week
    const quests = await prisma.weeklyQuest.findMany({
      where: {
        userId: user.id,
        weekStart: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        tasks: true,
      },
    })

    // Calculate quest progress
    const questsWithProgress = quests.map((quest) => {
      const completedTasks = quest.tasks.filter((t) => t.completed).length
      const totalTasks = quest.tasks.length
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      return {
        id: quest.id,
        title: quest.title,
        progress,
      }
    })

    // Get streak
    const streak = userStats?.currentStreak || 0
    const coins = userStats?.coins || 0

    return NextResponse.json({
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      hlHours,
      mtHours,
      llHours,
      totalHours,
      target,
      remaining,
      xpThisWeek,
      xpToday,
      byContext,
      quests: questsWithProgress,
      streak,
      coins,
    })
  } catch (error: any) {
    console.error('Error fetching weekly stats:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

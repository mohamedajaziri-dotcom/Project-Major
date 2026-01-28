import { supabase } from './supabaseClient';
import { 
  Quest, 
  Task, 
  Session, 
  DailyCheckin, 
  WeeklyStats, 
  TaskStatus,
  LeverageType,
  SessionContext,
  WeeklyTarget
} from './types';
import { getWeekStart, formatDate, formatDateTime, isWorkHours } from './utils';

/**
 * Get or create weekly target for a user
 */
export async function getWeeklyTarget(userId: string, weekStart: Date): Promise<number> {
  const weekStartStr = formatDate(weekStart);
  
  const { data, error } = await supabase
    .from('weekly_targets')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStartStr)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching weekly target:', error);
    return 20; // Default target
  }
  
  if (!data) {
    // Create default target
    const { data: newTarget } = await supabase
      .from('weekly_targets')
      .insert({
        user_id: userId,
        week_start: weekStartStr,
        hl_hours_target: 20,
      })
      .select()
      .single();
    
    return newTarget?.hl_hours_target || 20;
  }
  
  return data.hl_hours_target;
}

/**
 * Get weekly statistics for a user
 */
export async function getWeeklyStats(userId: string, weekStart: Date): Promise<WeeklyStats> {
  const weekStartStr = formatDate(weekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = formatDate(weekEnd);
  
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', weekStartStr)
    .lt('start_time', weekEndStr);
  
  if (error) {
    console.error('Error fetching weekly sessions:', error);
    return {
      weekStart: weekStartStr,
      totalHLMinutes: 0,
      totalMTMinutes: 0,
      totalLLMinutes: 0,
      hlHours: 0,
      mtHours: 0,
      llHours: 0,
      hlByContext: { work: 0, evening: 0, weekend: 0 },
      llAtWork: 0,
      sessionCount: 0,
      daysWithHL: 0,
    };
  }
  
  let totalHLMinutes = 0;
  let totalMTMinutes = 0;
  let totalLLMinutes = 0;
  const hlByContext = { work: 0, evening: 0, weekend: 0 };
  let llAtWork = 0;
  const daysWithHLSet = new Set<string>();
  
  sessions?.forEach((session) => {
    const minutes = session.duration_minutes;
    
    switch (session.leverage_type) {
      case 'HL':
        totalHLMinutes += minutes;
        hlByContext[session.context as SessionContext] += minutes;
        daysWithHLSet.add(session.start_time.split('T')[0]);
        break;
      case 'MT':
        totalMTMinutes += minutes;
        break;
      case 'LL':
        totalLLMinutes += minutes;
        if (session.context === 'work') {
          llAtWork += minutes;
        }
        break;
    }
  });
  
  return {
    weekStart: weekStartStr,
    totalHLMinutes,
    totalMTMinutes,
    totalLLMinutes,
    hlHours: totalHLMinutes / 60,
    mtHours: totalMTMinutes / 60,
    llHours: totalLLMinutes / 60,
    hlByContext: {
      work: hlByContext.work / 60,
      evening: hlByContext.evening / 60,
      weekend: hlByContext.weekend / 60,
    },
    llAtWork,
    sessionCount: sessions?.length || 0,
    daysWithHL: daysWithHLSet.size,
  };
}

/**
 * Get today's tasks for a user
 */
export async function getTodayTasks(userId: string, today: Date = new Date()): Promise<Task[]> {
  const todayStr = formatDate(today);
  const weekStart = getWeekStart(today);
  const weekStartStr = formatDate(weekStart);
  
  // Get tasks planned for today OR TODO tasks from active quest
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .or(`planned_date.eq.${todayStr},and(planned_date.is.null,status.eq.TODO)`)
    .order('created_at', { ascending: true })
    .limit(10);
  
  if (error) {
    console.error('Error fetching today tasks:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Upsert daily check-in
 */
export async function upsertDailyCheckin(
  userId: string,
  date: Date,
  energy: number,
  note?: string
): Promise<DailyCheckin | null> {
  const dateStr = formatDate(date);
  
  const { data, error } = await supabase
    .from('daily_checkins')
    .upsert({
      user_id: userId,
      date: dateStr,
      energy,
      note,
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error upserting daily checkin:', error);
    return null;
  }
  
  return data;
}

/**
 * Create or update Major Quest for the week
 */
export async function createOrUpdateMajorQuest(
  userId: string,
  weekStart: Date,
  title: string,
  successMetric?: string
): Promise<Quest | null> {
  const weekStartStr = formatDate(weekStart);
  
  // Check if major quest exists for this week
  const { data: existing } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStartStr)
    .eq('is_major', true)
    .single();
  
  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('quests')
      .update({
        title,
        success_metric: successMetric,
      })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating major quest:', error);
      return null;
    }
    
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('quests')
      .insert({
        user_id: userId,
        week_start: weekStartStr,
        title,
        success_metric: successMetric,
        is_major: true,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating major quest:', error);
      return null;
    }
    
    return data;
  }
}

/**
 * Get Major Quest for the week
 */
export async function getMajorQuest(userId: string, weekStart: Date): Promise<Quest | null> {
  const weekStartStr = formatDate(weekStart);
  
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStartStr)
    .eq('is_major', true)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching major quest:', error);
  }
  
  return data || null;
}

/**
 * Create a new task
 */
export async function createTask(
  userId: string,
  title: string,
  questId?: number,
  plannedDate?: Date,
  estimateMinutes?: number,
  leverageType?: LeverageType
): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      quest_id: questId,
      title,
      status: 'TODO',
      planned_date: plannedDate ? formatDate(plannedDate) : undefined,
      estimate_minutes: estimateMinutes,
      leverage_type: leverageType,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  
  return data;
}

/**
 * Update task status
 */
export async function updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task status:', error);
    return null;
  }
  
  return data;
}

/**
 * Get tasks for a quest
 */
export async function getQuestTasks(questId: number): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('quest_id', questId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching quest tasks:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Create a session
 */
export async function createSession(
  userId: string,
  startTime: Date,
  durationMinutes: number,
  leverageType: LeverageType,
  context: SessionContext,
  taskId?: number,
  note?: string
): Promise<Session | null> {
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
  
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      task_id: taskId,
      start_time: formatDateTime(startTime),
      end_time: formatDateTime(endTime),
      duration_minutes: durationMinutes,
      leverage_type: leverageType,
      context,
      note,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating session:', error);
    return null;
  }
  
  return data;
}

/**
 * Get sessions for date range
 */
export async function getSessions(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', formatDateTime(startDate))
    .lt('start_time', formatDateTime(endDate))
    .order('start_time', { ascending: false });
  
  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Database type definitions
 */

export type LeverageType = "HL" | "MT" | "LL";
export type TaskStatus = "TODO" | "DOING" | "DONE" | "SKIPPED";
export type SessionContext = "work" | "evening" | "weekend";

export interface WeeklyTarget {
  id?: number;
  user_id: string;
  week_start: string; // ISO date string
  hl_hours_target: number;
  created_at?: string;
}

export interface Quest {
  id?: number;
  user_id: string;
  week_start: string; // ISO date string (Monday)
  title: string;
  success_metric?: string;
  is_major?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id?: number;
  user_id: string;
  quest_id?: number;
  title: string;
  status: TaskStatus;
  planned_date?: string; // ISO date string
  estimate_minutes?: number;
  leverage_type?: LeverageType;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id?: number;
  user_id: string;
  task_id?: number;
  start_time: string; // ISO datetime string
  end_time?: string; // ISO datetime string
  duration_minutes: number;
  leverage_type: LeverageType;
  context: SessionContext;
  note?: string;
  created_at?: string;
}

export interface DailyCheckin {
  id?: number;
  user_id: string;
  date: string; // ISO date string
  energy?: number; // 1-5 scale
  note?: string;
  created_at?: string;
}

// Helper type for database operations
export interface Database {
  public: {
    Tables: {
      weekly_targets: {
        Row: WeeklyTarget;
        Insert: Omit<WeeklyTarget, 'id' | 'created_at'>;
        Update: Partial<Omit<WeeklyTarget, 'id' | 'created_at'>>;
      };
      quests: {
        Row: Quest;
        Insert: Omit<Quest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Quest, 'id' | 'created_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id' | 'created_at'>;
        Update: Partial<Omit<Session, 'id' | 'created_at'>>;
      };
      daily_checkins: {
        Row: DailyCheckin;
        Insert: Omit<DailyCheckin, 'id' | 'created_at'>;
        Update: Partial<Omit<DailyCheckin, 'id' | 'created_at'>>;
      };
    };
  };
}

// Stats and computed types
export interface WeeklyStats {
  weekStart: string;
  totalHLMinutes: number;
  totalMTMinutes: number;
  totalLLMinutes: number;
  hlHours: number;
  mtHours: number;
  llHours: number;
  hlByContext: {
    work: number;
    evening: number;
    weekend: number;
  };
  llAtWork: number; // LL minutes during work hours (leakage)
  sessionCount: number;
  daysWithHL: number;
}

export interface LifeStats {
  birthdate: Date;
  currentAge: number;
  expectedDeathAge: number;
  remainingYears: number;
  remainingDays: number;
  remainingHours: number;
  remainingSleep: number;
  remainingWork: number;
  remainingFree: number;
  weeklyFreeHours: number;
  weeklyWorkHours: number;
}

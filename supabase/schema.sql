# SQL schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (keeping for compatibility)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Weekly targets for HL hours
CREATE TABLE IF NOT EXISTS weekly_targets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  hl_hours_target DECIMAL(5,2) DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Quests (weekly missions)
CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  week_start DATE NOT NULL,
  title TEXT NOT NULL,
  success_metric TEXT,
  is_major BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  quest_id INTEGER REFERENCES quests(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'TODO' CHECK (status IN ('TODO', 'DOING', 'DONE', 'SKIPPED')),
  planned_date DATE,
  estimate_minutes INTEGER,
  leverage_type VARCHAR(2) CHECK (leverage_type IN ('HL', 'MT', 'LL')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions (focus time tracking)
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_minutes INTEGER NOT NULL,
  leverage_type VARCHAR(2) NOT NULL CHECK (leverage_type IN ('HL', 'MT', 'LL')),
  context VARCHAR(20) NOT NULL CHECK (context IN ('work', 'evening', 'weekend')),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily check-ins
CREATE TABLE IF NOT EXISTS daily_checkins (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  energy INTEGER CHECK (energy >= 1 AND energy <= 5),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_quest_id ON tasks(quest_id);
CREATE INDEX IF NOT EXISTS idx_tasks_planned_date ON tasks(planned_date);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_quests_user_week ON quests(user_id, week_start);

-- Legacy tables (keeping for compatibility)
CREATE TABLE IF NOT EXISTS checkins (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  checkin_time TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS weekly_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  report_date TIMESTAMP DEFAULT NOW(),
  content TEXT
);

-- RLS Policies (when auth is implemented)
-- ALTER TABLE weekly_targets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;


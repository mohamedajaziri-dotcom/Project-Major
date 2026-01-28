# SQL schema for Supabase

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE checkins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES profiles(id),
  checkin_time TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weekly_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES profiles(id),
  report_date TIMESTAMP DEFAULT NOW(),
  content TEXT
);

-- Other tables as needed

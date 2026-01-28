# Project Major - MVP

A high-leverage work tracking application built with Next.js, TypeScript, Tailwind CSS, Supabase, and Prisma.

## 🚀 Quick Start - How to Access the Application

**Already have everything set up?** Just run:
```bash
npm run dev
```
Then open **[http://localhost:3000](http://localhost:3000)** in your browser!

**First time here?** See the **[📖 Getting Started Guide](GETTING_STARTED.md)** for a complete walkthrough (10 minutes).

**Don't have Supabase credentials yet?** Follow the [detailed setup instructions](#setup-instructions) below.

---

## Features

- 🚀 Track high-leverage (HL), maintenance (MT), and low-leverage (LL) work sessions
- 📊 Weekly progress tracking and North Star metrics (WHLH - Weekly High-Leverage Hours)
- ⏱️ Focus timer for deep work sessions
- 📝 Quick logging for completed work
- 🎯 Weekly quests and task management
- 📈 Weekly review with insights and analytics
- ⚡ Energy check-ins and commitment tracking
- 🎁 XP, streaks, and rewards system

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (email + password)
- **Database**: Supabase Postgres with Prisma ORM
- **Date Handling**: date-fns with Europe/London timezone support

## Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account and project
- PostgreSQL database (via Supabase)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd Project-Major
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to find your credentials
3. Go to Project Settings > Database to find your connection strings

### 4. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URLs (from Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.com:5432/postgres
```

### 5. Set up the database

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 6. Run the development server

```bash
npm run dev
```

**🎉 Your app is now running!** Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. First-time user flow

1. You'll see the login page at `http://localhost:3000/login`
2. Click **"Don't have an account? Sign up"**
3. Enter your email and password to create an account
4. Check your email for the confirmation link (click it to verify)
5. Return to the login page and sign in
6. You'll be redirected to the home dashboard at `http://localhost:3000`

**🎯 Start tracking your high-leverage work!**

---

## 🛠️ Troubleshooting

### "Can't connect to the application"
- Make sure the dev server is running: `npm run dev`
- Check that you're accessing `http://localhost:3000`
- Verify no other app is using port 3000

### "Database connection error"
- Verify your `DATABASE_URL` and `DIRECT_URL` in `.env.local`
- Make sure you ran `npx prisma db push`
- Check your Supabase database is active

### "Authentication not working"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check email confirmation if signing up for the first time
- Clear browser cache and cookies

### "Build fails"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js 18+

### Need help?
Open an issue on GitHub with:
- Error message
- Steps you've taken
- Your Node.js version (`node --version`)

---

## Project Structure

```
/app
  /(auth)          # Authentication routes (login, callback)
  /(app)           # Protected app routes
    /plan          # Weekly planning and quests
    /focus         # Focus timer
    /log           # Quick logging
    /review        # Weekly review
    /inventory     # Skills inventory (Phase 2)
    /settings      # User settings
  /api             # API routes
    /sessions      # Session CRUD
    /checkin       # Daily check-ins
    /weekly        # Weekly statistics
/lib               # Utilities
  /supabase        # Supabase client utilities
  date-utils.ts    # Date/time helpers (Europe/London)
  prisma.ts        # Prisma client
/prisma
  schema.prisma    # Database schema
```

## Core Concepts

### North Star Metric: WHLH
**Weekly High-Leverage Hours (WHLH)** - The total sum of HL session durations per week. Week starts Monday 00:00 Europe/London timezone.

### Leverage Types
- **HL (High Leverage)**: Deep work that creates outsized impact
- **MT (Maintenance)**: Necessary operational tasks
- **LL (Low Leverage)**: Administrative or low-impact work

### XP System
- HL work: 10 XP per hour
- MT work: 5 XP per hour
- LL work: 2 XP per hour

## API Endpoints

### POST /api/sessions
Create a new work session.

```json
{
  "startTime": "2024-01-01T10:00:00Z",
  "endTime": "2024-01-01T11:00:00Z",
  "durationMinutes": 60,
  "leverageType": "HL",
  "context": "deep work",
  "note": "Completed feature X"
}
```

### POST /api/checkin
Log daily energy check-in.

```json
{
  "date": "2024-01-01",
  "energy": 8,
  "note": "Feeling great today"
}
```

### GET /api/weekly?weekStart=YYYY-MM-DD
Get weekly statistics.

Returns:
```json
{
  "weekStart": "2024-01-01",
  "weekEnd": "2024-01-07",
  "hlHours": 12.5,
  "target": 10,
  "remaining": 0,
  "xpThisWeek": 125,
  "byContext": [
    { "context": "deep work", "hours": 8.5 },
    { "context": "learning", "hours": 4.0 }
  ]
}
```

## Development

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Database management

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

## MVP Scope

Current implementation includes:
- ✅ Authentication (email/password via Supabase)
- ✅ Home dashboard with all key sections
- ✅ Focus timer with session tracking
- ✅ Quick logging interface
- ✅ Weekly review with statistics
- ✅ Basic planning (quests - UI only)
- ✅ Settings page
- ✅ Mobile-first responsive design
- ✅ API routes for sessions, check-ins, and weekly stats

Phase 2 features:
- Skills & strengths inventory
- Advanced task management
- Notifications and reminders
- Social features
- Advanced analytics

## License

MIT

# Project Major

A productivity app for tracking high-leverage work, managing quests, and optimizing your time.

## Features

- **Life Remaining Dashboard**: See your remaining lifetime broken down into sleep, work, and free time
- **Weekly HL Hours Tracking**: Track High Leverage (HL), Medium Task (MT), and Low Leverage (LL) work
- **Major Quest System**: Set and track your weekly main mission
- **Task Management**: Plan daily tasks with estimates and leverage types
- **Focus Timer**: Built-in timer for focused work sessions
- **Weekly Review**: Analyze your productivity patterns and insights

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   
   Create `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Database Setup**
   
   Run the SQL schema in your Supabase project:
   ```bash
   # Go to Supabase dashboard > SQL Editor
   # Run the contents of supabase/schema.sql
   ```

4. **Configure Dev User**
   
   Edit `lib/devUser.ts` and set your user UUID:
   ```typescript
   export const DEV_USER_ID = "your-uuid-here";
   ```

### Running the App

**Option 1: One-click via VS Code Task**
- Press `Ctrl+Shift+B` (Windows) or `Cmd+Shift+B` (Mac)
- Select "Dev Server + Open Browser"

**Option 2: Command Line**
```bash
# Auto-open browser (Windows)
npm run dev:open

# Or standard dev server
npm run dev
```

The app will open at http://localhost:3000

## Usage

### Daily Workflow
1. **Home Page**: View your weekly progress, major quest, and today's tasks
2. **Start Focus Session**: Click timer button to track HL/MT/LL work
3. **Mark Tasks Done**: Check off completed tasks directly from home
4. **Review Progress**: See your weekly stats and insights

### Weekly Planning
1. Go to **Plan** page
2. Set your Major Quest for the week
3. Add tasks with planned dates and estimates
4. Assign leverage types (HL/MT/LL) to prioritize

### Session Tracking
- **HL (High Leverage)**: Deep work that moves you forward (goal: 20h/week)
- **MT (Medium Task)**: Important but less strategic work
- **LL (Low Leverage)**: Necessary but low-value tasks

Context is auto-suggested based on time:
- **Work**: Mon-Fri 9am-5pm
- **Evening**: Weekday evenings
- **Weekend**: Saturday-Sunday

## Project Structure

```
app/
  (app)/
    page.tsx          # Home dashboard
    plan/page.tsx     # Weekly planning
    focus/page.tsx    # Focus timer
    review/page.tsx   # Weekly review
components/
  ProgressRing.tsx    # Progress visualization
  UrgencyCard.tsx     # Life remaining stats
  MajorQuestCard.tsx  # Quest display
  TaskList.tsx        # Task list component
  Timer.tsx           # Focus session timer
lib/
  supabaseClient.ts   # Supabase client setup
  db.ts               # Database helper functions
  utils.ts            # Utility functions
  types.ts            # TypeScript type definitions
  devUser.ts          # Dev user constant
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom components
- **Notifications**: Sonner

## Development

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## TODO

- [ ] Implement proper authentication (replace DEV_USER_ID)
- [ ] Add RLS policies in Supabase
- [ ] Add data visualization charts
- [ ] Mobile app wrapper
- [ ] Export weekly reports
- [ ] Social accountability features

## License

Private project

# Getting Started with Project Major

This guide will walk you through setting up and accessing Project Major from scratch.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Accessing the Application](#accessing-the-application)
- [Your First Session](#your-first-session)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 18 or higher** - [Download here](https://nodejs.org/)
   ```bash
   node --version  # Should be v18.x.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **A code editor** (VS Code, Sublime, etc.)

4. **Git** - [Download here](https://git-scm.com/)

---

## Step-by-Step Setup

### Step 1: Get the Code

Clone the repository:
```bash
git clone https://github.com/mohamedajaziri-dotcom/Project-Major.git
cd Project-Major
```

### Step 2: Install Dependencies

Install all required packages:
```bash
npm install
```

This will take 1-2 minutes. You'll see a progress bar as packages are downloaded.

### Step 3: Create a Supabase Account (FREE)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Create a new organization (use any name)

### Step 4: Create a Supabase Project

1. Click **"New Project"**
2. Fill in:
   - **Name**: `project-major` (or any name you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. Wait ~2 minutes for setup to complete

### Step 5: Get Your Credentials

Once your project is ready:

1. **Go to Project Settings** (gear icon in sidebar)
2. Click **"API"** in the left menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this
   - **service_role** key - Click "Reveal" and copy this

4. **Go to Project Settings > Database**
5. Scroll to **Connection String** section
6. Copy both:
   - **Connection pooling** URL (for DATABASE_URL)
   - **Direct connection** URL (for DIRECT_URL)

### Step 6: Configure Environment Variables

1. In your project folder, find `.env.example`
2. Copy it to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` in your editor
4. Replace the placeholders with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URLs
DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.com:5432/postgres
```

**Important**: Replace `[PASSWORD]` in the URLs with your actual database password!

### Step 7: Initialize the Database

Run these commands to set up your database tables:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

You should see: ✅ "Your database is now in sync with your Prisma schema"

### Step 8: Start the Application

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
✓ Ready in 1.2s
```

---

## Accessing the Application

### Open in Your Browser

1. Open your browser (Chrome, Firefox, Safari, etc.)
2. Go to: **http://localhost:3000**

### Create Your Account

You'll see the login page. Let's create your account:

1. Click **"Don't have an account? Sign up"**
2. Enter your email address
3. Create a password (at least 6 characters)
4. Click **"Sign up"**

### Verify Your Email

1. Check your email inbox
2. Look for an email from Supabase
3. Click the confirmation link
4. Return to the login page

### Sign In

1. Enter your email and password
2. Click **"Sign in"**
3. You'll be redirected to the home dashboard!

---

## Your First Session

Now that you're in, let's track your first high-leverage work session:

### Option 1: Start a Timer

1. Click the big blue button: **"🚀 Start HL Session (60 min)"**
2. Or click **"Start 15-min HL Sprint"** for a quick session
3. The timer will count down
4. When done, it automatically logs to your weekly stats!

### Option 2: Quick Log Past Work

1. Click **"Log HL"** button (in the Quick Log section)
2. Adjust the duration slider
3. Add notes about what you worked on
4. Click **"Log Session"**

### Explore the Features

- **Home** - Your dashboard and weekly progress
- **Plan** - Create weekly quests and tasks
- **Focus** - Start a timed work session
- **Log** - Quickly log completed work
- **Review** - See your weekly statistics
- **Settings** - Adjust your weekly target

---

## Troubleshooting

### Port 3000 Already in Use

If you see "Port 3000 is already in use":
```bash
# Kill the process on port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Cannot Connect to Database

1. Double-check your `.env.local` file
2. Make sure both DATABASE_URL and DIRECT_URL are correct
3. Verify your database password doesn't have special characters that need escaping
4. Test connection: `npx prisma db pull`

### Supabase Email Not Arriving

1. Check your spam folder
2. In Supabase dashboard, go to Authentication > Email Templates
3. You can disable email confirmation for development:
   - Go to Authentication > Settings
   - Turn off "Enable email confirmations"

### App Shows Blank Page

1. Open browser console (F12)
2. Look for errors
3. Make sure all environment variables are set
4. Try clearing browser cache (Ctrl+Shift+Delete)

### "Module not found" Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Still Having Issues?

1. Check the [main README troubleshooting section](README.md#-troubleshooting)
2. Open an issue on GitHub with:
   - Your error message
   - Steps you've tried
   - Node.js version
   - Operating system

---

## Next Steps

Now that you're set up:

1. **Set your weekly target** - Go to Settings and adjust your HL hours goal
2. **Log your energy** - Use the energy slider daily to track how you feel
3. **Create a quest** - Go to Plan and add your first weekly goal
4. **Review your week** - Check out the Review page on Sundays

**Happy tracking! 🚀**

---

## Quick Reference

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset
```

### Important URLs

- **Application**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Prisma Studio**: http://localhost:5555 (after running `npx prisma studio`)

### Default Credentials

- Create your own during sign-up
- No default accounts provided for security

### Support

- GitHub Issues: [Report a bug](https://github.com/mohamedajaziri-dotcom/Project-Major/issues)
- Documentation: See [README.md](README.md)

# Quick Reference Card

## 🚀 How to Access the Application

### If You're Set Up Already:
```bash
npm run dev
```
Open **http://localhost:3000** in your browser!

### First Time? Need Help?
👉 See [GETTING_STARTED.md](GETTING_STARTED.md) for full setup guide

---

## 📍 Important URLs

| What | URL | Notes |
|------|-----|-------|
| **Application** | http://localhost:3000 | Main app |
| **Login** | http://localhost:3000/login | Sign in/up |
| **Home Dashboard** | http://localhost:3000 | After login |
| **Supabase Dashboard** | https://supabase.com/dashboard | Manage database |
| **Prisma Studio** | http://localhost:5555 | View database (after `npx prisma studio`) |

---

## ⚡ Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npx prisma generate

# Update database schema
npx prisma db push

# View database in browser
npx prisma studio
```

---

## 🔧 Common Issues & Quick Fixes

### "Cannot connect to database"
```bash
# Verify environment variables in .env.local
# Then regenerate Prisma and push schema
npx prisma generate
npx prisma db push
```

### "Port 3000 already in use"
```bash
# Mac/Linux: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### "Module not found" errors
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Authentication not working"
- Check email for confirmation link
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Clear browser cache

---

## 📱 App Navigation

### Desktop Navigation (Top Bar)
- Home | Plan | Focus | Log | Review | Settings ⚙️

### Mobile Navigation (Bottom Bar)
- 🏠 Home | 📋 Plan | ⏱️ Focus | ✏️ Log | 📊 Review

---

## 🎯 Core Features Quick Guide

### Track a Session
**Option 1: Timer**
1. Home → Click "🚀 Start HL Session"
2. Work while timer runs
3. Complete when done ✓

**Option 2: Quick Log**
1. Home → Click "Log HL"
2. Set duration and notes
3. Submit

### Check Your Progress
- **Home**: Weekly progress bar
- **Review**: Detailed stats and insights

### Plan Your Week
- **Plan**: Create quests and tasks
- **Home**: Set daily HL commitment

### Weekly Review
- **Review** page (Sundays)
- See all stats, add reflection

---

## 🔑 First-Time Setup Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Create Supabase account (free)
- [ ] Get Supabase credentials
- [ ] Create `.env.local` file
- [ ] Add all environment variables
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Create account and verify email
- [ ] Start tracking! 🎉

---

## 📊 Understanding Your Stats

### Leverage Types
- **HL** (High Leverage): Deep work, high impact → 10 XP/hour
- **MT** (Maintenance): Necessary tasks → 5 XP/hour
- **LL** (Low Leverage): Admin work → 2 XP/hour

### Weekly North Star
**WHLH** = Weekly High-Leverage Hours
- Your main metric
- Week starts Monday 00:00 (Europe/London time)
- Set your target in Settings

### Rewards
- **XP**: Earned from sessions (varies by type)
- **Streak**: Consecutive days with check-ins
- **Coins**: Future feature for Phase 2

---

## 🛟 Need More Help?

| Resource | Link | Purpose |
|----------|------|---------|
| Full Setup Guide | [GETTING_STARTED.md](GETTING_STARTED.md) | Complete walkthrough |
| Visual Guide | [VISUAL_GUIDE.md](VISUAL_GUIDE.md) | See what to expect |
| Main README | [README.md](README.md) | Full documentation |
| Troubleshooting | [README.md#troubleshooting](README.md#-troubleshooting) | Common issues |
| GitHub Issues | [Report a bug](https://github.com/mohamedajaziri-dotcom/Project-Major/issues) | Get support |

---

## 💡 Pro Tips

1. **Set realistic targets** - Start with 5-10 HL hours/week
2. **Log energy daily** - Track your patterns
3. **Use 15-min sprints** - Build momentum
4. **Review weekly** - Sunday evening ritual
5. **Keep notes** - Context helps later

---

## 🎓 Learning Path

**Day 1**: Setup + create account + log first session  
**Day 2**: Set weekly target + create a quest  
**Day 3**: Use focus timer + log energy  
**Week 1**: Track consistently, find your rhythm  
**Week 2**: Review stats, adjust target  
**Ongoing**: Build your high-leverage habits! 🚀

---

## 📞 Support

**Before opening an issue**, check:
1. Environment variables are correct
2. Database is initialized (`npx prisma db push`)
3. Server is running (`npm run dev`)
4. Browser console for errors (F12)

**When reporting issues, include**:
- Error message
- Node.js version (`node --version`)
- Operating system
- Steps to reproduce

---

**Happy tracking! 📈**

*Keep this card bookmarked for quick reference!*

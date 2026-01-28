# Visual Guide - What You'll See

This document shows what to expect when accessing Project Major for the first time.

## 🌐 Accessing the Application

### Step 1: Open Your Browser
After running `npm run dev`, you'll see in your terminal:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000
✓ Ready in 1.2s
```

### Step 2: Navigate to the URL
Open your browser and go to: **http://localhost:3000**

---

## 📱 What You'll See

### First Visit - Login Page

When you first access the application, you'll be automatically redirected to the login page:

**URL**: `http://localhost:3000/login`

**The page contains:**
- 🎯 Application title: "Sign in to Project Major"
- 📧 Email input field
- 🔒 Password input field
- 🔵 "Sign in" button
- 🔗 "Don't have an account? Sign up" link

**Design**: Clean, modern interface with a gradient background (blue to indigo) and centered white card.

---

### Creating an Account (Sign Up)

Click "Don't have an account? Sign up" to see:

**The page changes to show:**
- 🎯 Title: "Create your account"
- 📧 Email input field
- 🔒 Password input field
- 🔵 "Sign up" button
- 🔗 "Already have an account? Sign in" link

**After clicking Sign up:**
- ✅ Success message: "Check your email for the confirmation link!"
- 📨 You'll receive an email from Supabase
- 🔗 Click the link in the email to verify

---

### After Login - Home Dashboard

Once logged in, you'll see the main dashboard at `http://localhost:3000`:

**Top Section - Navigation Bar (Desktop)**
- Logo: "Project Major" (left side)
- Links: Home | Plan | Focus | Log | Review
- Settings icon (gear, right side)

**Bottom Navigation (Mobile)**
- 🏠 Home
- 📋 Plan
- ⏱️ Focus
- ✏️ Log
- 📊 Review

**Main Dashboard Sections (Scrollable):**

1. **Weekly North Star**
   - Purple gradient card
   - Shows: "X.X / 10 hours" (your HL hours vs target)
   - Subtitle: "WHLH (Weekly High-Leverage Hours)"

2. **Progress Bar**
   - Visual progress indicator
   - Percentage completed
   - "X.X HL hours remaining to hit target"

3. **Start HL Session CTA**
   - Large blue button
   - "🚀 Start HL Session (60 min)"

4. **Today's Plan**
   - White card
   - Shows daily focus areas

5. **Energy Check-in**
   - Slider from 1-10
   - "How's your energy today?"
   - Green "Save Energy Level" button

6. **Today's HL Commitment**
   - Three buttons: "1 Session" | "2 Sessions" | "3 Sessions"
   - Selected button is highlighted in blue

7. **Next Action**
   - Yellow/orange gradient card
   - "⚡ Next Action"
   - "Start 15-min HL Sprint" button

8. **Quick Log**
   - Three buttons in a row:
   - "Log HL" (blue) | "Log MT" (blue) | "Log LL" (gray)

9. **This Week's Quests**
   - Lists your weekly goals
   - Shows progress bars
   - Empty state: "No quests yet. Create your first quest in the Plan section!"

10. **Rewards**
    - Three columns showing:
    - ⭐ XP Today
    - 🔥 Day Streak
    - 🪙 Coins

---

## 📄 Other Pages

### Plan Page (`/plan`)
- Create new quests button
- List of weekly quests
- Task management section

### Focus Page (`/focus`)
- Timer setup screen:
  - Leverage type selector (HL/MT/LL)
  - Duration slider (5-120 minutes)
  - Context input field
  - Note textarea
  - "🚀 Start Session" button
- Active timer shows countdown
- Complete/Cancel buttons during session

### Log Page (`/log`)
- Leverage type buttons (HL/MT/LL)
- Duration slider
- Context and note fields
- "Log Session" button

### Review Page (`/review`)
- Weekly performance summary
- Hours by type (HL/MT/LL)
- Context breakdown
- XP earned this week
- Weekly reflection textarea
- Insights section

### Settings Page (`/settings`)
- Weekly HL target slider
- Profile section
- Notifications (coming soon)
- Sign out button (red)

---

## 🎨 Design Highlights

**Color Scheme:**
- Primary: Indigo/Purple (#4F46E5)
- Success: Green (#10B981)
- Warning: Yellow/Orange (#F59E0B)
- Background: Light gray (#F9FAFB)

**Typography:**
- Headlines: Bold, large text
- Body: Regular weight
- Numbers: Bold and emphasized

**Cards:**
- White backgrounds
- Rounded corners
- Subtle shadows
- Padding for breathing room

**Buttons:**
- Primary: Blue with hover effects
- Secondary: Gray outline
- Destructive: Red
- All have smooth transitions

**Mobile Responsiveness:**
- Stack vertically on mobile
- Bottom navigation replaces top nav
- Touch-friendly button sizes
- Readable text at all sizes

---

## 🔄 User Flow Examples

### Logging Your First Session

1. **Start from Home** → Click "🚀 Start HL Session (60 min)"
2. **Redirected to Focus** → Timer starts counting down
3. **Work on your task** → Timer shows remaining time
4. **Complete or cancel** → Session is logged automatically
5. **Return to Home** → See updated progress and XP

### Quick Logging Past Work

1. **From Home** → Click "Log HL" in Quick Log section
2. **Adjust duration** → Use slider to set minutes
3. **Add context** → Optional notes about the work
4. **Submit** → Click "Log Session"
5. **See confirmation** → Success message appears
6. **Return to Home** → Updated statistics

### Weekly Review

1. **Navigate to Review** → Click Review in navigation
2. **See your stats** → Hours worked by type
3. **Check progress** → Visual charts and numbers
4. **Add reflection** → Write notes in textarea
5. **Get insights** → Automatic feedback on performance

---

## ✨ Tips for First-Time Users

1. **Start with a small commitment** - Try 1 HL session per day
2. **Log your energy daily** - Track patterns over time
3. **Create a weekly quest** - Give your week direction
4. **Use the 15-min sprint** - Perfect for getting started
5. **Review on Sundays** - Reflect and plan the next week

---

## 🆘 If Something Looks Wrong

**Blank page?**
- Check browser console (F12) for errors
- Verify environment variables are set

**Styles not loading?**
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Clear browser cache

**Can't see navigation?**
- You might not be logged in
- Go to /login and sign in

**Data not showing?**
- Database might not be initialized
- Run: `npx prisma db push`

---

## 📱 Responsive Design

**Desktop (≥768px):**
- Top horizontal navigation
- Cards in wider layout
- Multi-column sections
- Larger text and buttons

**Mobile (<768px):**
- Bottom tab navigation
- Single column layout
- Stacked cards
- Touch-optimized buttons
- Full-width inputs

---

## 🎯 What Success Looks Like

When everything is working correctly:

✅ Login page loads with no errors  
✅ Sign up creates account and sends email  
✅ Dashboard shows all sections  
✅ Navigation works between pages  
✅ Buttons are clickable and responsive  
✅ Data persists after refresh  
✅ Timer counts down properly  
✅ Sessions are logged to database  
✅ Weekly stats update correctly  

**You're ready to track your high-leverage work! 🚀**

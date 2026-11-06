# Blip ⚡️ Next-Gen TikTok & Instagram Social App

A short-form video and media social networking platform built with **Next.js (App Router)**, **Tailwind CSS**, **Supabase (Auth, Storage, Realtime)**, **Prisma ORM**, and optimized for deployment on **Vercel**.

---

## 🚀 Features

- **TikTok-Style Vertical Feed (`/`)**:
  - Fullscreen snap-scrolling reels with autoplay/pause on viewport intersection.
  - Floating action stack: Creator avatar with Follow badge, animated like counter, comments sheet trigger, bookmarking, and share sheet.
  - Double-tap anywhere to trigger the heart burst animation.
  - Rotating vinyl disc animation with sound track marquee.
  - Toggle between **"For You"** and **"Following"** feeds.

- **Instagram-Style Discovery Grid (`/explore`)**:
  - Search bar with filter chips (Trending, Dance, Food, Travel, Aesthetics).
  - 3x3 photo & video thumbnail grid with hover engagement counters.

- **Creator Studio (`/create`)**:
  - Video and photo uploader with live preview.
  - Caption composer with hashtag manager and audio track naming.
  - Uploads to Supabase Storage and records directly into PostgreSQL via Prisma.

- **Profile & Portfolio (`/profile/[username]`)**:
  - Gradient story ring avatar, follower / following / like counters.
  - Tabbed views for Reels, Posts, Bookmarks, and Liked media.

- **Realtime Direct Messages (`/messages`)**:
  - Conversation list with unread counters and online presence badges.
  - Realtime messaging thread interface.

- **Activity Notifications (`/notifications`)**:
  - Live activity feed for likes, comments, and new followers with one-click follow-back.

- **Authentication (`/login` & `/signup`)**:
  - Supabase Auth integration with email/password and instant demo bypass for rapid testing.

---

## 🛠️ Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Database & ORM**: PostgreSQL via [Supabase](https://supabase.com/) & [Prisma](https://www.prisma.io/)
- **Authentication & Storage**: [Supabase Auth](https://supabase.com/auth) & [Supabase Storage](https://supabase.com/storage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide Icons
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

DIRECT_URL="postgresql://postgres.[your-project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
DATABASE_URL="postgresql://postgres.[your-project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Database Schema with Prisma
Push the Prisma models directly to your Supabase PostgreSQL database:

```bash
npx prisma db push
```

### 4. Create the Supabase Storage Bucket
In your Supabase Dashboard:
1. Navigate to **Storage** -> **New Bucket**.
2. Name the bucket `media`.
3. Set the bucket to **Public**.

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploy to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
4. Click **Deploy**. Vercel will automatically run `prisma generate` and build the application.

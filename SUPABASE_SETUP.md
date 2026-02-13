# ✨ Supabase Integration Complete!

Your app is connected to Supabase, but there's one small step to finish the setup.

## Step 1: Go to Your Supabase Dashboard

Open: https://app.supabase.com/projects

Login with your Supabase account and select your project **"iqzrhpldkpemfwkcwwmg"**

## Step 2: Run the Migration

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste this SQL:

```sql
-- Fix RLS to allow services to be inserted
DROP POLICY IF EXISTS "Services can be inserted" ON public.services;
CREATE POLICY "Services can be inserted" ON public.services FOR INSERT WITH CHECK (true);
```

4. Click **Run** (or press Ctrl+Enter)

You should see: ✅ "Success. No rows returned"

## Step 3: Seed Your Database

Run this command in your terminal:

```bash
npm run setup
```

## Step 4: Start Building!

```bash
npm run dev
```

Visit: http://localhost:5173

---

## What's Already Set Up ✅

- **Supabase Client**: Configured with your credentials
- **Authentication**: Email/password signup & login ready
- **Database Schema**: Tables created (profiles, services, bookings)
- **Row-Level Security**: Policies in place for data privacy

## Database Tables:

### profiles
- Stores user information (name, phone, address)
- Auto-created on signup

### services  
- Home Cleaning, Plumbing, Electrical, Cooking, Painting, Carpentry, AC Service, Pest Control

### bookings
- Tracks all service bookings
- Links users to services

---

**Need help?** Check the `.env` file to confirm your Supabase credentials are set.

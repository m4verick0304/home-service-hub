# 🔐 Authentication Setup Guide

Complete setup for Google OAuth, GitHub OAuth, and Phone/SMS authentication.

---

## 1️⃣ Google OAuth Setup

### Step 1: Get Google Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API** (Search in APIs)
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Select **Web Application**
6. Add authorized redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_ID` with `xzoxfpnfoxqxmnftbcmq`
   - Full URL: `https://xzoxfpnfoxqxmnftbcmq.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**

### Step 2: Add to Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Find **Google** → Click to expand
3. Paste:
   - **Client ID**: [from Google Cloud]
   - **Client Secret**: [from Google Cloud]
4. **Enable** the provider
5. Click **Save**

---

## 2️⃣ GitHub OAuth Setup

### Step 1: Get GitHub Credentials

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Home Service Hub
   - **Homepage URL**: `http://localhost:5173` (or your domain)
   - **Authorization callback URL**: `https://xzoxfpnfoxqxmnftbcmq.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy **Client ID** and **Client Secret**

### Step 2: Add to Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Find **GitHub** → Click to expand
3. Paste:
   - **Client ID**: [from GitHub]
   - **Client Secret**: [from GitHub]
4. **Enable** the provider
5. Click **Save**

---

## 3️⃣ Phone/SMS Authentication (Twilio)

### Step 1: Get Twilio Credentials

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up or login
3. Get your:
   - **Account SID**
   - **Auth Token**
4. Go to **Phone Numbers** → Buy/verify a number
5. Note your **phone number** (with country code, e.g., +1234567890)

### Step 2: Add to Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Find **Phone** → Click to expand
3. Toggle **Enable Phone Provider**
4. Select **Twilio** as the provider
5. Paste:
   - **Twilio Account SID**: [from Twilio]
   - **Twilio Auth Token**: [from Twilio]
   - **Twilio Phone Number**: [your verified number]
6. Click **Save**

---

## 4️⃣ Update Your .env File

Add these after setting up the providers:

```env
# Existing Supabase credentials
VITE_SUPABASE_PROJECT_ID="xzoxfpnfoxqxmnftbcmq"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_8BVOQN2pocgTXp0hEc9yHw_OcmuG0UL"
VITE_SUPABASE_URL="https://xzoxfpnfoxqxmnftbcmq.supabase.co"

# Google OAuth (optional - Supabase handles this)
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# GitHub OAuth (optional - Supabase handles this)
VITE_GITHUB_CLIENT_ID="your-github-client-id"

# Twilio (if using Phone Auth)
VITE_TWILIO_ACCOUNT_SID="your-account-sid"
VITE_TWILIO_AUTH_TOKEN="your-auth-token"
VITE_TWILIO_PHONE_NUMBER="+1234567890"
```

---

## 5️⃣ Test the Authentication

### In your app, users can now:

✅ **Email/Password** (already working)
```
Sign up with email and password
```

✅ **Google Login**
```
Click "Sign in with Google" button
```

✅ **GitHub Login**
```
Click "Sign in with GitHub" button
```

✅ **Phone/SMS**
```
Enter phone number → Receive OTP → Verify
```

---

## 6️⃣ Quick Setup Checklist

- [ ] Google Client ID and Secret
- [ ] GitHub Client ID and Secret  
- [ ] Twilio Account SID, Auth Token, Phone Number
- [ ] Added to Supabase Dashboard
- [ ] Updated .env file (optional)
- [ ] Tested login in app

---

## ⚠️ Important Notes

1. **Redirect URL** must match exactly: `https://xzoxfpnfoxqxmnftbcmq.supabase.co/auth/v1/callback`
2. Keep credentials **secret** - never commit to Git
3. Supabase handles most OAuth flow - you don't need to code it
4. Phone auth requires Twilio account (small monthly fee)

---

## 🎯 Next Step

After adding credentials:

1. Run `npm run dev`
2. Go to `http://localhost:5173/auth`
3. Test each login method
4. Check browser console for errors (F12)

**Questions?** Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

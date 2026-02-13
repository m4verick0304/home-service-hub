# 🔐 Adding Twilio Secrets to Edge Function

Your Twilio credentials are ready. Here's how to add them to your Supabase Edge Function:

## Your Credentials (from screenshot):
```
TWILIO_ACCOUNT_SID = ACsd073a0ea3b0cdb1db42b-bc660368e
TWILIO_AUTH_TOKEN = 6fa6ca3bdbabbb3fb1da51ac8b8dcc02
TWILIO_MESSAGING_SERVICE_SID = MGd91f30c9653996dd830ba3259d3614b06
```

## Steps to Add Secrets:

### 1. Go to Supabase Dashboard
https://app.supabase.com/project/xzoxfpnfoxqxmnftbcmq/functions

### 2. Select the `twilio-otp` Function
Click on the function name to open it.

### 3. Go to "Secrets" Tab
You'll see a form to add secrets.

### 4. Add First Secret
- **Name:** `TWILIO_ACCOUNT_SID`
- **Value:** `ACsd073a0ea3b0cdb1db42b-bc660368e`
- Click **Add Secret**

### 5. Add Second Secret
- **Name:** `TWILIO_AUTH_TOKEN`
- **Value:** `6fa6ca3bdbabbb3fb1da51ac8b8dcc02`
- Click **Add Secret**

### 6. Add Third Secret
- **Name:** `TWILIO_MESSAGING_SERVICE_SID`
- **Value:** `MGd91f30c9653996dd830ba3259d3614b06`
- Click **Add Secret**

### 7. Redeploy the Function
The function should auto-redeploy. If not, click the **Deploy** button.

---

## ✅ After Adding Secrets

1. **Refresh your app** (F5)
2. **Try Phone OTP** - Click "Phone" tab and enter a number
3. You should receive an SMS with the verification code

---

## 🎯 Test It:
1. Go to http://localhost:8080/auth
2. Click **Phone** tab
3. Enter your phone number
4. Click **Send OTP**
5. Check your phone for a message!

---

**⚠️ Important Notes:**
- Keep these secrets **secret** - never commit to Git
- SMS costs ~$0.01-0.02 per message with Twilio
- Test with your own number first

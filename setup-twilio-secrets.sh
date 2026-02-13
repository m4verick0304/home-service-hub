#!/bin/bash

# Supabase Edge Function Secrets Setup
# Add Twilio credentials to the twilio-otp edge function

echo "🔐 Setting up Twilio secrets for Edge Function..."
echo ""

# Extract from your Supabase dashboard
SUPABASE_PROJECT_ID="xzoxfpnfoxqxmnftbcmq"

# Twilio credentials (from your screenshot)
TWILIO_ACCOUNT_SID="ACsd073a0ea3b0cdb1db42b-bc660368e"
TWILIO_AUTH_TOKEN="6fa6ca3bdbabbb3fb1da51ac8b8dcc02"
TWILIO_MESSAGING_SERVICE_SID="MGd91f30c9653996dd830ba3259d3614b06"

echo "📝 To set these secrets in Supabase:"
echo ""
echo "1. Go to: https://app.supabase.com/project/$SUPABASE_PROJECT_ID/functions"
echo "2. Click on the 'twilio-otp' function"
echo "3. Click 'Secrets' tab"
echo "4. Add these three secrets:"
echo ""
echo "   Name: TWILIO_ACCOUNT_SID"
echo "   Value: $TWILIO_ACCOUNT_SID"
echo ""
echo "   Name: TWILIO_AUTH_TOKEN"
echo "   Value: $TWILIO_AUTH_TOKEN"
echo ""
echo "   Name: TWILIO_MESSAGING_SERVICE_SID"
echo "   Value: $TWILIO_MESSAGING_SERVICE_SID"
echo ""
echo "5. Click 'Save' for each secret"
echo ""
echo "✅ Done! Phone OTP will now work in your app"

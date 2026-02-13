import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory OTP store (for simplicity; consider DB storage for production)
const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_MESSAGING_SERVICE_SID = Deno.env.get("TWILIO_MESSAGING_SERVICE_SID");

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_MESSAGING_SERVICE_SID) {
      throw new Error("Twilio credentials not configured");
    }

    const { action, phone, code } = await req.json();

    if (action === "send") {
      if (!phone) {
        return new Response(JSON.stringify({ error: "Phone number is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const otp = generateOtp();
      otpStore.set(phone, { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

      // Send SMS via Twilio
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
      const authHeader = "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

      const body = new URLSearchParams({
        To: phone,
        MessagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
        Body: `Your homeserv verification code is: ${otp}. Valid for 5 minutes.`,
      });

      const twilioRes = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!twilioRes.ok) {
        const errData = await twilioRes.text();
        console.error("Twilio error:", errData);
        throw new Error(`Twilio API error [${twilioRes.status}]: ${errData}`);
      }

      await twilioRes.json(); // consume body

      return new Response(JSON.stringify({ success: true, message: "OTP sent" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "verify") {
      if (!phone || !code) {
        return new Response(JSON.stringify({ error: "Phone and code are required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const stored = otpStore.get(phone);
      if (!stored) {
        return new Response(JSON.stringify({ error: "No OTP found. Request a new one." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(phone);
        return new Response(JSON.stringify({ error: "OTP expired. Request a new one." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (stored.code !== code) {
        return new Response(JSON.stringify({ error: "Invalid OTP" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      otpStore.delete(phone);

      // Sign in or sign up user via Supabase Admin
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      // Check if user exists with this phone
      const listRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );
      
      // Use admin API to create/find user by phone and generate a magic link
      // First try to find existing user
      const searchRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );
      await listRes.text(); // consume

      const searchData = await searchRes.json();
      const existingUser = searchData?.users?.find(
        (u: any) => u.phone === phone.replace("+", "").replace(/\s/g, "")
      );

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Create new user with phone
        const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            phone_confirm: true,
            user_metadata: { phone },
          }),
        });

        if (!createRes.ok) {
          const err = await createRes.text();
          throw new Error(`Failed to create user: ${err}`);
        }

        const created = await createRes.json();
        userId = created.id;
      }

      // Generate a session link for the user
      const linkRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users/${userId}/factors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );
      await linkRes.text(); // consume

      // Generate magic link / session token
      const tokenRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "magiclink",
          email: `${phone.replace(/[^0-9]/g, "")}@phone.homeserv.app`,
        }),
      });

      // Alternative approach: directly create a session
      // Use signInWithPassword approach with admin-set password
      const tempPassword = crypto.randomUUID();
      
      // Update user with temp password
      const updateRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: tempPassword }),
      });

      if (!updateRes.ok) {
        const err = await updateRes.text();
        throw new Error(`Failed to update user: ${err}`);
      }
      await updateRes.json(); // consume
      await tokenRes.text(); // consume

      // Get user email/phone for sign in  
      const userEmail = existingUser?.email || `${phone.replace(/[^0-9]/g, "")}@phone.homeserv.app`;

      // Now sign in with temp password to get session
      const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
      const signInRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: tempPassword,
        }),
      });

      if (!signInRes.ok) {
        const err = await signInRes.text();
        throw new Error(`Sign in failed: ${err}`);
      }

      const session = await signInRes.json();

      return new Response(JSON.stringify({ success: true, session }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("OTP error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

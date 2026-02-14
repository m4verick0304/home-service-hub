#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
        }
    });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("❌ Error: Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function executeSQL(sql) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_PUBLISHABLE_KEY,
                'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ sql_content: sql }),
        });

        if (!response.ok) {
            // Fallback for when RPC is not available or fails
            console.warn("⚠️  RPC exec_sql failed. Trying direct query if possible or logging instruction.");
            const error = await response.json();
            throw new Error(error.message || 'SQL execution failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function fixRLS() {
    console.log("🔐 Fixing RLS policies for bookings...\n");

    const sql = `
    -- Enable RLS on bookings
    ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can insert their own bookings
    DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
    CREATE POLICY "Users can insert their own bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    -- Policy: Users can view their own bookings
    DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
    CREATE POLICY "Users can view their own bookings" 
    ON public.bookings FOR SELECT 
    USING (auth.uid() = user_id);

    -- Policy: Service providers (if any) or admins can view all (optional, simplistic for now)
    -- For now, just ensuring basic user flow works
  `;

    try {
        await executeSQL(sql);
        console.log("✅ RLS policies for 'bookings' table successfully updated!");
        console.log("   - Users can now INSERT their own bookings.");
        console.log("   - Users can now SELECT their own bookings.");
    } catch (error) {
        console.error("❌ Failed to update RLS policies automatically.");
        console.error("   Error:", error.message);
        console.log("\n👇 PLEASE RUN THIS SQL MANUALLY IN SUPABASE SQL EDITOR:\n");
        console.log(sql);
    }
}

fixRLS();

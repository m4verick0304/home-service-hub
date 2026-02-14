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
            const error = await response.json();
            throw new Error(error.message || 'SQL execution failed');
        }

        return await response.json();
    } catch (error) {
        // If the RPC function doesn't exist, we might get a different error.
        // In a real production app, we'd use a proper migration tool or the dashboard.
        // For this demo/hackathon context, this is a best-effort "try to modify schema from client".
        throw error;
    }
}

async function addLocationColumns() {
    console.log("🌍 Adding location columns to bookings table...\n");

    const sql = `
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS latitude double precision;
    ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS longitude double precision;
  `;

    try {
        await executeSQL(sql);
        console.log("✅ Successfully added latitude and longitude columns!\n");
    } catch (error) {
        console.error("❌ Failed to add columns:", error.message);
        console.log("\nIf you see an error about 'function exec_sql() does not exist', you need to run the initial migration in the Supabase Dashboard SQL Editor first.");
        process.exit(1);
    }
}

addLocationColumns();

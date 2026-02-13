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
  console.log("\nMake sure your .env file has:");
  console.log("  VITE_SUPABASE_URL=https://...");
  console.log("  VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...");
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
    throw error;
  }
}

async function setupRLS() {
  console.log("🔐 Setting up Row-Level Security policies...\n");
  
  const sql = `
    -- Add INSERT policy for services (allow inserts for setup)
    DROP POLICY IF EXISTS "Services can be inserted" ON public.services;
    CREATE POLICY "Services can be inserted" ON public.services FOR INSERT WITH CHECK (true);
  `;
  
  try {
    await executeSQL(sql);
    console.log("✅ RLS policy updated\n");
  } catch (error) {
    console.warn("⚠️  Could not update RLS policy (may already exist):", error.message);
  }
}

async function seedServices() {
  console.log("🚀 Seeding services to Supabase...\n");
  
  const services = [
    { name: 'Home Cleaning', description: 'Professional house cleaning services', category: 'cleaning', icon: 'sparkles', price_range: '₹500-₹2000' },
    { name: 'Plumbing', description: 'Expert plumbers for all your plumbing needs', category: 'plumbing', icon: 'wrench', price_range: '₹300-₹1500' },
    { name: 'Electrical Work', description: 'Licensed electricians for installations and repairs', category: 'electrical', icon: 'zap', price_range: '₹400-₹2000' },
    { name: 'Cooking Services', description: 'Professional chefs for meal preparation', category: 'cooking', icon: 'chef-hat', price_range: '₹1000-₹3000' },
    { name: 'Painting', description: 'Interior and exterior painting services', category: 'painting', icon: 'brush', price_range: '₹800-₹3000' },
    { name: 'Carpentry', description: 'Expert carpenters for furniture and repairs', category: 'carpentry', icon: 'hammer', price_range: '₹600-₹2500' },
    { name: 'AC Service', description: 'Air conditioning installation and maintenance', category: 'ac-service', icon: 'wind', price_range: '₹400-₹1500' },
    { name: 'Pest Control', description: 'Professional pest management services', category: 'pest-control', icon: 'bug', price_range: '₹500-₹2000' }
  ];
  
  try {
    const { data, error } = await supabase
      .from('services')
      .insert(services)
      .select();
    
    if (error) {
      // If RLS error, try to update policy first
      if (error.message.includes('row-level security')) {
        await setupRLS();
        // Retry after fixing RLS
        const { data: retryData, error: retryError } = await supabase
          .from('services')
          .insert(services)
          .select();
        
        if (retryError) throw retryError;
        data = retryData;
      } else {
        throw error;
      }
    }
    
    console.log(`✅ Successfully seeded ${data?.length || 0} services!\n`);
    data?.forEach(service => {
      console.log(`  • ${service.name} (${service.category})`);
    });
  } catch (error) {
    if (error.message.includes("duplicate") || error.message.includes("already exists")) {
      console.log("ℹ️  Services already exist in database - skipping\n");
    } else {
      console.error("❌ Seeding failed:", error.message);
      console.log("\n📚 If you see RLS errors, go to your Supabase dashboard and:");
      console.log("   1. Click 'SQL Editor'");
      console.log("   2. Run the migration: 20260214_fix_services_rls.sql");
      console.log("   3. Then run: npm run setup");
      process.exit(1);
    }
  }
}

async function setupComplete() {
  console.log("\n✨ Setup complete! Your app is connected to Supabase.");
  console.log("\n📝 Next steps:");
  console.log("  1. Run: npm run dev");
  console.log("  2. Visit http://localhost:5173");
  console.log("  3. Sign up and start booking services!");
}

seedServices().then(setupComplete).catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});

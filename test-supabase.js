// Quick test file to verify Supabase connection
// Run: node test-supabase.js

import { supabase } from './src/integrations/supabase/client.ts'

console.log('🔍 Testing Supabase Connection...\n')

try {
  // Test 1: Check credentials
  console.log('✅ Credentials loaded:', {
    url: supabase.supabaseUrl,
    hasKey: !!supabase.supabaseKey
  })
  
  // Test 2: Try to fetch services
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1)
  
  if (error) {
    console.log('❌ Error fetching services:', error.message)
  } else {
    console.log('✅ Services table accessible:', data)
  }
  
  // Test 3: Check auth
  const { data: { session } } = await supabase.auth.getSession()
  console.log('✅ Auth system ready:', session?.user?.id || 'No active session')
  
} catch (error) {
  console.log('❌ Connection test failed:', error.message)
}

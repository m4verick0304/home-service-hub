// Test Groq (Free LLM) connection and chatbot function
// Run: node test-chatbot.js

const GROQ_API_KEY = process.env.GROQ_API_KEY || "your_api_key_here"
const SUPABASE_URL = "https://xzoxfpnfoxqxmnftbcmq.supabase.co"
const SUPABASE_KEY = "sb_publishable_8BVOQN2pocgTXp0hEc9yHw_OcmuG0UL"

async function testGroq() {
  console.log('🤖 Testing Groq Connection...\n')

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Say 'Hello from Groq' - just that.",
          },
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Groq Error:', response.status, data);
      console.log('Error details:', data.error);
    } else {
      console.log('✅ Groq Connection Works!');
      console.log('Response:', data.choices[0].message.content);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

async function testSupabaseFunction() {
  console.log('\n📞 Testing Supabase Function...\n')

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: "What services do you offer?",
          },
        ],
      }),
    });

    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ Function Error:', errorData);
    } else {
      console.log('✅ Function Response Received (streaming)');

      // For streaming, we'd need to read the body
      const text = await response.text();
      console.log('Raw response:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Function call failed:', error.message);
  }
}

console.log('='.repeat(50));
console.log('CHATBOT TEST SUITE');
console.log('='.repeat(50));

await testGroq();
await testSupabaseFunction();

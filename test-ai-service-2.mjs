import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Test which AI service is being used
console.log('====================================');
console.log('🔍 Checking AI Service Configuration');
console.log('====================================');

console.log('Environment variables:');
console.log('- GLM_API_KEY:', process.env.GLM_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- USE_MOCK_AI:', process.env.USE_MOCK_AI);

console.log('\nAI Service Selection Logic:');
const hasGLMApiKey = !!process.env.GLM_API_KEY;

console.log('- Has GLM API key:', hasGLMApiKey);

if (hasGLMApiKey) {
  console.log('\n✅ Selected: GLM47Service');
} else {
  console.log('\n❌ No AI service configured!');
}

console.log('\nExpected selection: GLM47Service');
console.log('====================================\n');

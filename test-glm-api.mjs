import fetch from 'node-fetch';

const API_KEY = "b26483819ef34f8db272dea4ff45dfa6.3ObtOOan1V9nlwMJ";
const ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

async function testGLM() {
  console.log('🧪 Testing GLM API...');
  console.log('📡 Endpoint:', ENDPOINT);
  console.log('🔑 API Key:', API_KEY.substring(0, 20) + '...');

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'system',
            content: '你是一个测试助手。'
          },
          {
            role: 'user',
            content: '请回复：GLM API 测试成功！'
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error);

      if (error.error?.code === '1113') {
        console.error('💰 余额不足！请访问 https://open.bigmodel.cn/ 充值');
      }

      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Success!');
    console.log('📝 Response:', data.choices[0].message.content);
    console.log('📊 Usage:', data.usage);

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
  }
}

testGLM();

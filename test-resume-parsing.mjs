import { config } from 'dotenv';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import fetch from 'node-fetch';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testResumeParsing() {
  console.log('====================================');
  console.log('🧪 Testing Resume Parsing');
  console.log('====================================');

  // Check environment
  console.log('Environment:');
  console.log('- GLM_API_KEY:', process.env.GLM_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('- USE_MOCK_AI:', process.env.USE_MOCK_AI);
  console.log('');

  const API_KEY = process.env.GLM_API_KEY;
  const ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

  if (!API_KEY) {
    console.error('❌ GLM_API_KEY not set!');
    process.exit(1);
  }

  // Simulate resume parsing prompt
  const prompt = `请将以下简历文本解析为结构化 JSON 格式。

简历文本：
张三
邮箱：zhangsan@example.com
电话：13800138000

工作经历：
1. 阿里巴巴集团 - 高级前端工程师 (2021-07 至今)
   负责淘宝前端架构优化，使用 React 和 TypeScript 重构核心交易链路。

2. 字节跳动 - 前端工程师 (2019-06 至 2021-06)
   参与抖音电商 Web 端开发。

请返回 JSON 格式：
{
  "name": "姓名",
  "email": "邮箱",
  "phone": "电话",
  "workExps": [...],
  "projects": [],
  "education": [],
  "skills": []
}`;

  console.log('📡 Sending request to GLM API...');
  console.log('📝 Prompt length:', prompt.length, 'chars');
  console.log('');

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
            content: '你是一个专业的简历解析助手。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:');
      console.error(JSON.stringify(error, null, 2));

      if (error.error?.code === '1113') {
        console.error('\n💰 余额不足！');
        console.error('   请访问 https://open.bigmodel.cn/ 查看余额');
      }

      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Success!');
    console.log('📝 Response length:', data.choices[0].message.content?.length, 'chars');
    console.log('📊 Usage:', JSON.stringify(data.usage, null, 2));
    console.log('');
    console.log('📄 First 500 chars of response:');
    console.log(data.choices[0].message.content.substring(0, 500));
    console.log('');

    // Try to parse JSON
    const jsonMatch = data.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('✅ JSON extracted successfully!');
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('📊 Parsed data:');
      console.log('- Name:', parsed.name);
      console.log('- Email:', parsed.email);
      console.log('- Work experiences:', parsed.workExps?.length || 0);
    }

  } catch (error) {
    console.error('❌ Request failed:', error.message);
    process.exit(1);
  }

  console.log('\n====================================');
  console.log('✅ Resume parsing test completed!');
  console.log('====================================');
}

testResumeParsing();

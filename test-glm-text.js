// 测试 GLM-4 文本 API
const GLM_API_KEY = "b26483819ef34f8db272dea4ff45dfa6.3ObtOOan1V9nlwMJ";
const ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

async function testGLMText() {
  console.log('=== 测试 GLM-4 文本 API ===\n');

  const prompt = "请用一句话介绍你自己";

  console.log('1. 发送请求到 GLM-4...');
  console.log('   API Key:', GLM_API_KEY ? '✓ 已设置' : '✗ 未设置');
  console.log('   Endpoint:', ENDPOINT);
  console.log('   模型: glm-4\n');

  try {
    const startTime = Date.now();

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4",
        messages: [
          {
            role: "system",
            content: "你是一个专业的AI助手。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    const elapsed = Date.now() - startTime;
    console.log(`2. 收到响应 (${elapsed}ms)`);
    console.log('   状态码:', response.status, response.statusText);

    const data = await response.json();

    if (data.error) {
      console.error('\n❌ API 返回错误:');
      console.error('   错误代码:', data.error.code);
      console.error('   错误消息:', data.error.message);
      return;
    }

    console.log('\n✅ API 调用成功!');
    console.log('\nAI 回复:');
    console.log('-'.repeat(50));
    console.log(data.choices[0].message.content);
    console.log('-'.repeat(50));

  } catch (error) {
    console.error('\n❌ 请求失败:', error.message);
  }
}

testGLMText();

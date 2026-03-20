// 测试 GLM-4V API 调用
const GLM_API_KEY = "b26483819ef34f8db272dea4ff45dfa6.3ObtOOan1V9nlwMJ";
const ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

async function testGLMVision() {
  console.log('=== 测试 GLM-4V 视觉 API ===\n');

  // 使用一个小测试图片（1x1像素的透明PNG的base64）
  const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  const prompt = "请描述这张图片";

  console.log('1. 发送请求到 GLM-4V...');
  console.log('   API Key:', GLM_API_KEY ? '✓ 已设置' : '✗ 未设置');
  console.log('   Endpoint:', ENDPOINT);
  console.log('   图片大小:', testImageBase64.length, '字符\n');

  try {
    const startTime = Date.now();

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "glm-4v",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: testImageBase64
                }
              },
              {
                type: "text",
                text: prompt
              }
            ]
          }
        ],
        temperature: 0.3,
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
      console.error('\n完整响应:', JSON.stringify(data, null, 2));
      return;
    }

    console.log('\n✅ API 调用成功!');
    console.log('\n响应内容:');
    console.log('-'.repeat(50));
    console.log(data.choices[0].message.content);
    console.log('-'.repeat(50));

    console.log('\n完整响应数据:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('\n❌ 请求失败:', error.message);
    console.error('错误详情:', error);
  }
}

testGLMVision();

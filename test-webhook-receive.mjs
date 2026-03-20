/**
 * 测试Webhook接收
 */

console.log('🧪 测试Webhook接收\n');
console.log('='.repeat(60));

async function testWebhook() {
  // 测试1：健康检查
  console.log('[1/3] 测试健康检查...');
  try {
    const response = await fetch('http://localhost:3002/health');
    const data = await response.json();
    console.log('✅ 健康检查通过');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log('❌ 健康检查失败:', error.message);
    return;
  }

  // 测试2：URL验证
  console.log('\n[2/3] 测试URL验证...');
  try {
    const payload = {
      type: 'url_verification',
      challenge: 'test_challenge_12345',
      token: 'OpenClaw2026',
    };

    const response = await fetch('http://localhost:3002/webhook/feishu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.challenge === 'test_challenge_12345') {
      console.log('✅ URL验证测试通过');
      console.log('返回的challenge:', data.challenge);
    } else {
      console.log('❌ URL验证失败');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ URL验证测试失败:', error.message);
    return;
  }

  // 测试3：模拟飞书消息事件
  console.log('\n[3/3] 模拟飞书消息事件...');
  try {
    const payload = {
      token: 'OpenClaw2026',
      ts: Date.now() / 1000,
      uuid: 'test-uuid',
      event: {
        type: 'message',
        sender: {
          sender_id: { open_id: 'test_user_id' },
        },
        message: {
          message_id: 'om_test_12345',
          message_type: 'text',
          content: {
            text: '测试消息：@机器人',
          },
        },
        chat_id: 'oc_test_chat_id',
        chat_type: 'group',
        msg_type: 'text',
        create_time: Date.now(),
      },
    };

    const response = await fetch('http://localhost:3002/webhook/feishu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('✅ 消息事件发送成功');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n💡 现在检查日志文件，看是否收到并处理了此消息：');
    console.log('   - feishu-bot-debug.log');
    console.log('   - feishu-bot-error.log');

  } catch (error) {
    console.log('❌ 消息事件测试失败:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('测试完成！\n');
  console.log('💡 如果以上测试都通过，说明Webhook接收正常。');
  console.log('问题可能在于：');
  console.log('1. 飞书没有发送请求到ngrok地址');
  console.log('2. 飞书事件订阅配置有问题');
  console.log('3. 机器人处理消息时出错');
}

testWebhook();

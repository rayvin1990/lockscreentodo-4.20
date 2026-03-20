/**
 * 测试飞书开放平台机器人健康检查
 */

async function testHealth() {
  try {
    const response = await fetch('http://localhost:3002/health');
    const data = await response.json();

    console.log('健康检查结果:', JSON.stringify(data, null, 2));

    if (data.status === 'ok') {
      console.log('\n✅ 飞书开放平台机器人运行正常！');
    } else {
      console.log('\n❌ 健康检查失败');
    }
  } catch (error) {
    console.error('❌ 无法连接到服务:', error.message);
    console.log('\n请先启动服务: start-feishu-open-bot.bat');
  }
}

testHealth();

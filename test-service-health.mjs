/**
 * 测试服务健康
 */

console.log('🔍 测试服务健康\n');
console.log('='.repeat(60));

async function testHealth() {
  try {
    const response = await fetch('http://localhost:3002/health');
    const data = await response.json();

    console.log('✅ 服务运行正常！');
    console.log('\n服务信息:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('🎯 现在请在飞书群里 @机器人测试！');
    console.log('\n如果 @机器人 后有回复，说明问题已解决！');
    console.log('如果还是没有回复，说明飞书还在发送加密事件。');

  } catch (error) {
    console.error('❌ 服务检查失败:', error.message);
    console.error('\n可能的原因:');
    console.error('1. 服务没有启动');
    console.error('2. 端口3002被占用');
    console.error('3. 服务崩溃了');
    console.error('\n建议: 检查启动飞书服务的窗口是否有错误');
  }
}

testHealth();

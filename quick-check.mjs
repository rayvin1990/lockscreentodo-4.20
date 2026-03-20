/**
 * 快速检查服务状态
 */

console.log('🔍 快速检查服务状态\n');
console.log('='.repeat(60));

async function quickCheck() {
  try {
    const response = await fetch('http://localhost:3002/health');
    const data = await response.json();

    console.log('✅ 服务运行正常！');
    console.log('\n服务信息:');
    console.log(JSON.stringify(data, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('🎯 如果飞书@机器人，日志会实时显示新请求。\n');

    console.log('💡 提示：');
    console.log('1. 在飞书群 "墨少" 中 @机器人');
    console.log('2. 观察服务窗口是否有新日志');
    console.log('3. 如果有新请求，说明飞书正常工作了！\n');

    console.log('='.repeat(60));
    console.log('✅ 检查完成！服务正在监听飞书事件。\n');

  } catch (error) {
    console.log('❌ 服务检查失败:', error.message);
    console.log('\n可能的原因:');
    console.log('1. 服务没有启动');
    console.log('2. 端口3002被占用');
    console.log('3. 服务崩溃了\n');

    console.log('\n建议：');
    console.log('查看启动服务的窗口，看是否有错误信息');
  }
}

quickCheck();

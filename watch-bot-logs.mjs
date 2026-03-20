/**
 * 实时查看飞书机器人日志
 */

import { readFileSync, watchFile } from 'node:fs';

console.log('👀 实时查看飞书机器人日志\n');
console.log('='.repeat(60));
console.log('💡 现在去飞书群里 @机器人，日志会实时显示在这里\n');
console.log('按 Ctrl+C 退出\n');

let lastPosition = 0;
let lastErrorPosition = 0;

// 检查日志文件
function checkLogs() {
  try {
    const log = readFileSync('feishu-bot-debug.log', 'utf8');
    const errorLog = readFileSync('feishu-bot-error.log', 'utf8');

    // 显示新增的日志
    if (log.length > lastPosition) {
      const newLogs = log.slice(lastPosition);
      if (newLogs.trim()) {
        console.log('\n📄 DEBUG LOG:');
        console.log(newLogs);
      }
      lastPosition = log.length;
    }

    // 显示新增的错误日志
    if (errorLog.length > lastErrorPosition) {
      const newErrors = errorLog.slice(lastErrorPosition);
      if (newErrors.trim()) {
        console.log('\n❌ ERROR LOG:');
        console.log(newErrors);
      }
      lastErrorPosition = errorLog.length;
    }
  } catch (error) {
    // 文件可能不存在或正在写入
  }
}

// 初始读取
try {
  const log = readFileSync('feishu-bot-debug.log', 'utf8');
  lastPosition = log.length;

  const errorLog = readFileSync('feishu-bot-error.log', 'utf8');
  lastErrorPosition = errorLog.length;
} catch (error) {
  // 文件不存在
}

// 每秒检查一次新日志
const interval = setInterval(checkLogs, 1000);

console.log('✅ 日志监控已启动\n');
console.log('现在去飞书群里 @机器人测试...\n');

// 退出时清理
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('\n\n👋 监控已停止');
  process.exit(0);
});

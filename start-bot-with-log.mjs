/**
 * 启动飞书机器人并记录日志
 */

console.log('🚀 启动飞书机器人（带日志）\n');

import { spawn } from 'node:child_process';
import { createWriteStream } from 'node:fs';

// 创建日志文件
const logStream = createWriteStream('feishu-bot-debug.log', { flags: 'a' });
const errorLogStream = createWriteStream('feishu-bot-error.log', { flags: 'a' });

// 记录启动时间
const startTime = new Date().toISOString();
logStream.write(`\n\n========== 服务启动: ${startTime} ==========\n`);

// 启动服务
const botProcess = spawn('node', ['feishu-open-bot.mjs'], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

// 将输出同时写入日志文件和显示
botProcess.stdout.on('data', (data) => {
  const text = data.toString();
  console.log(text);
  logStream.write(text);
});

botProcess.stderr.on('data', (data) => {
  const text = data.toString();
  console.error(text);
  errorLogStream.write(text);
});

botProcess.on('close', (code) => {
  logStream.write(`\n========== 服务停止: ${new Date().toISOString()}, 退出码: ${code} ==========\n`);
  console.log(`\n服务已停止，退出码: ${code}`);
});

botProcess.on('error', (error) => {
  console.error('启动服务失败:', error);
  errorLogStream.write(`启动失败: ${error}\n`);
});

console.log('服务启动中...\n');
console.log('💡 提示: 现在去飞书群里 @机器人，查看此窗口的日志输出\n');
console.log('日志文件:');
console.log('  - feishu-bot-debug.log');
console.log('  - feishu-bot-error.log\n');

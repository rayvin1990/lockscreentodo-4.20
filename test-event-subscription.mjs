/**
 * 测试飞书事件订阅配置
 */

console.log('🧪 测试飞书事件订阅\n');
console.log('='.repeat(60));

// 检查本地服务
console.log('\n[检查1] 本地服务是否正常运行...');

async function checkLocalService() {
  try {
    const response = await fetch('http://localhost:3002/health');
    const data = await response.json();

    if (data.status === 'ok' && data.service === 'feishu-open-bot') {
      console.log('✅ 本地服务正常运行');
      console.log(`   服务: ${data.service}`);
      console.log(`   地址: http://localhost:3002`);
      return true;
    } else {
      console.log('❌ 服务响应异常');
      return false;
    }
  } catch (error) {
    console.log('❌ 无法连接到本地服务');
    console.log(`   错误: ${error.message}`);
    return false;
  }
}

const serviceOk = await checkLocalService();

// 检查 ngrok
console.log('\n[检查2] ngrok 是否正常运行...');
console.log('⚠️  请确认 ngrok 窗口是否显示 "Session Status: online"');

// 检查配置
console.log('\n[检查3] 飞书平台配置...');

import { readFileSync } from 'node:fs';
const batContent = readFileSync('start-feishu-open-bot.bat', 'utf8');

const verifyToken = batContent.match(/FEISHU_VERIFY_TOKEN=([^\r\n]+)/)?.[1]?.trim();
console.log(`   验证 Token: ${verifyToken}`);

// 给出配置建议
console.log('\n' + '='.repeat(60));
console.log('配置清单（请在飞书平台确认）：\n');

const checklist = [
  '事件订阅已启用',
  '请求地址: https://halolike-kensley-subventricous.ngrok-free.dev/webhook/feishu',
  '验证 Token: OpenClaw2026',
  '已订阅事件: im.message.receive_v1',
  '机器人已发布（企业内发布）',
];

checklist.forEach((item, index) => {
  console.log(`[ ] ${index + 1}. ${item}`);
});

console.log('\n' + '='.repeat(60));

// 模拟飞书验证请求
console.log('\n[测试] 模拟飞书验证请求...');

async function testVerification() {
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

    if (data.challenge === payload.challenge) {
      console.log('✅ 验证请求测试通过');
      console.log(`   返回 challenge: ${data.challenge}`);
      return true;
    } else {
      console.log('❌ 验证响应异常');
      console.log(`   期望: ${payload.challenge}`);
      console.log(`   实际: ${data.challenge}`);
      return false;
    }
  } catch (error) {
    console.log('❌ 验证测试失败');
    console.log(`   错误: ${error.message}`);
    return false;
  }
}

const verificationOk = await testVerification();

// 总结
console.log('\n' + '='.repeat(60));

if (serviceOk && verificationOk) {
  console.log('✅ 本地配置正确！\n');
  console.log('问题可能在飞书平台配置：\n');
  console.log('请在飞书开放平台 (https://open.feishu.cn/) 检查：\n');
  console.log('1. [事件订阅] 页面');
  console.log('   - 请求地址是否正确？');
  console.log('   - 验证 Token 是否为 "OpenClaw2026"？');
  console.log('   - 是否点击了"验证"按钮并通过？');
  console.log('');
  console.log('2. [订阅事件] 列表');
  console.log('   - 是否添加了 "im.message.receive_v1"？');
  console.log('');
  console.log('3. [发布机器人]');
  console.log('   - 是否点击了"发布"？');
  console.log('   - 发布范围是否选择"企业内发布"？');
  console.log('');
  console.log('4. [机器人所在的群聊]');
  console.log('   - 群名称: "墨少"');
  console.log('   - 在群里 @机器人 试一试');
} else {
  console.log('❌ 本地配置有问题\n');
  console.log('解决方法：');
  console.log('1. 确保 ngrok 正在运行');
  console.log('2. 重新启动机器人服务: start-feishu-open-bot.bat');
  console.log('3. 运行 node test-open-bot.mjs 检查服务');
}

console.log('\n' + '='.repeat(60));

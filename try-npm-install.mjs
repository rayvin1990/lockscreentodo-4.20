/**
 * 直接尝试npm安装
 */

const { exec } = await import('node:child_process');

console.log('🔍 尝试直接npm安装\n');
console.log('='.repeat(60));

async function tryNpmInstall() {
  try {
    console.log('[1/3] 尝试使用npm安装...\n');

    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec('npm install -g @m1heng-clawd/feishu', (error, stdout, stderr) => {
        if (error) {
          console.log('  ❌ 安装失败:', error.message);
          reject(error);
        } else {
          console.log('  ✅ npm命令执行完成');
          resolve({ stdout, stderr });
        }
      });
    });

    console.log('npm命令输出:');
    console.log(stdout);

    if (stderr && stderr.trim()) {
      console.log('\npm错误输出:');
      console.log(stderr);
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 如果安装成功，尝试注册插件...\n');

    // 尝试注册
    try {
      await new Promise((resolve, reject) => {
        exec('openclaw plugins install @m1heng-clawd/feishu', (error, stdout, stderr) => {
          if (error) {
            console.log('  ❌ 插件注册失败:', error.message);
            console.log('\n  可能原因:');
            console.log('  1. OpenClaw Gateway未运行');
            console.log('  2. 插件仓库不存在');
            console.log('  3. 网络问题');
            reject(error);
          } else {
            console.log('  ✅ 插件注册命令执行完成');
            console.log('\n输出:');
            console.log(stdout);
            resolve();
          }
        });
      });

      console.log('\n' + '='.repeat(60));
      console.log('🎯 尝试重启OpenClaw Gateway\n');

      // 重启Gateway
      await new Promise((resolve, reject) => {
        exec('openclaw gateway restart', (error, stdout, stderr) => {
          if (error) {
            console.log('  ❌ 重启失败:', error.message);
            reject(error);
          } else {
            console.log('  ✅ 重启命令执行完成');
            console.log('\n输出:');
            console.log(stdout);
            resolve();
          }
        });
      });

      console.log('\n' + '='.repeat(60));
      console.log('✅ 安装和重启完成！\n');

      console.log('📋 接下来：\n');
      console.log('1. 检查飞书插件是否安装成功：');
      console.log('   openclaw plugins list | findstr /i "feishu"\n');
      console.log('2. 如果安装成功，重启Gateway：');
      console.log('   openclaw gateway restart\n');
      console.log('3. 重新测试飞书机器人\n');

    } catch (error) {
      console.error('  ❌ 注册或重启失败:', error.message);
      console.log('\n建议:');
      console.log('- 继续使用当前的配置');
      console.log('- 服务已经正常运行（端口3002）');
      console.log('- 只需在飞书平台重新验证事件订阅');
    }

  } catch (error) {
    console.error('\n❌ npm安装失败:', error.message);
    console.log('\n可能的原因:');
    console.log('1. npm未找到');
    console.log('2. npm没有全局安装权限');
    console.log('3. 网络问题');
    console.log('\n建议：');
    console.log('- 确保npm已安装: npm -v');
    console.log('- 检查环境变量PATH');
    console.log('- 继续使用当前的配置');
    console.log('- 服务已经正常运行');
  }
}

tryNpmInstall();

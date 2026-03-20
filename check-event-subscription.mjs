/**
 * 椋炰功浜嬩欢璁㈤槄妫€鏌ュ伐鍏? * 閫氳繃API妫€鏌ヤ簨浠惰闃呯姸鎬? */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}

console.log('馃攳 妫€鏌ラ涔︿簨浠惰闃呯姸鎬乗n');
console.log('='.repeat(60));

async function checkEventSubscription() {
  try {
    // 鑾峰彇 Access Token
    console.log('[1/3] 鑾峰彇 Access Token...');
    const tokenResponse = await fetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: APP_ID,
        app_secret: APP_SECRET,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.code !== 0) {
      console.log('鉂?鑾峰彇 Access Token 澶辫触');
      console.log(JSON.stringify(tokenData, null, 2));
      return;
    }

    const token = tokenData.tenant_access_token;
    console.log('鉁?Access Token 鑾峰彇鎴愬姛\n');

    // 妫€鏌ヤ簨浠惰闃呯姸鎬?    console.log('[2/3] 妫€鏌ヤ簨浠惰闃呴厤缃?..');

    // 娉ㄦ剰锛氶涔﹀彲鑳戒笉鎻愪緵鐩存帴鏌ヨ浜嬩欢璁㈤槄鐨凙PI
    // 杩欓噷鎴戜滑灏濊瘯鑾峰彇搴旂敤閰嶇疆淇℃伅
    const appInfoResponse = await fetch(
      `${FEISHU_API_BASE}/application/v6/applications/app_info`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const appInfoData = await appInfoResponse.json();
    console.log('搴旂敤淇℃伅:');
    console.log(JSON.stringify(appInfoData, null, 2));

    // 灏濊瘯鑾峰彇鏈哄櫒浜轰俊鎭?    console.log('\n[3/3] 鑾峰彇鏈哄櫒浜轰俊鎭?..');
    const botResponse = await fetch(`${FEISHU_API_BASE}/bot/v3/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const botData = await botResponse.json();

    if (botData.code === 0) {
      console.log('鉁?鏈哄櫒浜轰俊鎭?');
      console.log(`   鏈哄櫒浜哄悕绉? ${botData.bot.app_name}`);
      console.log(`   鏈哄櫒浜篒D: ${botData.bot.open_id}`);
      console.log(`   婵€娲荤姸鎬? ${botData.bot.activate_status === 2 ? '宸叉縺娲? : '鏈縺娲?}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('妫€鏌ュ畬鎴愶紒\n');

    console.log('鈿狅笍  閲嶈鎻愮ず锛?);
    console.log('椋炰功浜嬩欢璁㈤槄闇€瑕佸湪娴忚鍣ㄤ腑鎵嬪姩閰嶇疆\n');
    console.log('璇锋寜鐓т互涓嬫楠ゆ搷浣滐細\n');
    console.log('1. 鎵撳紑浣犵粰鐨勯摼鎺ワ細');
    console.log('   https://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event\n');
    console.log('2. 鍦ㄩ〉闈腑鏌ユ壘锛?);
    console.log('   - "浜嬩欢璁㈤槄" 鎴?"Event Subscription" 閫夐」鍗?);
    console.log('   - "閰嶇疆浜嬩欢" 鎴?"Configure Events" 鎸夐挳');
    console.log('   - 璇锋眰鍦板潃杈撳叆妗哱n');
    console.log('3. 濉啓璇锋眰鍦板潃锛?);
    console.log('   https://halolike-kensley-subventricous.ngrok-free.dev/webhook/feishu\n');
    console.log('4. 璁㈤槄浜嬩欢锛?);
    console.log('   - 鎵惧埌骞舵坊鍔?"im.message.receive_v1" 浜嬩欢\n');
    console.log('5. 淇濆瓨閰嶇疆\n');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('鉂?妫€鏌ュけ璐?', error.message);
  }
}

checkEventSubscription();

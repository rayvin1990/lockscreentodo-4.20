/**
 * 鍙戦€佹祴璇曟秷鎭埌椋炰功缇よ亰
 * 鐢ㄤ簬娴嬭瘯鏈哄櫒浜烘槸鍚︽甯稿伐浣? */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}
const GROUP_CHAT_ID = 'oc_81581d0e26ebf3b8d2986482d451b259'; // 澧ㄥ皯缇?
console.log('馃И 鍙戦€佹祴璇曟秷鎭埌椋炰功缇よ亰\n');
console.log('='.repeat(60));

async function sendTestMessage() {
  try {
    // 鑾峰彇 Access Token
    console.log('[1/2] 鑾峰彇 Access Token...');
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

    // 鍙戦€佹祴璇曟秷鎭?    console.log('[2/2] 鍙戦€佹祴璇曟秷鎭埌缇よ亰...');
    console.log(`缇よ亰ID: ${GROUP_CHAT_ID}`);
    console.log(`缇よ亰鍚嶇О: 澧ㄥ皯\n`);

    const messageContent = {
      text: `馃И 椋炰功鏈哄櫒浜烘祴璇曟秷鎭痋n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n濡傛灉浣犵湅鍒拌繖鏉℃秷鎭紝璇存槑锛歕n1. 鉁?鏈哄櫒浜烘湇鍔℃甯歌繍琛孿n2. 鉁?浜嬩欢璁㈤槄閰嶇疆姝ｇ‘\n3. 鉁?鏈哄櫒浜哄彲浠ユ帴鏀舵秷鎭痋n\n鐜板湪鍙互鍦ㄧ兢閲?@鏈哄櫒浜?杩涜瀵硅瘽浜嗭紒`,
    };

    const response = await fetch(
      `${FEISHU_API_BASE}/im/v1/messages?receive_id_type=chat_id`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receive_id: GROUP_CHAT_ID,
          msg_type: 'text',
          content: JSON.stringify(messageContent),
        }),
      },
    );

    const data = await response.json();

    if (data.code === 0) {
      console.log('鉁?娴嬭瘯娑堟伅鍙戦€佹垚鍔燂紒');
      console.log(`娑堟伅ID: ${data.data.message_id}\n`);
      console.log('璇锋煡鐪嬮涔︾兢鑱?"澧ㄥ皯" 鏄惁鏀跺埌姝ゆ秷鎭€?);
    } else {
      console.log('鉂?鍙戦€佹秷鎭け璐?);
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('鉂?璇锋眰澶辫触:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

sendTestMessage();

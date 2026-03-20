/**
 * 鍙戦€佹渶缁堟祴璇曟秷鎭埌椋炰功
 */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}
const GROUP_CHAT_ID = 'oc_81581d0e26ebf3b8d2986482d451b259';

console.log('馃И 鏈€缁堟祴璇曟秷鎭痋n');
console.log('='.repeat(60));

async function sendFinalTestMessage() {
  try {
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

    console.log('[2/2] 鍙戦€佹渶缁堟祴璇曟秷鎭埌缇よ亰...');
    console.log(`缇よ亰ID: ${GROUP_CHAT_ID}`);
    console.log(`缇よ亰鍚嶇О: 澧ㄥ皯\n`);

    const messageContent = {
      text: `馃幆 椋炰功鏈哄櫒浜?- 鏈€缁堟祴璇昞n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n鉁?鏈嶅姟鐘舵€?\n- 鏈嶅姟杩愯姝ｅ父\n- ngrok杩炴帴姝ｅ父\n- 鍔犲瘑瀵嗛挜宸查厤缃甛n\n鉂?褰撳墠闂:\n椋炰功杩樺湪鍙戦€佸姞瀵嗕簨浠禱n\n鈿狅笍  **蹇呴』鎿嶄綔锛?*\n\n1. 璁块棶椋炰功骞冲彴:\n   https://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event\n\n2. 鐐瑰嚮"閲嶆柊楠岃瘉"鎴?楠岃瘉"鎸夐挳\n   **杩欎竴姝ユ槸蹇呴』鐨勶紒**\n\n3. 纭楠岃瘉鎴愬姛\n   搴旇鏄剧ず"宸查獙璇?鎴栫豢鑹插嬀閫塡n\n4. 鐒跺悗鍦ㄧ兢閲?@鏈哄櫒浜篭n\n馃挕 鍏抽敭鐐癸細\n- 蹇呴』鐐瑰嚮"閲嶆柊楠岃瘉"鎸夐挳\n- 鍚﹀垯椋炰功涓嶄細鏇存柊閰嶇疆\n- 灏卞儚鏀逛簡WiFi闇€瑕侀噸鏂拌繛鎺n\n馃殌 鐜板湪鍘婚涔﹀钩鍙伴噸鏂伴獙璇佸惂锛乣,
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
      console.log('='.repeat(60));
      console.log('馃搵 璇锋寜浠ヤ笅姝ラ鎿嶄綔锛歕n');
      console.log('1. 鏌ョ湅椋炰功缇よ亰 "澧ㄥ皯" 鏄惁鏀跺埌姝ゆ秷鎭?);
      console.log('2. 璁块棶椋炰功骞冲彴閲嶆柊楠岃瘉浜嬩欢璁㈤槄锛?);
      console.log('   https://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event');
      console.log('3. 鐐瑰嚮"閲嶆柊楠岃瘉"鎴?楠岃瘉"鎸夐挳');
      console.log('4. 鍦ㄧ兢閲?@鏈哄櫒浜?娴嬭瘯\n');
      console.log('='.repeat(60));
      console.log('馃挕 濡傛灉閲嶆柊楠岃瘉鎴愬姛锛屾満鍣ㄤ汉灏辫兘鍥炲浜嗭紒\n');
    } else {
      console.log('鉂?鍙戦€佹秷鎭け璐?);
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('鉂?璇锋眰澶辫触:', error.message);
  }
}

sendFinalTestMessage();

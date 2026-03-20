/**
 * 鍙戦€佹祴璇曟秷鎭苟绔嬪嵆妫€鏌ユ棩蹇? */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}
const GROUP_CHAT_ID = 'oc_81581d0e26ebf3b8d2986482d451b259';

console.log('馃И 鍙戦€佹祴璇曟秷鎭苟瀹炴椂鐩戞帶\n');
console.log('='.repeat(60));

async function sendAndMonitor() {
  try {
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

    console.log('[2/3] 鍙戦€佹祴璇曟秷鎭?..');
    const messageContent = {
      text: `馃幆 瀹炴椂娴嬭瘯娑堟伅 #6\n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n鉁?鏈嶅姟姝ｅ父杩愯\n鉁?鍔犲瘑瀵嗛挜宸查厤缃甛n鉁?ngrok杩炴帴姝ｅ父\n\n馃И 濡傛灉 @鏈哄櫒浜?鍚庢棩蹇楁病鏈夋洿鏂帮細\n璇存槑椋炰功杩樺湪鍙戦€佸姞瀵嗕簨浠禱n闇€瑕侀噸鏂伴獙璇佷簨浠惰闃咃紒\n\n馃敆 椋炰功骞冲彴锛歕nhttps://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event`,
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
      console.log('馃搳 鐜板湪鐨勬楠わ細\n');

      console.log('姝ラ1锛氬湪椋炰功缇?"澧ㄥ皯" 涓?@鏈哄櫒浜?);
      console.log('  杈撳叆: @claw lonchat 娴嬭瘯\n');

      console.log('姝ラ2锛氱珛鍗虫煡鐪嬫棩蹇楁枃浠?);
      console.log('  杩愯: Get-Content feishu-bot-debug.log -Tail 50\n');

      console.log('姝ラ3锛氭鏌ユ棩蹇椾腑鏄惁鏈夋柊璇锋眰');
      console.log('  濡傛灉鏈夋柊璇锋眰 鈫?椋炰功姝ｅ父宸ヤ綔');
      console.log('  濡傛灉杩樻槸鍔犲瘑浜嬩欢 鈫?闇€瑕侀噸鏂伴獙璇乗n');

      console.log('\n' + '='.repeat(60));
      console.log('馃挕 蹇€熸鏌ュ懡浠?\n');

      console.log('Get-Content feishu-bot-debug.log -Tail 50');
      console.log('\n鍙戦€佹祴璇曟秷鎭悗锛岀珛鍗宠繍琛岃繖涓懡浠ゆ煡鐪嬫渶鏂版棩蹇楋紒\n');

    } else {
      console.log('鉂?鍙戦€佹秷鎭け璐?);
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('鉂?璇锋眰澶辫触:', error.message);
  }
}

sendAndMonitor();

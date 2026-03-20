/**
 * 鍙戦€佺畝鐭祴璇曟秷鎭? */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}
const GROUP_CHAT_ID = 'oc_81581d0e26ebf3b8d2986482d451b259';

console.log('馃И 鍙戦€佺畝鐭祴璇曟秷鎭痋n');

async function sendShortMessage() {
  try {
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

    const messageContent = {
      text: `馃И 鏈€缁堟祴璇昞n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n璇?@鏈哄櫒浜烘祴璇曪細\n@claw lonchat 浣犲ソ\n\n濡傛灉鑳藉洖澶嶏紝璇存槑閰嶇疆鎴愬姛锛乣,
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
      console.log('馃幆 璇峰湪椋炰功缇?"澧ㄥ皯" 涓?@鏈哄櫒浜猴細\n');
      console.log('@claw lonchat 浣犲ソ\n');
      console.log('\n' + '='.repeat(60));
      console.log('鐒跺悗鍛婅瘔鎴戯細鏈哄櫒浜哄洖澶嶄簡鍚楋紵\n');
      console.log('='.repeat(60) + '\n');
    } else {
      console.log('鉂?鍙戦€佹秷鎭け璐?);
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('鉂?璇锋眰澶辫触:', error.message);
  }
}

sendShortMessage();

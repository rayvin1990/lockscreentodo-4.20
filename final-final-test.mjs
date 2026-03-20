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

console.log('馃И 鍙戦€佹渶缁堟祴璇曟秷鎭埌椋炰功缇よ亰\n');
console.log('='.repeat(60));

async function sendTestMessage() {
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

    console.log('[2/2] 鍙戦€佹祴璇曟秷鎭埌缇よ亰...');
    console.log(`缇よ亰ID: ${GROUP_CHAT_ID}`);
    console.log(`缇よ亰鍚嶇О: 澧ㄥ皯\n`);

    const messageContent = {
      text: `馃幆 椋炰功鏈哄櫒浜?- 鏈€缁堟祴璇?#5\n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n鉁?鏈嶅姟鐘舵€佺‘璁?\n- 鉁?鏈嶅姟杩愯姝ｅ父\n- 鉁?鍔犲瘑瀵嗛挜宸查厤缃? 62jqucEwk6gQ40myJq2LOebCuH2rqVT8\n- 鉁?ngrok杩炴帴姝ｅ父\n\n馃И 鐜板湪璇峰湪椋炰功缇ら噷娴嬭瘯锛歕n\n馃搵 姝ラ:\n1. 鍦ㄧ兢鑱婁腑杈撳叆: @claw lonchat 娴嬭瘯\n2. 瑙傚療鏈哄櫒浜烘槸鍚﹀洖澶峔n\n馃搳 鍙兘鐨勭粨鏋?\n\n鉁?濡傛灉鏈哄櫒浜哄洖澶?\n[OpenClaw 鍥炲]\n鎴戞敹鍒颁簡浣犵殑娑堟伅: 娴嬭瘯\n\n璇存槑锛氶涔︿簨浠惰闃呭凡鎴愬姛锛侌煄塡n\n鉂?濡傛灉鏈哄櫒浜轰笉鍥炲:\n璇存槑锛氶涔﹁繕鍦ㄥ彂閫佸姞瀵嗕簨浠禱n\n馃敡 瑙ｅ喅鏂规硶锛歕n- 璁块棶椋炰功骞冲彴鍒锋柊椤甸潰\n- 鎴栧垹闄ゅ悗閲嶆柊閰嶇疆浜嬩欢璁㈤槄\n\n馃挕 鍏抽敭鐐癸細\n蹇呴』璁╅涔﹂噸鏂拌鍙栭厤缃紒\n\n鐜板湪璇曡瘯鍚э紒** 馃殌`,
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
      console.log('馃搵 涓嬩竴姝ユ搷浣滐細\n');
      console.log('1. 鏌ョ湅椋炰功缇よ亰 "澧ㄥ皯" 鏄惁鏀跺埌姝ゆ秷鎭?);
      console.log('2. 濡傛灉鏀跺埌锛屽湪缇ら噷 @鏈哄櫒浜?娴嬭瘯');
      console.log('3. @鏈哄櫒浜? @claw lonchat 娴嬭瘯\n');
      console.log('='.repeat(60));
      console.log('馃幆 杩欐搴旇鑳芥垚鍔熶簡锛侌煉?);
    } else {
      console.log('鉂?鍙戦€佹秷鎭け璐?);
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('鉂?璇锋眰澶辫触:', error.message);
  }
}

sendTestMessage();

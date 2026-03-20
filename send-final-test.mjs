/**
 * 鍙戦€佹祴璇曟秷鎭埌椋炰功
 */

const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';
const APP_ID = 'cli_a9f5af0e51f89cc4';
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_SECRET) {
  throw new Error('Missing FEISHU_APP_SECRET environment variable');
}
const GROUP_CHAT_ID = 'oc_81581d0e26ebf3b8d2986482d451b259';

console.log('馃И 鍙戦€佹祴璇曟秷鎭埌椋炰功缇よ亰\n');
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
      text: `馃幆 娴嬭瘯娑堟伅 #4\n\n鏃堕棿: ${new Date().toLocaleString('zh-CN')}\n\n濡傛灉浣犵湅鍒拌繖鏉℃秷鎭細\n鉁?鏈嶅姟姝ｅ父杩愯\n鉁?ngrok杩炴帴姝ｅ父\n鉁?鍔犲瘑瀵嗛挜宸查厤缃甛n\n馃敂 浣嗘槸锛佸鏋?@鏈哄櫒浜?杩樻槸涓嶅洖澶嶏細\n\n鍘熷洜锛氶涔︿簨浠惰闃呮病鏈夐噸鏂伴獙璇侊紒\n\n鈿狅笍  椋炰功骞冲彴杩樺湪鍙戦€佸姞瀵嗕簨浠禱n馃挕 瑙ｅ喅鏂规硶锛氬湪椋炰功骞冲彴蹇呴』"閲嶆柊楠岃瘉"浜嬩欢璁㈤槄\n\n馃搶 鎴栬€咃細鍒锋柊椤甸潰骞剁偣鍑?淇濆瓨"鎸夐挳\n\n   鍦板潃锛歨ttps://open.feishu.cn/app/cli_a9f5af0e51f89cc4/event?tab=event\n\n馃挰 鐜板湪鍘婚噸鏂伴獙璇侊紝鐒跺悗鍦ㄧ兢閲?@鏈哄櫒浜烘祴璇曞惂锛乣,
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
      console.log('馃搵 璇锋煡鐪嬮涔︾兢鑱?"澧ㄥ皯"\n');
      console.log('濡傛灉鐪嬪埌杩欐潯娑堟伅锛屾湇鍔″氨鏄甯哥殑锛乗n');
      console.log('馃挕 浣嗘槸 @鏈哄櫒浜轰笉鍥炲锛岃鏄庨涔﹁繕鍦ㄥ彂閫佸姞瀵嗕簨浠禱n');
      console.log('蹇呴』鍘婚涔﹀钩鍙伴噸鏂伴獙璇佷簨浠惰闃咃紒\n');
      console.log('='.repeat(60));
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

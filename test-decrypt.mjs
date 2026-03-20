/**
 * 测试飞书事件解密
 */

import crypto from 'node:crypto';

const ENCRYPT_KEY = 'OpenClaw20260201';

// 从日志中复制的加密事件
const encryptedEvent = '+4SPgn4Uw7Onlu8H0z0VEugwnU7zkTaTSWZXvz0KOBHOevIVV9XcrRekacwfhgsvsFDHSlz0EIOGYK9J/C7JnsFFKeB5p48iNx2F9s5fgc0tykbgac25OhsnoEWTN5bWW1PBppXNDCV+7qlbkV6iKrIrruKbO4ysN4NMziE8k1PCXGmZxT7ZnYpPLi2vYjvYKuqGFDtYuP66RewsIWMIQRQGe45MHDgAyGiW6//af/Nb2265WLGoVo38SQPrTG8AeT4ldsCJGnWDcLj3DSBR5MKkI6/N+FmaIOh06TSHPM+JqB1tDwwNAKCKjOx0rHvrQUIPsYtY0ZuRU5xC52+4IiJqa43qExyMkSYUzrWaG+bbWcHXAcnZE7preIYCmGmSoQ/lLrqZJES0hsp+IU1vqnHV29q//tmVcvCY5dSVO1SVF8QOmE/KsNc0ULfiP+ZehTQ2UWqNmVmNPCkLX/j4XxFXX3gHjA9+BOzeq08kNFy4z/LlZ1NpRh6Q9Anbvuwj7Pk08d3oDD+Yfgvau8eVR4aRZPGsiwgHPhoY49FeRhSGl/qzyyrRxMT3AqZTs51TsZCMeUbQ91kedB5YcaYqZGCY5/D1NB7gFJxG0iu4Rs9oAFH30EaQ+enFCT9fAhU1ln8lvhVPEMLCrIBzW5shj60qyJdHTjjseOGdKmlByhIl+KvhxSJ/GMKpdCBrOfdgZAlqgu94DtPRhr463oiy3b+k1/+PxyxBCrPcn1WLo9EigbBzGo489idk1TJzvuH7ovL6ULWUf+mTMNYJ7FVOZ8Qk/VTUVkZm0z4+8gSRFEtaB339DmtsxRMdTvredIvPzXUxz+U9HXdFF7FkGxjGh9Qg623NbvdQltZYX+1nWG8JMnZAVQW9vPAjTOR7aq7edBU633QqbwA3E7v8Dg4xidDazpqPGqpOFNCdSiyJh52y5GI16z/1tgfiyshVVDm3yQwKqrlJevf5YLt3Q6lY7Wz8hPo5THxRRRDJGoNabwNL4minSnw5QHMmOV+RCLm62rCr41ya4zMzoycBVGOChCyBcF/wJs9j7gDblJBom6uT3DEDM7VsmbyBAHp3hrNjdm52JJ99AycUya8bwckbIVG9kP5o1QyWaWXjdFxOrTCjPNL/sJQAGQxb389WCrmUFNM9M/w4d/oyYe2Uz4/7XB3sCDI8Qbms5JnDR26msLSnbr1hz32p1cXfw0ZGr8F1Mm9vvSfp3wOrAlNZI+Xxg==';

console.log('🧪 测试飞书事件解密\n');
console.log('='.repeat(60));

try {
  // 飞书的加密是 AES-256-CBC
  const key = Buffer.from(ENCRYPT_KEY, 'base64');
  const encrypted = Buffer.from(encryptedEvent, 'base64');

  // 提取IV（前16字节）
  const iv = encrypted.slice(0, 16);
  const ciphertext = encrypted.slice(16);

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(false);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // 移除PKCS7 padding
  const padding = decrypted[decrypted.length - 1];
  const plaintext = decrypted.slice(0, decrypted.length - padding);

  const decryptedText = plaintext.toString('utf8');
  const decryptedJSON = JSON.parse(decryptedText);

  console.log('✅ 解密成功！');
  console.log('\n解密后的事件:');
  console.log(JSON.stringify(decryptedJSON, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✅ 加密密钥配置正确！');
  console.log('\n现在机器人可以正常接收飞书的加密事件了。');

} catch (error) {
  console.error('❌ 解密失败:', error.message);
  console.error('\n可能的原因:');
  console.log('1. 加密密钥不正确');
  console.log('2. 加密算法或IV提取方式不正确');
  console.log('3. 密钥格式不正确');
}

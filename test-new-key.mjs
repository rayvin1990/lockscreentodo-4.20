/**
 * 测试新加密密钥是否能解密
 */

import crypto from 'node:crypto';

const ENCRYPT_KEY = '62jqucEwk6gQ40myJq2LOebCuH2rqVT8';

// 从日志中复制的加密事件
const encryptedEvent = '+4SPgn4Uw7Onlu8H0z0VEugwnU7zkTaTSWZXvz0KOBHOevIVV9XcrRekacwfhgsvsFDHSlz0EIOGYK9J/C7JnsFFKeB5p48iNx2F9s5fgc0tykbgac25OhsnoEWTN5bWW1PBppXNDCV+7qlbkV6iKrIrruKbO4ysN4NMziE8k1PCXGmZxT7ZnYpPLi2vYjvYKuqGFDtYuP66RewsIWMIQRQGe45MHDgAyGiW6//af/Nb2265WLGoVo38SQPrTG8AeT4ldsCJGnWDcLj3DSBR5MKkI6/N+FmaIOh06TSHPM+JqB1tDwwNAKCKjOx0rHvrQUIPsYtY0ZuRU5xC52+4IiJqa43qExyMkSYUzrWaG+bbWcHXAcnZE7preIYCmGmSoQ/lLrqZJES0hsp+IU1vqnHV29q//tmVcvCY5dSVO1SVF8QOmE/KsNc0ULfiP+ZehTQ2UWqNmVmNPCkLX/j4XxFXX3gHjA9+BOzeq08kNFy4z/LlZ1NpRh6Q9Anbvuwj7Pk08d3oDD+Yfgvau8eVR4aRZPGsiwgHPhoY49FeRhSGl/qzyyrRxMT3AqZTs51TsZCMeUbQ91kedB5YcaYqZGCY5/D1NB7gFJxG0iu4Rs9oAFH30EaQ+enFCT9fAhU1ln8lvhVPEMLCrIBzW5shj60qyJdHTjjseOGdKmlByhIl+KvhxSJ/GMKpdCBrOfdgZAlqgu94DtPRhr463oiy3b+k1/+PxyxBCrPcn1WLo9EigbBzGo489idk1TJzvuH7ovL6ULWUf+mTMNYJ7FVOZ8Qk/VTUVkZm0z4+8gSRFEtaB339DmtsxRMdTvredIvPzXUxz7U9HXdFF7FkGxjGh9Qg623NbvdQltZYX+1nWG8JMnZAVQW9vPAjTOR7aq7edBU633QqbwA3E7v8Dg4xidDazpqPGqpOFNCdSiyJh52y5GI16z/1tgfiyshVVDm3yQwKqrlJevf5YLt3Q6lY7Wz8hPo5THxRRRDJGoNabwNL4minSnw5QHMmOV+RCLm62rCr41ya4zMzoycBVGOChCyBcF/wJs9j7gDblJBom6uT3DEDM7VsmbyBAHp3hrNjdm52JJ99AycUya8bwckbIVG9kP5o1QyWaWXjdFxOrTCjPNL/sJQAGQxb389WCrmUFNM9M/w4d/oyYe2Uz4/7XB3sCDI8Qbms5JnDR26msLSnbr1hz32p1cXfw0ZGr8F1Mm9vvSfp3wOrAlNZI+Xxg==';

console.log('🧪 测试新加密密钥解密\n');
console.log('='.repeat(60));

// 尝试base64解码密钥
const key = Buffer.from(ENCRYPT_KEY, 'base64');

console.log(`加密密钥 (base64): ${ENCRYPT_KEY}`);
console.log(`解码后密钥长度: ${key.length} 字节\n`);

if (key.length !== 32) {
  console.log('❌ 密钥长度不正确，需要32字节');
  console.log(`   实际: ${key.length} 字节`);
  process.exit(1);
}

console.log('✅ 密钥长度正确: 32字节\n');

const encrypted = Buffer.from(encryptedEvent, 'base64');
const iv = encrypted.slice(0, 16);
const ciphertext = encrypted.slice(16);

console.log('开始解密...\n');

try {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(false);

  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  const padding = decrypted[decrypted.length - 1];
  const plaintext = decrypted.slice(0, decrypted.length - padding);
  const decryptedText = plaintext.toString('utf8');

  // 检查是否是有效的JSON
  const decryptedJSON = JSON.parse(decryptedText);

  console.log('✅ 解密成功！');
  console.log('\n解密后的事件:');
  console.log(JSON.stringify(decryptedJSON, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('🎉 加密密钥配置正确！\n');

} catch (error) {
  console.error('❌ 解密失败:', error.message);
  console.log('\n可能的原因:');
  console.log('1. 加密算法不对');
  console.log('2. IV提取方式不对');
  console.log('3. 密钥格式不对');

  process.exit(1);
}

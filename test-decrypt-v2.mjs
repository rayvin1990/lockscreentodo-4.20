/**
 * 测试飞书事件解密 - 版本2
 */

import crypto from 'node:crypto';

const ENCRYPT_KEY = 'OpenClaw20260201';

// 从日志中复制的加密事件
const encryptedEvent = '+4SPgn4Uw7Onlu8H0z0VEugwnU7zkTaTSWZXvz0KOBHOevIVV9XcrRekacwfhgsvsFDHSlz0EIOGYK9J/C7JnsFFKeB5p48iNx2F9s5fgc0tykbgac25OhsnoEWTN5bWW1PBppXNDCV+7qlbkV6iKrIrruKbO4ysN4NMziE8k1PCXGmZxT7ZnYpPLi2vYjvYKuqGFDtYuP66RewsIWMIQRQGe45MHDgAyGiW6//af/Nb2265WLGoVo38SQPrTG8AeT4ldsCJGnWDcLj3DSBR5MKkI6/N+FmaIOh06TSHPM+JqB1tDwwNAKCKjOx0rHvrQUIPsYtY0ZuRU5xC52+4IiJqa43qExyMkSYUzrWaG+bbWcHXAcnZE7preIYCmGmSoQ/lLrqZJES0hsp+IU1vqnHV29q//tmVcvCY5dSVO1SVF8QOmE/KsNc0ULfiP+ZehTQ2UWqNmVmNPCkLX/j4XxFXX3gHjA9+BOzeq08kNFy4z/LlZ1NpRh6Q9Anbvuwj7Pk08d3oDD+Yfgvau8eVR4aRZPGsiwgHPhoY49FeRhSGl/qzyyrRxMT3AqZTs51TsZCMeUbQ91kedB5YcaYqZGCY5/D1NB7gFJxG0iu4Rs9oAFH30EaQ+enFCT9fAhU1ln8lvhVPEMLCrIBzW5shj60qyJdHTjjseOGdKmlByhIl+KvhxSJ/GMKpdCBrOfdgZAlqgu94DtPRhr463oiy3b+k1/+PxyxBCrPcn1WLo9EigbBzGo489idk1TJzvuH7ovL6ULWUf+mTMNYJ7FVOZ8Qk/VTUVkZm0z4+8gSRFEtaB339DmtsxRMdTvredIvPzXUxz+U9HXdFF7FkGxjGh9Qg623NbvdQltZYX+1nWG8JMnZAVQW9vPAjTOR7aq7edBU633QqbwA3E7v8Dg4xidDazpqPGqpOFNCdSiyJh52y5GI16z/1tgfiyshVVDm3yQwKqrlJevf5YLt3Q6lY7Wz8hPo5THxRRRDJGoNabwNL4minSnw5QHMmOV+RCLm62rCr41ya4zMzoycBVGOChCyBcF/wJs9j7gDblJBom6uT3DEDM7VsmbyBAHp3hrNjdm52JJ99AycUya8bwckbIVG9kP5o1QyWaWXjdFxOrTCjPNL/sJQAGQxb389WCrmUFNM9M/w4d/oyYe2Uz4/7XB3sCDI8Qbms5JnDR26msLSnbr1hz32p1cXfw0ZGr8F1Mm9vvSfp3wOrAlNZI+Xxg==';

console.log('🧪 测试飞书事件解密（版本2）\n');
console.log('='.repeat(60));

// 尝试不同的密钥格式
const keyFormats = [
  { name: '原始字符串', key: Buffer.from(ENCRYPT_KEY, 'utf8').slice(0, 32) },
  { name: '原始字符串 + 填充', key: Buffer.alloc(32, 0).fill(Buffer.from(ENCRYPT_KEY, 'utf8'), 0) },
  { name: 'SHA256哈希', key: crypto.createHash('sha256').update(ENCRYPT_KEY).digest() },
  { name: 'Base64解码', key: Buffer.from(ENCRYPT_KEY, 'base64') },
];

const encrypted = Buffer.from(encryptedEvent, 'base64');

for (const format of keyFormats) {
  console.log(`\n尝试密钥格式: ${format.name}`);

  try {
    // 检查密钥长度
    if (format.key.length !== 32) {
      console.log(`   ⚠️  密钥长度: ${format.key.length} 字节（需要32字节）`);
      continue;
    }

    console.log(`   ✅ 密钥长度: ${format.key.length} 字节`);

    // 提取IV（前16字节）
    const iv = encrypted.slice(0, 16);
    const ciphertext = encrypted.slice(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', format.key, iv);
    decipher.setAutoPadding(false);

    let decrypted = decipher.update(ciphertext);
    try {
      decrypted = Buffer.concat([decrypted, decipher.final()]);
    } catch (e) {
      console.log(`   ❌ 解密失败: ${e.message}`);
      continue;
    }

    // 移除PKCS7 padding
    const padding = decrypted[decrypted.length - 1];
    if (padding > 16) {
      console.log(`   ❌ Padding无效: ${padding}`);
      continue;
    }

    const plaintext = decrypted.slice(0, decrypted.length - padding);
    const decryptedText = plaintext.toString('utf8');

    // 检查是否是有效的JSON
    try {
      const decryptedJSON = JSON.parse(decryptedText);

      console.log(`   ✅ 解密成功！`);
      console.log(`\n   解密后的事件:`);
      console.log(`   ${JSON.stringify(decryptedJSON, null, 2).replace(/\n/g, '\n   ')}`);

      console.log('\n' + '='.repeat(60));
      console.log('✅ 正确的密钥格式:', format.name);
      console.log('\n现在需要更新代码以使用正确的密钥格式。');
      process.exit(0);
    } catch (e) {
      console.log(`   ❌ 不是有效的JSON: ${e.message}`);
    }

  } catch (error) {
    console.log(`   ❌ 失败: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('❌ 所有密钥格式都失败了');
console.log('\n可能需要更新飞书端的加密密钥，或者查看飞书文档确认正确的格式。');

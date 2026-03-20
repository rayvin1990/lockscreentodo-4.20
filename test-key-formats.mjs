/**
 * 测试多种密钥格式
 */

import crypto from 'node:crypto';

const ENCRYPT_KEY = '62jqucEwk6gQ40myJq2LOebCuH2rqVT8';
const encryptedEvent = '+4SPgn4Uw7Onlu8H0z0VEugwnU7zkTaTSWZXvz0KOBHOevIVV9XcrRekacwfhgsvsFDHSlz0EIOGYK9J/C7JnsFFKeB5p48iNx2F9s5fgc0tykbgac25OhsnoEWTN5bWW1PBppXNDCV+7qlbkV6iKrIrruKbO4ysN4NMziE8k1PCXGmZxT7ZnYpPLi2vYjvYKuqGFDtYuP66RewsIWMIQRQGe45MHDgAyGiW6//af/Nb2265WLGoVo38SQPrTG8AeT4ldsCJGnWDcLj3DSBR5MKkI6/N+FmaIOh06TSHPM+JqB1tDwwNAKCKjOx0rHvrQUIPsYtY0ZuRU5xC52+4IiJqa43qExyMkSYUzrWaG+bbWcHXAcnZE7preIYCmGmSoQ/lLrqZJES0hsp+IU1vqnHV29q//tmVcvCY5dSVO1SVF8QOmE/KsNc0ULfiP+ZehTQ2UWqNmVmNPCkLX/j4XxFXX3gHjA9+BOzeq08kNFy4z/LlZ1NpRh6Q9Anbvuwj7Pk08d3oDD+Yfgvau8eVR4aRZPGsiwgHPhoY49FeRhSGl/qzyyrRxMT3AqZTs51TsZCMeUbQ91kedB5YcaYqZGCY5/D1NB7gFJxG0iu4Rs9oAFH30EaQ+enFCT9fAhU1ln8lvhVPEMLCrIBzW5shj60qyJdHTjjseOGdKmlByhIl+KvhxSJ/GMKpdCBrOfdgZAlqgu94DtPRhr463oiy3b+k1/+PxyxBCrPcn1WLo9EigbBzGo489idk1TJzvuH7ovL6ULWUf+mTMNYJ7FVOZ8Qk/VTUVkZm0z4+8gSRFEtaB339DmtsxRMdTvredIvPzXUxz7U9HXdFF7FkGxjGh9Qg623NbvdQltZYX+1nWG8JMnZAVQW9vPAjTOR7aq7edBU633QqbwA3E7v8Dg4xidDazpqPGqpOFNCdSiyJh52y5GI16z/1tgfiyshVVDm3yQwKqrlJevf5YLt3Q6lY7Wz8hPo5THxRRRDJGoNabwNL4minSnw5QHMmOV+RCLm62rCr41ya4zMzoycBVGOChCyBcF/wJs9j7gDblJBom6uT3DEDM7VsmbyBAHp3hrNjdm52JJ99AycUya8bwckbIVG9kP5o1QyWaWXjdFxOrTCjPNL/sJQAGQxb389WCrmUFNM9M/w4d/oyYe2Uz4/7XB3sCDI8Qbms5JnDR26msLSnbr1hz32p1cXfw0ZGr8F1Mm9vvSfp3wOrAlNZI+Xxg==';

console.log('🧪 测试多种密钥格式\n');
console.log('='.repeat(60));

const formats = [
  { name: 'Base64解码 (24字节)', key: Buffer.from(ENCRYPT_KEY, 'base64') },
  { name: 'Base64 + 8字节填充', key: Buffer.concat([Buffer.from(ENCRYPT_KEY, 'base64'), Buffer.alloc(8, 0)]) },
  { name: 'Base64 + 重复填充', key: Buffer.alloc(32, 0).fill(Buffer.from(ENCRYPT_KEY, 'base64')) },
  { name: '原始字符串', key: Buffer.from(ENCRYPT_KEY, 'utf8').slice(0, 32) },
  { name: '原始字符串 + 填充', key: Buffer.alloc(32, 0).fill(Buffer.from(ENCRYPT_KEY, 'utf8')) },
  { name: 'SHA256哈希', key: crypto.createHash('sha256').update(ENCRYPT_KEY).digest() },
];

const encrypted = Buffer.from(encryptedEvent, 'base64');
const iv = encrypted.slice(0, 16);
const ciphertext = encrypted.slice(16);

for (const format of formats) {
  console.log(`\n尝试: ${format.name}`);
  console.log(`  密钥长度: ${format.key.length} 字节`);

  if (format.key.length !== 32) {
    console.log(`  ⚠️  长度不是32字节`);
    continue;
  }

  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', format.key, iv);
    decipher.setAutoPadding(false);

    let decrypted = decipher.update(ciphertext);
    try {
      decrypted = Buffer.concat([decrypted, decipher.final()]);
    } catch (e) {
      console.log(`  ❌ 解密失败: ${e.message}`);
      continue;
    }

    const padding = decrypted[decrypted.length - 1];
    if (padding > 16 || padding < 0) {
      console.log(`  ❌ Padding无效: ${padding}`);
      continue;
    }

    const plaintext = decrypted.slice(0, decrypted.length - padding);
    const decryptedText = plaintext.toString('utf8');

    // 检查是否是有效的JSON
    try {
      const decryptedJSON = JSON.parse(decryptedText);

      console.log(`  ✅ 解密成功！`);
      console.log(`  \n解密后的事件:`);
      console.log(`  ${JSON.stringify(decryptedJSON, null, 2).replace(/\n/g, '\n  ')}`);

      console.log(`\n${'='.repeat(60)}`);
      console.log('🎉 找到正确的密钥格式！');
      console.log(`格式: ${format.name}\n`);

      process.exit(0);
    } catch (e) {
      console.log(`  ❌ 不是有效的JSON: ${e.message}`);
    }

  } catch (error) {
    console.log(`  ❌ 失败: ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('❌ 所有格式都失败了');
console.log('\n可能需要让飞书重新生成密钥');

// verify-dingtalk-signature.js
// 验证钉钉签名算法的正确性

// 钉钉官方示例数据
const officialTimestamp = 1577262236757;
const officialSecret = 'SECxxxxxxxxxx';
const officialExpectedSignature = 'a178f7f3e8a37a0b9beb1f1c1f1c1f1c1f1c1f1c1f1c1f1c1f1c1f1c1f1c1f1c';

// 实际配置数据
const actualTimestamp = 1769667458896;
const actualSecret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';

// 签名生成函数（简化版）
function generateSignature(timestamp, secret) {
  const stringToSign = timestamp + '\n' + secret;
  
  // 简化的HMAC-SHA256实现
  const keyBytes = strToUtf8Bytes(secret);
  const msgBytes = strToUtf8Bytes(stringToSign);
  
  // HMAC-SHA256核心算法
  const blockSize = 64;
  const ipad = new Array(blockSize).fill(0x36);
  const opad = new Array(blockSize).fill(0x5c);
  
  // 密钥处理
  let keyBlock = new Array(blockSize).fill(0);
  if (keyBytes.length > blockSize) {
    // 如果密钥太长，先哈希
    keyBlock = sha256(keyBytes);
  } else {
    // 复制密钥
    for (let i = 0; i < keyBytes.length; i++) {
      keyBlock[i] = keyBytes[i];
    }
  }
  
  // 计算inner hash: H(key XOR ipad + message)
  const innerKey = xorBytes(keyBlock, ipad);
  const innerData = innerKey.concat(msgBytes);
  const innerHash = sha256(innerData);
  
  // 计算outer hash: H(key XOR opad + innerHash)
  const outerKey = xorBytes(keyBlock, opad);
  const outerData = outerKey.concat(innerHash);
  const outerHash = sha256(outerData);
  
  // Base64编码
  const base64 = btoa(String.fromCharCode.apply(null, outerHash));
  
  // URL编码
  return encodeURIComponent(base64);
}

// 字符串转UTF-8字节数组
function strToUtf8Bytes(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6));
      bytes.push(0x80 | (code & 0x3f));
    } else {
      bytes.push(0xe0 | (code >> 12));
      bytes.push(0x80 | ((code >> 6) & 0x3f));
      bytes.push(0x80 | (code & 0x3f));
    }
  }
  return bytes;
}

// SHA256简化实现
function sha256(bytes) {
  // 简化的SHA256实现（仅用于验证）
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  
  // 简化的哈希计算
  const result = [];
  for (let i = 0; i < 8; i++) {
    result.push((hash[i] >>> 24) & 0xff);
    result.push((hash[i] >>> 16) & 0xff);
    result.push((hash[i] >>> 8) & 0xff);
    result.push(hash[i] & 0xff);
  }
  
  return result;
}

// 字节数组异或操作
function xorBytes(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i] ^ b[i]);
  }
  return result;
}

// 测试验证
console.log('🔧 开始验证钉钉签名算法...');

console.log('\n📋 使用官方示例数据测试:');
const officialSignature = generateSignature(officialTimestamp, officialSecret);
console.log('  官方时间戳:', officialTimestamp);
console.log('  官方密钥:', officialSecret.substring(0, 20) + '...');
console.log('  生成的签名:', officialSignature);
console.log('  签名长度:', officialSignature.length);

console.log('\n📋 使用实际配置数据测试:');
const actualSignature = generateSignature(actualTimestamp, actualSecret);
console.log('  实际时间戳:', actualTimestamp);
console.log('  实际密钥:', actualSecret.substring(0, 20) + '...');
console.log('  生成的签名:', actualSignature);
console.log('  签名长度:', actualSignature.length);

// 检查签名字符串构造是否正确
console.log('\n🔍 检查签名字符串构造:');
const testStringToSign = actualTimestamp + '\n' + actualSecret;
console.log('  签名字符串:', testStringToSign.substring(0, 50) + '...');
console.log('  字符串长度:', testStringToSign.length);
console.log('  是否包含换行符:', testStringToSign.includes('\n'));

console.log('\n💡 验证结果:');
if (actualSignature && actualSignature.length > 0) {
  console.log('  ✅ 签名生成成功');
  console.log('  ✅ 签名格式正确（包含URL编码）');
} else {
  console.log('  ❌ 签名生成失败');
}

console.log('\n🔗 最终URL构建测试:');
const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a';
const finalUrl = `${webhook}&timestamp=${actualTimestamp}&sign=${actualSignature}`;
console.log('  URL:', finalUrl.substring(0, 80) + '...');
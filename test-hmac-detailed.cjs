// 详细的HMAC对比测试
const crypto = require('crypto');
const { hmacSHA256: browserHmac } = require('./utils/hmac-sha256-browser.cjs');

function nodeHmac(key, message) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message, 'utf8');
  return hmac.digest('base64');
}

// 测试参数
const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const timestamp = 1769673852247;
const stringToSign = timestamp + '\n' + secret;

console.log('=== HMAC-SHA256 详细对比测试 ===');
console.log('输入参数:');
console.log('secret:', secret);
console.log('timestamp:', timestamp);
console.log('stringToSign length:', stringToSign.length);

// Node.js 结果
const nodeResult = nodeHmac(secret, stringToSign);
console.log('\n✅ Node.js HMAC-SHA256:', nodeResult);

// 浏览器实现结果
const browserResult = browserHmac(secret, stringToSign);
console.log('🌐 Browser HMAC-SHA256:', browserResult);

// 比较
console.log('\n=== 结果比较 ===');
console.log('Node.js:', nodeResult);
console.log('Browser:', browserResult);
console.log('是否相等:', nodeResult === browserResult);

if (nodeResult !== browserResult) {
  console.log('\n❌ 签名不匹配，分析差异:');
  console.log('Node长度:', nodeResult.length);
  console.log('Browser长度:', browserResult.length);
  
  // 解码base64来比较字节
  const nodeBytes = Buffer.from(nodeResult, 'base64');
  const browserBytes = Buffer.from(browserResult, 'base64');
  
  console.log('Node hex:', nodeBytes.toString('hex'));
  console.log('Browser hex:', browserBytes.toString('hex'));
  
  if (nodeBytes.length !== browserBytes.length) {
    console.log('字节长度不同！Node:', nodeBytes.length, 'Browser:', browserBytes.length);
  } else {
    // 找出第一个不同的字节
    for (let i = 0; i < nodeBytes.length; i++) {
      if (nodeBytes[i] !== browserBytes[i]) {
        console.log('第一个不同字节位置:', i);
        console.log('Node 字节[' + i + ']:', nodeBytes[i]);
        console.log('Browser 字节[' + i + ']:', browserBytes[i]);
        break;
      }
    }
  }
} else {
  console.log('✅ 签名完全匹配！');
}
// 测试修复的HMAC实现
const crypto = require('crypto');
const { hmacSHA256: fixedHmac } = require('./utils/hmac-sha256-fixed.cjs');

function nodeHmac(key, message) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message, 'utf8');
  return hmac.digest('base64');
}

// 测试参数
const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const timestamp = 1769673852247;
const stringToSign = timestamp + '\n' + secret;

console.log('=== 修复版HMAC测试 ===');
console.log('输入参数验证:');
console.log('secret长度:', secret.length, '字节:', Buffer.from(secret, 'utf8').length);
console.log('stringToSign长度:', stringToSign.length);

// Node.js结果
const nodeResult = nodeHmac(secret, stringToSign);
console.log('\n✅ Node.js HMAC:', nodeResult);

// 修复版结果
try {
  const fixedResult = fixedHmac(secret, stringToSign);
  console.log('🔧 Fixed HMAC  :', fixedResult);
  
  console.log('\n=== 对比结果 ===');
  console.log('是否相等:', nodeResult === fixedResult);
  
  if (nodeResult === fixedResult) {
    console.log('🎉 完美匹配！HMAC实现已修复');
    
    // 额外测试几个用例
    console.log('\n=== 额外测试用例 ===');
    const testCases = [
      ['test', 'hello'],
      ['key', 'The quick brown fox jumps over the lazy dog'],
      [secret, stringToSign],
      ['short', '123456789']
    ];
    
    let allMatch = true;
    for (const [k, m] of testCases) {
      const node = nodeHmac(k, m);
      const fixed = fixedHmac(k, m);
      const match = node === fixed;
      console.log(`[${k.substring(0,5)}.. + ${m.substring(0,20)}..] ${match ? '✅' : '❌'}`);
      if (!match) {
        allMatch = false;
        console.log('   Node :', node);
        console.log('   Fixed:', fixed);
      }
    }
    
    if (allMatch) {
      console.log('\n🎉 所有测试用例都匹配！实现完全正确');
    }
  } else {
    console.log('❌ 仍然不匹配');
    console.log('预期:', nodeResult);
    console.log('实际:', fixedResult);
  }
} catch (error) {
  console.log('❌ 修复版实现有错误:', error.message);
}
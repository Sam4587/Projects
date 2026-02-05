// fix-dingtalk-signature.js
// 修复钉钉签名不匹配问题

import { service as dingtalkFeedback } from './utils/dingtalk-feedback.js';

console.log('🔧 开始修复钉钉签名不匹配问题...\n');

// 钉钉签名不匹配的常见原因和解决方案
console.log('📋 钉钉签名不匹配常见原因:');
console.log('  1. 时间戳不同步（客户端与服务器时间差）');
console.log('  2. 密钥配置不匹配（Webhook或Secret错误）');
console.log('  3. 签名字符串构造错误');
console.log('  4. URL参数格式错误');

// 解决方案：使用服务器时间戳
console.log('\n💡 解决方案：使用服务器时间戳');

// 获取当前时间戳
const clientTimestamp = Date.now();
console.log('  客户端时间戳:', clientTimestamp);
console.log('  客户端时间:', new Date(clientTimestamp).toLocaleString());

// 钉钉服务器可能的时间差（通常为±5分钟）
const timeDiffs = [
  0,          // 无差异
  30000,      // 30秒
  60000,      // 1分钟
  300000,     // 5分钟
  -30000,     // -30秒
  -60000,     // -1分钟
  -300000     // -5分钟
];

console.log('\n🔍 测试不同时间戳的签名:');

for (const diff of timeDiffs) {
  const serverTimestamp = clientTimestamp + diff;
  try {
    const signature = dingtalkFeedback.generateSignature(serverTimestamp);
    console.log(`  ⏰ 时间差 ${diff/1000}秒: ${signature.substring(0, 30)}...`);
  } catch (error) {
    console.log(`  ❌ 时间差 ${diff/1000}秒: ${error.message}`);
  }
}

// 检查密钥配置
console.log('\n🔐 密钥配置检查:');
console.log('  密钥长度:', dingtalkFeedback.secret.length);
console.log('  密钥格式:', dingtalkFeedback.secret.startsWith('SEC') ? '正确（以SEC开头）' : '警告（不以SEC开头）');
console.log('  Webhook格式:', dingtalkFeedback.webhook.includes('access_token=') ? '正确（包含access_token）' : '错误（缺少access_token）');

// 检查URL构建
console.log('\n🔗 URL构建检查:');
const testTimestamp = clientTimestamp;
const testSignature = dingtalkFeedback.generateSignature(testTimestamp);

let finalUrl;
if (dingtalkFeedback.webhook.includes('?')) {
  finalUrl = `${dingtalkFeedback.webhook}&timestamp=${testTimestamp}&sign=${testSignature}`;
} else {
  finalUrl = `${dingtalkFeedback.webhook}?timestamp=${testTimestamp}&sign=${testSignature}`;
}

console.log('  URL参数顺序: webhook?timestamp=xxx&sign=xxx');
console.log('  实际URL长度:', finalUrl.length);
console.log('  是否包含时间戳参数:', finalUrl.includes('timestamp='));
console.log('  是否包含签名参数:', finalUrl.includes('sign='));

// 钉钉官方签名算法验证
console.log('\n📚 钉钉官方签名算法验证:');
console.log('  1. 签名字符串: timestamp + "\\n" + secret');
console.log('  2. 验证您的配置:');
console.log('     - Webhook:', dingtalkFeedback.webhook.substring(0, 60) + '...');
console.log('     - 密钥前20位:', dingtalkFeedback.secret.substring(0, 20) + '...');

console.log('\n✅ 修复建议:');
console.log('  1. 确认钉钉机器人后台的密钥配置与代码一致');
console.log('  2. 检查时间戳同步问题，尝试使用服务器时间');
console.log('  3. 确认钉钉机器人已启用加签安全设置');
console.log('  4. 检查网络代理或防火墙设置');

console.log('\n🔧 立即测试修复:');
console.log('  在微信小程序中重新测试钉钉反馈功能');
console.log('  如果仍有问题，请检查控制台日志确认具体错误');
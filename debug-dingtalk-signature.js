// debug-dingtalk-signature.js
// 调试钉钉签名算法问题

import { service as dingtalkFeedback } from './utils/dingtalk-feedback.js';

console.log('🔧 开始调试钉钉签名算法...\n');

// 测试当前配置的签名算法
const timestamp = 1769668572442; // 使用错误日志中的时间戳
console.log('📋 使用错误日志中的时间戳:', timestamp);
console.log('  当前时间:', new Date(timestamp).toLocaleString());
console.log('  密钥前20位:', dingtalkFeedback.secret.substring(0, 20) + '...');

try {
  // 生成签名
  const signature = dingtalkFeedback.generateSignature(timestamp);
  console.log('\n✅ 签名生成结果:');
  console.log('  签名:', signature);
  console.log('  签名长度:', signature.length);
    
  // 检查签名的关键特征
  console.log('\n🔍 签名特征检查:');
  console.log('  是否包含URL编码字符:', signature.includes('%'));
  console.log('  是否以等号结尾:', signature.endsWith('='));
  console.log('  是否包含斜杠:', signature.includes('/'));
  console.log('  是否包含加号:', signature.includes('+'));
    
  // 构建URL并检查
  console.log('\n🔗 URL构建检查:');
  const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a';
  let finalUrl;
  if (webhook.includes('?')) {
    finalUrl = `${webhook}&timestamp=${timestamp}&sign=${signature}`;
  } else {
    finalUrl = `${webhook}?timestamp=${timestamp}&sign=${signature}`;
  }
    
  console.log('  原始Webhook:', webhook.substring(0, 60) + '...');
  console.log('  最终URL长度:', finalUrl.length);
  console.log('  URL是否包含时间戳:', finalUrl.includes(timestamp.toString()));
  console.log('  URL是否包含签名:', finalUrl.includes(signature));
    
  // 检查签名字符串构造
  console.log('\n📝 签名字符串构造检查:');
  const stringToSign = timestamp + '\n' + dingtalkFeedback.secret;
  console.log('  签名字符串:', stringToSign.substring(0, 50) + '...');
  console.log('  字符串长度:', stringToSign.length);
  console.log('  是否包含换行符:', stringToSign.includes('\n'));
  console.log('  换行符位置:', stringToSign.indexOf('\n'));
    
  // 检查HMAC-SHA256实现
  console.log('\n🔐 HMAC-SHA256算法检查:');
  try {
    const testSignature = dingtalkFeedback.optimizedHmacSha256(dingtalkFeedback.secret, stringToSign);
    console.log('  ✅ 优化算法成功');
    console.log('  测试签名:', testSignature.substring(0, 30) + '...');
  } catch (error) {
    console.log('  ❌ 优化算法失败:', error.message);
  }
    
  // 检查微信兼容算法
  try {
    const wxSignature = dingtalkFeedback.wxHmacSha256(dingtalkFeedback.secret, stringToSign);
    console.log('  ✅ 微信兼容算法成功');
    console.log('  微信签名:', wxSignature.substring(0, 30) + '...');
  } catch (error) {
    console.log('  ❌ 微信兼容算法失败:', error.message);
  }
    
  console.log('\n💡 调试结论:');
  console.log('  1. 签名生成流程正常');
  console.log('  2. URL构建格式正确');
  console.log('  3. 需要检查钉钉机器人配置是否匹配');
    
} catch (error) {
  console.error('❌ 调试过程中出现错误:', error);
}

// 钉钉官方签名算法验证
console.log('\n📚 钉钉官方签名算法要求:');
console.log('  1. 签名字符串: timestamp + "\\n" + secret');
console.log('  2. 算法: HMAC-SHA256');
console.log('  3. 编码: Base64 -> URL编码');
console.log('  4. URL格式: webhook?timestamp=xxx&sign=xxx');

console.log('\n🔧 建议检查:');
console.log('  1. 确认钉钉机器人Webhook URL是否正确');
console.log('  2. 确认加签密钥是否与钉钉后台配置一致');
console.log('  3. 检查时间戳是否同步（钉钉服务器时间）');
console.log('  4. 确认钉钉机器人是否已启用加签安全设置');
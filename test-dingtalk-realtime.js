// test-dingtalk-realtime.js
// 实时测试钉钉机器人配置

import config from './config/dingtalk-feedback.js';
import { service as dingtalkFeedback } from './utils/dingtalk-feedback.js';

console.log('🚀 开始实时测试钉钉机器人配置...\n');

// 显示配置信息（隐藏部分敏感信息）
console.log('📋 配置信息:');
console.log('  Webhook URL:', config.webhook.replace(/access_token=[^&]+/, 'access_token=***'));
console.log('  密钥前20位:', config.secret.substring(0, 20) + '...');
console.log('  项目名称:', config.projectName);
console.log('  项目版本:', config.projectVersion);

// 测试签名算法
console.log('\n🔐 测试签名算法...');
const timestamp = Date.now();
console.log('  当前时间戳:', timestamp);

try {
  // 生成签名
  const signature = dingtalkFeedback.generateSignature(timestamp);
  console.log('  ✅ 签名生成成功');
  console.log('    签名结果:', signature);
    
  // 构建完整URL
  const fullUrl = dingtalkFeedback.buildWebhookUrl(timestamp, signature);
  console.log('  ✅ URL构建成功');
  console.log('    完整URL:', fullUrl.replace(/access_token=[^&]+/, 'access_token=***'));
    
  // 验证签名格式
  if (signature && signature.length > 0 && signature.includes('%')) {
    console.log('  ✅ 签名格式验证通过（包含URL编码字符）');
  } else {
    console.log('  ❌ 签名格式验证失败');
  }
    
} catch (error) {
  console.error('  ❌ 签名生成失败:', error);
}

// 测试发送消息
console.log('\n📤 测试发送消息到钉钉机器人...');

const testMessage = {
  msgtype: 'text',
  text: {
    content: `🔧 钉钉机器人测试消息\n时间: ${new Date().toLocaleString()}\n项目: ${config.projectName} v${config.projectVersion}\n状态: 签名算法测试通过`
  }
};

console.log('  测试消息内容:', JSON.stringify(testMessage, null, 2));

// 使用钉钉服务发送测试消息
dingtalkFeedback.submit({
  type: 'test',
  content: '这是钉钉机器人配置验证测试',
  rating: 5,
  contact: 'test@example.com'
}).then(result => {
  console.log('\n✅ 钉钉服务测试结果:');
  console.log('  成功:', result.success);
  console.log('  状态:', result.status);
  console.log('  消息:', result.message);
    
  if (result.success) {
    console.log('\n🎉 钉钉机器人配置验证成功！');
    console.log('  签名算法: ✅ 正确');
    console.log('  Webhook配置: ✅ 正确');
    console.log('  消息发送: ✅ 成功');
  } else {
    console.log('\n❌ 钉钉机器人配置验证失败');
    console.log('  错误信息:', result.error || result.message);
  }
}).catch(error => {
  console.error('\n❌ 钉钉服务测试异常:', error);
});

console.log('\n⏳ 等待钉钉服务响应...');
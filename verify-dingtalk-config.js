// verify-dingtalk-config.js
// 验证钉钉机器人配置

import config from './config/dingtalk-feedback.js';
import { service, testService } from './utils/dingtalk-feedback.js';

console.log('🚀 开始验证钉钉机器人配置...\n');

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
  const signature = service.generateSignature(timestamp);
  console.log('  ✅ 签名生成成功');
  console.log('    签名结果:', signature);
    
  // 验证签名格式
  if (signature && signature.length > 0 && signature.includes('%')) {
    console.log('  ✅ 签名格式验证通过（包含URL编码字符）');
  } else {
    console.log('  ❌ 签名格式验证失败');
  }
    
} catch (error) {
  console.error('  ❌ 签名生成失败:', error);
}

// 测试服务连通性
console.log('\n📡 测试钉钉服务连通性...');

testService().then(result => {
  console.log('\n✅ 钉钉服务测试结果:');
  console.log('  成功:', result.success);
  console.log('  状态:', result.status);
  console.log('  消息:', result.message);
    
  if (result.success) {
    console.log('\n🎉 钉钉机器人配置验证成功！');
    console.log('  签名算法: ✅ 正确');
    console.log('  Webhook配置: ✅ 正确');
    console.log('  服务连通性: ✅ 成功');
    console.log('\n💡 配置验证完成，可以在微信小程序中使用钉钉反馈功能了！');
  } else {
    console.log('\n❌ 钉钉机器人配置验证失败');
    console.log('  错误信息:', result.error || result.message);
        
    if (result.status === 'dingtalk_error') {
      console.log('\n🔧 建议检查:');
      console.log('  1. 确认钉钉机器人Webhook URL是否正确');
      console.log('  2. 确认加签密钥是否与钉钉后台配置一致');
      console.log('  3. 检查网络连接是否正常');
      console.log('  4. 确认钉钉机器人是否已启用');
    }
  }
}).catch(error => {
  console.error('\n❌ 钉钉服务测试异常:', error);
});

console.log('\n⏳ 等待钉钉服务响应...');
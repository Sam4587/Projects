// 详细测试钉钉签名生成
import('./utils/dingtalk-feedback.js').then((module) => {
  const { createService } = module;
  
  // 创建测试实例
  const service = createService({
    webhook: 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a',
    secret: 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc',
    projectName: '测试项目',
    projectVersion: '1.0.0'
  });

  console.log('🔧 开始详细测试钉钉签名生成...');

  const timestamp = 1769667458896; // 使用固定时间戳便于比较
  console.log('固定时间戳:', timestamp);

  // 测试不同的签名方法
  console.log('\n📋 测试标准HMAC-SHA256算法:');
  try {
    const signature1 = service.standardHmacSha256(service.secret, timestamp + '\n' + service.secret);
    console.log('  标准算法签名:', signature1);
    console.log('  签名长度:', signature1.length);
  } catch (error) {
    console.error('  标准算法失败:', error.message);
  }

  console.log('\n📋 测试微信兼容HMAC-SHA256算法:');
  try {
    const signature2 = service.wxHmacSha256(timestamp + '\n' + service.secret, service.secret);
    console.log('  微信兼容算法签名:', signature2);
    console.log('  签名长度:', signature2.length);
  } catch (error) {
    console.error('  微信兼容算法失败:', error.message);
  }

  console.log('\n📋 测试备用Base64算法:');
  try {
    const signature3 = service.simpleBase64(timestamp + '\n' + service.secret);
    console.log('  备用算法签名:', signature3);
    console.log('  签名长度:', signature3.length);
  } catch (error) {
    console.error('  备用算法失败:', error.message);
  }

  console.log('\n📋 测试完整签名生成流程:');
  try {
    const finalSignature = service.generateSignature(timestamp);
    console.log('  最终签名:', finalSignature);
    console.log('  签名长度:', finalSignature.length);
    
    // 构建完整URL
    const url = `${service.webhook}&timestamp=${timestamp}&sign=${finalSignature}`;
    console.log('  完整URL:', url.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('  完整流程失败:', error);
  }

  console.log('\n📋 测试完成');
}).catch((error) => {
  console.error('导入模块失败:', error);
});
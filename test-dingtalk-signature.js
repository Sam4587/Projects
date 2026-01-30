// 测试钉钉签名生成
// 使用动态导入来兼容CommonJS模块
import('./utils/dingtalk-feedback.js').then((module) => {
  const { createService } = module;
  
  // 创建测试实例
  const service = createService({
    webhook: 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a',
    secret: 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc',
    projectName: '测试项目',
    projectVersion: '1.0.0'
  });

  // 测试签名生成
  console.log('🔧 开始测试钉钉签名生成...');

  const timestamp = Date.now();
  console.log('时间戳:', timestamp);

  try {
    const signature = service.generateSignature(timestamp);
    console.log('✅ 签名生成成功:');
    console.log('  签名:', signature);
    console.log('  签名长度:', signature.length);
    
    // 构建完整URL
    const url = `${service.webhook}&timestamp=${timestamp}&sign=${signature}`;
    console.log('  完整URL:', url.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ 签名生成失败:', error);
  }

  console.log('\n📋 测试完成');
}).catch((error) => {
  console.error('导入模块失败:', error);
});
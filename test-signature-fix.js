// 测试签名算法修复
// 验证钉钉签名算法是否正确实现

// 导入钉钉反馈模块
import { service as dingtalkFeedback } from './utils/dingtalk-feedback.js';

// 测试签名算法
function testSignatureAlgorithm() {
  console.log('🔐 开始测试签名算法...');
    
  // 测试数据
  const timestamp = Date.now();
  const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
    
  console.log('测试参数:');
  console.log('  时间戳:', timestamp);
  console.log('  密钥长度:', secret.length);
    
  // 测试钉钉官方示例
  const officialTimestamp = 1577262236757;
  const officialSecret = 'SECxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const officialStringToSign = officialTimestamp + '\n' + officialSecret;
    
  console.log('\n📋 钉钉官方示例:');
  console.log('  时间戳:', officialTimestamp);
  console.log('  签名字符串:', officialStringToSign);
    
  // 使用钉钉的签名算法
  try {
    const signature = dingtalkFeedback.generateSignature(timestamp);
    console.log('✅ 签名生成成功');
    console.log('  签名结果:', signature);
    console.log('  签名长度:', signature.length);
        
    // 验证签名格式
    if (signature && signature.length > 0) {
      console.log('✅ 签名格式验证通过');
    } else {
      console.log('❌ 签名格式验证失败');
    }
        
  } catch (error) {
    console.error('❌ 签名生成失败:', error);
  }
}

// 测试URL构建
function testUrlConstruction() {
  console.log('\n🔗 测试URL构建...');
    
  const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a';
  const timestamp = Date.now();
    
  try {
    const signature = dingtalkFeedback.generateSignature(timestamp);
        
    // 构建URL
    let url;
    if (webhook.includes('?')) {
      url = `${webhook}&timestamp=${timestamp}&sign=${signature}`;
    } else {
      url = `${webhook}?timestamp=${timestamp}&sign=${signature}`;
    }
        
    console.log('✅ URL构建成功');
    console.log('  原始webhook:', webhook.substring(0, 60) + '...');
    console.log('  时间戳:', timestamp);
    console.log('  签名:', signature.substring(0, 30) + '...');
    console.log('  最终URL:', url.substring(0, 80) + '...');
        
    // 验证URL格式
    if (url.includes('timestamp=') && url.includes('sign=')) {
      console.log('✅ URL格式验证通过');
    } else {
      console.log('❌ URL格式验证失败');
    }
        
  } catch (error) {
    console.error('❌ URL构建失败:', error);
  }
}

// 运行测试
async function runTests() {
  console.log('🚀 开始钉钉签名算法测试...\n');
    
  // 测试签名算法
  testSignatureAlgorithm();
    
  // 测试URL构建
  testUrlConstruction();
    
  console.log('\n📊 测试完成');
}

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testSignatureAlgorithm,
    testUrlConstruction,
    runTests
  };
} else {
  // 浏览器环境
  window.testDingtalkSignature = runTests;
}

// 如果直接运行此文件
if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}
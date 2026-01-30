// test-dingtalk.js
// 钉钉反馈机制测试脚本

const dingtalkTest = require('./utils/dingtalk-test.js');

/**
 * 运行钉钉反馈测试
 */
async function runDingTalkTest() {
  console.log('🎯 开始钉钉反馈机制测试...\n');
  
  try {
    // 运行完整测试套件
    const testReport = await dingtalkTest.runFullTest();
    
    console.log('\n📋 测试完成！');
    console.log('='.repeat(50));
    
    // 显示测试摘要
    console.log('📊 测试摘要:');
    console.log(`   总测试数: ${testReport.summary.totalTests}`);
    console.log(`   通过测试: ${testReport.summary.passedTests} ✅`);
    console.log(`   失败测试: ${testReport.summary.failedTests} ❌`);
    console.log(`   测试耗时: ${testReport.duration}ms`);
    
    // 显示连通性测试结果
    console.log('\n🔗 连通性测试结果:');
    console.log(`   状态: ${testReport.connectivity.success ? '✅ 成功' : '❌ 失败'}`);
    console.log(`   消息: ${testReport.connectivity.message}`);
    
    // 显示消息格式测试结果
    console.log('\n📋 消息格式测试结果:');
    console.log(`   格式验证: ${testReport.format.valid ? '✅ 通过' : '❌ 失败'}`);
    
    // 显示反馈测试结果
    if (testReport.feedback && testReport.feedback.length > 0) {
      console.log('\n📝 反馈类型测试结果:');
      testReport.feedback.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.name}: ${result.success ? '✅ 成功' : '❌ 失败'} ${result.fallback ? '(降级)' : ''}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    
    // 测试建议
    if (testReport.connectivity.success) {
      console.log('💡 测试建议:');
      console.log('   1. 请检查钉钉群聊，确认是否收到测试消息');
      console.log('   2. 验证消息格式是否符合预期');
      console.log('   3. 检查消息中的项目信息、用户信息等字段');
      console.log('   4. 测试不同场景下的反馈提交');
    } else {
      console.log('⚠️  连通性测试失败，可能原因:');
      console.log('   1. 网络连接问题');
      console.log('   2. 钉钉机器人配置错误');
      console.log('   3. Webhook地址或密钥错误');
      console.log('   4. 钉钉服务限制');
    }
    
    return testReport;
    
  } catch (error) {
    console.error('❌ 测试运行失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 模拟真实用户反馈测试
 */
async function simulateUserFeedback() {
  console.log('\n👤 开始模拟真实用户反馈测试...\n');
  
  const dingtalkFeedback = require('./utils/dingtalk-feedback.js').service;
  
  // 模拟不同场景的用户反馈
  const scenarios = [
    {
      name: '高评分功能建议',
      rating: 5,
      type: 'feature',
      content: '希望增加红包历史记录功能，方便查看以往的发送记录',
      contact: 'user001@example.com'
    },
    {
      name: '低评分bug报告', 
      rating: 1,
      type: 'bug',
      content: '在华为手机上，红包计算界面显示异常，部分文字重叠',
      contact: '13800138000'
    },
    {
      name: '中等评分内容反馈',
      rating: 3,
      type: 'content',
      content: '发现广东地区红包习俗描述不够详细，建议补充更多细节',
      contact: ''
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`📝 模拟: ${scenario.name}...`);
    
    const feedbackData = {
      rating: scenario.rating,
      type: scenario.type,
      content: scenario.content,
      contact: scenario.contact,
      pageName: 'simulation_test',
      createTime: new Date().toISOString(),
      userInfo: {
        userId: `sim_user_${Date.now()}`,
        deviceBrand: 'Simulated',
        deviceModel: 'Test Device'
      },
      systemInfo: {
        brand: 'Simulated',
        model: 'Test Model',
        system: 'Test OS',
        version: '1.0.0',
        SDKVersion: '2.0.0',
        platform: 'test',
        language: 'zh-CN'
      }
    };
    
    try {
      const result = await dingtalkFeedback.submitFeedback(feedbackData, {
        retryCount: 1,
        enableFallback: true
      });
      
      console.log(`   ${scenario.name}: ${result.success ? '✅ 提交成功' : '❌ 提交失败'}`);
      if (result.fallback) {
        console.log('   ⚠️  降级到本地存储');
      }
      
      // 延迟避免频率限制
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`   ${scenario.name}: ❌ 错误 - ${error.message}`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 钉钉反馈机制验证工具');
  console.log('='.repeat(50));
  
  // 运行完整测试
  await runDingTalkTest();
  
  // 模拟用户反馈（可选）
  console.log('\n是否运行模拟用户反馈测试？(y/n)');
  // 在实际环境中可以添加用户输入判断
  
  console.log('\n🎉 测试工具完成！');
  console.log('💡 请检查钉钉群聊确认是否收到测试消息');
  console.log('📋 验证消息内容是否符合预期格式');
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  runDingTalkTest,
  simulateUserFeedback
};
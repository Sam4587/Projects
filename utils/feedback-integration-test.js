// utils/feedback-integration-test.js
// 反馈系统集成测试工具

const dingtalkModule = require('./dingtalk-feedback.js');
const dingtalkFeedback = dingtalkModule.service;

/**
 * 反馈系统集成测试类
 */
class FeedbackIntegrationTest {
  constructor() {
    this.testResults = [];
    this.startTime = null;
  }

  /**
   * 运行完整集成测试
   */
  async runFullIntegrationTest() {
    this.startTime = Date.now();
    console.log('🚀 开始反馈系统集成测试...\n');
    
    try {
      // 1. 测试服务连通性
      await this.testServiceConnectivity();
      
      // 2. 测试消息格式
      await this.testMessageFormat();
      
      // 3. 测试降级机制
      await this.testFallbackMechanism();
      
      // 4. 测试本地存储
      await this.testLocalStorage();
      
      // 5. 测试重试机制
      await this.testRetryMechanism();
      
      // 6. 生成测试报告
      const report = this.generateTestReport();
      
      console.log('\n📊 集成测试完成！');
      console.log('='.repeat(60));
      console.log('测试报告:', JSON.stringify(report, null, 2));
      
      return report;
      
    } catch (error) {
      console.error('❌ 集成测试失败:', error);
      return {
        success: false,
        error: error.message,
        duration: Date.now() - this.startTime
      };
    }
  }

  /**
   * 测试服务连通性
   */
  async testServiceConnectivity() {
    console.log('🔗 测试服务连通性...');
    
    const testData = {
      name: '服务连通性测试',
      startTime: Date.now()
    };
    
    try {
      const result = await dingtalkModule.testService();
      
      this.testResults.push({
        ...testData,
        success: result.success,
        message: result.message,
        status: result.status,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ${result.success ? '✅' : '❌'} ${result.message}`);
      
    } catch (error) {
      this.testResults.push({
        ...testData,
        success: false,
        error: error.message,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ❌ 连通性测试失败: ${error.message}`);
    }
  }

  /**
   * 测试消息格式
   */
  async testMessageFormat() {
    console.log('📋 测试消息格式...');
    
    const testData = {
      name: '消息格式测试',
      startTime: Date.now()
    };
    
    try {
      const feedbackData = {
        rating: 5,
        type: 'feature',
        content: '集成测试：验证消息格式是否正确构建',
        contact: 'test@example.com',
        pageName: 'integration_test',
        createTime: new Date().toISOString(),
        userInfo: {
          userId: 'integration_test_user',
          deviceBrand: 'Test',
          deviceModel: 'Test Device'
        },
        systemInfo: {
          brand: 'Test',
          model: 'Test Model',
          system: 'Test System',
          version: '1.0.0',
          SDKVersion: '2.0.0',
          platform: 'test',
          language: 'zh-CN'
        }
      };
      
      const message = dingtalkFeedback.buildDingTalkMessage(feedbackData);
      
      // 验证消息格式
      const isValid = this.validateMessage(message);
      
      this.testResults.push({
        ...testData,
        success: isValid,
        message: isValid ? '消息格式验证通过' : '消息格式验证失败',
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ${isValid ? '✅' : '❌'} 消息格式${isValid ? '正确' : '错误'}`);
      
    } catch (error) {
      this.testResults.push({
        ...testData,
        success: false,
        error: error.message,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ❌ 消息格式测试失败: ${error.message}`);
    }
  }

  /**
   * 测试降级机制
   */
  async testFallbackMechanism() {
    console.log('🔄 测试降级机制...');
    
    const testData = {
      name: '降级机制测试',
      startTime: Date.now()
    };
    
    try {
      // 模拟网络不可用情况
      const originalCheckNetwork = dingtalkFeedback.checkNetwork;
      dingtalkFeedback.checkNetwork = async () => false;
      
      const feedbackData = {
        rating: 3,
        type: 'other',
        content: '降级机制测试：模拟网络不可用情况',
        contact: '',
        pageName: 'fallback_test',
        createTime: new Date().toISOString()
      };
      
      const result = await dingtalkFeedback.submitFeedback(feedbackData, {
        retryCount: 1,
        enableFallback: true
      });
      
      // 恢复原方法
      dingtalkFeedback.checkNetwork = originalCheckNetwork;
      
      const success = result.success && result.fallback;
      
      this.testResults.push({
        ...testData,
        success: success,
        message: success ? '降级机制正常工作' : '降级机制测试失败',
        fallbackUsed: result.fallback,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ${success ? '✅' : '❌'} 降级机制${success ? '正常' : '异常'}`);
      
    } catch (error) {
      this.testResults.push({
        ...testData,
        success: false,
        error: error.message,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ❌ 降级机制测试失败: ${error.message}`);
    }
  }

  /**
   * 测试本地存储
   */
  async testLocalStorage() {
    console.log('💾 测试本地存储...');
    
    const testData = {
      name: '本地存储测试',
      startTime: Date.now()
    };
    
    try {
      // 清除原有数据
      wx.removeStorageSync('dingtalk_feedback_queue');
      
      // 测试保存到本地
      const feedbackData = {
        rating: 4,
        type: 'content',
        content: '本地存储测试：验证数据是否能正确保存到本地',
        contact: '',
        pageName: 'storage_test',
        createTime: new Date().toISOString()
      };
      
      const saveResult = dingtalkFeedback.saveToLocal(feedbackData);
      
      // 验证数据是否保存成功
      const queue = dingtalkFeedback.getPendingFeedbacks();
      const success = saveResult.success && queue.length === 1;
      
      this.testResults.push({
        ...testData,
        success: success,
        message: success ? '本地存储功能正常' : '本地存储测试失败',
        savedCount: queue.length,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ${success ? '✅' : '❌'} 本地存储${success ? '正常' : '异常'}`);
      
      // 清理测试数据
      wx.removeStorageSync('dingtalk_feedback_queue');
      
    } catch (error) {
      this.testResults.push({
        ...testData,
        success: false,
        error: error.message,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ❌ 本地存储测试失败: ${error.message}`);
    }
  }

  /**
   * 测试重试机制
   */
  async testRetryMechanism() {
    console.log('🔄 测试重试机制...');
    
    const testData = {
      name: '重试机制测试',
      startTime: Date.now()
    };
    
    try {
      // 先添加一些测试数据到本地队列
      const testFeedbacks = [
        {
          rating: 2,
          type: 'bug',
          content: '重试机制测试：测试数据1',
          contact: '',
          pageName: 'retry_test',
          createTime: new Date().toISOString()
        },
        {
          rating: 5,
          type: 'feature',
          content: '重试机制测试：测试数据2',
          contact: '',
          pageName: 'retry_test',
          createTime: new Date().toISOString()
        }
      ];
      
      // 保存测试数据
      testFeedbacks.forEach(feedback => {
        dingtalkFeedback.saveToLocal(feedback);
      });
      
      // 运行重试机制
      const retryResult = await dingtalkFeedback.retryFailedFeedbacks();
      
      const success = retryResult.success;
      
      this.testResults.push({
        ...testData,
        success: success,
        message: success ? '重试机制正常工作' : '重试机制测试失败',
        retriedCount: retryResult.retried,
        successCount: retryResult.successCount,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ${success ? '✅' : '❌'} 重试机制${success ? '正常' : '异常'}`);
      
      // 清理测试数据
      wx.removeStorageSync('dingtalk_feedback_queue');
      
    } catch (error) {
      this.testResults.push({
        ...testData,
        success: false,
        error: error.message,
        duration: Date.now() - testData.startTime
      });
      
      console.log(`   ❌ 重试机制测试失败: ${error.message}`);
    }
  }

  /**
   * 验证消息格式
   */
  validateMessage(message) {
    if (!message || typeof message !== 'object') return false;
    if (!message.msgtype || message.msgtype !== 'markdown') return false;
    if (!message.markdown || typeof message.markdown !== 'object') return false;
    if (!message.markdown.title || !message.markdown.text) return false;
    
    return true;
  }

  /**
   * 生成测试报告
   */
  generateTestReport() {
    const duration = Date.now() - this.startTime;
    const passedTests = this.testResults.filter(r => r.success).length;
    const totalTests = this.testResults.length;
    const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    return {
      timestamp: new Date().toISOString(),
      duration: duration,
      summary: {
        totalTests: totalTests,
        passedTests: passedTests,
        failedTests: totalTests - passedTests,
        successRate: Math.round(successRate)
      },
      details: this.testResults,
      overallStatus: passedTests === totalTests ? 'PASSED' : 'FAILED'
    };
  }

  /**
   * 获取测试结果
   */
  getTestResults() {
    return this.testResults;
  }
}

// 创建默认实例
const integrationTest = new FeedbackIntegrationTest();

// 导出模块
module.exports = {
  FeedbackIntegrationTest,
  test: integrationTest,
  
  // 快捷方法
  runIntegrationTest: () => integrationTest.runFullIntegrationTest(),
  getTestResults: () => integrationTest.getTestResults()
};
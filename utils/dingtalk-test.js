// utils/dingtalk-test.js
// 钉钉反馈机制测试工具

// 导入钉钉反馈模块
import { service as dingtalkFeedback, testService, submit } from './dingtalk-feedback.js';

/**
 * 钉钉反馈测试类
 */
class DingTalkTest {
  constructor() {
    this.testResults = [];
  }

  /**
   * 测试钉钉服务连通性
   */
  async testConnectivity() {
    console.log('🔗 开始测试钉钉服务连通性...');
    
    try {
      const result = await dingtalkModule.testService();
      
      this.testResults.push({
        name: '服务连通性测试',
        result: result,
        timestamp: new Date().toISOString()
      });
      
      console.log('🔗 连通性测试结果:', result);
      
      return result;
    } catch (error) {
      console.error('🔗 连通性测试失败:', error);
      return {
        success: false,
        status: 'test_error',
        message: error.message
      };
    }
  }

  /**
   * 测试各种类型的反馈消息
   */
  async testFeedbackTypes() {
    console.log('📝 开始测试各种反馈类型...');
    
    const feedbackTypes = [
      {
        name: '功能异常反馈',
        data: {
          rating: 2,
          type: 'bug',
          content: '测试功能异常反馈：红包计算功能在特定情况下显示错误结果',
          contact: 'test@example.com',
          pageName: 'calculator_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user_001',
            deviceBrand: 'Xiaomi',
            deviceModel: 'Mi 11'
          },
          systemInfo: {
            brand: 'Xiaomi',
            model: 'Mi 11',
            system: 'Android 12',
            version: '12.0.1',
            SDKVersion: '2.0.0',
            platform: 'android',
            language: 'zh-CN'
          }
        }
      },
      {
        name: '功能建议反馈',
        data: {
          rating: 5,
          type: 'feature',
          content: '测试功能建议：建议增加红包金额预测功能，帮助用户更好规划',
          contact: '13800138000',
          pageName: 'suggestion_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user_002',
            deviceBrand: 'Apple',
            deviceModel: 'iPhone 13'
          },
          systemInfo: {
            brand: 'Apple',
            model: 'iPhone 13',
            system: 'iOS 15.4',
            version: '15.4.1',
            SDKVersion: '2.0.0',
            platform: 'ios',
            language: 'zh-CN'
          }
        }
      },
      {
        name: '内容反馈',
        data: {
          rating: 4,
          type: 'content',
          content: '测试内容反馈：发现某个地域风俗描述不够准确，建议更新',
          contact: '',
          pageName: 'content_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user_003',
            deviceBrand: 'Huawei',
            deviceModel: 'P50'
          },
          systemInfo: {
            brand: 'Huawei',
            model: 'P50',
            system: 'HarmonyOS 2.0',
            version: '2.0.0',
            SDKVersion: '2.0.0',
            platform: 'harmony',
            language: 'zh-CN'
          }
        }
      },
      {
        name: '算法优化反馈',
        data: {
          rating: 3,
          type: 'algorithm',
          content: '测试算法优化：建议优化红包分配算法，提高公平性',
          contact: 'algorithm@test.com',
          pageName: 'algorithm_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user_004',
            deviceBrand: 'Samsung',
            deviceModel: 'Galaxy S22'
          },
          systemInfo: {
            brand: 'Samsung',
            model: 'Galaxy S22',
            system: 'Android 13',
            version: '13.0.0',
            SDKVersion: '2.0.0',
            platform: 'android',
            language: 'zh-CN'
          }
        }
      },
      {
        name: '界面优化反馈',
        data: {
          rating: 4,
          type: 'ui',
          content: '测试界面优化：建议调整颜色搭配，提高可读性',
          contact: '',
          pageName: 'ui_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user_005',
            deviceBrand: 'OPPO',
            deviceModel: 'Find X5'
          },
          systemInfo: {
            brand: 'OPPO',
            model: 'Find X5',
            system: 'ColorOS 12',
            version: '12.0.0',
            SDKVersion: '2.0.0',
            platform: 'android',
            language: 'zh-CN'
          }
        }
      }
    ];

    const results = [];
    
    for (const feedback of feedbackTypes) {
      console.log(`📝 测试: ${feedback.name}...`);
      
      try {
        const result = await dingtalkFeedback.submitFeedback(feedback.data, {
          retryCount: 2,
          enableFallback: true
        });
        
        results.push({
          name: feedback.name,
          success: result.success,
          fallback: result.fallback || false,
          message: result.message,
          data: feedback.data
        });
        
        console.log(`📝 ${feedback.name} 结果:`, result.success ? '✅ 成功' : '❌ 失败');
        
        // 添加延迟避免频率限制
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`📝 ${feedback.name} 失败:`, error);
        results.push({
          name: feedback.name,
          success: false,
          error: error.message,
          data: feedback.data
        });
      }
    }

    this.testResults.push({
      name: '反馈类型测试',
      results: results,
      timestamp: new Date().toISOString()
    });

    return results;
  }

  /**
   * 测试消息格式和内容
   */
  async testMessageFormat() {
    console.log('📋 开始测试消息格式...');
    
    try {
      // 测试构建消息格式
      const testData = {
        rating: 5,
        type: 'bug',
        content: '测试消息格式验证 - 这是一个完整的测试消息，用于验证钉钉机器人接收的消息格式是否正确。包含项目信息、用户评分、反馈详情、用户信息等完整字段。',
        contact: 'format@test.com',
        pageName: 'message_format_test',
        createTime: new Date().toISOString(),
        userInfo: {
          userId: 'format_test_user',
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

      // 构建消息但不发送
      const message = dingtalkFeedback.buildDingTalkMessage(testData);
      
      console.log('📋 构建的消息格式:', JSON.stringify(message, null, 2));
      
      // 验证消息结构
      const formatValid = this.validateMessageFormat(message);
      
      this.testResults.push({
        name: '消息格式测试',
        valid: formatValid,
        message: message,
        timestamp: new Date().toISOString()
      });

      return {
        valid: formatValid,
        message: message
      };
      
    } catch (error) {
      console.error('📋 消息格式测试失败:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * 验证消息格式
   */
  validateMessageFormat(message) {
    const requiredFields = ['msgtype', 'markdown'];
    const markdownFields = ['title', 'text'];
    
    // 检查必需字段
    for (const field of requiredFields) {
      if (!message[field]) {
        console.error(`❌ 缺少必需字段: ${field}`);
        return false;
      }
    }
    
    // 检查markdown字段
    for (const field of markdownFields) {
      if (!message.markdown[field]) {
        console.error(`❌ 缺少markdown字段: ${field}`);
        return false;
      }
    }
    
    // 检查消息内容
    const text = message.markdown.text;
    const requiredSections = [
      '项目信息',
      '用户评分', 
      '反馈详情',
      '用户信息'
    ];
    
    for (const section of requiredSections) {
      if (!text.includes(section)) {
        console.error(`❌ 消息缺少章节: ${section}`);
        return false;
      }
    }
    
    console.log('✅ 消息格式验证通过');
    return true;
  }

  /**
   * 运行完整测试套件
   */
  async runFullTest() {
    console.log('🚀 开始运行完整的钉钉反馈测试套件...\n');
    
    const startTime = Date.now();
    
    // 1. 测试连通性
    const connectivityResult = await this.testConnectivity();
    
    // 2. 测试消息格式
    const formatResult = await this.testMessageFormat();
    
    // 3. 测试反馈类型（仅在连通性成功时进行）
    let feedbackResults = [];
    if (connectivityResult.success) {
      feedbackResults = await this.testFeedbackTypes();
    } else {
      console.log('⚠️  跳过反馈类型测试（连通性失败）');
    }
    
    // 4. 生成测试报告
    const report = this.generateTestReport({
      connectivity: connectivityResult,
      format: formatResult,
      feedback: feedbackResults,
      duration: Date.now() - startTime
    });
    
    console.log('\n📊 测试报告:', report);
    
    return report;
  }

  /**
   * 生成测试报告
   */
  generateTestReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      duration: results.duration,
      connectivity: results.connectivity,
      format: results.format,
      feedback: results.feedback,
      summary: {
        totalTests: 2 + (results.feedback ? results.feedback.length : 0),
        passedTests: 0,
        failedTests: 0
      }
    };
    
    // 统计通过/失败的测试
    if (results.connectivity.success) report.summary.passedTests++;
    else report.summary.failedTests++;
    
    if (results.format.valid) report.summary.passedTests++;
    else report.summary.failedTests++;
    
    if (results.feedback) {
      results.feedback.forEach(feedback => {
        if (feedback.success) report.summary.passedTests++;
        else report.summary.failedTests++;
      });
    }
    
    return report;
  }

  /**
   * 获取测试结果
   */
  getTestResults() {
    return this.testResults;
  }
}

// 创建默认实例
const dingtalkTest = new DingTalkTest();

// 导出模块
module.exports = {
  DingTalkTest,
  test: dingtalkTest,
  
  // 快捷方法
  runTest: () => dingtalkTest.runFullTest(),
  testConnectivity: () => dingtalkTest.testConnectivity(),
  testFeedbackTypes: () => dingtalkTest.testFeedbackTypes(),
  testMessageFormat: () => dingtalkTest.testMessageFormat()
};
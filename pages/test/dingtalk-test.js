// pages/test/dingtalk-test.js
// 钉钉反馈测试页面

import { service as dingtalkFeedback, testService, submit } from '../../utils/dingtalk-feedback.js';
import { test as dingtalkTest } from '../../utils/dingtalk-test.js';

Page({
  data: {
    testResults: [],
    currentStatus: 'ready', // ready, testing, completed
    testProgress: 0,
    testReport: null
  },

  onLoad() {
    console.log('钉钉反馈测试页面加载');
    this.updateStatus('准备开始测试...');
  },

  // 更新状态
  updateStatus(message) {
    this.setData({
      statusMessage: message
    });
    console.log('状态更新:', message);
  },

  // 添加测试结果
  addTestResult(name, result, success) {
    const testResults = this.data.testResults;
    testResults.push({
      name: name,
      result: result,
      success: success,
      timestamp: new Date().toLocaleTimeString()
    });
    
    this.setData({
      testResults: testResults
    });
  },

  // 运行完整测试
  async runFullTest() {
    this.setData({
      currentStatus: 'testing',
      testResults: [],
      testProgress: 0
    });

    try {
      this.updateStatus('开始测试钉钉服务连通性...');
      
      // 1. 测试连通性
      const connectivityResult = await dingtalkTest.testConnectivity();
      this.addTestResult('服务连通性', connectivityResult.message, connectivityResult.success);
      this.setData({ testProgress: 25 });

      // 2. 测试消息格式
      this.updateStatus('测试消息格式...');
      const formatResult = await dingtalkTest.testMessageFormat();
      this.addTestResult('消息格式', formatResult.valid ? '格式正确' : '格式错误', formatResult.valid);
      this.setData({ testProgress: 50 });

      // 3. 测试反馈类型（仅在连通性成功时）
      if (connectivityResult.success) {
        this.updateStatus('测试各种反馈类型...');
        const feedbackResults = await dingtalkTest.testFeedbackTypes();
        
        feedbackResults.forEach((result, index) => {
          this.addTestResult(
            `反馈类型-${result.name}`,
            result.success ? '提交成功' : (result.fallback ? '降级成功' : '提交失败'),
            result.success || result.fallback
          );
        });
        
        this.setData({ testProgress: 100 });
      } else {
        this.updateStatus('跳过反馈类型测试（连通性失败）');
        this.setData({ testProgress: 100 });
      }

      // 生成测试报告
      const successCount = this.data.testResults.filter(r => r.success).length;
      const totalCount = this.data.testResults.length;
      
      this.setData({
        currentStatus: 'completed',
        testReport: {
          successCount: successCount,
          totalCount: totalCount,
          successRate: Math.round((successCount / totalCount) * 100),
          timestamp: new Date().toLocaleString()
        }
      });

      this.updateStatus(`测试完成！成功率: ${successCount}/${totalCount}`);

    } catch (error) {
      this.updateStatus(`测试失败: ${error.message}`);
      this.setData({
        currentStatus: 'completed'
      });
    }
  },

  // 单独测试连通性
  async testConnectivity() {
    this.updateStatus('测试钉钉服务连通性...');
    
    try {
      const result = await dingtalkTest.testConnectivity();
      
      wx.showModal({
        title: '连通性测试结果',
        content: `状态: ${result.success ? '成功' : '失败'}\n消息: ${result.message}`,
        showCancel: false
      });
      
      return result;
    } catch (error) {
      wx.showModal({
        title: '连通性测试失败',
        content: error.message,
        showCancel: false
      });
    }
  },

  // 测试消息格式
  async testMessageFormat() {
    this.updateStatus('测试消息格式...');
    
    try {
      const result = await dingtalkTest.testMessageFormat();
      
      wx.showModal({
        title: '消息格式测试',
        content: `验证结果: ${result.valid ? '通过' : '失败'}`,
        showCancel: false
      });
      
      // 显示消息格式预览
      if (result.message) {
        console.log('消息格式预览:', JSON.stringify(result.message, null, 2));
      }
      
      return result;
    } catch (error) {
      wx.showModal({
        title: '消息格式测试失败',
        content: error.message,
        showCancel: false
      });
    }
  },

  // 模拟用户反馈
  async simulateUserFeedback() {
    this.updateStatus('模拟用户反馈...');
    
    const scenarios = [
      {
        name: '高评分功能建议',
        rating: 5,
        type: 'feature',
        content: '测试：希望增加红包历史记录功能'
      },
      {
        name: 'bug报告',
        rating: 1,
        type: 'bug', 
        content: '测试：界面显示异常问题'
      }
    ];

    for (const scenario of scenarios) {
      wx.showLoading({
        title: `提交: ${scenario.name}`
      });

      try {
        const feedbackData = {
          rating: scenario.rating,
          type: scenario.type,
          content: scenario.content,
          contact: 'test@example.com',
          pageName: 'test_page',
          createTime: new Date().toISOString(),
          userInfo: {
            userId: 'test_user',
            deviceBrand: 'Test',
            deviceModel: 'Test Device'
          }
        };

        const result = await dingtalkFeedback.submitFeedback(feedbackData, {
          retryCount: 1,
          enableFallback: true
        });

        wx.hideLoading();
        
        wx.showToast({
          title: `${scenario.name}: ${result.success ? '成功' : '失败'}`,
          icon: result.success ? 'success' : 'none'
        });

        // 延迟避免频率限制
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        wx.hideLoading();
        wx.showToast({
          title: `${scenario.name}: 错误`,
          icon: 'none'
        });
      }
    }

    this.updateStatus('模拟反馈完成');
  },

  // 查看服务状态
  checkServiceStatus() {
    const status = dingtalkFeedback.getServiceStatus();
    
    wx.showModal({
      title: '服务状态',
      content: `在线状态: ${status.isOnline ? '在线' : '离线'}\n待发送: ${status.pendingCount}条\n项目: ${status.config.projectName}`,
      showCancel: false
    });
  },

  // 清空测试结果
  clearResults() {
    this.setData({
      testResults: [],
      testReport: null,
      currentStatus: 'ready'
    });
    this.updateStatus('测试结果已清空');
  }
});
/**
 * 钉钉服务 - 小程序专用版本
 * 本地测试模式与降级方案
 */

class DingTalkMiniAppService {
  constructor() {
    // 本地测试模式配置
    this.apiUrl = 'https://your-vercel-app.vercel.app/api/send';
    this.enabled = true;
    this.timeout = 10000; // 10秒超时
    this.useLocalTest = false; // 禁用本地测试，使用真实API
    
  }

  /**
   * 发送反馈消息
   * @param {string} message - 反馈内容
   * @param {string} title - 反馈标题
   * @param {string} userId - 用户ID
   * @param {string} page - 来源页面
   * @returns {Promise<boolean>}
   */
  async sendFeedback(message, title = '用户反馈', userId = 'anonymous', page = '未知页面') {
    if (!this.enabled) {
      console.warn('钉钉服务暂时禁用');
      return false;
    }

    // 输入验证
    if (!message || message.trim().length === 0) {
      console.error('反馈消息不能为空');
      return false;
    }

    // 内容长度限制
    if (message.length > 2000) {
      message = message.substring(0, 2000) + '...(内容已截断)';
    }

    const fullMessage = `[来源:${page}] ${message}`;

    // 获取系统信息
    const systemInfo = this.getSystemInfo();

    try {
      // 本地测试模式 - 无需外部API
      if (this.useLocalTest) {
        console.log('🔧 钉钉服务：本地测试模式运行中...');
        console.log('📝 模拟发送反馈:', { fullMessage, title, userId, page, systemInfo });
        
        // 模拟API调用延迟
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('✅ 本地测试：反馈消息模拟发送成功');
            
            // 显示用户反馈成功
            wx.showToast({
              title: '反馈已记录',
              icon: 'success',
              duration: 2000
            });
            
            // 存储到本地（为将来可能的数据同步做准备）
            this.saveFeedbackToLocal({
              message: fullMessage,
              title,
              userId,
              page,
              timestamp: Date.now(),
              systemInfo
            });
            
            resolve(true);
          }, 1000);
        });
      }

      // 正常API调用模式
      return new Promise((resolve) => {
        if (!this.apiUrl) {
          console.error('钉钉API地址未配置');
          wx.showToast({
            title: '服务未配置',
            icon: 'none'
          });
          resolve(false);
          return;
        }

        const requestData = {
          message: fullMessage,
          title: title,
          userId: userId,
          page: page,
          timestamp: Date.now(),
          systemInfo: systemInfo
        };

        wx.request({
          url: this.apiUrl,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'User-Agent': 'MiniProgram-DingTalk-Client'
          },
          data: requestData,
          timeout: this.timeout,
          success: (res) => {
            if (res.statusCode === 200 && res.data && res.data.success) {
              
              // 存储成功记录
              this.saveFeedbackToLocal({
                ...requestData,
                status: 'sent',
                response: res.data
              });
              
              wx.showToast({
                title: '反馈发送成功',
                icon: 'success'
              });
              resolve(true);
            } else {
              console.error('钉钉API返回错误:', res.data, res.statusCode);
              wx.showToast({
                title: '发送失败',
                icon: 'none'
              });
              resolve(false);
            }
          },
          fail: (error) => {
            console.error('钉钉API调用失败');
            
            // 网络错误的详细分析
            if (error.errMsg.includes('request:fail timeout')) {
              console.warn('钉钉API请求超时');
              wx.showToast({
                title: '网络超时',
                icon: 'none'
              });
            } else if (error.errMsg.includes('request:fail')) {
              console.warn('钉钉API网络请求失败')
              wx.showToast({
                title: '网络异常',
                icon: 'none'
              });
            }
            
            // 失败后保存到本地
            this.saveFeedbackToLocal({
              ...requestData,
              status: 'failed',
              error: error.errMsg
            });
            
            resolve(false);
          }
        });
      });
    } catch (error) {
      wx.showToast({
        title: '提交异常',
        icon: 'none'
      });
      return false;
    }
  }

  /**
   * 发送错误报告
   */
  async sendErrorReport(error, context = {}) {
    const message = `
错误报告
━━━━━━━━━
错误内容: ${error.message || error}
错误类型: ${error.name || 'Unknown'}
页面来源: ${context.page || '未知页面'}
用户信息: ${context.userId || 'anonymous'}
发生时间: ${new Date().toLocaleString('zh-CN')}
━━━━━━━━━
    `.trim();

    return await this.sendFeedback(message, '⚠️ 系统错误报告', context.userId || 'system', context.page || 'error-handler');
  }

  /**
   * 发送使用统计
   */
  async sendUsageStats(stats) {
    const message = `
用户行为统计
━━━━━━━━━━━
统计类型: ${stats.type}
用户数量: ${stats.userCount || '未知'}
操作次数: ${stats.actionCount || '未知'}
统计时间: ${new Date().toLocaleString('zh-CN')}
━━━━━━━━━━━
    `.trim();

    return await this.sendFeedback(message, '📊 使用统计报告', 'system', 'background-stats');
  }

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      return {
        platform: systemInfo.platform,
        version: systemInfo.version,
        model: systemInfo.model,
        system: systemInfo.system,
        language: systemInfo.language
      };
    } catch (error) {
      console.warn('获取系统信息失败:', error);
      return { error: '获取系统信息失败' };
    }
  }

  /**
   * 保存反馈到本地存储
   */
  saveFeedbackToLocal(feedbackData) {
    try {
      // 获取现有反馈数据
      let feedbacks = wx.getStorageSync('local_feedbacks') || [];
      
      // 添加新反馈
      feedbacks.push({
        ...feedbackData,
        id: Date.now().toString()
      });
      
      // 保存（最多保留100条）
      if (feedbacks.length > 100) {
        feedbacks = feedbacks.slice(-100);
      }
      
      wx.setStorageSync('local_feedbacks', feedbacks);
      console.log('反馈已保存到本地');
    } catch (error) {
      console.warn('保存反馈到本地失败:', error);
    }
  }

  /**
   * 获取本地存储的反馈数据
   */
  getLocalFeedbacks() {
    try {
      return wx.getStorageSync('local_feedbacks') || [];
    } catch (error) {
      console.warn('获取本地反馈失败:', error);
      return [];
    }
  }

  /**
   * 清空本地反馈数据
   */
  clearLocalFeedbacks() {
    try {
      wx.removeStorageSync('local_feedbacks');
      console.log('本地反馈数据已清空');
    } catch (error) {
      console.warn('清空本地反馈失败:', error);
    }
  }

  /**
   * 禁用钉钉服务（用于降级）
   */
  disable() {
    this.enabled = false;
    this.useLocalTest = false;
    console.warn('钉钉服务已禁用');
  }

  /**
   * 启用钉钉服务
   */
  enable() {
    this.enabled = true;
    this.useLocalTest = true;
    console.log('钉钉服务已启用');
  }

  /**
   * 服务健康检查
   */
  async healthCheck() {
    try {
  
      const result = await this.sendFeedback(
        '服务健康检查 - 一切正常',
        '🔍 系统监控',
        'monitor',
        'health-check'
      );
      return result;
    } catch (error) {
      console.warn('健康检查失败:', error);
      return false;
    }
  }

  /**
   * 更新API端点URL
   */
  updateApiUrl(newUrl) {
    if (newUrl && newUrl.startsWith('https://')) {
      this.apiUrl = newUrl;
      this.useLocalTest = false; // 使用真实API时关闭本地测试
      return true;
    }
    console.error('无效的API地址格式');
    return false;
  }
}

// 创建全局实例
const dingTalkService = new DingTalkMiniAppService();

// 自动进行健康检查（开发环境）
if (typeof __wxConfig !== 'undefined' && __wxConfig.envVersion === 'develop') {
  setTimeout(() => {
    dingTalkService.healthCheck().then(result => {
    });
  }, 3000);
}

// 导出
module.exports = dingTalkService;

// 默认导出（ES6风格）
exports.dingTalkService = dingTalkService;
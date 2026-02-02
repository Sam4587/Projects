// utils/feedback-manager.js
// 通用反馈状态管理模块 - 支持快速部署到其他项目

/**
 * 通用反馈状态管理器
 * 提供统一的反馈状态管理，支持多种平台和降级机制
 */
class FeedbackManager {
  constructor(config = {}) {
    // 基础配置
    this.projectName = config.projectName || '未命名项目';
    this.projectVersion = config.projectVersion || '1.0.0';
    this.environment = config.environment || 'production';
    
    // 钉钉配置
    this.dingtalkConfig = config.dingtalk || {
      enabled: true,
      webhook: process.env.DINGTALK_TOKEN 
        ? `https://oapi.dingtalk.com/robot/send?access_token=${process.env.DINGTALK_TOKEN}`
        : 'https://oapi.dingtalk.com/robot/send?access_token=你的钉钉token',
      secret: process.env.DINGTALK_SECRET || '你的钉钉secret密钥'
    };
    
    // 降级配置
    this.fallbackConfig = config.fallback || {
      enabled: true,
      maxRetries: 3,
      retryInterval: 30000, // 30秒重试间隔
      maxQueueSize: 100
    };
    
    // 状态管理
    this.status = {
      isOnline: false,
      lastCheck: null,
      pendingCount: 0,
      stats: {
        total: 0,
        success: 0,
        failed: 0,
        fallback: 0,
        byType: {},
        byRating: {1:0, 2:0, 3:0, 4:0, 5:0}
      }
    };
    
    // 事件监听器
    this.listeners = {
      statusChange: [],
      feedbackSubmit: [],
      feedbackSuccess: [],
      feedbackFailed: [],
      fallbackTriggered: []
    };
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化管理器
   */
  init() {
    console.log(`[FeedbackManager] 初始化反馈管理器 - ${this.projectName} v${this.projectVersion}`);
    
    // 加载历史统计
    this.loadStats();
    
    // 检查服务状态
    this.checkServiceStatus();
    
    // 启动自动重试（如果启用降级）
    if (this.fallbackConfig.enabled) {
      this.startAutoRetry();
    }
  }
  
  /**
   * 提交反馈（主方法）
   * @param {Object} feedbackData - 反馈数据
   * @param {Object} options - 提交选项
   * @returns {Promise<Object>} 提交结果
   */
  async submitFeedback(feedbackData, options = {}) {
    const {
      retryCount = this.fallbackConfig.maxRetries,
      enableFallback = this.fallbackConfig.enabled,
      forceFallback = false
    } = options;
    
    // 验证反馈数据
    const validation = this.validateFeedback(feedbackData);
    if (!validation.valid) {
      throw new Error(`反馈数据验证失败: ${validation.errors.join(', ')}`);
    }
    
    // 构建完整反馈数据
    const completeFeedback = this.buildCompleteFeedback(feedbackData);
    
    // 触发提交事件
    this.emit('feedbackSubmit', completeFeedback);
    
    // 强制降级模式
    if (forceFallback) {
      return this.fallbackToLocal(completeFeedback);
    }
    
    // 1. 首先尝试钉钉提交
    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        console.log(`[FeedbackManager] 尝试钉钉提交 (第${attempt}次)...`);
        const result = await this.submitToDingTalk(completeFeedback);
        
        // 提交成功
        this.updateStats('success', completeFeedback);
        this.emit('feedbackSuccess', { feedback: completeFeedback, result });
        
        return result;
        
      } catch (error) {
        console.warn(`[FeedbackManager] 钉钉提交失败 (第${attempt}次):`, error.message);
        
        // 最后一次尝试失败
        if (attempt === retryCount) {
          // 2. 降级到本地存储
          if (enableFallback) {
            console.log('[FeedbackManager] 钉钉提交失败，触发降级机制...');
            const fallbackResult = this.fallbackToLocal(completeFeedback);
            
            this.updateStats('fallback', completeFeedback);
            this.emit('fallbackTriggered', { feedback: completeFeedback, error: error.message });
            
            return fallbackResult;
          } else {
            // 不启用降级，直接返回错误
            this.updateStats('failed', completeFeedback);
            this.emit('feedbackFailed', { feedback: completeFeedback, error: error.message });
            throw error;
          }
        }
        
        // 等待后重试
        await this.delay(1000 * attempt);
      }
    }
  }
  
  /**
   * 提交到钉钉机器人
   */
  async submitToDingTalk(feedbackData) {
    if (!this.dingtalkConfig.enabled) {
      throw new Error('钉钉服务未启用');
    }
    
    // 检查网络连接
    if (!this.isNetworkAvailable()) {
      throw new Error('网络连接不可用');
    }
    
    // 生成时间戳和签名
    const timestamp = Date.now();
    const sign = this.generateDingTalkSignature(timestamp);
    
    // 构建URL
    const url = `${this.dingtalkConfig.webhook}&timestamp=${timestamp}&sign=${sign}`;
    
    // 构建消息体
    const message = this.buildDingTalkMessage(feedbackData);
    
    // 发送请求
    return new Promise((resolve, reject) => {
      // 根据环境选择发送方式
      if (typeof wx !== 'undefined' && wx.request) {
        // 微信小程序环境
        wx.request({
          url: url,
          method: 'POST',
          data: message,
          timeout: 10000,
          success: (res) => {
            if (res.statusCode === 200 && res.data.errcode === 0) {
              this.status.isOnline = true;
              resolve({
                success: true,
                method: 'dingtalk',
                message: '反馈发送成功',
                timestamp: Date.now()
              });
            } else {
              reject(new Error(`钉钉机器人返回错误: ${res.data.errmsg}`));
            }
          },
          fail: (err) => {
            this.status.isOnline = false;
            reject(new Error(`网络请求失败: ${err.errMsg}`));
          }
        });
      } else if (typeof fetch !== 'undefined') {
        // Web环境
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
          mode: 'no-cors'
        })
          .then(() => {
            this.status.isOnline = true;
            resolve({
              success: true,
              method: 'dingtalk',
              message: '反馈已发送（no-cors模式）',
              timestamp: Date.now()
            });
          })
          .catch(error => {
            this.status.isOnline = false;
            reject(new Error(`网络请求失败: ${error.message}`));
          });
      } else {
        reject(new Error('不支持的运行环境'));
      }
    });
  }
  
  /**
   * 降级到本地存储
   */
  // 🔴 审核修改：本地保存功能已移除
  fallbackToLocal(feedbackData) {
    // 本地保存功能已移除，避免收集用户信息
    console.log('反馈本地保存已移除，仅通过钉钉提交');
    return {
      success: true,
      method: 'direct',
      message: '反馈已提交（本地保存已移除）'
    };
  }
  
  /**
   * 验证反馈数据
   */
  validateFeedback(feedbackData) {
    const errors = [];
    
    if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
      errors.push('评分必须为1-5');
    }
    
    if (!feedbackData.content || feedbackData.content.trim().length < 5) {
      errors.push('反馈内容至少5个字符');
    }
    
    if (!feedbackData.type) {
      errors.push('必须选择反馈类型');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * 构建完整反馈数据
   */
  buildCompleteFeedback(feedbackData) {
    const now = new Date().toISOString();
    
    return {
      // 基础信息
      ...feedbackData,
      
      // 项目信息
      project: {
        name: this.projectName,
        version: this.projectVersion,
        environment: this.environment
      },
      
      // 时间信息
      createTime: now,
      timestamp: Date.now(),
      
      // 环境信息
      environment: this.getEnvironmentInfo(),
      
      // 状态信息
      status: 'pending'
    };
  }
  
  /**
   * 构建钉钉消息
   */
  buildDingTalkMessage(feedbackData) {
    const typeMap = {
      bug: '🐛 功能异常',
      feature: '✨ 功能建议', 
      content: '📝 内容反馈',
      algorithm: '🧠 算法优化',
      ui: '🎨 界面优化',
      other: '💭 其他'
    };
    
    const feedbackType = typeMap[feedbackData.type] || typeMap.other;
    
    return {
      msgtype: 'markdown',
      markdown: {
        title: `${this.projectName} - 用户反馈`,
        text: `## ${this.projectName} - 用户反馈\n\n` +
              '**📊 项目信息**\n' +
              `- 项目：${this.projectName} (v${this.projectVersion})\n` +
              `- 环境：${this.environment}\n` +
              `- 时间：${new Date(feedbackData.createTime).toLocaleString('zh-CN')}\n\n` +
              
              '**⭐ 用户评分**\n' +
              `评分：${'★'.repeat(feedbackData.rating)}${'☆'.repeat(5 - feedbackData.rating)} (${feedbackData.rating}/5)\n\n` +
              
              '**📋 反馈详情**\n' +
              `- 类型：${feedbackType}\n` +
              `- 内容：${feedbackData.content}\n` +
              (feedbackData.contact ? `- 联系方式：${feedbackData.contact}\n` : '') +
              '\n' +
              
              '**🌍 环境信息**\n' +
              `- 页面：${feedbackData.pageName || '未知'}\n` +
              `- 平台：${feedbackData.environment?.platform || '未知'}\n` +
              `- 用户：${feedbackData.environment?.userId || '匿名'}\n`
      }
    };
  }
  
  /**
   * 生成钉钉签名
   */
  generateDingTalkSignature(timestamp) {
    // 简化版签名生成（实际项目中需要完整实现）
    const stringToSign = timestamp + '\n' + this.dingtalkConfig.secret;
    return encodeURIComponent(btoa(stringToSign));
  }
  
  /**
   * 检查服务状态
   */
  async checkServiceStatus() {
    try {
      const isOnline = this.isNetworkAvailable();
      this.status.isOnline = isOnline;
      this.status.lastCheck = new Date().toISOString();
      
      this.emit('statusChange', this.status);
      return this.status;
    } catch (error) {
      console.warn('[FeedbackManager] 检查服务状态失败:', error);
      return this.status;
    }
  }
  
  /**
   * 启动自动重试
   */
  startAutoRetry() {
    if (this.autoRetryInterval) {
      clearInterval(this.autoRetryInterval);
    }
    
    this.autoRetryInterval = setInterval(async () => {
      if (this.status.isOnline) {
        await this.retryFailedFeedbacks();
      }
    }, this.fallbackConfig.retryInterval);
  }
  
  /**
   * 重试失败的反馈
   */
  async retryFailedFeedbacks() {
    try {
      const key = `${this.projectName}_feedback_queue`.replace(/[^a-zA-Z0-9_]/g, '_');
      const queue = this.getStorage(key) || [];
      
      if (queue.length === 0) return;
      
      let successCount = 0;
      let failedCount = 0;
      
      // 只重试最近10条
      const toRetry = queue.slice(0, 10);
      
      for (const feedback of toRetry) {
        try {
          await this.submitToDingTalk(feedback);
          successCount++;
          
          // 从队列中移除成功发送的
          const index = queue.findIndex(item => item.id === feedback.id);
          if (index !== -1) {
            queue.splice(index, 1);
          }
        } catch (error) {
          failedCount++;
          // 更新重试次数
          feedback.retryCount = (feedback.retryCount || 0) + 1;
        }
        
        // 添加延迟避免频率限制
        await this.delay(1000);
      }
      
      // 更新本地存储
      this.setStorage(key, queue);
      this.updatePendingCount();
      
      if (successCount > 0) {
        console.log(`[FeedbackManager] 自动重试完成: 成功 ${successCount} 条, 失败 ${failedCount} 条`);
      }
      
    } catch (error) {
      console.warn('[FeedbackManager] 自动重试失败:', error);
    }
  }
  
  /**
   * 工具方法
   */
  
  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // 生成唯一ID
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
  
  // 检查网络可用性
  isNetworkAvailable() {
    if (typeof navigator !== 'undefined' && navigator.onLine !== undefined) {
      return navigator.onLine;
    }
    return true; // 默认认为在线
  }
  
  // 获取环境信息
  getEnvironmentInfo() {
    if (typeof wx !== 'undefined') {
      // 微信小程序环境
      try {
        const systemInfo = wx.getSystemInfoSync();
        return {
          platform: 'wechat_miniprogram',
          userId: systemInfo.model + '_' + systemInfo.system.replace(/\s+/g, '_'),
          device: `${systemInfo.brand} ${systemInfo.model}`,
          system: systemInfo.system,
          version: systemInfo.version
        };
      } catch (error) {
        return { platform: 'wechat_miniprogram', userId: 'unknown' };
      }
    } else if (typeof navigator !== 'undefined') {
      // Web环境
      return {
        platform: 'web',
        userId: navigator.userAgent.substring(0, 20) + '_' + Date.now(),
        device: navigator.platform,
        system: navigator.userAgent,
        language: navigator.language
      };
    } else {
      return { platform: 'unknown', userId: 'unknown' };
    }
  }
  
  // 存储操作（跨平台兼容）
  getStorage(key) {
    try {
      if (typeof wx !== 'undefined' && wx.getStorageSync) {
        return wx.getStorageSync(key);
      } else if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem(key) || 'null');
      }
    } catch (error) {
      console.warn('[FeedbackManager] 读取存储失败:', error);
    }
    return null;
  }
  
  setStorage(key, value) {
    try {
      if (typeof wx !== 'undefined' && wx.setStorageSync) {
        wx.setStorageSync(key, value);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('[FeedbackManager] 写入存储失败:', error);
    }
  }
  
  // 更新待处理计数
  updatePendingCount() {
    const key = `${this.projectName}_feedback_queue`.replace(/[^a-zA-Z0-9_]/g, '_');
    const queue = this.getStorage(key) || [];
    this.status.pendingCount = queue.length;
  }
  
  // 更新统计
  updateStats(status, feedbackData) {
    this.status.stats.total++;
    this.status.stats[status]++;
    
    // 按类型统计
    const type = feedbackData.type || 'other';
    this.status.stats.byType[type] = (this.status.stats.byType[type] || 0) + 1;
    
    // 按评分统计
    const rating = feedbackData.rating || 0;
    if (rating >= 1 && rating <= 5) {
      this.status.stats.byRating[rating]++;
    }
    
    // 保存到存储
    this.saveStats();
  }
  
  // 加载统计
  loadStats() {
    try {
      const key = `${this.projectName}_feedback_stats`.replace(/[^a-zA-Z0-9_]/g, '_');
      const savedStats = this.getStorage(key);
      if (savedStats) {
        this.status.stats = { ...this.status.stats, ...savedStats };
      }
    } catch (error) {
      console.warn('[FeedbackManager] 加载统计失败:', error);
    }
  }
  
  // 保存统计
  saveStats() {
    try {
      const key = `${this.projectName}_feedback_stats`.replace(/[^a-zA-Z0-9_]/g, '_');
      this.setStorage(key, this.status.stats);
    } catch (error) {
      console.warn('[FeedbackManager] 保存统计失败:', error);
    }
  }
  
  // 事件系统
  on(event, listener) {
    if (this.listeners[event]) {
      this.listeners[event].push(listener);
    }
  }
  
  off(event, listener) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.warn(`[FeedbackManager] 事件监听器执行失败 (${event}):`, error);
        }
      });
    }
  }
  
  /**
   * 公共方法
   */
  
  // 获取状态信息
  getStatus() {
    return {
      ...this.status,
      config: {
        projectName: this.projectName,
        projectVersion: this.projectVersion,
        environment: this.environment,
        dingtalkEnabled: this.dingtalkConfig.enabled,
        fallbackEnabled: this.fallbackConfig.enabled
      }
    };
  }
  
  // 获取统计信息
  getStats() {
    return this.status.stats;
  }
  
  // 获取待处理反馈
  getPendingFeedbacks() {
    const key = `${this.projectName}_feedback_queue`.replace(/[^a-zA-Z0-9_]/g, '_');
    return this.getStorage(key) || [];
  }
  
  // 清空待处理反馈
  clearPendingFeedbacks() {
    const key = `${this.projectName}_feedback_queue`.replace(/[^a-zA-Z0-9_]/g, '_');
    this.setStorage(key, []);
    this.updatePendingCount();
    return { success: true, message: '待处理反馈已清空' };
  }
  
  // 手动重试
  async manualRetry() {
    return this.retryFailedFeedbacks();
  }
  
  // 销毁管理器
  destroy() {
    if (this.autoRetryInterval) {
      clearInterval(this.autoRetryInterval);
    }
    console.log('[FeedbackManager] 反馈管理器已销毁');
  }
}

// 创建默认实例（用于快速集成）
const createFeedbackManager = (config) => new FeedbackManager(config);

// 导出
module.exports = {
  FeedbackManager,
  createFeedbackManager,
  default: createFeedbackManager
};
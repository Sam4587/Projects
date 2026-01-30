// utils/analytics.js
// 数据统计分析模块

/**
 * 统计管理类
 */
class Analytics {
  constructor() {
    this.sessionStartTime = Date.now();
    this.pageViewStack = [];
    this.eventQueue = [];
    this.flushInterval = 30000; // 30秒刷新一次
    this.maxQueueSize = 50; // 最大队列长度
    
    // 启动自动刷新
    this.startAutoFlush();
  }

  /**
   * 记录页面浏览
   * @param {string} pageName - 页面名称
   * @param {Object} params - 附加参数
   */
  trackPageView(pageName, params = {}) {
    const data = {
      type: 'pageview',
      page: pageName,
      params,
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.sessionStartTime
    };
    
    this.pushToQueue(data);
    this.pageViewStack.push({
      page: pageName,
      enterTime: Date.now()
    });
    
    // 保存页面访问统计
    this.savePageStats(pageName);
  }

  /**
   * 记录页面离开
   * @param {string} pageName - 页面名称
   */
  trackPageLeave(pageName) {
    const pageEntry = this.pageViewStack.pop();
    if (pageEntry && pageEntry.page === pageName) {
      const duration = Date.now() - pageEntry.enterTime;
      
      const data = {
        type: 'pageleave',
        page: pageName,
        duration,
        timestamp: Date.now()
      };
      
      this.pushToQueue(data);
      this.saveDurationStats(pageName, duration);
    }
  }

  /**
   * 记录自定义事件
   * @param {string} eventName - 事件名称
   * @param {Object} params - 事件参数
   */
  trackEvent(eventName, params = {}) {
    const data = {
      type: 'event',
      event: eventName,
      params,
      timestamp: Date.now(),
      page: this.getCurrentPage()
    };
    
    this.pushToQueue(data);
    this.saveEventStats(eventName);
  }

  /**
   * 记录用户操作
   * @param {string} action - 操作类型
   * @param {string} target - 操作目标
   * @param {Object} params - 附加参数
   */
  trackAction(action, target, params = {}) {
    this.trackEvent('action', {
      action,
      target,
      ...params
    });
  }

  /**
   * 记录性能指标
   * @param {string} metric - 指标名称
   * @param {number} value - 指标值
   * @param {string} unit - 单位
   */
  trackPerformance(metric, value, unit = 'ms') {
    const data = {
      type: 'performance',
      metric,
      value,
      unit,
      timestamp: Date.now()
    };
    
    this.pushToQueue(data);
    this.savePerformanceStats(metric, value);
  }

  /**
   * 记录错误信息
   * @param {Error} error - 错误对象
   * @param {Object} context - 错误上下文
   */
  trackError(error, context = {}) {
    const data = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now(),
      page: this.getCurrentPage()
    };
    
    this.pushToQueue(data);
    this.saveErrorStats(error.message);
  }

  /**
   * 将数据推入队列
   * @param {Object} data - 数据对象
   */
  pushToQueue(data) {
    this.eventQueue.push(data);
    
    // 队列满时立即刷新
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  /**
   * 启动自动刷新
   */
  startAutoFlush() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }

  /**
   * 刷新数据到存储
   */
  flush() {
    if (this.eventQueue.length === 0) return;
    
    try {
      const key = `analytics_events_${new Date().toDateString()}`;
      const existing = wx.getStorageSync(key) || [];
      const updated = existing.concat(this.eventQueue);
      
      // 限制存储大小
      if (updated.length > 1000) {
        updated.splice(0, updated.length - 1000);
      }
      
      wx.setStorageSync(key, updated);
      this.eventQueue = [];
    } catch (e) {
      console.error('Analytics flush failed:', e);
      // 跟踪错误事件
      if (this.app && this.app.trackError) {
        this.app.trackError(e, { context: 'analytics_flush' });
      }
    }
  }

  /**
   * 获取当前页面
   * @returns {string} 页面名称
   */
  getCurrentPage() {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      return pages[pages.length - 1].route;
    }
    return '';
  }

  /**
   * 保存页面访问统计
   * @param {string} pageName - 页面名称
   */
  savePageStats(pageName) {
    const key = 'stats_pageviews';
    const stats = wx.getStorageSync(key) || {};
    
    if (!stats[pageName]) {
      stats[pageName] = { count: 0, firstVisit: Date.now() };
    }
    stats[pageName].count++;
    stats[pageName].lastVisit = Date.now();
    
    wx.setStorageSync(key, stats);
  }

  /**
   * 保存页面停留时长统计
   * @param {string} pageName - 页面名称
   * @param {number} duration - 停留时长(ms)
   */
  saveDurationStats(pageName, duration) {
    const key = 'stats_duration';
    const stats = wx.getStorageSync(key) || {};
    
    if (!stats[pageName]) {
      stats[pageName] = { total: 0, count: 0, avg: 0, max: 0, min: Infinity };
    }
    
    const s = stats[pageName];
    s.total += duration;
    s.count++;
    s.avg = Math.round(s.total / s.count);
    s.max = Math.max(s.max, duration);
    s.min = Math.min(s.min, duration);
    
    wx.setStorageSync(key, stats);
  }

  /**
   * 保存事件统计
   * @param {string} eventName - 事件名称
   */
  saveEventStats(eventName) {
    const key = 'stats_events';
    const stats = wx.getStorageSync(key) || {};
    
    if (!stats[eventName]) {
      stats[eventName] = { count: 0, firstTime: Date.now() };
    }
    stats[eventName].count++;
    stats[eventName].lastTime = Date.now();
    
    wx.setStorageSync(key, stats);
  }

  /**
   * 保存性能统计
   * @param {string} metric - 指标名称
   * @param {number} value - 指标值
   */
  savePerformanceStats(metric, value) {
    const key = 'stats_performance';
    const stats = wx.getStorageSync(key) || {};
    
    if (!stats[metric]) {
      stats[metric] = { values: [], avg: 0, max: 0, min: Infinity };
    }
    
    const s = stats[metric];
    s.values.push(value);
    // 只保留最近100条
    if (s.values.length > 100) {
      s.values.shift();
    }
    s.avg = Math.round(s.values.reduce((a, b) => a + b, 0) / s.values.length);
    s.max = Math.max(...s.values);
    s.min = Math.min(...s.values);
    
    wx.setStorageSync(key, stats);
  }

  /**
   * 保存错误统计
   * @param {string} errorMessage - 错误信息
   */
  saveErrorStats(errorMessage) {
    const key = 'stats_errors';
    const stats = wx.getStorageSync(key) || {};
    
    const errorKey = errorMessage.substring(0, 50); // 取前50字符作为key
    if (!stats[errorKey]) {
      stats[errorKey] = { count: 0, message: errorMessage, firstTime: Date.now() };
    }
    stats[errorKey].count++;
    stats[errorKey].lastTime = Date.now();
    
    wx.setStorageSync(key, stats);
  }

  /**
   * 获取统计数据汇总
   * @returns {Object} 统计汇总
   */
  getStatsSummary() {
    const today = new Date().toDateString();
    
    return {
      pageViews: wx.getStorageSync('stats_pageviews') || {},
      duration: wx.getStorageSync('stats_duration') || {},
      events: wx.getStorageSync('stats_events') || {},
      performance: wx.getStorageSync('stats_performance') || {},
      errors: wx.getStorageSync('stats_errors') || {},
      todayEvents: wx.getStorageSync(`analytics_events_${today}`) || [],
      feedback: wx.getStorageSync('user_feedback_list') || []
    };
  }

  /**
   * 生成统计报告
   * @returns {Object} 统计报告
   */
  generateReport() {
    const summary = this.getStatsSummary();
    const report = {
      generatedAt: new Date().toISOString(),
      overview: {
        totalPageViews: 0,
        totalEvents: 0,
        totalErrors: Object.keys(summary.errors).length,
        totalFeedback: summary.feedback.length
      },
      topPages: [],
      topEvents: [],
      performance: summary.performance,
      errors: summary.errors
    };
    
    // 计算总页面访问
    Object.values(summary.pageViews).forEach(pv => {
      report.overview.totalPageViews += pv.count;
    });
    
    // 计算总事件
    Object.values(summary.events).forEach(ev => {
      report.overview.totalEvents += ev.count;
    });
    
    // 热门页面排行
    report.topPages = Object.entries(summary.pageViews)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([page, data]) => ({ page, ...data }));
    
    // 热门事件排行
    report.topEvents = Object.entries(summary.events)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([event, data]) => ({ event, ...data }));
    
    return report;
  }

  /**
   * 清空所有统计数据
   */
  clearAllStats() {
    const keys = [
      'stats_pageviews',
      'stats_duration',
      'stats_events',
      'stats_performance',
      'stats_errors',
      'user_feedback_list'
    ];
    
    // 清除今日事件
    const today = new Date().toDateString();
    keys.push(`analytics_events_${today}`);
    
    keys.forEach(key => wx.removeStorageSync(key));
  }
}

// 创建全局实例
const analytics = new Analytics();

/**
 * 初始化全局统计
 * @param {Object} app - App 实例
 */
function initAnalytics(app) {
  app.globalData = app.globalData || {};
  app.globalData.analytics = analytics;
  
  // 在 app 上挂载快捷方法
  app.trackEvent = (eventName, params) => analytics.trackEvent(eventName, params);
  app.trackPageView = (pageName, params) => analytics.trackPageView(pageName, params);
  app.trackError = (error, context) => analytics.trackError(error, context);
  
  // 监听全局错误
  wx.onError((error) => {
    analytics.trackError(new Error(error), { source: 'global' });
  });
  
  // 监听页面不存在
  wx.onPageNotFound((res) => {
    analytics.trackEvent('page_not_found', {
      path: res.path,
      query: res.query,
      isEntryPage: res.isEntryPage
    });
  });
  
  console.log('Analytics initialized');
}

module.exports = {
  Analytics,
  analytics,
  initAnalytics
};

// app.js
// 引入统计模块 - 使用Web兼容版本
const { initAnalytics } = require('./utils/analytics.js');

App({
  onLaunch: function() {
    // 应用启动时调用
    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
      console.log('随礼那点事儿应用启动 - 版本: 20260128');
    }
    
    // 初始化路由信息 - 更新为新的入口页面
    this.globalData = {
      userInfo: null,
      currentRoute: 'pages/calculator/calculator',
      prevRoute: null,
      _webviewReady: false, // 添加webview准备状态
      storageMonitor: {
        lastCheck: null,
        lastSize: 0,
        warningLevel: 'normal',
        cleanedCount: 0
      }
    };
    
    // 初始化数据统计
    initAnalytics(this);
    
    // 初始化存储监控
    this.initStorageMonitor();
    
    // 只清除非统计相关的旧缓存
    this.clearNonStatsCache();
    
    // 检查用户信息
    if (wx.canIUse('getUserInfo')) {
      // 可以调用 getUserInfo 获取用户信息
    }
    
    // 记录应用启动事件（确保在 initAnalytics 之后）
    if (this.trackEvent && (typeof process === 'undefined' || process.env.NODE_ENV === 'production')) {
      this.trackEvent('app_launch', {
        scene: 'startup',
        version: '20260128'
      });
    }
  },

  // 初始化存储监控
  initStorageMonitor: function() {
    // 启动存储监控定时器
    this.storageMonitorInterval = setInterval(this.checkStorageHealth.bind(this), 60000);
    
    // 启动缓存过期清理定时器
    this.cacheCleanupInterval = setInterval(this.cleanExpiredCache.bind(this), 24 * 60 * 60 * 1000);
    
    // 生产环境减少控制台输出
    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
      console.log('存储监控系统已启动');
    }
  },

  // 检查存储健康状态
  checkStorageHealth: function() {
    try {
      const storageInfo = wx.getStorageInfoSync();
      const currentSize = storageInfo.currentSize;
      const limitSize = storageInfo.limitSize;
      const usageRate = currentSize / limitSize;
      
      // 更新监控状态
      this.globalData.storageMonitor.lastCheck = new Date().toISOString();
      this.globalData.storageMonitor.lastSize = currentSize;
      
      // 存储容量预警
      const usagePercent = Math.round(usageRate * 100);
      if (usageRate > 0.9) {
        this.globalData.storageMonitor.warningLevel = 'critical';
        this.handleStorageCritical(usageRate);
      } else if (usageRate > 0.8) {
        this.globalData.storageMonitor.warningLevel = 'warning';
        this.handleStorageWarning(usageRate);
      } else if (usageRate > 0.7) {
        this.globalData.storageMonitor.warningLevel = 'normal';
        this.handleStorageNormal(usageRate);
      } else {
        this.globalData.storageMonitor.warningLevel = 'good';
      }
      
      // 记录存储监控事件
      if (this.trackEvent) {
        this.trackEvent('storage_monitor', {
          currentSize,
          limitSize,
          usageRate: usagePercent,
          warningLevel: this.globalData.storageMonitor.warningLevel,
          keysCount: storageInfo.keys.length
        });
      }
      
    } catch (error) {
      console.error('存储健康检查失败:', error);
      if (this.trackError) {
        this.trackError(error, { context: 'storage_monitor' });
      }
    }
  },

  // 处理存储临界状态
  handleStorageCritical: function(usageRate) {
    const usagePercent = Math.round(usageRate * 100);
    // 仅在非生产环境显示警告
    if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
      console.warn('存储空间严重不足');
    }
    
    // 立即清理过期缓存
    this.cleanExpiredCache(true);
    
    // 清理非必要数据
    this.cleanNonEssentialData();
    
    // 显示用户警告
    setTimeout(() => {
      wx.showToast({
        title: '存储空间不足，正在清理缓存',
        icon: 'none',
        duration: 2000
      });
    }, 1000);
  },

  // 处理存储警告状态
  handleStorageWarning: function(usageRate) {
    const usagePercent = Math.round(usageRate * 100);
    console.warn('存储空间警告');
    
    // 清理过期缓存
    this.cleanExpiredCache();
    
    // 记录警告事件
    if (this.trackEvent) {
      this.trackEvent('storage_warning', { usageRate: usagePercent });
    }
  },

  // 处理存储正常状态
  handleStorageNormal: function(usageRate) {
    const usagePercent = Math.round(usageRate * 100);
    
    // 定期清理过期缓存
    this.cleanExpiredCache();
  },

  // 清理过期缓存
  cleanExpiredCache: function(forceClean = false) {
    try {
      const now = Date.now();
      const storageKeys = wx.getStorageInfoSync().keys;
      let cleanedCount = 0;
      
      // 定义缓存过期时间配置
      const cacheExpiryConfig = {
        'analytics_events_': 7 * 24 * 60 * 60 * 1000,    // 7天
        'user_feedback_list': 30 * 24 * 60 * 60 * 1000,   // 30天
        'pseudo_feedback': 14 * 24 * 60 * 60 * 1000,      // 14天
        'local_feedbacks': 14 * 24 * 60 * 60 * 1000,      // 14天
        'stats_': 90 * 24 * 60 * 60 * 1000               // 90天
      };
      
      storageKeys.forEach(key => {
        try {
          const data = wx.getStorageSync(key);
          let shouldClean = false;
          
          // 检查缓存过期
          for (const [prefix, expiry] of Object.entries(cacheExpiryConfig)) {
            if (key.startsWith(prefix)) {
              if (Array.isArray(data) && data.length > 0) {
                // 处理数组类型数据
                const firstItem = data[0];
                const itemTime = firstItem.timestamp || firstItem.createTime || firstItem.saveTime;
                if (itemTime && (now - itemTime > expiry)) {
                  shouldClean = true;
                  break;
                }
              } else if (typeof data === 'object' && data !== null) {
                // 处理对象类型数据
                const updateTime = data.lastUpdate || data.timestamp || data.createTime;
                if (updateTime && (now - updateTime > expiry)) {
                  shouldClean = true;
                  break;
                }
              }
            }
          }
          
          // 执行清理
          if (forceClean || shouldClean) {
            wx.removeStorageSync(key);
            cleanedCount++;
            if (process.env.NODE_ENV !== 'production') {
              console.log(`清理过期缓存: ${key}`);
            }
          }
          
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`清理缓存 ${key} 时出错:`, error);
          }
        }
      });
      
      // 更新清理统计
      if (cleanedCount > 0) {
        this.globalData.storageMonitor.cleanedCount += cleanedCount;
        console.log(`本次清理了 ${cleanedCount} 个过期缓存`);
        
        // 记录清理事件
        if (this.trackEvent) {
          this.trackEvent('cache_cleanup', {
            cleanedCount,
            totalCleaned: this.globalData.storageMonitor.cleanedCount
          });
        }
      }
      
    } catch (error) {
      if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
        console.error('清理过期缓存失败:', error);
      }
      if (this.trackError) {
        this.trackError(error, { context: 'cache_cleanup' });
      }
    }
  },

  // 清理非必要数据
  cleanNonEssentialData: function() {
    try {
      const nonEssentialPrefixes = ['debug_', 'temp_', 'cache_', 'session_'];
      const storageKeys = wx.getStorageInfoSync().keys;
      let cleanedCount = 0;
      
      storageKeys.forEach(key => {
        const isNonEssential = nonEssentialPrefixes.some(prefix => key.startsWith(prefix));
        
        if (isNonEssential) {
          try {
            wx.removeStorageSync(key);
            cleanedCount++;
            if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
            }
          } catch (error) {
            if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
              console.error('清理数据失败');
            }
          }
        }
      });
      
      if (cleanedCount > 0) {
      }
      
    } catch (error) {
      console.error('清理数据失败');
    }
  },

  // 获取存储监控状态
  getStorageStatus: function() {
    try {
      const storageInfo = wx.getStorageInfoSync();
      return {
        ...this.globalData.storageMonitor,
        currentSize: storageInfo.currentSize,
        limitSize: storageInfo.limitSize,
        usageRate: Math.round((storageInfo.currentSize / storageInfo.limitSize) * 100),
        keysCount: storageInfo.keys.length
      };
    } catch (error) {
      return {
        ...this.globalData.storageMonitor,
        error: error.message
      };
    }
  },

  // 清除非统计数据缓存
  clearNonStatsCache: function() {
    const keys = wx.getStorageInfoSync().keys;
    const protectedKeys = [
      'stats_',           // 统计相关
      'analytics_',       // 分析事件
      'user_feedback',    // 用户反馈
      'feedback_count'    // 反馈次数
    ];
    
    keys.forEach(key => {
      // 如果key不以保护前缀开头，则清除
      const shouldProtect = protectedKeys.some(prefix => key.startsWith(prefix));
      if (!shouldProtect) {
        wx.removeStorageSync(key);
      }
    });
  },

  onShow: function(options) {
  // 应用显示时调用
    if (options && options.path) {
      this.globalData.currentRoute = options.path;
    }
  },

  onHide: function() {
    // 应用隐藏时调用
  },

  onError: function(msg) {
    // 应用发生错误时调用
  },

  onPageNotFound: function(options) {
    // 页面不存在时调用
  },

  onUnload: function() {
    // 应用卸载时清理定时器
    if (this.storageMonitorInterval) {
      clearInterval(this.storageMonitorInterval);
    }
    
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
    }
  },

  // 全局数据
  globalData: {
    userInfo: null,
    currentRoute: 'pages/calculator/calculator',
    prevRoute: null,
    storageMonitor: {
      lastCheck: null,
      lastSize: 0,
      warningLevel: 'normal',
      cleanedCount: 0
    }
  }
});
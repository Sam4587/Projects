// components/feedback/feedback.js
// 用户反馈组件 - 支持钉钉机器人降级机制的反馈组件

// 引入钉钉反馈服务 - 微信小程序专用版本
const dingtalkModule = require('../../utils/dingtalk-feedback-miniprogram');
const dingtalkFeedback = dingtalkModule.dingtalkFeedback;

Component({
  /**
   * 组件属性
   */
  properties: {
    // 页面标识，用于统计来源
    pageName: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件初始数据
   */
  data: {
    // 弹窗显示状态
    show: false,
    // 评分 (1-5)
    rating: 0,
    // 反馈类型
    selectedType: '',
    // 反馈内容
    content: '',
    // 联系方式
    contact: '',
    // 提交状态
    submitStatus: 'idle', // 提交状态: idle-空闲, submitting-提交中, success-成功, fallback-降级成功, error-失败
    submitTimeout: null, // 提交超时定时器
    submitError: '', // 错误信息
    loading: false,  // 🔴 P0: 通用加载状态
    loadingText: '',  // 🔴 P0: 加载文本
    // 钉钉服务状态
    dingtalkStatus: 'unknown', // unknown, online, offline
    // 拖拽状态
    dragging: false,
    // 是否允许触发点击
    allowClick: true,
    // 拖拽起始位置（用于绝对定位）
    dragStart: {
      x: 0,
      y: 0
    },
    // 按钮起始位置
    btnStart: {
      x: 0,
      y: 0
    },
    // 节流控制
    lastMoveTime: 0,
    // 按钮位置
    btnPosition: {
      x: 300,
      y: 400
    },
    // 拖拽起始位置
    btnStart: {
      x: 0,
      y: 0
    },
    // 触摸起始位置
    touchStart: {
      x: 0,
      y: 0
    },
    // 按钮尺寸
    btnSize: {
      width: 50,
      height: 50
    },
    // 窗口信息（缓存，避免频繁调用 wx.getWindowInfo()）
    windowInfo: {
      windowWidth: 375,
      windowHeight: 667
    },
    // 反馈类型列表
    feedbackTypes: [
      { value: 'bug', label: '🐛 功能异常' },
      { value: 'feature', label: '✨ 功能建议' },
      { value: 'content', label: '📝 内容反馈' },
      { value: 'algorithm', label: '🧠 算法优化' },
      { value: 'ui', label: '🎨 界面优化' },
      { value: 'other', label: '💭 其他' }
    ],
    // 反馈历史
    showHistory: false,
    
    // 统计信息
    stats: {
      totalFeedback: 0,
      avgRating: 0,
      dingtalkSuccess: 0,
      fallbackSuccess: 0
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 初始化窗口信息（缓存到 data 中，避免频繁调用 wx.getWindowInfo()）
      const windowInfo = wx.getWindowInfo();
      this.setData({
        windowInfo: windowInfo
      });

      // 初始化按钮位置（屏幕右侧中间，增加安全边距）
      this.setData({
        'btnPosition.x': windowInfo.windowWidth - 120, // 距离右边距120px，确保不贴边
        'btnPosition.y': windowInfo.windowHeight * 0.6, // 屏幕高度的60%处
        'btnSize.width': 60,
        'btnSize.height': 60
      });

      // 加载统计信息
      this.loadStats();

      // 检查钉钉服务状态
      this.checkDingTalkStatus();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    // 打开弹窗
    openModal() {
      // 如果不允许点击（正在拖拽），则不打开弹窗
      if (!this.data.allowClick) {
        return;
      }

      // 检查今日反馈次数限制
      const today = new Date().toDateString();
      const feedbackCount = wx.getStorageSync('feedback_count_' + today) || 0;
      
      if (feedbackCount >= 5) {
        wx.showToast({
          title: '今日反馈次数已达上限',
          icon: 'none'
        });
        return;
      }
      
      // 重置提交状态
      this.setData({ 
        show: true,
        submitStatus: 'idle',
        submitError: ''
      });
      this.trackEvent('feedback_modal_open');
    },

    // 关闭弹窗
    closeModal() {
      // 清除超时定时器
      if (this.data.submitTimeout) {
        clearTimeout(this.data.submitTimeout);
      }
      
      this.setData({ show: false });
      // 重置表单
      setTimeout(() => {
        this.setData({
          rating: 0,
          selectedType: '',
          content: '',
          contact: '',
          submitStatus: 'idle',
          submitError: ''
        });
      }, 300);
    },

    // 评分变化
    onRatingChange(e) {
      const rating = parseInt(e.currentTarget.dataset.index);
      this.setData({ rating });
    },

    // 类型选择
    onTypeChange(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({ selectedType: type });
    },

    // 内容输入
    onContentInput(e) {
      this.setData({ content: e.detail.value });
    },

    // 联系方式输入
    onContactInput(e) {
      this.setData({ contact: e.detail.value });
    },

    // 提交反馈 - 实现降级机制
    async submitFeedback() {
      const { rating, selectedType, content, submitStatus } = this.data;
      
      // 防止重复提交
      if (submitStatus === 'submitting') {
        return;
      }
      
      // 验证必填项
      if (!rating) {
        wx.showToast({
          title: '请选择评分',
          icon: 'none'
        });
        return;
      }
      
      if (!selectedType) {
        wx.showToast({
          title: '请选择反馈类型',
          icon: 'none'
        });
        return;
      }
      
      if (!content.trim()) {
        wx.showToast({
          title: '请填写反馈内容',
          icon: 'none'
        });
        return;
      }
      
      // 🔴 P0: 增强提交状态显示
      wx.showLoading({
        title: '正在提交反馈...',
        mask: true
      });
      
      // 设置提交状态
      this.setData({ 
        submitStatus: 'submitting',
        submitError: '',
        loading: true,
        loadingText: '正在发送反馈...'
      });
      
      // 设置超时定时器（15秒超时）
      const timeout = setTimeout(() => {
        if (this.data.submitStatus === 'submitting') {
          wx.hideLoading();
          this.handleSubmitError('请求超时，请检查网络连接后重试');
        }
      }, 15000);
      
      this.setData({ submitTimeout: timeout });
      
      try {
        // 获取系统信息 (使用新版API)
        let systemInfo;
        try {
          // 尝试使用新版API
          const deviceInfo = wx.getDeviceInfo();
          const windowInfo = wx.getWindowInfo();
          const appBaseInfo = wx.getAppBaseInfo();
          
          systemInfo = {
            brand: deviceInfo.brand || '未知',
            model: deviceInfo.model || '未知',
            system: deviceInfo.system || '未知',
            version: deviceInfo.version || '未知',
            SDKVersion: appBaseInfo.SDKVersion || '未知',
            platform: deviceInfo.platform || 'unknown',
            language: appBaseInfo.language || 'zh_CN',
            windowWidth: windowInfo.windowWidth,
            windowHeight: windowInfo.windowHeight
          };
        } catch (error) {
          console.warn('使用新版API获取系统信息失败，降级到旧版API:', error);
          // 降级到旧版API
          systemInfo = await new Promise((resolve, reject) => {
            wx.getSystemInfo({
              success: resolve,
              fail: reject
            });
          });
        }
        
        // 构建反馈数据
        const feedbackData = {
          rating,
          type: selectedType,
          content: content.trim(),
          contact: this.data.contact.trim(),
          pageName: this.properties.pageName,
          createTime: new Date().toISOString(),
          userInfo: {
            userId: systemInfo.model + '_' + systemInfo.system.replace(/\s+/g, '_'),
            deviceBrand: systemInfo.brand || '未知',
            deviceModel: systemInfo.model || '未知'
          },
          systemInfo: {
            brand: systemInfo.brand || '未知',
            model: systemInfo.model || '未知',
            system: systemInfo.system || '未知',
            version: systemInfo.version || '未知',
            SDKVersion: systemInfo.SDKVersion || '未知',
            platform: systemInfo.platform || '未知',
            language: systemInfo.language || '未知'
          }
        };

        // 真正发送反馈到钉钉
        console.log('🚀 开始提交反馈到钉钉...');

        try {
          const result = await dingtalkModule.submit(feedbackData);

          wx.hideLoading();

          // 清除超时定时器
          if (this.data.submitTimeout) {
            clearTimeout(this.data.submitTimeout);
          }

          // 根据结果处理
          if (result.success) {
            if (result.fallback) {
              // 降级成功
              console.log('📦 反馈已降级保存到本地');
              this.setData({ submitStatus: 'fallback' });
              this.updateStats(rating, 'fallback');

              setTimeout(() => {
                wx.showToast({
                  title: '反馈已保存到本地,稍后自动重试',
                  icon: 'success',
                  duration: 3000
                });
                this.closeModal();
              }, 500);
            } else {
              // 钉钉提交成功
              console.log('✅ 反馈已成功发送到钉钉');
              this.setData({ submitStatus: 'success' });
              this.updateStats(rating, 'dingtalk');

              setTimeout(() => {
                wx.showToast({
                  title: '感谢您的反馈!',
                  icon: 'success',
                  duration: 2000
                });
                this.closeModal();
              }, 500);
            }

            // 更新今日反馈次数
            const today = new Date().toDateString();
            const feedbackCount = wx.getStorageSync('feedback_count_' + today) || 0;
            wx.setStorageSync('feedback_count_' + today, feedbackCount + 1);

            // 发送统计事件
            this.trackEvent('feedback_submit', {
              rating,
              type: selectedType,
              method: result.fallback ? 'fallback' : 'dingtalk'
            });

            // 更新钉钉服务状态
            this.checkDingTalkStatus();

          } else {
          // 提交失败
          const errorMsg = result.error || result.message || '发送失败';
          console.warn('⚠️ 反馈发送失败:', errorMsg);
          this.handleSubmitError(errorMsg);
        }
        } catch (error) {
          wx.hideLoading();
          throw error;
        }
        
      } catch (error) {
        console.error('提交反馈失败:', error);
        // 清除超时定时器
        if (this.data.submitTimeout) {
          clearTimeout(this.data.submitTimeout);
        }
        this.handleSubmitError(error.message || '提交失败，请重试');
      }
    },

    // 错误处理包装器
    handleSubmitError(errorMessage) {
      console.error('提交反馈失败:', errorMessage);
      
      // 清除超时定时器
      if (this.data.submitTimeout) {
        clearTimeout(this.data.submitTimeout);
      }
      
      // 🔴 P0: 隐藏所有加载状态并重置
      wx.hideLoading();
      
      this.setData({ 
        submitStatus: 'error',
        submitError: errorMessage,
        loading: false,
        loadingText: ''
      });
      
      // 显示错误提示
      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 3000
      });
    },

    // 重试提交
    retrySubmit() {
      this.setData({ 
        submitStatus: 'idle',
        submitError: ''
      });
      this.submitFeedback();
    },

    // 🔴 审核修改：移除保存反馈到本地功能
    saveFeedback(feedbackData) {
      // 本地保存功能已移除，避免收集用户信息
      console.log('反馈本地保存已移除，仅通过钉钉提交');
      return { success: true, message: '反馈已提交（本地保存已移除）' };
    },

    // 安全保存反馈列表到本地
    safeSetFeedbackList(list) {
      try {
        // 验证存储空间
        const storageInfo = wx.getStorageInfoSync();
        
        // 预估存储大小 (简单估算)
        const estimatedSize = JSON.stringify(list).length;
        const usageRate = (storageInfo.currentSize + estimatedSize) / storageInfo.limitSize;
        
        // 存储容量预警检查
        if (usageRate > 0.95) {
          this.triggerGlobalStorageCleanup(); // 触发全局清理
          return this.cleanOldFeedbackData();
        } else if (usageRate > 0.85) {
          return this.cleanOldFeedbackData();
        }
        
        // 添加时间戳用于过期检查
        const enhancedList = list.map(item => ({
          ...item,
          lastUpdated: Date.now()
        }));
        
        wx.setStorageSync('user_feedback_list', enhancedList);
        
        // 记录存储操作
        if (getApp().trackEvent) {
          getApp().trackEvent('feedback_storage', {
            action: 'save',
            itemCount: list.length,
            estimatedSize: estimatedSize,
            usageRate: Math.round(usageRate * 100)
          });
        }
        
        return true;
      } catch (error) {
        console.error('保存反馈失败');
        
        // 尝试清理后重试
        try {
          this.cleanOldFeedbackData();
          wx.setStorageSync('user_feedback_list', [list[0]]); // 只保存最新的
          return true;
        } catch (retryError) {
          return false;
        }
      }
    },

    // 安全获取反馈列表
    safeGetFeedbackList() {
      try {
        // 检查存储空间
        const storageInfo = wx.getStorageInfoSync();
        const usageRate = storageInfo.currentSize / storageInfo.limitSize;
        
        if (usageRate > 0.9) {
  
          this.cleanOldFeedbackData();
        }
        
        const data = wx.getStorageSync('user_feedback_list');
        
        // 记录存储操作
        if (getApp().trackEvent) {
          getApp().trackEvent('feedback_storage', {
            action: 'read',
            itemCount: Array.isArray(data) ? data.length : 0,
            usageRate: Math.round(usageRate * 100)
          });
        }
        
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('获取反馈失败');
        
        // 降级方案：尝试清理存储
        try {
          wx.clearStorageSync();
          wx.showToast({
            title: '存储空间已清理',
            icon: 'none',
            duration: 2000
          });
        } catch (clearError) {
  
        }
        
        return [];
      }
    },

    // 触发全局存储清理
    triggerGlobalStorageCleanup() {
      try {
        const app = getApp();
        if (app.cleanExpiredCache) {
          app.cleanExpiredCache(true); // 强制清理
        }
        if (app.cleanNonEssentialData) {
          app.cleanNonEssentialData();
        }
        console.log('已触发全局存储清理');
      } catch (error) {
        console.warn('触发全局存储清理失败:', error);
      }
    },

    // 清理旧数据，保留最近30条
    cleanOldFeedbackData() {
      try {
        const data = wx.getStorageSync('user_feedback_list');
        if (!Array.isArray(data)) return [];
        
        const cleaned = data.slice(0, 30);
        wx.setStorageSync('user_feedback_list', cleaned);
        
        return cleaned;
      } catch {
        return [];
      }
    },

    // 加载统计信息
    loadStats() {
      try {
        const list = this.safeGetFeedbackList();
        if (list.length > 0) {
          const totalRating = list.reduce((sum, item) => sum + (item.rating || 0), 0);
          this.setData({
            'stats.totalFeedback': list.length,
            'stats.avgRating': list.length > 0 ? (totalRating / list.length).toFixed(1) : '0.0'
          });
        } else {
          this.setData({
            'stats.totalFeedback': 0,
            'stats.avgRating': '0.0'
          });
        }
      } catch (e) {
        console.error('加载统计失败:', e);
        // 设置默认值
        this.setData({
          'stats.totalFeedback': 0,
          'stats.avgRating': '0.0'
        });
      }
    },

    // 更新统计
    updateStats(newRating, method = 'dingtalk') {
      const { stats } = this.data;
      const newTotal = stats.totalFeedback + 1;
      const newAvg = ((stats.avgRating * stats.totalFeedback + newRating) / newTotal).toFixed(1);
      
      // 根据提交方式更新统计
      const updatedStats = {
        'stats.totalFeedback': newTotal,
        'stats.avgRating': newAvg
      };
      
      if (method === 'dingtalk') {
        updatedStats['stats.dingtalkSuccess'] = stats.dingtalkSuccess + 1;
      } else if (method === 'fallback') {
        updatedStats['stats.fallbackSuccess'] = stats.fallbackSuccess + 1;
      }
      
      this.setData(updatedStats);
    },
    
    // 检查钉钉服务状态
    checkDingTalkStatus() {
      try {
        const status = dingtalkFeedback.getServiceStatus();
        const serviceStatus = status.isOnline ? 'online' : 'offline';
        
        this.setData({
          dingtalkStatus: serviceStatus
        });
        
        // 如果服务状态为离线，自动进行连通性测试
        if (serviceStatus === 'offline') {
          this.autoTestDingTalkService();
        }
        
        return status;
      } catch (error) {
        console.warn('检查钉钉服务状态失败:', error);
        this.setData({
          dingtalkStatus: 'unknown'
        });
        
        // 自动进行连通性测试
        this.autoTestDingTalkService();
        return null;
      }
    },
    
    // 自动测试钉钉服务连通性
    autoTestDingTalkService() {
      // 避免频繁测试，每5分钟测试一次
      const lastTestTime = wx.getStorageSync('last_dingtalk_test') || 0;
      const now = Date.now();
      if (now - lastTestTime < 5 * 60 * 1000) {
        return;
      }
      
      
      dingtalkModule.testService()
        .then(result => {
    
          
          // 更新测试时间
          wx.setStorageSync('last_dingtalk_test', now);
          
          // 根据测试结果更新状态
          let newStatus = 'unknown';
          
          if (result.success) {
            newStatus = 'online';
    
          } else {
            newStatus = 'offline';
    
          }
          
          this.setData({
            dingtalkStatus: newStatus
          });
          
          // 发送统计事件
          this.trackEvent('dingtalk_service_test', {
            success: result.success,
            status: result.status,
            message: result.message
          });
        })
        .catch(error => {
    
          this.setData({
            dingtalkStatus: 'offline'
          });
        });
    },
    
    // 重试本地失败的反馈
    retryFailedFeedbacks() {
      this.setData({ 
        submitStatus: 'submitting',
        submitError: ''
      });
      
      dingtalkFeedback.retryFailedFeedbacks()
        .then(result => {
          if (result.success) {
            wx.showToast({
              title: `重试完成: 成功${result.successCount}条`,
              icon: 'success',
              duration: 3000
            });
          } else {
            wx.showToast({
              title: '重试失败',
              icon: 'none',
              duration: 2000
            });
          }
          
          this.setData({ submitStatus: 'idle' });
          this.checkDingTalkStatus();
        })
        .catch(error => {
          wx.showToast({
            title: '重试失败',
            icon: 'none',
            duration: 2000
          });
          this.setData({ submitStatus: 'idle' });
        });
    },

    // 触摸开始
    onTouchStart(e) {
      const touch = e.touches[0];
      const { btnPosition } = this.data;

      this.setData({
        dragging: false,
        allowClick: true,
        dragStart: { x: touch.clientX, y: touch.clientY },
        btnStart: { x: btnPosition.x, y: btnPosition.y },
        'touchStart.x': touch.clientX,
        'touchStart.y': touch.clientY
      });
    },

    // 触摸移动
    onTouchMove: function(e) {
      // 阻止页面滚动
      if (e.cancelable && e.preventDefault) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      const { dragStart, btnStart, windowInfo } = this.data;
      const MOVE_THRESHOLD = 5; // 降低阈值，更快响应
      const THROTTLE_DELAY = 8; // 提高帧率到 120fps

      // 计算拖拽距离
      const dragX = touch.clientX - dragStart.x;
      const dragY = touch.clientY - dragStart.y;

      // 如果移动距离超过阈值，标记为拖拽
      if (Math.abs(dragX) > MOVE_THRESHOLD || Math.abs(dragY) > MOVE_THRESHOLD) {
        if (!this.data.dragging) {
          this.setData({
            dragging: true,
            allowClick: false
          });
        }
      }

      // 节流控制：限制更新频率
      const now = Date.now();
      if (now - this.data.lastMoveTime < THROTTLE_DELAY) {
        return;
      }

      // 更新最后移动时间
      this.setData({ lastMoveTime: now });

      // 使用绝对位置计算：按钮起始位置 + 拖拽距离
      let newX = btnStart.x + dragX;
      let newY = btnStart.y + dragY;

      // 快速边界限制
      const btnWidth = 60;
      const btnHeight = 60;
      const minX = 20;
      const maxX = windowInfo.windowWidth - btnWidth - 20;
      const minY = 20;
      const maxY = windowInfo.windowHeight - btnHeight - 20;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      // 角落吸附（只在靠近时执行）
      const safeMargin = 80;
      const nearTopLeft = newX < minX + safeMargin && newY < minY + safeMargin;
      const nearTopRight = newX > maxX - safeMargin && newY < minY + safeMargin;
      const nearBottomLeft = newX < minX + safeMargin && newY > maxY - safeMargin;
      const nearBottomRight = newX > maxX - safeMargin && newY > maxY - safeMargin;

      if (nearTopLeft) {
        newX = minX + safeMargin;
        newY = Math.max(minY, newY);
      } else if (nearTopRight) {
        newX = maxX - safeMargin;
        newY = Math.max(minY, newY);
      } else if (nearBottomLeft) {
        newX = minX + safeMargin;
        newY = Math.min(maxY, newY);
      } else if (nearBottomRight) {
        newX = maxX - safeMargin;
        newY = Math.min(maxY, newY);
      }

      // 只更新按钮位置，减少 setData 调用
      this.setData({
        'btnPosition.x': newX,
        'btnPosition.y': newY
      });
    },

    // 触摸结束
    onTouchEnd(e) {
      // 防止拖拽时触发tap事件
      if (this.data.dragging) {
        e.preventDefault && e.preventDefault();
      }
      
      setTimeout(() => {
        this.setData({ 
          dragging: false,
          allowClick: true
        });
      }, 100);
    },

    // 阻止触摸穿透
    preventTouchMove() {
      return;
    },

    // 事件追踪
    trackEvent(eventName, params = {}) {
      try {
        const app = getApp();
        if (app && app.trackEvent) {
          app.trackEvent(eventName, {
            ...params,
            component: 'feedback',
            pageName: this.properties.pageName
          });
        }
      } catch (error) {
        console.warn('trackEvent failed:', error);
        // 静默失败，不影响核心功能
      }
    },

    // 获取所有反馈数据（供外部调用）
    getAllFeedback() {
      console.log('反馈数据获取已禁用，返回空数组');
      return [];
    },

    // 清空反馈数据（供外部调用）
    clearAllFeedback() {
      console.log('反馈本地存储已移除，无需清理');
      this.setData({
        'stats.totalFeedback': 0,
        'stats.avgRating': 0
      });
    }
  }
});
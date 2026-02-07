// components/feedback-history/feedback-history.js
// 用户反馈历史组件

Component({
  /**
   * 组件属性
   */
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件初始数据
   */
  data: {
    // 反馈列表
    feedbackList: [],
    // 统计信息
    totalCount: 0,
    successCount: 0,
    // 反馈类型映射
    typeMap: {
      bug: { icon: '🐛', label: '功能异常' },
      feature: { icon: '✨', label: '功能建议' },
      content: { icon: '📝', label: '内容反馈' },
      algorithm: { icon: '🧠', label: '算法优化' },
      ui: { icon: '🎨', label: '界面优化' },
      other: { icon: '💭', label: '其他' }
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      this.loadFeedbackHistory();
    }
  },

  /**
   * 组件方法
   */
  methods: {
    // 打开弹窗
    openModal() {
      this.setData({ show: true });
      this.loadFeedbackHistory();
    },

    // 关闭弹窗
    closeModal() {
      this.setData({ show: false });
    },

    // 加载反馈历史
    loadFeedbackHistory() {
      try {
        // 从本地存储加载反馈历史
        const feedbackHistory = wx.getStorageSync('feedback_history') || [];
        const totalCount = feedbackHistory.length;
        const successCount = feedbackHistory.filter(item => item.status === 'success').length;
        
        // 按时间倒序排列
        const sortedList = feedbackHistory.sort((a, b) => b.createTime - a.createTime);
        
        this.setData({
          feedbackList: sortedList,
          totalCount,
          successCount
        });
      } catch (error) {
        console.error('加载反馈历史失败:', error);
        this.setData({
          feedbackList: [],
          totalCount: 0,
          successCount: 0
        });
      }
    },

    // 获取类型图标
    getTypeIcon(type) {
      return this.data.typeMap[type]?.icon || '💭';
    },

    // 获取类型标签
    getTypeLabel(type) {
      return this.data.typeMap[type]?.label || '其他';
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        success: '已发送',
        pending: '待发送',
        failed: '发送失败'
      };
      return statusMap[status] || '未知';
    },

    // 获取评分星星
    getStars(rating) {
      const stars = '☆'.repeat(rating) + '☆'.repeat(5 - rating);
      return stars;
    },

    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚';
      }
      
      // 小于1小时
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
      }
      
      // 小于24小时
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
      }
      
      // 小于7天
      if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
      }
      
      // 超过7天，显示具体日期
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },

    // 防止触摸穿透
    preventTouchMove() {
      return;
    }
  }
});

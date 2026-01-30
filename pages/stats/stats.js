// pages/stats/stats.js
// 数据统计查看页面

const { analytics } = require('../../utils/analytics.js');

Page({
  data: {
    report: null,
    feedbackList: [],
    todayEvents: [],
    activeTab: 'overview', // overview, feedback, events, performance
    tabs: [
      { key: 'overview', label: '概览' },
      { key: 'feedback', label: '反馈' },
      { key: 'events', label: '事件' },
      { key: 'performance', label: '性能' }
    ],
    loading: false,  // 🔴 P0: 加载状态
    loadingText: ''  // 🔴 P0: 加载文本
  },

  onLoad: function() {
    this.loadStats();
  },

  onShow: function() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats: function() {
    // 🔴 P0: 添加统计加载状态
    this.setData({
      loading: true,
      loadingText: '正在加载统计报告...'
    });
    
    // 模拟数据加载过程
    var that = this;
    setTimeout(function() {
      const report = analytics.generateReport();
      const feedbackList = wx.getStorageSync('user_feedback_list') || [];
      const today = new Date().toDateString();
      const todayEvents = wx.getStorageSync(`analytics_events_${today}`) || [];

      that.setData({
        report,
        feedbackList: feedbackList.slice(0, 20), // 最近20条
        todayEvents: todayEvents.slice(-50), // 最近50条
        loading: false
      });
      console.log('✅ 统计报告加载完成');
    }, 700);
  },

  // 切换标签
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 格式化日期
  formatDate: function(timestamp) {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  },

  // 格式化时长
  formatDuration: function(ms) {
    if (ms < 1000) return ms + 'ms';
    if (ms < 60000) return Math.round(ms / 1000) + '秒';
    return Math.round(ms / 60000) + '分钟';
  },

  // 导出统计数据
  exportStats: function() {
    const report = analytics.generateReport();
    const content = JSON.stringify(report, null, 2);
    
    wx.setClipboardData({
      data: content,
      success: () => {
        wx.showToast({
          title: '报告已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  // 清空统计数据
  clearStats: function() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有统计数据吗？此操作不可恢复。',
      confirmColor: '#dc2626',
      success: (res) => {
        if (res.confirm) {
          analytics.clearAllStats();
          this.loadStats();
          wx.showToast({
            title: '统计数据已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看反馈详情
  viewFeedbackDetail: function(e) {
    const index = e.currentTarget.dataset.index;
    const feedback = this.data.feedbackList[index];
    
    wx.showModal({
      title: '反馈详情',
      content: `类型: ${feedback.type}\n评分: ${feedback.rating}星\n内容: ${feedback.content}\n时间: ${this.formatDate(feedback.createTime)}`,
      showCancel: false
    });
  },

  // 返回上一页
  goBack: function() {
    wx.navigateBack();
  }
});

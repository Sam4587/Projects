// components/feedback-history-modal/feedback-history-modal.js
const FeedbackStorage = require('../../utils/feedback-storage');

Component({
  options: {},

  data: {
    show: false,
    history: [],
    loading: false
  },

  lifetimes: {
    attached() {
      console.log('📋 反馈历史组件已加载');
      this.loadHistory();
    },

    detached() {
      console.log('📋 反馈历史组件已卸载');
    }
  },

  methods: {
    /**
     * 加载反馈历史
     */
    loadHistory() {
      const history = FeedbackStorage.getFeedbackHistory();

      // 为每条记录添加类型标签
      const historyWithLabels = history.map(item => ({
        ...item,
        typeLabel: this.getTypeLabel(item.type)
      }));

      this.setData({
        history: historyWithLabels,
        loading: false
      });
    },

    /**
     * 获取类型标签
     */
    getTypeLabel(type) {
      const labels = {
        functional: '功能建议',
        bug: '问题反馈',
        appearance: '界面建议',
        performance: '性能建议',
        other: '其他'
      };
      return labels[type] || type;
    },

    /**
     * 显示弹窗
     */
    show() {
      this.setData({ show: true });
      this.loadHistory();
    },

    /**
     * 隐藏弹窗
     */
    hide() {
      this.setData({ show: false });
    },

    /**
     * 处理遮罩层点击
     */
    handleMaskTap() {
      // 点击遮罩层关闭弹窗
      this.hide();
    },

    /**
     * 处理关闭按钮
     */
    handleClose() {
      this.hide();
    },

    /**
     * 阻止事件冒泡
     */
    stopPropagation() {
      // 阻止点击事件冒泡到遮罩层
    },

    /**
     * 处理记录项点击
     */
    handleItemClick(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.history.find(h => h.id === id);

      if (!item) return;

      console.log('📋 查看反馈记录:', id);

      // 显示详情弹窗（待实现）
      wx.showModal({
        title: '反馈详情',
        content: `类型: ${item.typeLabel}\n评分: ${item.rating}⭐\n内容: ${item.content}\n时间: ${item.submitTime}\n状态: ${this.getStatusText(item.status)}`,
        showCancel: false
      });
    },

    /**
     * 获取状态文本
     */
    getStatusText(status) {
      const statusText = {
        success: '已发送到钉钉',
        failed: '发送失败,已保存到本地',
        pending: '等待发送'
      };
      return statusText[status] || status;
    },

    /**
     * 处理重新发送
     */
    handleRetry(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.history.find(h => h.id === id);

      if (!item || item.status !== 'failed') return;

      console.log('📤 重新发送反馈:', id);

      wx.showModal({
        title: '确认重新发送',
        content: `是否要重新发送这条反馈?\n\n类型: ${item.typeLabel}\n评分: ${item.rating}⭐\n内容: ${item.content}`,
        success: (res) => {
          if (res.confirm) {
            // 触发页面级重试事件
            this.triggerEvent('retryFeedback', { feedback: item });
          }
        }
      });
    },

    /**
     * 处理删除记录
     */
    handleDelete(e) {
      const id = e.currentTarget.dataset.id;
      const item = this.data.history.find(h => h.id === id);

      if (!item) return;

      console.log('🗑️ 删除反馈记录:', id);

      wx.showModal({
        title: '确认删除',
        content: `确定要删除这条反馈记录吗?\n\n类型: ${item.typeLabel}\n评分: ${item.rating}⭐\n内容: ${item.content}`,
        success: (res) => {
          if (res.confirm) {
            const result = FeedbackStorage.deleteFeedback(id);

            if (result.success) {
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });
              this.loadHistory();
            } else {
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },

    /**
     * 清空所有记录
     */
    handleClearAll() {
      wx.showModal({
        title: '确认清空',
        content: '确定要清空所有反馈记录吗?此操作不可恢复。',
        success: (res) => {
          if (res.confirm) {
            const result = FeedbackStorage.clearAllHistory();

            if (result.success) {
              wx.showToast({
                title: '清空成功',
                icon: 'success'
              });
              this.loadHistory();
            } else {
              wx.showToast({
                title: '清空失败',
                icon: 'none'
              });
            }
          }
        }
      });
    },

    /**
     * 格式化时间
     */
    formatTime(isoString) {
      if (!isoString) return '';

      const date = new Date(isoString);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) {
        return '刚刚';
      } else if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}分钟前`;
      } else if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
      } else if (diff < 2592000000) {
        const days = Math.floor(diff / 86400000);
        return `${days}天前`;
      } else {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
      }
    }
  }
});

module.exports = {};

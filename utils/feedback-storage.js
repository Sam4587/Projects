/**
 * 反馈历史存储工具
 * 用于存储和管理用户的反馈记录
 */

class FeedbackStorage {
  constructor() {
    this.storageKey = 'feedback_history';
    this.maxRecords = 50; // 最多保存50条记录
  }

  /**
   * 保存反馈记录
   * @param {Object} feedback - 反馈数据
   * @returns {Object} - 保存结果
   */
  saveFeedback(feedback) {
    try {
      const history = this.getFeedbackHistory();

      // 创建新的反馈记录
      const newFeedback = {
        id: this.generateId(),
        ...feedback,
        submitTime: new Date().toISOString(),
        status: 'success'
      };

      // 添加到开头
      history.unshift(newFeedback);

      // 限制记录数量
      const limitedHistory = history.slice(0, this.maxRecords);

      // 保存到本地存储
      wx.setStorageSync(this.storageKey, limitedHistory);

      console.log('✅ 反馈已保存到本地记录:', newFeedback.id);
      console.log('📊 当前历史记录数:', limitedHistory.length);

      return {
        success: true,
        message: '反馈已保存',
        feedbackId: newFeedback.id
      };
    } catch (error) {
      console.error('❌ 保存反馈记录失败:', error);
      return {
        success: false,
        error: '保存失败,请重试'
      };
    }
  }

  /**
   * 获取反馈历史
   * @returns {Array} - 历史记录数组
   */
  getFeedbackHistory() {
    try {
      const history = wx.getStorageSync(this.storageKey) || [];
      console.log('📋 已加载历史记录:', history.length, '条');
      return history;
    } catch (error) {
      console.error('❌ 加载历史记录失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取反馈记录
   * @param {string} id - 反馈记录ID
   * @returns {Object|null} - 反馈记录或null
   */
  getFeedbackById(id) {
    try {
      const history = this.getFeedbackHistory();
      return history.find(item => item.id === id) || null;
    } catch (error) {
      console.error('❌ 获取反馈记录失败:', error);
      return null;
    }
  }

  /**
   * 更新反馈记录状态
   * @param {string} id - 反馈记录ID
   * @param {string} status - 新状态
   */
  updateFeedbackStatus(id, status) {
    try {
      const history = this.getFeedbackHistory();
      const updatedHistory = history.map(item => {
        if (item.id === id) {
          return { ...item, status };
        }
        return item;
      });

      wx.setStorageSync(this.storageKey, updatedHistory);
      console.log('✅ 反馈状态已更新:', id, '→', status);
      return { success: true };
    } catch (error) {
      console.error('❌ 更新反馈状态失败:', error);
      return { success: false, error: '更新失败' };
    }
  }

  /**
   * 删除反馈记录
   * @param {string} id - 反馈记录ID
   */
  deleteFeedback(id) {
    try {
      const history = this.getFeedbackHistory();
      const filteredHistory = history.filter(item => item.id !== id);

      wx.setStorageSync(this.storageKey, filteredHistory);
      console.log('✅ 反馈记录已删除:', id);
      return { success: true };
    } catch (error) {
      console.error('❌ 删除反馈记录失败:', error);
      return { success: false, error: '删除失败' };
    }
  }

  /**
   * 清空所有历史记录
   */
  clearAllHistory() {
    try {
      wx.setStorageSync(this.storageKey, []);
      console.log('✅ 历史记录已清空');
      return { success: true };
    } catch (error) {
      console.error('❌ 清空历史记录失败:', error);
      return { success: false, error: '清空失败' };
    }
  }

  /**
   * 获取存储统计信息
   */
  getStorageStats() {
    try {
      const history = this.getFeedbackHistory();
      const stats = {
        totalRecords: history.length,
        successCount: history.filter(item => item.status === 'success').length,
        failedCount: history.filter(item => item.status === 'failed').length,
        oldestRecord: history.length > 0 ? history[history.length - 1].submitTime : null,
        newestRecord: history.length > 0 ? history[0].submitTime : null
      };

      console.log('📊 存储统计:', stats);
      return { success: true, stats };
    } catch (error) {
      console.error('❌ 获取存储统计失败:', error);
      return { success: false, error: '获取统计失败' };
    }
  }

  /**
   * 生成唯一ID
   * @returns {string} - 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
  }

  /**
   * 检查存储容量
   * @returns {Object} - 容量信息
   */
  checkStorageCapacity() {
    try {
      // 微信小程序storage限制为10MB
      const info = wx.getStorageInfoSync();
      const capacity = {
        currentSize: info.currentSize || 0,
        limitSize: info.limitSize || 10 * 1024 * 1024, // 10MB
        keys: info.keys || [],
        availableSpace: (info.limitSize || 10 * 1024 * 1024) - (info.currentSize || 0)
      };

      console.log('💾 存储容量:', capacity);
      return { success: true, capacity };
    } catch (error) {
      console.error('❌ 检查存储容量失败:', error);
      return { success: false, error: '检查失败' };
    }
  }
}

module.exports = FeedbackStorage;

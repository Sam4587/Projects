/**
 * 用户行为模型
 * 职责: 管理用户行为数据,提供个性化调整依据
 */

const STORAGE_KEY = 'user_behavior_model';

class UserBehaviorModel {
  constructor() {
    // 用户历史记录
    this.history = [];

    // 用户偏好
    this.preferences = {
      budgetRange: null,
      amountMultipliers: {},
      regionalAdjustments: {}
    };

    // 数据统计
    this.statistics = {
      totalRecords: 0,
      averageAmount: 0,
      relationshipDistribution: {},
      regionDistribution: {}
    };

    // 加载存储的数据
    this.loadFromStorage();
  }

  /**
   * 记录用户行为
   * @param {Object} data - 行为数据
   */
  recordBehavior(data) {
    const record = {
      id: `${Date.now()}-${data.relationship}-${data.region || 'unknown'}`,
      timestamp: Date.now(),
      ...data
    };

    this.history.push(record);

    // 保持最近100条记录
    if (this.history.length > 100) {
      this.history.shift();
    }

    this.updateStatistics();
    this.updatePreferences();
    this.saveToStorage();
  }

  /**
   * 更新统计数据
   */
  updateStatistics() {
    if (this.history.length === 0) return;

    // 总记录数
    this.statistics.totalRecords = this.history.length;

    // 平均金额
    const totalAmount = this.history.reduce((sum, record) => sum + record.amount, 0);
    this.statistics.averageAmount = Math.round(totalAmount / this.history.length);

    // 关系类型分布
    this.statistics.relationshipDistribution = {};
    this.history.forEach(record => {
      const rel = record.relationship;
      this.statistics.relationshipDistribution[rel] =
        (this.statistics.relationshipDistribution[rel] || 0) + 1;
    });

    // 地域分布
    this.statistics.regionDistribution = {};
    this.history.forEach(record => {
      const region = record.region || 'unknown';
      this.statistics.regionDistribution[region] =
        (this.statistics.regionDistribution[region] || 0) + 1;
    });
  }

  /**
   * 更新用户偏好
   */
  updatePreferences() {
    if (this.history.length < 5) return;

    // 计算各关系的平均金额系数
    const relationshipAmounts = {};
    const globalAverage = this.statistics.averageAmount;

    this.history.forEach(record => {
      const rel = record.relationship;
      if (!relationshipAmounts[rel]) {
        relationshipAmounts[rel] = { total: 0, count: 0 };
      }
      relationshipAmounts[rel].total += record.amount;
      relationshipAmounts[rel].count += 1;
    });

    // 计算系数
    this.preferences.amountMultipliers = {};
    Object.keys(relationshipAmounts).forEach(rel => {
      const avgAmount = relationshipAmounts[rel].total / relationshipAmounts[rel].count;
      this.preferences.amountMultipliers[rel] = avgAmount / globalAverage;
    });

    // 计算地域调整系数
    const regionAmounts = {};
    this.history.forEach(record => {
      if (!record.region) return;
      const region = record.region;
      if (!regionAmounts[region]) {
        regionAmounts[region] = { total: 0, count: 0 };
      }
      regionAmounts[region].total += record.amount;
      regionAmounts[region].count += 1;
    });

    this.preferences.regionalAdjustments = {};
    Object.keys(regionAmounts).forEach(region => {
      const avgAmount = regionAmounts[region].total / regionAmounts[region].count;
      this.preferences.regionalAdjustments[region] = avgAmount / globalAverage;
    });
  }

  /**
   * 获取个性化系数
   * @param {string} relationship - 关系类型
   * @param {string} region - 地域
   * @returns {number} - 个性化系数
   */
  getPersonalizationFactor(relationship, region) {
    let factor = 1.0;

    // 基于历史数据的系数
    if (this.preferences.amountMultipliers[relationship]) {
      factor *= this.preferences.amountMultipliers[relationship];
    }

    if (this.preferences.regionalAdjustments[region]) {
      factor *= this.preferences.regionalAdjustments[region];
    }

    // 限制在0.8-1.2倍
    return Math.max(0.8, Math.min(1.2, factor));
  }

  /**
   * 计算用户偏好一致性
   * @returns {number} - 一致性得分 (0-1)
   */
  calculateConsistency() {
    if (this.history.length < 5) return 0;

    // 简化的一致性计算:基于最近10次记录的金额标准差
    const recentRecords = this.history.slice(-10);
    const amounts = recentRecords.map(r => r.amount);

    const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // 标准差越小,一致性越高
    // 使用指数函数将标准差映射到0-1之间
    return Math.exp(-stdDev / avg);
  }

  /**
   * 设置预算范围
   * @param {Object} budget - 预算范围 { min, max }
   */
  setBudgetRange(budget) {
    if (!budget) {
      this.preferences.budgetRange = null;
    } else {
      this.preferences.budgetRange = {
        min: parseInt(budget.min) || 0,
        max: parseInt(budget.max) || 0
      };
    }
    this.saveToStorage();
  }

  /**
   * 获取预算范围
   * @returns {Object|null} - 预算范围
   */
  getBudgetRange() {
    return this.preferences.budgetRange;
  }

  /**
   * 保存到本地存储
   */
  saveToStorage() {
    try {
      const data = {
        history: this.history,
        preferences: this.preferences,
        statistics: this.statistics
      };
      wx.setStorageSync(STORAGE_KEY, data);
    } catch (error) {
      console.error('保存用户行为数据失败:', error);
    }
  }

  /**
   * 从本地存储加载
   */
  loadFromStorage() {
    try {
      const data = wx.getStorageSync(STORAGE_KEY);
      if (data) {
        this.history = data.history || [];
        this.preferences = data.preferences || {
          budgetRange: null,
          amountMultipliers: {},
          regionalAdjustments: {}
        };
        this.statistics = data.statistics || {
          totalRecords: 0,
          averageAmount: 0,
          relationshipDistribution: {},
          regionDistribution: {}
        };
      }
    } catch (error) {
      console.error('加载用户行为数据失败:', error);
    }
  }

  /**
   * 清空所有数据
   */
  clearAll() {
    this.history = [];
    this.preferences = {
      budgetRange: null,
      amountMultipliers: {},
      regionalAdjustments: {}
    };
    this.statistics = {
      totalRecords: 0,
      averageAmount: 0,
      relationshipDistribution: {},
      regionDistribution: {}
    };
    this.saveToStorage();
  }
}

module.exports = UserBehaviorModel;

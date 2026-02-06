/**
 * 智能推荐引擎
 * 职责: 协调所有推荐逻辑,提供统一的推荐接口
 */

const UserBehaviorModel = require('./user-behavior-model');
const RegionalRuleSystem = require('./regional-rule-system');

class SmartRecommendationEngine {
  constructor() {
    // 数据模型
    this.userBehavior = new UserBehaviorModel();
    this.regionalRules = new RegionalRuleSystem();

    // 配置
    this.config = {
      enableBudgetAdjustment: true,
      enableRegionalRules: true,
      enableFeedbackLearning: false // 任务2.2暂不实现反馈学习
    };
  }

  /**
   * 主要推荐方法
   * @param {Object} params - 推荐参数
   * @returns {Object} - 推荐结果
   */
  recommend(params) {
    const {
      relationship,    // 关系类型
      closeness,      // 亲疏程度
      occasion,        // 场合类型
      region,          // 地域
      budget           // 预算范围 { min, max }
    } = params;

    console.log('=== 推荐计算开始 ===');
    console.log('输入参数:', { relationship, closeness, occasion, region, budget });

    // 1. 基础金额计算
    const baseAmount = this.calculateBaseAmount(relationship, closeness);
    console.log('步骤1 - 基础金额:', baseAmount);

    // 2. 场合调整（在预算调整之前）
    const occasionAdjustedAmount = this.applyOccasionAdjustment(
      baseAmount,
      occasion
    );
    console.log('步骤2 - 场合调整后:', occasionAdjustedAmount, '(场合:', occasion, ')');

    // 3. 地域习俗调整
    const regionalAdjustedAmount = this.applyRegionalRules(
      occasionAdjustedAmount,
      relationship,
      region
    );
    console.log('步骤3 - 地域调整后:', regionalAdjustedAmount, '(地域:', region, ')');

    // 4. 预算调整（最后执行，确保最终金额在预算范围内）
    const finalAmount = this.applyBudgetAdjustment(
      regionalAdjustedAmount,
      budget
    );
    console.log('步骤4 - 预算调整后:', finalAmount, '(预算:', budget, ')');

    // 5. 生成推荐结果
    const result = this.generateRecommendation(
      finalAmount,
      baseAmount,
      params
    );
    console.log('=== 推荐计算完成 ===');
    return result;
  }

  /**
   * 计算基础推荐金额
   * @param {string} relationship - 关系类型
   * @param {string} closeness - 亲疏程度
   * @returns {number} - 基础金额
   */
  calculateBaseAmount(relationship, closeness) {
    // 关系基础金额
    const baseAmounts = {
      family: 800,
      friend: 500,
      colleague: 300,
      boss: 600
    };

    // 亲疏程度系数
    const closenessMultipliers = {
      acquaintance: 0.5,
      normal: 1.0,
      close: 1.5,
      'very-close': 2.0
    };

    const base = baseAmounts[relationship] || 300;
    const multiplier = closenessMultipliers[closeness] || 1.0;

    // 确保为100的整数倍数，使用floor避免吸附效应
    return Math.max(100, Math.floor(base * multiplier / 100) * 100);
  }

  /**
   * 应用地域习俗规则
   * @param {number} amount - 原始金额
   * @param {string} relationship - 关系类型
   * @param {string} region - 地域ID
   * @returns {number} - 调整后金额
   */
  applyRegionalRules(amount, relationship, region) {
    if (!this.config.enableRegionalRules || !region) {
      console.log('  地域调整: 跳过 (未启用或未选择地域)');
      return amount;
    }

    const rule = this.regionalRules.get(region);
    if (!rule) {
      console.log('  地域调整: 跳过 (未找到规则)');
      return amount;
    }

    const adjustment = rule.adjustments[relationship] || rule.adjustments.base || 1.0;
    console.log('  地域调整: 原金额=', amount, '系数=', adjustment, '关系=', relationship);

    // 应用调整
    const adjustedAmount = Math.round(amount * adjustment);

    // 确保是50的整数倍数（比100更细，保留更多地域差异）
    const result = Math.max(100, Math.floor(adjustedAmount / 50) * 50);
    console.log('  地域调整结果:', amount, '×', adjustment, '=', adjustedAmount, '→', result);
    return result;
  }

  /**
   * 应用预算调整
   * @param {number} amount - 原始金额
   * @param {Object} budget - 预算范围 { min, max }
   * @returns {number} - 调整后金额
   */
  applyBudgetAdjustment(amount, budget) {
    if (!budget || !this.config.enableBudgetAdjustment) return amount;

    const { min, max } = budget;

    // 金额在预算范围内,不做调整
    if (amount >= min && amount <= max) {
      return amount;
    }

    // 超出预算上限,调整到上限附近
    if (amount > max) {
      return (max - 100); // 留出100元缓冲
    }

    // 低于预算下限,提升到下限
    if (amount < min) {
      return min;
    }

    return amount;
  }

  /**
   * 应用场合调整
   * @param {number} amount - 原始金额
   * @param {string} occasion - 场合类型
   * @returns {number} - 调整后金额
   */
  applyOccasionAdjustment(amount, occasion) {
    if (!occasion) {
      console.log('  场合调整: 跳过 (未选择场合)');
      return amount;
    }

    // 场合调整系数
    const occasionMultipliers = {
      'birthday': 1.0,
      'wedding': 1.5,
      'funeral': 0.8,
      'new-year': 1.2,
      'graduation': 1.0,
      'house-warming': 1.3,
      'baby-birth': 1.2,
      'general': 1.0
    };

    const multiplier = occasionMultipliers[occasion] || 1.0;
    console.log('  场合调整: 原金额=', amount, '系数=', multiplier, '场合=', occasion);
    const adjustedAmount = Math.round(amount * multiplier);

    // 确保是50的整数倍数（比100更细，保留更多场合差异）
    const result = Math.max(100, Math.floor(adjustedAmount / 50) * 50);
    console.log('  场合调整结果:', amount, '×', multiplier, '=', adjustedAmount, '→', result);
    return result;
  }

  /**
   * 生成推荐结果
   * @param {number} finalAmount - 最终推荐金额
   * @param {number} baseAmount - 基础金额
   * @param {Object} params - 原始参数
   * @returns {Object} - 推荐结果
   */
  generateRecommendation(finalAmount, baseAmount, params) {
    const { relationship, closeness, region, occasion, budget } = params;

    // 计算金额范围
    let range = {
      low: Math.max(100, finalAmount - 200),
      high: finalAmount + 400,
      recommended: finalAmount
    };

    // 如果用户设置了预算范围
    if (budget && budget.min !== undefined && budget.max !== undefined) {
      if (finalAmount >= budget.min && finalAmount <= budget.max) {
        // 最终金额在预算范围内，显示预算范围
        range.low = budget.min;
        range.high = budget.max;
      } else {
        // 最终金额不在预算范围内（被预算调整函数调整过）
        // 基于调整后的金额计算范围，但限制在预算边界内
        range.low = Math.max(budget.min, Math.max(100, finalAmount - 200));
        range.high = Math.min(budget.max, finalAmount + 400);
      }
    }

    // 获取地域习俗
    let customs = null;
    if (region && this.config.enableRegionalRules) {
      customs = this.regionalRules.getRegionCustoms(region);
    }

    // 获取关系类型的中文名称
    const relationshipMap = {
      'family': '家人亲戚',
      'friend': '朋友同学',
      'colleague': '同事领导',
      'boss': '老板客户'
    };

    // 获取亲疏程度的中文名称
    const closenessMap = {
      'acquaintance': '点头之交',
      'normal': '普通关系',
      'close': '关系密切',
      'very-close': '非常要好'
    };

    // 计算置信度
    const confidence = this.calculateConfidence({
      amount: finalAmount,
      relationship,
      closeness,
      region,
      occasion,
      budget
    });

    // 生成推荐依据说明
    const factors = {
      relationship: relationshipMap[relationship] || relationship,
      closeness: closenessMap[closeness] || closeness,
      region: region ? this.getRegionName(region) : '未选择',
      occasion: occasion ? this.getOccasionName(occasion) : '一般场合',
      budget: budget ? `${budget.min}-${budget.max}元` : '未设置'
    };

    // 历史对比
    let comparison = null;
    if (this.userBehavior.statistics.totalRecords > 0) {
      const userAverage = this.userBehavior.statistics.averageAmount;
      comparison = {
        userAverage,
        difference: finalAmount >= userAverage
          ? `+${finalAmount - userAverage}`
          : `${finalAmount - userAverage}`,
        withinBudget: !budget || (finalAmount >= budget.min && finalAmount <= budget.max)
      };
    }

    return {
      amount: finalAmount,
      range,
      confidence: confidence.confidence,
      confidenceLabel: confidence.label,
      factors,
      customs,
      comparison
    };
  }

  /**
   * 计算推荐置信度
   * @param {Object} factors - 影响因子
   * @returns {Object} - 置信度信息
   */
  calculateConfidence(factors) {
    let score = 0;
    let reasons = [];

    // 1. 用户历史数据充足性 (30分)
    const historyCount = this.userBehavior.history.length;
    if (historyCount >= 20) {
      score += 30;
      reasons.push('基于丰富的历史数据');
    } else if (historyCount >= 10) {
      score += 20;
      reasons.push('基于部分历史数据');
    }

    // 2. 地域规则匹配 (25分)
    if (factors.region && this.regionalRules.has(factors.region)) {
      score += 25;
      reasons.push('应用地域习俗规则');
    }

    // 3. 预算符合度 (15分)
    if (factors.budget) {
      const withinBudget = factors.amount >= factors.budget.min &&
                         factors.amount <= factors.budget.max;
      if (withinBudget) {
        score += 15;
        reasons.push('符合预算范围');
      }
    }

    // 4. 场合匹配 (10分)
    if (factors.occasion) {
      score += 10;
      reasons.push('匹配当前场景');
    }

    // 基础分 (20分)
    score += 20;

    // 计算置信度 (0-1)
    const confidence = Math.min(1.0, score / 100);

    // 置信度标签
    let label = '仅供参考';
    if (confidence >= 0.8) label = '非常推荐';
    else if (confidence >= 0.6) label = '比较推荐';
    else if (confidence >= 0.4) label = '一般推荐';

    return {
      score,
      confidence,
      label,
      reasons
    };
  }

  /**
   * 获取地域中文名称 - 支持34个地区
   */
  getRegionName(regionId) {
    const regionNames = {
      'beijing': '北京',
      'tianjin': '天津',
      'hebei': '河北',
      'shanxi': '山西',
      'neimenggu': '内蒙古',
      'liaoning': '辽宁',
      'jilin': '吉林',
      'heilongjiang': '黑龙江',
      'shanghai': '上海',
      'jiangsu': '江苏',
      'zhejiang': '浙江',
      'anhui': '安徽',
      'fujian': '福建',
      'jiangxi': '江西',
      'shandong': '山东',
      'henan': '河南',
      'hubei': '湖北',
      'hunan': '湖南',
      'guangdong': '广东',
      'guangxi': '广西',
      'hainan': '海南',
      'chongqing': '重庆',
      'sichuan': '四川',
      'guizhou': '贵州',
      'yunnan': '云南',
      'xizang': '西藏',
      'shaanxi': '陕西',
      'gansu': '甘肃',
      'qinghai': '青海',
      'ningxia': '宁夏',
      'xinjiang': '新疆',
      'hongkong': '香港',
      'macau': '澳门',
      'taiwan': '台湾'
    };
    return regionNames[regionId] || regionId;
  }

  /**
   * 获取场合中文名称
   */
  getOccasionName(occasionId) {
    const occasionNames = {
      'birthday': '生日',
      'wedding': '婚礼',
      'funeral': '葬礼',
      'new-year': '春节',
      'graduation': '毕业',
      'house-warming': '乔迁',
      'baby-birth': '满月',
      'general': '一般场合'
    };
    return occasionNames[occasionId] || occasionId;
  }
}

module.exports = SmartRecommendationEngine;

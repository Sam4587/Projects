/**
 * 地域习俗规则系统
 * 职责: 管理和应用地域习俗规则
 */

class RegionalRuleSystem {
  constructor() {
    // 地域规则库
    this.rules = new Map();

    // 初始化规则
    this.initializeRules();
  }

  /**
   * 初始化地域规则 - 34个省份/直辖市/自治区/特别行政区
   */
  initializeRules() {
    // 基于中国34个行政区划生成规则
    const regions = [
      { id: 'beijing', name: '北京', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 } },
      { id: 'tianjin', name: '天津', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 } },
      { id: 'hebei', name: '河北', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'shanxi', name: '山西', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'neimenggu', name: '内蒙古', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'liaoning', name: '辽宁', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'jilin', name: '吉林', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'heilongjiang', name: '黑龙江', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'shanghai', name: '上海', adjustments: { base: 1.2, family: 1.1, friend: 1.1, colleague: 1.2, boss: 1.3 } },
      { id: 'jiangsu', name: '江苏', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 } },
      { id: 'zhejiang', name: '浙江', adjustments: { base: 1.1, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.1 } },
      { id: 'anhui', name: '安徽', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'fujian', name: '福建', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.1 } },
      { id: 'jiangxi', name: '江西', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'shandong', name: '山东', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.1 } },
      { id: 'henan', name: '河南', adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 } },
      { id: 'hubei', name: '湖北', adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 } },
      { id: 'hunan', name: '湖南', adjustments: { base: 0.9, family: 0.9, friend: 0.8, colleague: 0.9, boss: 1.0 } },
      { id: 'guangdong', name: '广东', adjustments: { base: 1.1, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.1 } },
      { id: 'guangxi', name: '广西', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'hainan', name: '海南', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'chongqing', name: '重庆', adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 } },
      { id: 'sichuan', name: '四川', adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 } },
      { id: 'guizhou', name: '贵州', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'yunnan', name: '云南', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'xizang', name: '西藏', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'shaanxi', name: '陕西', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'gansu', name: '甘肃', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'qinghai', name: '青海', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'ningxia', name: '宁夏', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'xinjiang', name: '新疆', adjustments: { base: 0.9, family: 0.9, friend: 0.9, colleague: 0.9, boss: 1.0 } },
      { id: 'hongkong', name: '香港', adjustments: { base: 1.3, family: 1.2, friend: 1.1, colleague: 1.2, boss: 1.5 } },
      { id: 'macau', name: '澳门', adjustments: { base: 1.3, family: 1.2, friend: 1.1, colleague: 1.2, boss: 1.5 } },
      { id: 'taiwan', name: '台湾', adjustments: { base: 1.2, family: 1.1, friend: 1.0, colleague: 1.1, boss: 1.3 } }
    ];

    regions.forEach(region => {
      this.rules.set(region.id, {
        name: region.name,
        adjustments: region.adjustments,
        customs: this.getRegionCustoms(region.id)
      });
    });
  }

  /**
   * 获取地域规则
   * @param {string} regionId - 地域ID
   * @returns {Object} - 地域规则
   */
  get(regionId) {
    return this.rules.get(regionId);
  }

  /**
   * 应用地域规则
   * @param {number} amount - 原始金额
   * @param {string} relationship - 关系类型
   * @param {string} regionId - 地域ID
   * @returns {number} - 调整后金额
   */
  applyRules(amount, relationship, regionId) {
    const rule = this.rules.get(regionId);
    if (!rule) return amount;

    const adjustment = rule.adjustments[relationship] || rule.adjustments.base || 1.0;
    return Math.round(amount * adjustment);
  }

  /**
   * 获取地域习俗说明 - 支持34个地区
   * @param {string} regionId - 地域ID
   * @param {number} recommendedAmount - 推荐金额（用于生成动态吉利数字）
   * @param {Object} budgetRange - 预算范围 { min, max }
   * @returns {Object} - 地域习俗
   */
  getRegionCustoms(regionId, recommendedAmount = null, budgetRange = null) {
    const customsData = {
      'beijing': {
        preferredNumbers: [66, 88, 168, 188, 200],
        traditions: ['偏好吉利数字', '注重传统仪式感', '讲究礼数'],
        tips: '北京红包注重传统和文化内涵'
      },
      'tianjin': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重传统', '讲究礼数'],
        tips: '天津地区性格豪爽，注重传统礼仪'
      },
      'hebei': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['朴实稳重', '注重传统', '金额适中'],
        tips: '河北地区朴实稳重，注重传统礼仪'
      },
      'shanxi': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究礼数', '金额适中'],
        tips: '山西地区注重传统文化和礼仪'
      },
      'neimenggu': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情谊', '不拘小节'],
        tips: '内蒙古地区性格豪爽，注重情谊'
      },
      'liaoning': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情义', '不拘小节'],
        tips: '辽宁地区性格豪爽，注重情义'
      },
      'jilin': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情义', '不拘小节'],
        tips: '吉林地区性格豪爽，注重情义'
      },
      'heilongjiang': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情义', '不拘小节'],
        tips: '黑龙江地区性格豪爽，注重情义'
      },
      'shanghai': {
        preferredNumbers: [88, 168, 188, 288, 388],
        traditions: ['讲究面子文化', '注重人情往来', '金额相对较高'],
        tips: '上海地区消费水平较高，红包金额偏高'
      },
      'jiangsu': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重礼仪', '讲究分寸', '金额适中'],
        tips: '江苏地区注重传统礼仪'
      },
      'zhejiang': {
        preferredNumbers: [88, 168, 188, 200],
        traditions: ['注重面子', '讲究排场', '金额合理'],
        tips: '浙江地区经济发达，红包金额适中偏高'
      },
      'anhui': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究礼数', '金额适中'],
        tips: '安徽地区注重传统文化'
      },
      'fujian': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重面子', '讲究排场', '金额合理'],
        tips: '福建地区注重面子文化'
      },
      'jiangxi': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究礼数', '金额适中'],
        tips: '江西地区注重传统文化'
      },
      'shandong': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['讲究礼仪', '尊重长辈', '注重面子'],
        tips: '山东地区礼仪文化深厚'
      },
      'henan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究分寸', '金额适中'],
        tips: '河南地区注重传统文化'
      },
      'hubei': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '讲究分寸', '金额适中'],
        tips: '湖北地区相对务实'
      },
      'hunan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['性格豪爽', '注重情谊', '务实为主'],
        tips: '湖南地区性格豪爽务实'
      },
      'guangdong': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '不讲究排场', '注重实用'],
        tips: '广东地区相对务实，金额适中'
      },
      'guangxi': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '注重传统', '金额适中'],
        tips: '广西地区相对务实，注重传统'
      },
      'hainan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '注重情谊', '金额适中'],
        tips: '海南地区相对务实，注重情谊'
      },
      'chongqing': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情谊', '不拘小节'],
        tips: '重庆地区性格豪爽，注重情谊'
      },
      'sichuan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '不拘小节', '注重情谊'],
        tips: '四川地区性格豪爽，注重情谊'
      },
      'guizhou': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '注重传统', '金额适中'],
        tips: '贵州地区相对务实，注重传统'
      },
      'yunnan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '注重传统', '金额适中'],
        tips: '云南地区相对务实，注重传统'
      },
      'xizang': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '虔诚信仰', '金额适中'],
        tips: '西藏地区注重传统，信仰虔诚'
      },
      'shaanxi': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究礼数', '金额适中'],
        tips: '陕西地区注重传统文化'
      },
      'gansu': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '朴实稳重', '金额适中'],
        tips: '甘肃地区注重传统，朴实稳重'
      },
      'qinghai': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '朴实稳重', '金额适中'],
        tips: '青海地区注重传统，朴实稳重'
      },
      'ningxia': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '朴实稳重', '金额适中'],
        tips: '宁夏地区注重传统，朴实稳重'
      },
      'xinjiang': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '注重情谊', '不拘小节'],
        tips: '新疆地区性格豪爽，注重情谊'
      },
      'hongkong': {
        preferredNumbers: [88, 168, 188, 288, 388],
        traditions: ['注重面子', '讲究排场', '金额偏高'],
        tips: '香港地区消费水平高，红包金额偏高'
      },
      'macau': {
        preferredNumbers: [88, 168, 188, 288, 388],
        traditions: ['注重面子', '讲究排场', '金额偏高'],
        tips: '澳门地区消费水平高，红包金额偏高'
      },
      'taiwan': {
        preferredNumbers: [88, 168, 188, 288, 388],
        traditions: ['注重面子', '讲究排场', '金额偏高'],
        tips: '台湾地区消费水平高，红包金额偏高'
      }
    };

    const baseCustoms = customsData[regionId] || {
      traditions: ['注重传统', '讲究礼数'],
      tips: '地域习俗信息'
    };

    // 如果提供了推荐金额和预算范围，动态生成吉利数字
    if (recommendedAmount) {
      baseCustoms.preferredNumbers = this.generateLuckyNumbers(
        recommendedAmount,
        budgetRange
      );
    } else {
      // 未提供推荐金额时使用默认值
      baseCustoms.preferredNumbers = baseCustoms.preferredNumbers || [66, 88, 168, 200];
    }

    return baseCustoms;
  }

  /**
   * 根据推荐金额和预算范围生成动态吉利数字
   * @param {number} recommendedAmount - 推荐金额
   * @param {Object} budgetRange - 预算范围 { min, max }
   * @returns {Array} - 吉利数字数组
   */
  generateLuckyNumbers(recommendedAmount, budgetRange = null) {
    // 确定基数范围
    let baseAmount = recommendedAmount;
    if (budgetRange && budgetRange.min && budgetRange.max) {
      // 如果有预算范围，以推荐金额为中心，在预算范围内生成
      baseAmount = Math.min(Math.max(baseAmount, budgetRange.min), budgetRange.max);
    }

    // 获取金额的位数，确定生成的吉利数字范围
    const magnitude = Math.pow(10, Math.floor(Math.log10(baseAmount)));

    // 生成不同位数的吉利数字
    const candidates = [];

    // 1. 生成包含66、88、168、188、268、288、366、388、566、588、666、688、888等吉利组合的数字
    const luckyCombinations = [66, 88, 168, 188, 268, 288, 368, 388, 568, 588, 666, 688, 888, 968, 988];
    luckyCombinations.forEach(base => {
      // 为每个组合生成不同量级的数字（10倍递增）
      for (let m = 1; m <= 100; m *= 10) {
        const amount = base * m;
        if (amount > 0 && amount <= 100000) {
          candidates.push(amount);
        }
        if (amount > 100000) break;
      }
    });

    // 2. 生成经典的吉利数字模式（如600, 800, 1600, 1800等）
    const classicPatterns = [
      magnitude * 6,    // 如60, 600, 6000
      magnitude * 8,    // 如80, 800, 8000
      magnitude * 16,   // 如160, 1600, 16000
      magnitude * 18,   // 如180, 1800, 18000
      magnitude * 20,   // 如200, 2000, 20000
      magnitude * 28,   // 如280, 2800, 28000
      magnitude * 38    // 如380, 3800, 38000
    ];

    classicPatterns.forEach(amount => {
      if (amount > 0 && amount <= 100000) {
        candidates.push(amount);
      }
    });

    // 3. 生成接近推荐金额的吉利数字（主推荐）
    const nearPatterns = [
      baseAmount - 2 * magnitude,  // 低位
      baseAmount - magnitude,       // 中低位
      baseAmount,                   // 推荐金额本身
      baseAmount + magnitude,       // 中高位
      baseAmount + 2 * magnitude    // 高位
    ];

    nearPatterns.forEach(amount => {
      if (amount > 0 && amount <= 100000) {
        // 将数字转换为字符串，尝试替换为吉利数字
        const amountStr = Math.floor(amount / 10) * 10;
        const rounded = this.adjustToLuckyNumber(amountStr);
        if (rounded) {
          candidates.push(rounded);
        }
        candidates.push(amountStr);
      }
    });

    // 4. 根据预算范围过滤候选数字
    let filteredCandidates = candidates;
    if (budgetRange && budgetRange.min && budgetRange.max) {
      filteredCandidates = candidates.filter(
        amount => amount >= budgetRange.min && amount <= budgetRange.max
      );
    }

    // 如果预算范围内没有合适的数字，扩大范围到推荐金额附近的20%
    if (filteredCandidates.length === 0) {
      const minRange = Math.max(66, baseAmount * 0.8);
      const maxRange = Math.min(100000, baseAmount * 1.2);
      filteredCandidates = candidates.filter(
        amount => amount >= minRange && amount <= maxRange
      );
    }

    // 5. 对候选数字排序并选择最合适的6个
    // 优先选择接近推荐金额且为吉利数字的值
    filteredCandidates.sort((a, b) => {
      const diffA = Math.abs(a - baseAmount);
      const diffB = Math.abs(b - baseAmount);
      return diffA - diffB;
    });

    // 去重并取前6个
    const uniqueNumbers = [...new Set(filteredCandidates)].slice(0, 6);

    // 确保至少返回一些吉利数字
    if (uniqueNumbers.length === 0) {
      uniqueNumbers.push(
        Math.max(66, Math.floor(baseAmount - 100)),
        Math.floor(baseAmount),
        Math.min(9999, Math.floor(baseAmount + 100))
      );
    }

    // 最终排序，从小到大
    uniqueNumbers.sort((a, b) => a - b);

    return uniqueNumbers;
  }

  /**
   * 将普通数字调整为吉利数字
   * @param {number} amount - 原始金额
   * @returns {number|null} - 调整后的吉利数字，如果无法调整则返回null
   */
  adjustToLuckyNumber(amount) {
    const luckyEndings = ['66', '68', '88', '99'];
    const amountStr = Math.floor(amount).toString();

    // 尝试替换最后两位为吉利数字
    if (amountStr.length >= 2) {
      const prefix = amountStr.substring(0, amountStr.length - 2);

      for (const ending of luckyEndings) {
        const luckyAmount = parseInt(prefix + ending);
        // 确保调整后的数字在原始数字附近（±20%范围内）
        if (Math.abs(luckyAmount - amount) <= amount * 0.2 && luckyAmount > 0 && luckyAmount <= 100000) {
          return luckyAmount;
        }
      }
    }

    // 尝试替换最后三位为吉利数字（168, 188, 268, 288等）
    if (amountStr.length >= 3) {
      const prefix = amountStr.substring(0, amountStr.length - 3);
      const threeDigitLuckies = ['168', '188', '268', '288', '368', '388', '568', '588', '668', '688', '888'];

      for (const ending of threeDigitLuckies) {
        const luckyAmount = parseInt(prefix + ending);
        if (Math.abs(luckyAmount - amount) <= amount * 0.2 && luckyAmount > 0 && luckyAmount <= 100000) {
          return luckyAmount;
        }
      }
    }

    return null;
  }

  /**
   * 检查地域是否存在
   * @param {string} regionId - 地域ID
   * @returns {boolean} - 是否存在
   */
  has(regionId) {
    return this.rules.has(regionId);
  }

  /**
   * 获取所有地域列表
   * @returns {Array} - 地域列表
   */
  getAllRegions() {
    const regions = [];
    this.rules.forEach((value, key) => {
      regions.push({
        id: key,
        name: value.name
      });
    });
    return regions;
  }
}

module.exports = RegionalRuleSystem;

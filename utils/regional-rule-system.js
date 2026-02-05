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
   * 初始化地域规则
   */
  initializeRules() {
    // 基于现有config/customs数据生成规则
    const regions = [
      {
        id: 'beijing',
        name: '北京',
        adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 }
      },
      {
        id: 'shanghai',
        name: '上海',
        adjustments: { base: 1.2, family: 1.1, friend: 1.1, colleague: 1.2, boss: 1.3 }
      },
      {
        id: 'guangdong',
        name: '广东',
        adjustments: { base: 1.1, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.1 }
      },
      {
        id: 'zhejiang',
        name: '浙江',
        adjustments: { base: 1.1, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.1 }
      },
      {
        id: 'jiangsu',
        name: '江苏',
        adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.0 }
      },
      {
        id: 'sichuan',
        name: '四川',
        adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 }
      },
      {
        id: 'hubei',
        name: '湖北',
        adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 }
      },
      {
        id: 'hunan',
        name: '湖南',
        adjustments: { base: 0.9, family: 0.9, friend: 0.8, colleague: 0.9, boss: 1.0 }
      },
      {
        id: 'henan',
        name: '河南',
        adjustments: { base: 1.0, family: 1.0, friend: 0.9, colleague: 1.0, boss: 1.0 }
      },
      {
        id: 'shandong',
        name: '山东',
        adjustments: { base: 1.0, family: 1.0, friend: 1.0, colleague: 1.0, boss: 1.1 }
      }
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
   * 获取地域习俗说明
   * @param {string} regionId - 地域ID
   * @returns {Object} - 地域习俗
   */
  getRegionCustoms(regionId) {
    // 根据地域ID返回对应的习俗数据
    const customsData = {
      'beijing': {
        preferredNumbers: [66, 88, 168, 188, 200],
        traditions: ['偏好吉利数字', '注重传统仪式感', '讲究礼数'],
        tips: '北京红包注重传统和文化内涵'
      },
      'shanghai': {
        preferredNumbers: [88, 168, 188, 288, 388],
        traditions: ['讲究面子文化', '注重人情往来', '金额相对较高'],
        tips: '上海地区消费水平较高,红包金额偏高'
      },
      'guangdong': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['务实为主', '不讲究排场', '注重实用'],
        tips: '广东地区相对务实,金额适中'
      },
      'zhejiang': {
        preferredNumbers: [88, 168, 188, 200],
        traditions: ['注重面子', '讲究排场', '金额合理'],
        tips: '浙江地区经济发达,红包金额适中偏高'
      },
      'jiangsu': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重礼仪', '讲究分寸', '金额适中'],
        tips: '江苏地区注重传统礼仪'
      },
      'sichuan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['豪爽大方', '不拘小节', '注重情谊'],
        tips: '四川地区性格豪爽,注重情谊'
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
      'henan': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['注重传统', '讲究分寸', '金额适中'],
        tips: '河南地区注重传统文化'
      },
      'shandong': {
        preferredNumbers: [66, 88, 168, 200],
        traditions: ['讲究礼仪', '尊重长辈', '注重面子'],
        tips: '山东地区礼仪文化深厚'
      }
    };

    return customsData[regionId] || {
      preferredNumbers: [66, 88, 168, 200],
      traditions: ['注重传统', '讲究礼数'],
      tips: '地域习俗信息'
    };
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

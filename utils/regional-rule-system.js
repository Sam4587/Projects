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
   * @returns {Object} - 地域习俗
   */
  getRegionCustoms(regionId) {
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

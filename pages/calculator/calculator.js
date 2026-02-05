// pages/calculator/calculator.js
const app = getApp();
import { adManager } from '../../utils/ad-config';
const SmartRecommendationEngine = require('../../utils/smart-recommendation-engine');

Page({
  data: {
    // 表单数据
    relationship: '',
    closeness: '',
    occasion: 'general', // 默认一般场合
    region: '', // 地域选择
    budgetMin: '', // 预算最低金额
    budgetMax: '', // 预算最高金额
    // 计算属性（用于WXML显示）
    occasionName: '一般场合', // 场合名称
    regionName: '请选择地域', // 地域名称
    // 计算结果
    result: null,
    actualAmount: '', // 用户实际给的金额
    showFeedbackModal: false, // 是否显示反馈成功弹窗
    loading: false,  // 🔴 P0: 加载状态
    loadingText: '',  // 🔴 P0: 加载文本
    showBannerAd: false,  // Banner广告显示状态
    showBudgetSettings: false,  // 是否显示预算设置
    showOccasionPicker: false,  // 是否显示场合选择
    showRegionPicker: false,  // 是否显示地域选择
    regionList: [],  // 地域列表
    occasionList: [  // 场合列表
      { id: 'general', name: '一般场合' },
      { id: 'birthday', name: '生日' },
      { id: 'wedding', name: '婚礼' },
      { id: 'funeral', name: '葬礼' },
      { id: 'new-year', name: '春节' },
      { id: 'graduation', name: '毕业' },
      { id: 'house-warming', name: '乔迁' },
      { id: 'baby-birth', name: '满月' }
    ]
  },

  // 生命周期函数
  onLoad: function(options) {
    app.globalData.currentRoute = 'pages/calculator/calculator';

    // 初始化智能推荐引擎
    this.recommendationEngine = new SmartRecommendationEngine();

    // 获取地域列表
    this.setData({
      regionList: this.recommendationEngine.regionalRules.getAllRegions()
    });

    // 广告组件 - 临时禁用，过审后恢复
    // adManager.createBannerAd();

    // 🔴 P0: 移除人为延迟,立即显示页面
    // 页面初始化完成
  },

  onShow: function() {
  },

  onHide: function() {
  },

  onUnload: function() {
    // 重置页面状态
    this.setData({
      actualAmount: '',
      result: null
    });
  },

  selectRelationship(e) {
    const relationship = e.currentTarget.dataset.rel;
    this.setData({ relationship });
  },

  selectCloseness(e) {
    const closeness = e.currentTarget.dataset.close;
    this.setData({ closeness });
  },

  // 选择场合
  selectOccasion(e) {
    const occasion = e.currentTarget.dataset.occasion;
    const occasionList = this.data.occasionList;
    const occasionName = occasionList.find(i => i.id === occasion)?.name || '请选择场合';
    this.setData({ occasion, occasionName, showOccasionPicker: false });
  },

  // 显示场合选择器
  showOccasionSelector() {
    this.setData({ showOccasionPicker: true });
  },

  // 关闭场合选择器
  hideOccasionSelector() {
    this.setData({ showOccasionPicker: false });
  },

  // 选择地域
  selectRegion(e) {
    const region = e.currentTarget.dataset.region;
    const regionList = this.data.regionList;
    const regionName = regionList.find(i => i.id === region)?.name || '请选择地域';
    this.setData({ region, regionName, showRegionPicker: false });
  },

  // 显示地域选择器
  showRegionSelector() {
    this.setData({ showRegionPicker: true });
  },

  // 关闭地域选择器
  hideRegionSelector() {
    this.setData({ showRegionPicker: false });
  },

  // 显示预算设置
  showBudgetSettings() {
    this.setData({ showBudgetSettings: true });
  },

  // 关闭预算设置
  hideBudgetSettings() {
    this.setData({ showBudgetSettings: false });
  },

  // 输入最低预算
  onMinBudgetInput(e) {
    const value = e.detail.value;
    this.setData({ budgetMin: value });
  },

  // 输入最高预算
  onMaxBudgetInput(e) {
    const value = e.detail.value;
    this.setData({ budgetMax: value });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 阻止点击事件冒泡到modal-overlay
  },

  calculateAmount() {
    const { relationship, closeness, occasion, region, budgetMin, budgetMax } = this.data;

    if (!relationship || !closeness) return;

    // 🔴 中优先级修复：添加关系类型和亲疏程度的有效性验证
    const validRelationships = ['family', 'friend', 'colleague', 'boss'];
    const validCloseness = ['acquaintance', 'normal', 'close', 'very-close'];

    if (!validRelationships.includes(relationship)) {
      wx.showToast({
        title: '请选择有效的关系类型',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    if (!validCloseness.includes(closeness)) {
      wx.showToast({
        title: '请选择有效的亲疏程度',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 构建预算范围
    let budget = null;
    if (budgetMin && budgetMax) {
      budget = {
        min: parseInt(budgetMin),
        max: parseInt(budgetMax)
      };
    }

    // 使用智能推荐引擎计算推荐金额
    try {
      const recommendation = this.recommendationEngine.recommend({
        relationship,
        closeness,
        occasion,
        region,
        budget
      });

      this.setData({
        result: recommendation
      });
    } catch (error) {
      console.error('智能推荐计算失败:', error);

      // 降级到传统计算方式
      this.fallbackCalculate(relationship, closeness);
    }
  },

  // 降级计算方法（当智能推荐失败时使用）
  fallbackCalculate(relationship, closeness) {
    const baseAmounts = {
      family: 800,
      friend: 500,
      colleague: 300,
      boss: 600
    };

    const closenessMultipliers = {
      acquaintance: 0.5,
      normal: 1,
      close: 1.5,
      'very-close': 2
    };

    // 🔴 高优先级修复：添加默认值处理，确保计算结果始终为有效数字
    const base = baseAmounts[relationship] || 300; // 默认值
    const multiplier = closenessMultipliers[closeness] || 1; // 默认值
    const amount = Math.max(0, Math.round(base * multiplier / 100) * 100); // 确保为正数

    const suggestions = {
      family: {
        low: amount - 200,
        high: amount + 400,
        message: '家人之间重在心意，金额体现关爱程度'
      },
      friend: {
        low: amount - 100,
        high: amount + 200,
        message: '朋友之间量力而行，情谊比金额更重要'
      },
      colleague: {
        low: amount - 50,
        high: amount + 100,
        message: '同事之间适中即可，避免造成压力'
      },
      boss: {
        low: amount - 100,
        high: amount + 300,
        message: '对老板表示尊重，但不宜过于夸张'
      }
    };

    // 🔴 中优先级修复：添加计算结果合理性检查
    const suggestion = suggestions[relationship] || {
      low: Math.max(0, amount - 200),
      high: amount + 200,
      message: '量力而行，心意最重要'
    };

    this.setData({
      result: {
        amount,
        range: {
          low: suggestion.low,
          high: suggestion.high,
          recommended: amount
        },
        confidence: 0.5,
        confidenceLabel: '仅供参考',
        factors: {
          relationship: relationship,
          closeness: closeness,
          region: '未选择',
          occasion: '一般场合',
          budget: '未设置'
        },
        customs: null,
        comparison: null
      }
    });
  },

  // 输入实际金额
  onInputActualAmount(e) {
    let value = e.detail.value.replace(/[^0-9]/g, ''); // 只允许数字
    
    // 🔴 中优先级修复：添加金额范围验证
    const amount = parseInt(value);
    if (amount > 100000) {
      value = '100000'; // 上限
      wx.showToast({
        title: '金额不能超过100000元',
        icon: 'none',
        duration: 2000
      });
    }
    
    this.setData({
      actualAmount: value
    });
  },

  // 显示计算器页面的Banner广告 - 临时隐藏，过审后将恢复
  // showCalculatorBannerAd() {
  //   try {
  //     const success = adManager.showBannerAd('#calculator-feedback-section');
  //     if (success) {
  //       this.setData({ showBannerAd: true });
  //     } else {
  //       console.warn('🎯 计算器Banner广告显示失败');
  //     }
  //   } catch (error) {
  //     console.warn('显示计算器Banner广告失败:', error);
  //   }
  // },

  // 隐藏Banner广告 - 临时隐藏，过审后将恢复
  // hideCalculatorBannerAd() {
  //   try {
  //     adManager.hideBannerAd();
  //     this.setData({ showBannerAd: false });
  //   } catch (error) {
  //     console.warn('隐藏CalculatorBanner广告失败:', error);
  //   }
  // },

  // 提交伪反馈
  submitPseudoFeedback() {
    const { relationship, closeness, result, actualAmount } = this.data;
    
    if (!actualAmount || actualAmount === '') {
      wx.showToast({
        title: '请输入实际金额',
        icon: 'none'
      });
      return;
    }

    // 🔴 高优先级修复：添加result不为null的检查
    if (!result) {
      wx.showToast({
        title: '请先计算推荐金额',
        icon: 'none'
      });
      return;
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

    // 🔴 审核修改：移除本地存储功能，避免收集用户信息
    // 本地存储功能已移除，仅显示成功提示

    // 显示成功提示
    wx.showModal({
      title: '感谢反馈！',
      content: '已记录您的选择，将用于优化推荐算法',
      showCancel: false,
      confirmText: '好的',
      success: () => {
        // 清空输入框
        this.setData({
          actualAmount: '',
          showFeedbackModal: true
        });
      }
    });

    // 统计反馈事件
    if (app.trackEvent) {
      app.trackEvent('pseudo_feedback_submit', {
        relationship: relationship,
        closeness: closeness,
        suggested: `${result.range?.low || 0}-${result.range?.high || 0}`,
        actual: parseInt(actualAmount)
      });
    }

    console.log('伪反馈已提交（本地存储已移除）');
  }
});

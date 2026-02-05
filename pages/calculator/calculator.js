// pages/calculator/calculator.js
const app = getApp();
import { adManager } from '../../utils/ad-config';
Page({
  data: {
    // 表单数据
    relationship: '',
    closeness: '',
    occasion: '',
    // 计算结果
    result: null,
    // 推荐金额列表
    luckyNumbers: [200, 600, 800, 888, 999, 1000, 1688, 1888, 2000, 2888],
    actualAmount: '', // 用户实际给的金额
    showFeedbackModal: false, // 是否显示反馈成功弹窗
    loading: false,  // 🔴 P0: 加载状态
    loadingText: '',  // 🔴 P0: 加载文本
    showBannerAd: false  // Banner广告显示状态
  },

  // 生命周期函数
  onLoad: function(options) {
    app.globalData.currentRoute = 'pages/calculator/calculator';

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

  calculateAmount() {
    const { relationship, closeness } = this.data;
    
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
        ...suggestion
      }
    });
    
    // Banner广告 - 临时隐藏，过审后将恢复
    // setTimeout(() => {
    //   this.showCalculatorBannerAd();
    // }, 100);
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
        suggested: `${result.low}-${result.high}`,
        actual: parseInt(actualAmount)
      });
    }

    console.log('伪反馈已提交（本地存储已移除）');
  }
});

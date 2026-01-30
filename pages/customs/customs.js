// pages/customs/customs.js
const app = getApp();
const { regionsData, loadCustomsData } = require('../../config/version-1-initial-data-compressed');
import { adManager } from '../../utils/ad-config';
Page({
  data: {
    selectedRegion: 'beijing',
    selectedRegionIndex: 0,
    customsTab: 'gift',
    loading: false,  // 🔴 P0: 加载状态
    loadingText: '',  // 🔴 P0: 加载文本
    // unlockedDeepReadings: [],  // 已解锁的深度解读地区（暂时隐藏）
  },

  // 生命周期函数
  onLoad: function(options) {
    app.globalData.currentRoute = 'pages/customs/customs';
    
    // 初始化激励视频广告（暂时隐藏）
    // adManager.createRewardedVideoAd();
    
    // 从缓存加载已解锁的深度解读（暂时隐藏）
    // try {
    //   const unlocked = wx.getStorageSync('unlocked_deep_readings') || [];
    //   this.setData({ unlockedDeepReadings: unlocked });
    // } catch (error) {
    //   console.warn('加载已解锁数据失败:', error);
    // }
    // 确保将所有省份数据填充到页面中
    const allRegions = regionsData
      .filter(r => r.id !== 'common')
      .map(r => ({ id: r.id, name: r.name }));

    // 🔴 P0: 添加数据加载状态  
    this.setData({
      loading: true,
      loadingText: '正在加载地域习俗数据...',
      regions: allRegions,
      giftMoneyData: {},
      giftGivingData: {}
    });
    
    // 按需加载默认地域数据（北京）
    var that = this;
    setTimeout(async function() {
      try {
        const beijingData = await loadCustomsData('beijing');
        
        that.setData({
          giftMoneyData: beijingData,
          giftGivingData: beijingData,
          loading: false
        });
        
        wx.showToast({
          title: '数据已更新',
          icon: 'success',
          duration: 1000
        });
      } catch (error) {
        console.error('加载地域数据失败:', error);
        
        // 🔴 高优先级修复：添加默认数据回退机制
        const defaultData = {
          name: '北京',
          giftMoney: {
            amount: '100-500元',
            customs: ['偏好吉利数字如66、88、168', '注重传统仪式感'],
            tips: '北京红包注重传统和文化内涵'
          },
          giving: {
            colleague: '200-500元',
            friend: '800-1500元',
            customs: ['讲究礼尚往来，注重情义', '会根据对方经济情况调整'],
            tips: '北京人情往来体现皇城文化底蕴'
          },
          features: {
            tone: '大气厚重，注重传统',
            luckyNumbers: [66, 88, 168],
            colors: ['#FF0000', '#FFD700']
          }
        };
        
        that.setData({
          giftMoneyData: defaultData,
          giftGivingData: defaultData,
          loading: false
        });
        
        wx.showToast({
          title: '使用默认数据',
          icon: 'none',
          duration: 2000
        });
      }
    }, 800);
  },

  onShow: function() {
  },

  onHide: function() {
  },

  onUnload: function() {
    // 清理数据
    this.setData({
      selectedRegionIndex: 0,
      selectedRegion: 'beijing'
    });
  },

  onRegionChange(e) {
    const index = e.detail.value;
    
    // 🔴 中优先级修复：添加边界条件处理，防止数组越界
    if (index < 0 || index >= this.data.regions.length) {
      console.warn('地区选择索引超出范围:', index);
      wx.showToast({
        title: '地区选择无效',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    const region = this.data.regions[index];
    
    // 🔴 中优先级修复：添加region有效性检查
    if (!region || !region.id) {
      console.warn('地区数据无效:', region);
      wx.showToast({
        title: '地区数据错误',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    this.setData({ 
      selectedRegion: region.id,
      selectedRegionIndex: index,
      loading: true,
      loadingText: `正在加载${region.name}数据...`
    });
    
    // 按需加载选中地区的数据
    setTimeout(async () => {
      try {
        const regionData = await loadCustomsData(region.id);
        
        // 🔴 高优先级修复：添加数据有效性检查
        const validData = regionData && Object.keys(regionData).length > 0 ? regionData : this.createDefaultRegionData(region.name);
        
        this.setData({
          giftMoneyData: validData,
          giftGivingData: validData,
          loading: false
        });
        
        wx.showToast({
          title: `${region.name}数据加载完成`,
          icon: 'success',
          duration: 1000
        });
      } catch (error) {
        console.error('加载地域数据失败:', error);
        
        // 🔴 高优先级修复：使用默认数据确保功能不失效
        const defaultData = this.createDefaultRegionData(region.name);
        this.setData({
          giftMoneyData: defaultData,
          giftGivingData: defaultData,
          loading: false
        });
        
        wx.showToast({
          title: '使用默认数据',
          icon: 'none',
          duration: 2000
        });
      }
    }, 300);
  },

  switchCustomsTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ customsTab: tab });
  },

  // 🔴 高优先级修复：创建默认地域数据
  createDefaultRegionData(regionName) {
    return {
      name: regionName,
      giftMoney: {
        amount: '100-500元',
        customs: ['偏好吉利数字如66、88、168', '注重传统仪式感'],
        tips: `${regionName}红包注重传统和文化内涵`
      },
      giving: {
        colleague: '200-500元',
        friend: '800-1500元',
        customs: ['讲究礼尚往来，注重情义', '会根据对方经济情况调整'],
        tips: `${regionName}人情往来体现地方文化特色`
      },
      features: {
        tone: '朴实厚重，注重传统',
        luckyNumbers: [66, 88, 168],
        colors: ['#FF0000', '#FFD700']
      }
    };
  }
});

// pages/customs/customs.js
const app = getApp();
const { adManager } = require('../../utils/ad-config');

// 静态加载所有省份数据模块
const beijingData = require('../../config/customs/beijing.js');
const anhuiData = require('../../config/customs/anhui.js');
const chongqingData = require('../../config/customs/chongqing.js');
const fujianData = require('../../config/customs/fujian.js');
const gansuData = require('../../config/customs/gansu.js');
const guangdongData = require('../../config/customs/guangdong.js');
const guangxiData = require('../../config/customs/guangxi.js');
const guizhouData = require('../../config/customs/guizhou.js');
const hainanData = require('../../config/customs/hainan.js');
const hebeiData = require('../../config/customs/hebei.js');
const heilongjiangData = require('../../config/customs/heilongjiang.js');
const henanData = require('../../config/customs/henan.js');
const hongkongData = require('../../config/customs/hongkong.js');
const hubeiData = require('../../config/customs/hubei.js');
const hunanData = require('../../config/customs/hunan.js');
const jiangsuData = require('../../config/customs/jiangsu.js');
const jiangxiData = require('../../config/customs/jiangxi.js');
const jilinData = require('../../config/customs/jilin.js');
const liaoningData = require('../../config/customs/liaoning.js');
const macauData = require('../../config/customs/macau.js');
const neimengguData = require('../../config/customs/neimenggu.js');
const ningxiaData = require('../../config/customs/ningxia.js');
const qinghaiData = require('../../config/customs/qinghai.js');
const shaanxiData = require('../../config/customs/shaanxi.js');
const shandongData = require('../../config/customs/shandong.js');
const shanghaiData = require('../../config/customs/shanghai.js');
const shanxiData = require('../../config/customs/shanxi.js');
const sichuanData = require('../../config/customs/sichuan.js');
const taiwanData = require('../../config/customs/taiwan.js');
const tianjinData = require('../../config/customs/tianjin.js');
const xinjiangData = require('../../config/customs/xinjiang.js');
const xizangData = require('../../config/customs/xizang.js');
const yunnanData = require('../../config/customs/yunnan.js');
const zhejiangData = require('../../config/customs/zhejiang.js');

// 省份数据映射 - 按照行政区划代码排序
const regionsData = [
  { id: 'beijing', name: '北京' },
  { id: 'tianjin', name: '天津' },
  { id: 'hebei', name: '河北' },
  { id: 'shanxi', name: '山西' },
  { id: 'neimenggu', name: '内蒙古' },
  { id: 'liaoning', name: '辽宁' },
  { id: 'jilin', name: '吉林' },
  { id: 'heilongjiang', name: '黑龙江' },
  { id: 'shanghai', name: '上海' },
  { id: 'jiangsu', name: '江苏' },
  { id: 'zhejiang', name: '浙江' },
  { id: 'anhui', name: '安徽' },
  { id: 'fujian', name: '福建' },
  { id: 'jiangxi', name: '江西' },
  { id: 'shandong', name: '山东' },
  { id: 'henan', name: '河南' },
  { id: 'hubei', name: '湖北' },
  { id: 'hunan', name: '湖南' },
  { id: 'guangdong', name: '广东' },
  { id: 'guangxi', name: '广西' },
  { id: 'hainan', name: '海南' },
  { id: 'chongqing', name: '重庆' },
  { id: 'sichuan', name: '四川' },
  { id: 'guizhou', name: '贵州' },
  { id: 'yunnan', name: '云南' },
  { id: 'xizang', name: '西藏' },
  { id: 'shaanxi', name: '陕西' },
  { id: 'gansu', name: '甘肃' },
  { id: 'qinghai', name: '青海' },
  { id: 'ningxia', name: '宁夏' },
  { id: 'xinjiang', name: '新疆' },
  { id: 'hongkong', name: '香港' },
  { id: 'macau', name: '澳门' },
  { id: 'taiwan', name: '台湾' }
];

// 省份数据映射表
const regionDataMap = {
  beijing: beijingData,
  anhui: anhuiData,
  chongqing: chongqingData,
  fujian: fujianData,
  gansu: gansuData,
  guangdong: guangdongData,
  guangxi: guangxiData,
  guizhou: guizhouData,
  hainan: hainanData,
  hebei: hebeiData,
  heilongjiang: heilongjiangData,
  henan: henanData,
  hongkong: hongkongData,
  hubei: hubeiData,
  hunan: hunanData,
  jiangsu: jiangsuData,
  jiangxi: jiangxiData,
  jilin: jilinData,
  liaoning: liaoningData,
  macau: macauData,
  neimenggu: neimengguData,
  ningxia: ningxiaData,
  qinghai: qinghaiData,
  shaanxi: shaanxiData,
  shandong: shandongData,
  shanghai: shanghaiData,
  shanxi: shanxiData,
  sichuan: sichuanData,
  taiwan: taiwanData,
  tianjin: tianjinData,
  xinjiang: xinjiangData,
  xizang: xizangData,
  yunnan: yunnanData,
  zhejiang: zhejiangData
};

// 加载地域习俗数据
const loadCustomsData = async (regionId) => {
  try {
    // 从映射表中获取对应的省份数据
    const regionData = regionDataMap[regionId];
    if (regionData) {
      return regionData;
    } else {
      throw new Error(`未找到${regionId}的数据`);
    }
  } catch (error) {
    console.error(`加载${regionId}数据失败:`, error);
    throw error;
  }
};
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

    // 🔴 P0: 移除人为延迟,立即加载数据
    const that = this;
    (async function() {
      try {
        const beijingData = await loadCustomsData('beijing');

        that.setData({
          regions: allRegions,
          giftMoneyData: beijingData,
          giftGivingData: beijingData
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
          regions: allRegions,
          giftMoneyData: defaultData,
          giftGivingData: defaultData
        });
      }
    })();
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
      selectedRegionIndex: index
    });

    // 🔴 P0: 移除人为延迟,立即加载地区数据
    const page = this;
    (async function() {
      try {
        const regionData = await loadCustomsData(region.id);

        // 🔴 高优先级修复：添加数据有效性检查
        const validData = regionData && Object.keys(regionData).length > 0 ? regionData : page.createDefaultRegionData(region.name);

        page.setData({
          giftMoneyData: validData,
          giftGivingData: validData
        });

        wx.showToast({
          title: `${region.name}数据加载完成`,
          icon: 'success',
          duration: 1000
        });
      } catch (error) {
        console.error('加载地域数据失败:', error);

        // 🔴 高优先级修复：使用默认数据确保功能不失效
        const defaultData = page.createDefaultRegionData(region.name);
        page.setData({
          giftMoneyData: defaultData,
          giftGivingData: defaultData
        });

        wx.showToast({
          title: '使用默认数据',
          icon: 'none',
          duration: 2000
        });
      }
    })();
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

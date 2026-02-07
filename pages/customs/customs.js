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
      // 数据格式可能是 {regionId: {...}} 或直接 {...}
      // 兼容两种格式
      if (regionData[regionId]) {
        return regionData[regionId];
      }
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
    // P0: 添加特殊场合tab支持
    occasionTabs: ['gift', 'giving', 'special'],
    // P0: 地区对比功能
    showCompare: false,
    compareRegion1Index: 0,
    compareRegion2Index: 1,
    compareData: null,
    // 🔧 新增：展开的特殊场合详情
    expandedOccasion: null,
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

    // 🔧 修改地区选择逻辑：选择地区后自动进入对比模式
    // 自动将选中的地区设为第一个对比地区，第二个对比地区设为第二个可用的不同地区
    const regionsLength = this.data.regions.length;
    let compareRegion2Index = (index + 1) % regionsLength;  // 跳过相同地区，选择下一个不同地区

    this.setData({
      showCompare: true,
      compareRegion1Index: index,
      compareRegion2Index: compareRegion2Index
    });

    // 自动加载对比数据
    this.loadCompareData();

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
      },
      // 补充特殊场合习俗数据
      specialOccasions: {
        wedding: {
          amount: '500-2000元',
          customs: ['婚礼当天送红包', '新婚夫妇回礼'],
          tips: '婚礼红包要根据关系远近和当地习俗来确定'
        },
        birthday: {
          amount: '200-800元',
          customs: ['寿宴送礼', '整岁生日重视'],
          tips: '老人过寿要更加重视'
        },
        funeral: {
          amount: '500-1000元',
          customs: ['白事随礼', '素色封包'],
          tips: '葬礼红包要体现哀悼之情'
        }
      },
      // 补充禁忌信息
      taboo: ['避免使用与"死"谐音的数字', '红包金额要避开"4"'],
      // 补充文化故事
      story: `${regionName}的红包文化历史悠久，体现了当地人民对传统文化的重视和对亲友的美好祝愿。`
    };
  },

  // P0: 打开地区对比弹窗
  openCompare() {
    this.setData({ showCompare: true });
    // 自动加载对比数据
    this.loadCompareData();
  },

  // P0: 关闭地区对比弹窗
  closeCompare() {
    this.setData({ showCompare: false });
  },

  // 🔧 新增：切换特殊场合详情展开/收起
  toggleOccasionDetail(e) {
    const type = e.currentTarget.dataset.type;
    const currentExpanded = this.data.expandedOccasion;
    const specialOccasions = this.data.giftMoneyData.specialOccasions || {};

    const occasionMap = {
      wedding: { title: '婚礼', ...specialOccasions.wedding },
      birthday: { title: '生日', ...specialOccasions.birthday },
      funeral: { title: '葬礼', ...specialOccasions.funeral }
    };

    if (currentExpanded && currentExpanded.type === type) {
      // 点击已展开的，收起
      this.setData({ expandedOccasion: null });
    } else {
      // 展开新的
      this.setData({ expandedOccasion: occasionMap[type] });
    }
  },

  // P0: 地区1选择变化
  onCompareRegion1Change(e) {
    this.setData({ compareRegion1Index: e.detail.value });
    this.loadCompareData();
  },

  // P0: 地区2选择变化
  onCompareRegion2Change(e) {
    this.setData({ compareRegion2Index: e.detail.value });
    this.loadCompareData();
  },

  // P0: 加载对比数据
  async loadCompareData() {
    const page = this;
    const region1Index = page.data.compareRegion1Index;
    const region2Index = page.data.compareRegion2Index;
    const regions = page.data.regions;

    if (!regions || region1Index === region2Index) {
      return;
    }

    const region1Id = regions[region1Index]?.id;
    const region2Id = regions[region2Index]?.id;

    if (!region1Id || !region2Id) {
      return;
    }

    try {
      const [data1, data2] = await Promise.all([
        loadCustomsData(region1Id),
        loadCustomsData(region2Id)
      ]);

      // 处理数据格式兼容
      const region1Data = data1[region1Id] || data1 || page.createDefaultRegionData(regions[region1Index].name);
      const region2Data = data2[region2Id] || data2 || page.createDefaultRegionData(regions[region2Index].name);

      page.setData({
        compareData: {
          region1: region1Data,
          region2: region2Data
        }
      });
    } catch (error) {
      console.error('加载对比数据失败:', error);
    }
  }
});

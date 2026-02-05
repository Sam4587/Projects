const app = getApp();
const { adManager } = require('../../utils/ad-config');

// 静态加载所有祝福数据模块
const generalData = require('../../config/blessings/general.js');
const healthData = require('../../config/blessings/health.js');
const studyData = require('../../config/blessings/study.js');
const careerData = require('../../config/blessings/career.js');
const horseData = require('../../config/blessings/horse.js');
const northData = require('../../config/blessings/north.js');
const southData = require('../../config/blessings/south.js');
const cantoneseData = require('../../config/blessings/cantonese.js');
const coastalData = require('../../config/blessings/coastal.js');
const southwestData = require('../../config/blessings/southwest.js');
const weddingData = require('../../config/blessings/wedding.js');
const birthdayData = require('../../config/blessings/birthday.js');
const openingData = require('../../config/blessings/opening.js');

// 数据加载器
const loadBlessingData = async (category = '全部') => {
  try {
    // 使用对象映射替代冗长的if-else链，提高代码可维护性
    const categoryMap = {
      '全部': generalData,
      '通用祝福': generalData,
      '健康祝福': healthData,
      '学业祝福': studyData,
      '事业祝福': careerData,
      '马年专属': horseData,
      '北方豪爽': northData,
      '江南婉约': southData,
      '粤语商题': cantoneseData,
      '沿海渔家': coastalData,
      '西南安逸': southwestData,
      '婚礼祝福': weddingData,
      '生日祝福': birthdayData,
      '开业祝福': openingData
    };
    
    // 获取对应的模块数据
    const data = categoryMap[category] || generalData;
    return data;
  } catch (error) {
    console.error('加载祝福语数据失败:', error);
    return [];
  }
};

Page({
  data: {
    inputText: '',
    translation: null,
    showGuide: false,
    userInput: '',
    loading: false,
    loadingText: '',
    categoryList: ['全部', '马年专属', '通用祝福', '健康祝福', '学业祝福', '事业祝福', '北方豪爽', '江南婉约', '粤语商题', '沿海渔家', '西南安逸', '婚礼祝福', '生日祝福', '开业祝福'],
    selectedCategory: '全部',
    filteredPhrases: [],
    phrases: []
  },

  onLoad: function(options) {
    app.globalData.currentRoute = 'pages/translator/translator';

    // 记录页面启动时间
    this.startTime = Date.now();

    // 初始化插屏广告
    adManager.createInterstitialAd();

    // 🔴 P0: 移除人为延迟,立即加载数据
    var that = this;
    (async function() {
      try {
        // 加载默认分类数据（通用祝福）
        const generalData = await loadBlessingData('通用祝福');

        that.setData({
          phrases: generalData,
          filteredPhrases: generalData
        });

        console.log('按需加载祝福语列表:', generalData.length, '条');
        wx.showToast({
          title: '加载完成',
          icon: 'success',
          duration: 1000
        });
      } catch (error) {
        console.error('数据加载失败:', error);
        that.setData({
          loading: false
        });
        wx.showToast({
          title: '加载失败',
          icon: 'error',
          duration: 2000
        });
      }
    })();
  },

  onShow: function() {
  },

  onHide: function() {
  },

  onUnload: function() {
  },

  onInputText: function(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  translateText: function() {
    const inputText = this.data.inputText;
    
    if (!inputText || !inputText.trim()) {
      wx.showToast({
        title: '请输入要翻译的文字',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '正在查找翻译...'
    });

    const phrases = this.data.phrases;
    let found = null;
    
    // 精确匹配搜索
    for (let i = 0; i < phrases.length; i++) {
      const phrase = phrases[i];
      if (phrase && phrase.traditional === inputText) {
        found = phrase;
        break;
      }
    }

    // 如果没有找到精确匹配，尝试模糊搜索
    if (!found) {
      for (let i = 0; i < phrases.length; i++) {
        const phrase = phrases[i];
        if (phrase && phrase.traditional.includes(inputText) || inputText.includes(phrase.traditional)) {
          found = phrase;
          break;
        }
      }
    }

    setTimeout(() => {
      wx.hideLoading();
      
      if (found) {
        this.setData({
          translation: found,
          showGuide: false,
          inputText: found.traditional
        });
        wx.showToast({
          title: '翻译成功',
          icon: 'success',
          duration: 2000
        });
        
        // 触发插屏广告检查（翻译成功后）
        setTimeout(() => {
          this.checkAndShowInterstitialAd();
        }, 500);
      } else {
      // 未找到翻译时，设置详细的引导信息
        setTimeout(() => {
          this.setData({
            translation: {
              traditional: inputText,
              modern: '抱歉，该祝福语暂未收录',
              meaning: '我们暂时还没有收录这条祝福语的传统-现代翻译对照',
              category: '自定义',
              usage: '快来使用下方的祝福语库，选择最合适的祝福语吧！'
            },
            showGuide: true,
            userInput: inputText
          });
        
          wx.showToast({
            title: '推荐使用祝福语库',
            icon: 'none',
            duration: 2500
          });
        }, 500);
      }
    }, 800);
  },

  // 检查并显示插屏广告
  checkAndShowInterstitialAd() {
    try {
      const shouldShow = adManager.shouldShowInterstitialAd();
      if (shouldShow) {
  
        adManager.showInterstitialAd();
      } else {
  
      }
    } catch (error) {
      console.warn('检查插屏广告触发条件失败:', error);
    }
  },

  copyTranslation: function() {
    const translation = this.data.translation;
    
    if (translation) {
      // 确保所有字段都有默认值
      const originalText = this.data.inputText || translation.traditional || '';
      const traditional = translation.traditional || '';
      const modern = translation.modern || '';
      const meaning = translation.meaning || '';
      const usage = translation.usage || '无适用场景信息';
      
      // 构建复制内容，确保包含完整信息
      const content = `${originalText}\n原文：${traditional}\n译文：${modern}\n含义：${meaning}\n适用：${usage}`;
      
      wx.setClipboardData({
        data: content,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: 'success'
          });
          
          // 触发插屏广告检查
          setTimeout(() => {
            this.checkAndShowInterstitialAd();
          }, 500);
        },
        fail: () => {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '暂无内容可复制',
        icon: 'none'
      });
    }
  },

  selectCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    const that = this;

    if (!category) {
      console.error('未获取到分类信息');
      return;
    }

    this.setData({
      selectedCategory: category
    });

    // 🔴 P0: 移除人为延迟,立即加载分类数据
    (async function() {
      try {
        let dataToShow;

        if (category === '全部') {
          // 如果是"全部"，加载通用祝福数据
          dataToShow = await loadBlessingData('通用祝福');
        } else {
          // 加载指定分类数据
          dataToShow = await loadBlessingData(category);
        }

        that.setData({
          phrases: dataToShow,
          filteredPhrases: dataToShow
        });

        wx.showToast({
          title: `${category}加载完成`,
          icon: 'success',
          duration: 1000
        });

      } catch (error) {
        console.error('分类数据加载失败:', error);
        that.setData({
          loading: false
        });
        wx.showToast({
          title: '分类加载失败',
          icon: 'error',
          duration: 2000
        });
      }
    })();
  },

  selectPhrase: function(e) {
    const phraseText = e.currentTarget.dataset.phrase;
    const foundPhrase = this.data.phrases.find(p => p.traditional === phraseText);
    
    if (foundPhrase) {
      this.setData({
        inputText: phraseText,
        translation: foundPhrase
      });
    } else {
      this.setData({
        inputText: phraseText
      });
    }
    
    wx.showToast({
      title: `已选择: ${phraseText}`,
      icon: 'success'
    });
  },

  onClearInput: function() {
    this.setData({ inputText: '' });
  },
  
  copyPhrase: function(e) {
    const phrase = e.currentTarget.dataset.phrase;
    const foundPhrase = this.data.phrases.find(p => p.traditional === phrase);
    
    if (foundPhrase) {
      this.setData({ 
        inputText: phrase,
        translation: foundPhrase
      });
    } else {
      this.setData({ inputText: phrase });
    }
    
    wx.showToast({
      title: `已选择: ${phrase}`,
      icon: 'success'
    });
  },

  // 滚动到祝福语库
  scrollToPhraseLibrary: function() {
    wx.pageScrollTo({
      scrollTop: 700, // 滚动到祝福语库区域
      duration: 500,
      success: function() {
        wx.showToast({
          title: '已为您跳转到祝福语库',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  
  // 关闭引导提示
  closeGuide: function() {
    this.setData({
      showGuide: false
    });
  }
});
// utils/ad-config.js
// 广告配置管理模块

/**
 * 广告管理器 - 用于统一管理广告相关功能
 */
class AdManager {
  constructor() {
    // 广告配置
    this.config = {
      // 插屏广告
      interstitial: {
        adId: 'ad-1234567890', // 实际广告ID
        showInterval: 30000, // 30秒后显示
        maxShowCount: 5, // 每次会话最多显示5次
        showThreshold: 10 // 触发显示的最低阈值
      },
      // 激励视频广告
      rewardedVideo: {
        adId: 'ad-0987654321', // 实际广告ID
        showInterval: 60000, // 60秒后显示
        maxShowCount: 3, // 每次会话最多显示3次
        showThreshold: 5 // 触发显示的最低阈值
      },
      // Banner广告
      banner: {
        adId: 'ad-1122334455', // 实际广告ID
        showInterval: 120000, // 120秒后显示
        maxShowCount: 2, // 每次会话最多显示2次
        showThreshold: 8 // 触发显示的最低阈值
      }
    };

    // 广告状态
    this.adStatus = {
      interstitial: {
        lastShowTime: null,
        showCount: 0
      },
      rewardedVideo: {
        lastShowTime: null,
        showCount: 0
      },
      banner: {
        lastShowTime: null,
        showCount: 0
      }
    };

    // 广告事件监听
    this.eventListeners = {};
  }

  /**
   * 创建插屏广告
   */
  createInterstitialAd() {
    try {
      // 这里应该调用微信小程序的API来创建插屏广告
      // 由于我们是在模拟环境，这里只做日志记录
      console.log('插屏广告已创建');
      
      // 模拟广告加载成功
      setTimeout(() => {
        if (this.eventListeners.onInterstitialLoaded) {
          this.eventListeners.onInterstitialLoaded();
        }
      }, 1000);
      
    } catch (error) {
      console.error('创建插屏广告失败:', error);
      if (this.eventListeners.onInterstitialError) {
        this.eventListeners.onInterstitialError(error);
      }
    }
  }

  /**
   * 显示插屏广告
   */
  showInterstitialAd() {
    try {
      const now = Date.now();
      const lastShowTime = this.adStatus.interstitial.lastShowTime;
      const showCount = this.adStatus.interstitial.showCount;
      const threshold = this.config.interstitial.showThreshold;

      // 检查显示条件
      if (showCount >= this.config.interstitial.maxShowCount) {
        console.log('插屏广告显示次数已达上限');
        return false;
      }

      if (lastShowTime && (now - lastShowTime) < this.config.interstitial.showInterval) {
        console.log('插屏广告显示间隔未到');
        return false;
      }

      // 显示广告
      console.log('正在显示插屏广告');
      
      // 模拟广告显示
      setTimeout(() => {
        this.adStatus.interstitial.lastShowTime = Date.now();
        this.adStatus.interstitial.showCount++;
        
        if (this.eventListeners.onInterstitialShowed) {
          this.eventListeners.onInterstitialShowed();
        }
      }, 500);
      
      return true;
      
    } catch (error) {
      console.error('显示插屏广告失败:', error);
      if (this.eventListeners.onInterstitialError) {
        this.eventListeners.onInterstitialError(error);
      }
      return false;
    }
  }

  /**
   * 创建激励视频广告
   */
  createRewardedVideoAd() {
    try {
      // 这里应该调用微信小程序的API来创建激励视频广告
      // 由于我们是在模拟环境，这里只做日志记录
      console.log('激励视频广告已创建');
      
      // 模拟广告加载成功
      setTimeout(() => {
        if (this.eventListeners.onRewardedVideoLoaded) {
          this.eventListeners.onRewardedVideoLoaded();
        }
      }, 1000);
      
    } catch (error) {
      console.error('创建激励视频广告失败:', error);
      if (this.eventListeners.onRewardedVideoError) {
        this.eventListeners.onRewardedVideoError(error);
      }
    }
  }

  /**
   * 显示激励视频广告
   */
  showRewardedAd(callback) {
    try {
      const now = Date.now();
      const lastShowTime = this.adStatus.rewardedVideo.lastShowTime;
      const showCount = this.adStatus.rewardedVideo.showCount;
      const threshold = this.config.rewardedVideo.showThreshold;

      // 检查显示条件
      if (showCount >= this.config.rewardedVideo.maxShowCount) {
        console.log('激励视频广告显示次数已达上限');
        return false;
      }

      if (lastShowTime && (now - lastShowTime) < this.config.rewardedVideo.showInterval) {
        console.log('激励视频广告显示间隔未到');
        return false;
      }

      // 显示广告
      console.log('正在显示激励视频广告');
      
      // 模拟广告显示
      setTimeout(() => {
        this.adStatus.rewardedVideo.lastShowTime = Date.now();
        this.adStatus.rewardedVideo.showCount++;
        
        if (this.eventListeners.onRewardedVideoShowed) {
          this.eventListeners.onRewardedVideoShowed();
        }
        
        // 调用回调函数
        if (callback) {
          callback();
        }
      }, 500);
      
      return true;
      
    } catch (error) {
      console.error('显示激励视频广告失败:', error);
      if (this.eventListeners.onRewardedVideoError) {
        this.eventListeners.onRewardedVideoError(error);
      }
      return false;
    }
  }

  /**
   * 创建Banner广告
   */
  createBannerAd() {
    try {
      // 这里应该调用微信小程序的API来创建Banner广告
      // 由于我们是在模拟环境，这里只做日志记录
      console.log('Banner广告已创建');
      
      // 模拟广告加载成功
      setTimeout(() => {
        if (this.eventListeners.onBannerLoaded) {
          this.eventListeners.onBannerLoaded();
        }
      }, 1000);
      
    } catch (error) {
      console.error('创建Banner广告失败:', error);
      if (this.eventListeners.onBannerError) {
        this.eventListeners.onBannerError(error);
      }
    }
  }

  /**
   * 显示Banner广告
   */
  showBannerAd(elementId) {
    try {
      const now = Date.now();
      const lastShowTime = this.adStatus.banner.lastShowTime;
      const showCount = this.adStatus.banner.showCount;
      const threshold = this.config.banner.showThreshold;

      // 检查显示条件
      if (showCount >= this.config.banner.maxShowCount) {
        console.log('Banner广告显示次数已达上限');
        return false;
      }

      if (lastShowTime && (now - lastShowTime) < this.config.banner.showInterval) {
        console.log('Banner广告显示间隔未到');
        return false;
      }

      // 显示广告
      console.log('正在显示Banner广告');
      
      // 模拟广告显示
      setTimeout(() => {
        this.adStatus.banner.lastShowTime = Date.now();
        this.adStatus.banner.showCount++;
        
        if (this.eventListeners.onBannerShowed) {
          this.eventListeners.onBannerShowed();
        }
      }, 500);
      
      return true;
      
    } catch (error) {
      console.error('显示Banner广告失败:', error);
      if (this.eventListeners.onBannerError) {
        this.eventListeners.onBannerError(error);
      }
      return false;
    }
  }

  /**
   * 隐藏Banner广告
   */
  hideBannerAd() {
    try {
      console.log('正在隐藏Banner广告');
      // 模拟广告隐藏
      setTimeout(() => {
        if (this.eventListeners.onBannerHidden) {
          this.eventListeners.onBannerHidden();
        }
      }, 100);
      
      return true;
      
    } catch (error) {
      console.error('隐藏Banner广告失败:', error);
      return false;
    }
  }

  /**
   * 检查是否应该显示插屏广告
   */
  shouldShowInterstitialAd() {
    const now = Date.now();
    const lastShowTime = this.adStatus.interstitial.lastShowTime;
    const showCount = this.adStatus.interstitial.showCount;
    
    // 检查显示条件
    if (showCount >= this.config.interstitial.maxShowCount) {
      return false;
    }
    
    if (lastShowTime && (now - lastShowTime) < this.config.interstitial.showInterval) {
      return false;
    }
    
    return true;
  }

  /**
   * 检查是否应该显示激励视频广告
   */
  shouldShowRewardedVideoAd() {
    const now = Date.now();
    const lastShowTime = this.adStatus.rewardedVideo.lastShowTime;
    const showCount = this.adStatus.rewardedVideo.showCount;
    
    // 检查显示条件
    if (showCount >= this.config.rewardedVideo.maxShowCount) {
      return false;
    }
    
    if (lastShowTime && (now - lastShowTime) < this.config.rewardedVideo.showInterval) {
      return false;
    }
    
    return true;
  }

  /**
   * 检查是否应该显示Banner广告
   */
  shouldShowBannerAd() {
    const now = Date.now();
    const lastShowTime = this.adStatus.banner.lastShowTime;
    const showCount = this.adStatus.banner.showCount;
    
    // 检查显示条件
    if (showCount >= this.config.banner.maxShowCount) {
      return false;
    }
    
    if (lastShowTime && (now - lastShowTime) < this.config.banner.showInterval) {
      return false;
    }
    
    return true;
  }

  /**
   * 设置事件监听器
   */
  setEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * 移除事件监听器
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(callback);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }
}

// 导出广告管理器实例
const adManager = new AdManager();

// 为兼容性提供全局访问
if (typeof window !== 'undefined') {
  window.adManager = adManager;
}

module.exports = { adManager };
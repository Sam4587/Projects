// utils/network-utils.js
// 网络请求工具类 - 处理超时、重试和异常

/**
 * 指数退避重试机制
 * @param {Function} requestFn - 请求函数，返回Promise
 * @param {number} maxRetries - 最大重试次数，默认3次
 * @param {number} baseDelay - 基础延迟时间(ms)，默认1000ms
 * @returns {Promise} - 带重试机制请求的Promise
 */
function retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    
    function attempt() {
      requestFn()
        .then(resolve)
        .catch((error) => {
          retryCount++;
          
          if (retryCount >= maxRetries) {
            console.error(`请求失败，已重试${retryCount}次`, error);
            reject({
              ...error,
              retryCount: retryCount,
              message: error.message + ` (重试${retryCount}/${maxRetries})`
            });
            return;
          }
          
          // 指数退避：1s, 2s, 4s...
          const delay = baseDelay * Math.pow(2, retryCount - 1);
          console.log(`第${retryCount}次重试，${delay}ms后执行...`, error);
          
          setTimeout(attempt, delay);
        });
    }
    
    attempt();
  });
}

/**
 * 带超时的wx.request请求
 * @param {Object} options - wx.request参数
 * @param {number} timeout - 超时时间(ms)，默认15000ms
 * @returns {Promise} - 带超时的请求Promise
 */
function requestWithTimeout(options, timeout = 15000) {
  return new Promise((resolve, reject) => {
    let timeoutTimer = null;
    
    const timer = setTimeout(() => {
      timeoutTimer = true;
      reject({ 
        type: 'timeout', 
        message: `请求超时 (${timeout}ms)`,
        timeout: timeout
      });
    }, timeout);
    
    wx.request({
      ...options,
      success: (res) => {
        if (!timeoutTimer) {
          clearTimeout(timer);
          resolve(res);
        }
      },
      fail: (err) => {
        if (!timeoutTimer) {
          clearTimeout(timer);
          reject(err);
        }
      }
    });
  });
}

/**
 * 智能网络请求 - 包含超时、重试和错误处理
 * @param {Object} options - wx.request参数
 * @param {Object} config - 重试配置
 * @returns {Promise} - 完整处理的请求Promise
 */
function smartRequest(options, config = {}) {
  const {
    timeout = 15000,
    maxRetries = 3,
    baseDelay = 1000,
    retryCondition = null
  } = config;
  
  // 基础请求函数
  const baseRequest = () => {
    return requestWithTimeout(options, timeout);
  };
  
  // 重试条件判断
  const shouldRetry = retryCondition || ((error) => {
    // 默认重试条件：网络错误、超时、服务器错误(5xx)
    return error.type === 'network' || 
           error.type === 'timeout' ||
           (error.statusCode && error.statusCode >= 500);
  });
  
  // 包装重试逻辑
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    
    function attempt() {
      baseRequest()
        .then(resolve)
        .catch((error) => {
          // 检查是否应该重试
          if (!shouldRetry(error)) {
            reject(error);
            return;
          }
          
          retryCount++;
          if (retryCount >= maxRetries) {
            console.error(`请求失败，已达最大重试次数${maxRetries}`, error);
            reject({
              ...error,
              retryCount: retryCount,
              message: (error.message || '请求失败') + ` (重试${retryCount}/${maxRetries})`
            });
            return;
          }
          
          const delay = baseDelay * Math.pow(2, retryCount - 1);
          console.log(`请求异常，第${retryCount}次重试，${delay}ms后执行...`, error);
          
          setTimeout(attempt, delay);
        });
    }
    
    attempt();
  });
}

/**
 * 检查网络状态
 * @returns {Promise<boolean>} 是否可连接
 */
function checkNetworkStatus() {
  return new Promise((resolve) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res.networkType !== 'none');
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

/**
 * 等待网络恢复
 * @param {number} maxWaitTime - 最大等待时间(ms)
 * @returns {Promise<boolean>} 网络是否恢复
 */
function waitForNetwork(maxWaitTime = 30000) {
  return new Promise((resolve) => {
    let waited = 0;
    const checkInterval = 1000;
    
    function checkNetwork() {
      checkNetworkStatus().then((isConnected) => {
        if (isConnected) {
          resolve(true);
        } else if (waited >= maxWaitTime) {
          resolve(false);
        } else {
          waited += checkInterval;
          setTimeout(checkNetwork, checkInterval);
        }
      });
    }
    
    checkNetwork();
  });
}

module.exports = {
  retryRequest,
  requestWithTimeout,
  smartRequest,
  checkNetworkStatus,
  waitForNetwork
};
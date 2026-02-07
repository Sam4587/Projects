// utils/dingtalk-feedback-miniprogram.js
// 微信小程序专用钉钉反馈服务

// 加载配置
var config = require('../config/dingtalk-feedback-miniprogram.js');
var { hmacSHA256 } = require('./hmac-sha256-weapp');  // 使用新写的纯JS实现
var network = require('./network-utils.js');

/**
 * 钉钉机器人反馈服务 - 微信小程序专用版本
 */
class DingTalkFeedbackService {
  constructor() {
    this.config = config;
    this.status = {
      initialized: true,
      lastSend: null,
      successCount: 0,
      failedCount: 0,
      pendingQueue: []
    };
  }

  /**
   * 生成钉钉签名
   */
  generateSignature(timestamp) {
    // 方案2: 使用完整secret（含SEC）作为HMAC密钥和stringToSign
    var secret = this.config.secret;  // 完整secret，含SEC前缀
    var stringToSign = timestamp + '\n' + secret;
    
    console.log('📝 方案2: 使用完整secret（含SEC）');
    
    // 使用完整secret作为HMAC密钥
    var sign = hmacSHA256(secret, stringToSign);
    console.log("钉钉签名生成成功");

    if (!sign) {
      console.warn('生成签名失败，使用备用方案');
      return null;
    }

    console.log('✅ 签名生成成功，长度:', sign.length);
    return encodeURIComponent(sign);
  }

  /**
   * 发送钉钉消息
   */
  sendMessage(message, options = {}) {
    var timestamp = Date.now();
    var sign = this.generateSignature(timestamp);
    
    if (!sign) {
      console.error('无法生成有效签名，发送失败');
      return Promise.resolve({ success: false, error: '签名生成失败' });
    }

    var webhookWithSign = this.config.webhook + 
      '&timestamp=' + timestamp + 
      '&sign=' + sign;
    console.log('发送钉钉消息:', webhookWithSign.substring(0, 80) + '...');
    console.log('📤 发送钉钉消息:', webhookWithSign.substring(0, 80) + '...');

    // 使用智能网络请求
    return network.smartRequest({
      url: webhookWithSign,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: message
    }, {
      timeout: this.config.network?.timeout || 15000,  // 15秒超时
      maxRetries: this.config.network?.retryCount || 3, // 3次重试
      baseDelay: 1000 // 1秒基础延迟
    })
      .then(function(res) {
      
        // 🔴 P0 修复：添加全面的HTTP响应检查
        // 检查HTTP状态码
        if (res.statusCode !== 200) {
          console.error('❌ HTTP请求失败:', res.statusCode);
          return { 
            success: false, 
            error: {
              type: 'network',
              statusCode: res.statusCode,
              message: `网络请求失败: ${res.statusCode}`
            }
          };
        }
      
        // 检查数据是否存在
        if (!res.data) {
          console.error('❌ 响应数据为空');
          return {
            success: false,
            error: {
              type: 'data',
              message: '服务器返回数据为空'
            }
          };
        }
      
        // 检查钉钉错误码
        if (res.data.errcode === undefined) {
          console.error('❌ 响应缺少errcode字段');
          return {
            success: false,
            error: {
              type: 'data',
              message: '响应格式错误：缺少errcode字段'
            }
          };
        }
      
        // 处理钉钉API响应
        if (res.data.errcode === 0) {
        return { success: true, data: res.data };
        } else {
          console.warn('钉钉API返回错误:', res.data.errcode, res.data.errmsg);
          return { 
            success: false, 
            error: {
              type: 'dingtalk',
              errcode: res.data.errcode,
              message: res.data.errmsg || '钉钉服务器错误'
            }
          };
        }
      })
      .catch(function(error) {
        console.error('发送钉钉消息异常:', error);
        return { 
          success: false, 
          error: {
            type: 'exception',
            message: error.message || '发送异常',
            stack: error.stack
          }
        };
      });
  }

  /**
   * 提交反馈
   */
  submitFeedback(feedbackData, options = {}) {
    var message = this.formatFeedbackMessage(feedbackData, options);
    
    if (!message) {
      return Promise.resolve({ success: false, error: '反馈内容格式错误' });
    }

    return this.sendMessage(message, options);
  }

  /**
   * 格式化反馈消息
   */
  formatFeedbackMessage(feedbackData, options = {}) {
    if (!feedbackData.content) {
      console.error('反馈内容为空');
      return null;
    }

    var template = this.config.messageTemplates.feedback;
    var content = template.content
      .replace(/{{projectName}}/g, this.config.projectName)
      .replace(/{{timestamp}}/g, new Date().toLocaleString('zh-CN'))
      .replace(/{{userId}}/g, feedbackData.userId || '匿名用户')
      .replace(/{{type}}/g, feedbackData.type || '其他')
      .replace(/{{rating}}/g, feedbackData.rating || '未提供')
      .replace(/{{content}}/g, feedbackData.content || '');

    if (feedbackData.systemInfo) {
      content = content
        .replace(/{{systemInfo.brand}}/g, feedbackData.systemInfo.brand || '未知')
        .replace(/{{systemInfo.model}}/g, feedbackData.systemInfo.model || '未知')
        .replace(/{{systemInfo.system}}/g, feedbackData.systemInfo.system || '未知');
    }

    return {
      msgtype: 'markdown',
      markdown: {
        title: template.title.replace(/{{projectName}}/g, this.config.projectName),
        text: content
      }
    };
  }

  /**
   * 获取服务状态
   */
  getServiceStatus() {
    return this.status;
  }

  /**
   * 测试钉钉服务连通性
   */
  testService() {
    console.log('开始测试钉钉服务连通性...');
    
    var testMessage = {
      msgtype: 'text',
      text: {
        content: '🔧 钉钉反馈服务测试消息 \n来自「' + this.config.projectName + '」微信小程序\n测试时间：' + new Date().toLocaleString('zh-CN')
      }
    };
    
    return this.sendMessage(testMessage)
      .then(function(result) {
        console.log('钉钉服务测试结果:', result);
        return result;
      })
      .catch(function(error) {
        console.log('钉钉服务测试失败:', error);
        return { success: false, error: error };
      });
  }
}

// 创建服务实例
var dingtalkFeedback = new DingTalkFeedbackService();

// 导出API
var exports = {
  dingtalkFeedback: dingtalkFeedback,
  service: dingtalkFeedback,
  submit: function(feedbackData, options) {
    return dingtalkFeedback.submitFeedback(feedbackData, options);
  },
  getStatus: function() {
    return dingtalkFeedback.getServiceStatus();
  },
  testService: function() {
    if (typeof dingtalkFeedback.testService === 'function') {
      return dingtalkFeedback.testService();
    } else {
      return Promise.resolve({ 
        success: false, 
        error: 'testService not available', 
        message: '测试服务在当前版本不可用' 
      });
    }
  }
};

// 微信小程序专用导出
module.exports = exports;
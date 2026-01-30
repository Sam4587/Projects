// config/dingtalk-feedback-miniprogram.js
// 微信小程序专用配置 - 使用CommonJS导出

/**
 * 钉钉机器人配置
 * 微信小程序专用版本
 */
var config = {
  // 钉钉机器人Webhook地址（必填）
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a',
  
  // 钉钉机器人签名密钥（必填）
  secret: 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc',
  
  // 项目信息
  projectName: '随礼那点事儿',
  projectVersion: '1.0.0',
  
  // 降级机制配置
  fallback: {
    enabled: true, // 是否启用降级机制
    maxQueueSize: 100, // 本地队列最大容量
    autoRetry: true, // 是否自动重试
    retryInterval: 5 * 60 * 1000, // 重试间隔（5分钟）
    maxRetries: 3 // 最大重试次数
  },
  
  // 消息模板配置
  messageTemplates: {
    feedback: {
      title: '{{projectName}} - 用户反馈',
      content: '### 💬 用户反馈\n\n' +
               '**时间：** {{timestamp}}\n' +
               '**用户：** {{userId}}\n' +
               '**类型：** {{type}}\n' +
               '**评分：** {{rating}}⭐\n\n' +
               '**反馈内容：**\n' +
               '{{content}}\n\n' +
               '**设备信息：**\n' +
               '品牌：{{systemInfo.brand}} | ' +
               '型号：{{systemInfo.model}} | ' +
               '系统：{{systemInfo.system}}\n\n' +
               '---\n' +
               '*此消息由「{{projectName}}」微信小程序自动发送*'
    },
    status: {
      title: '{{projectName}} - 反馈系统状态',
      content: '### 📊 反馈系统状态报告\n\n' +
               '**时间：** {{timestamp}}\n' +
               '**状态：** {{status}}\n' +
               '**队列：** {{queue}} 条待发送\n' +
               '**失败：** {{failed}} 条失败\n' +
               '**成功率：** {{success_rate}}%'
    }
  },
  
  // 反馈类型配置
  feedbackTypes: [
    { value: 'bug', label: '🐛 问题报告', color: '#f5222d' },
    { value: 'feature', label: '✨ 功能建议', color: '#52c41a' },
    { value: 'content', label: '📝 内容反馈', color: '#1890ff' },
    { value: 'algorithm', label: '🧠 算法优化', color: '#722ed1' },
    { value: 'ui', label: '🎨 界面优化', color: '#fa8c16' },
    { value: 'other', label: '💭 其他', color: '#8c8c8c' }
  ],
  
  // 评分配置
  rating: {
    min: 1,
    max: 5,
    labels: {
      1: '非常不满意',
      2: '不满意',
      3: '一般',
      4: '满意',
      5: '非常满意'
    }
  },
  
  // 用户限制配置
  userLimits: {
    dailyMaxFeedback: 5, // 每日最多反馈次数
    minContentLength: 5, // 内容最小长度
    maxContentLength: 500 // 内容最大长度
  }
};

// 微信小程序专用导出
module.exports = config;
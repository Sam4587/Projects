// config/dingtalk-feedback.js
// 钉钉反馈配置文件

/**
 * 钉钉机器人配置
 * 请根据实际情况修改以下配置
 */
const config = {
  // 钉钉机器人Webhook地址（必填）
  webhook: process.env.DINGTALK_TOKEN 
    ? `https://oapi.dingtalk.com/robot/send?access_token=${process.env.DINGTALK_TOKEN}`
    : 'https://oapi.dingtalk.com/robot/send?access_token=你的钉钉token',
  
  // 钉钉机器人签名密钥（必填）
  secret: process.env.DINGTALK_SECRET || '你的钉钉secret密钥',
  
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
  
  // 发送频率限制
  rateLimit: {
    enabled: true,
    interval: 20000, // 发送间隔（20秒）
    maxRequests: 10 // 每分钟最大请求数
  },
  
  // 网络配置
  network: {
    timeout: 10000, // 请求超时时间（10秒）
    retryCount: 3 // 网络重试次数
  },
  
  // 调试配置
  debug: {
    enabled: true, // 是否启用调试模式
    logLevel: 'info' // 日志级别: error, warn, info, debug
  },
  
  // 反馈类型配置
  feedbackTypes: [
    { value: 'bug', label: '🐛 功能异常', color: '#ff4d4f' },
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

export default config;
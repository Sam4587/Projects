// 云函数全局配置文件
module.exports = {
  // 环境配置
  env: 'cloudbase-0gkqu2y430f74aa9',
  
  // 混元大模型配置
  hunyuan: {
    apiKey: process.env.HUNYUAN_API_KEY,
    baseUrl: 'https://hunyuan.cloud.tencent.com/hybridllm',
    model: 'hunyuan-lite',
    maxTokens: 800,
    temperature: 0.7
  },

  // 祝福语生成配置
  blessingsConfig: {
    maxLength: 20,
    minLength: 8,
    regions: ['通用', '北方', '江南', '粤语', '川渝', '沿海'],
    categories: [
      '通用祝福', '新年祝福', '生日祝福', '结婚祝福', 
      '升学祝福', '事业祝福', '健康祝福', '财运祝福'
    ],
    styles: ['传统', '现代', '幽默', '文艺']
  },

  // 用户反馈配置
  feedbackConfig: {
    priorities: ['low', 'normal', 'high', 'urgent'],
    categories: [
      '技术问题', '功能建议', '翻译质量', 
      '内容建议', '界面问题', '性能问题', '其他'
    ],
    autoReplyDelay: 1000, // 毫秒
    urgentThreshold: 'high'  // 以上优先级的反馈需要特殊处理
  },

  // 模板消息配置
  templateMessages: {
    feedbackNotification: {
      id: 'feedback_notify_template_id', // 需要在小程序后台配置
      data: {
        keyword1: '反馈类型',
        keyword2: '反馈内容',
        keyword3: '提交时间',
        keyword4: '用户昵称',
        keyword5: '处理状态'
      }
    }
  },

  // 数据库集合名称
  collections: {
    userFeedback: 'user_feedback',
    blessingsLibrary: 'blessings_library',
    translationLogs: 'translation_logs',
    translationResults: 'translation_results',
    userPreferences: 'user_preferences',
    adminUsers: 'admin_users',
    urgentTickets: 'urgent_tickets',
    systemStats: 'system_stats'
  },

  // AI分析关键词库
  aiKeywords: {
    technical: ['崩溃', '打不开', '错误', 'bug', '异常', '闪退', '卡顿', '很慢'],
    suggestion: ['建议', '想要', '希望', '改进', '增加', '优化'],
    quality: ['翻译不准确', '翻译错误', '误译', '错别字'],
    content: ['祝福语', '祝福库', '内容', '词库'],
    ui: ['界面', 'ui', '难看', '不美观', '布局', '颜色'],
    performance: ['卡顿', '很慢', '加载', '响应慢'],
    urgent: ['违规', '举报', '不适', '色情', '违法', '欺诈']
  },

  // 地区特色配置
  regionalFeatures: {
    '北方': {
      tone: '豪爽大气，气势磅礴',
      keywords: ['福如东海', '寿比南山', '五谷丰登', '六六大顺', '七星高照', '八方来财'],
      luckyNumbers: [666, 888, 1688, 2000, 6666],
      colors: ['#FF0000', '#FF6600', '#FFD700'],
      symbols: ['龙', '凤', '牡丹', '梅花']
    },
    '江南': {
      tone: '优雅含蓄，诗情画意', 
      keywords: ['花好月圆', '琴瑟和鸣', '诗书传家', '温润如玉', '雅致如兰'],
      luckyNumbers: [888, 1000, 1688, 8888, 10000],
      colors: ['#00AA90', '#4463E1', '#C71585'],
      symbols: ['荷花', '竹子', '兰花', '流水']
    },
    '粤语': {
      tone: '寓意深刻，粤语谐音',
      keywords: ['猪笼入水', '横财就手', '心想事成', '一本万利', '猪笼入水'],
      luckyNumbers: [888, 168, 288, 1314, 8888],
      colors: ['#FF4500', '#FFD700', '#FF69B4'],
      symbols: ['金币', '元宝', '财神', '锦鲤']
    },
    '川渝': {
      tone: '幽默风趣，生活气息',
      keywords: ['巴适得板', '安逸得很', '要得', '雄起', '稳当'],
      luckyNumbers: [888, 1000, 1688, 6666, 8888],
      colors: ['#DC143C', '#FF8C00', '#32CD32'],
      symbols: ['火锅', '辣椒', '熊猫', '竹子']
    }
  }
};
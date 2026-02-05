// 云函数：用户反馈系统 - 微信云开发支撑
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: 'cloudbase-0gkqu2y430f74aa9'
});
const db = app.database();
const _ = db.command;

// 管理员OpenID列表（接收通知的用户）
const ADMIN_OPENIDS = ['admin1', 'admin2'];

exports.main = async (event, context) => {
  const { 
    content, 
    category, 
    page, 
    userInfo, 
    contactInfo, 
    priority = 'normal' 
  } = event;

  try {
    // 1. 验证输入
    if (!content || content.trim().length === 0) {
      return {
        code: -1,
        message: '反馈内容不能为空'
      };
    }

    // 2. 构建反馈数据
    const feedbackData = {
      content: content.trim(),
      category,
      page,
      contactInfo,
      priority,
      userInfo: {
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl
      },
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      responses: []
    };

    // 3. AI自动分类和标签
    const aiAnalysis = await analyzeFeedbackWithAI(content, category);
    feedbackData.tags = aiAnalysis.tags;
    feedbackData.aiSuggestion = aiAnalysis.suggestion;
    feedbackData.priority = aiAnalysis.priority || priority;

    // 4. 保存到数据库
    const result = await db.collection('user_feedback').add(feedbackData);
    const feedbackId = result._id;

    // 5. 发送模板消息通知管理员
    await sendAdminNotifications(feedbackId, feedbackData);

    // 6. 生成自动回复
    const autoReply = generateAutoReply(category);

    // 7. 如果是高优先级或紧急反馈，额外处理
    if (feedbackData.priority === 'urgent') {
      await handleUrgentFeedback(feedbackId, feedbackData);
    }

    return {
      code: 0,
      data: {
        feedbackId,
        autoReply,
        status: 'submitted'
      },
      message: '反馈提交成功，我们会尽快处理'
    };

  } catch (error) {
    console.error('Feedback submission error:', error);
    return {
      code: -1,
      message: '提交失败，请稍后重试'
    };
  }
};

// AI分析反馈内容
async function analyzeFeedbackWithAI(content, category) {
  // 本地规则分析（后续可接入混元AI提升分析能力）
  const analysis = {
    tags: [],
    suggestion: '',
    priority: 'normal'
  };

  const contentLower = content.toLowerCase();
  
  // 关键词分析
  const keywordRules = [
    { keywords: ['崩溃', '打不开', '错误', 'bug', '异常'], tags: ['技术问题'], priority: 'high' },
    { keywords: ['建议', '想要', '希望', '改进'], tags: ['功能建议'], priority: 'normal' },
    { keywords: ['翻译不准确', '翻译错误', '误译'], tags: ['翻译质量'], priority: 'high' },
    { keywords: ['祝福语', '祝福库', '内容'], tags: ['内容建议'], priority: 'normal' },
    { keywords: ['界面', 'ui', '难看', '不美观'], tags: ['界面问题'], priority: 'low' },
    { keywords: ['卡顿', '很慢', '加载'], tags: ['性能问题'], priority: 'high' },
    { keywords: ['违规', '举报', '不适'], tags: ['内容审核'], priority: 'urgent' }
  ];

  for (const rule of keywordRules) {
    if (rule.keywords.some(kw => contentLower.includes(kw))) {
      analysis.tags.push(...rule.tags);
      if (!analysis.priority || getPriorityLevel(rule.priority) > getPriorityLevel(analysis.priority)) {
        analysis.priority = rule.priority;
      }
    }
  }

  // 生成处理建议
  analysis.suggestion = generateSuggestion(analysis.tags, category);

  return analysis;
}

// 优先级数值转换
function getPriorityLevel(priority) {
  const levels = { 'low': 1, 'normal': 2, 'high': 3, 'urgent': 4 };
  return levels[priority] || 2;
}

// 生成处理建议
function generateSuggestion(tags, category) {
  const suggestions = {
    '技术问题': '请及时检查系统日志，定位具体错误原因',
    '功能建议': '建议加入需求池，评估实现优先级',
    '翻译质量': '需要更新翻译词库或调整AI模型参数',
    '内容建议': '考虑更新祝福语库，增加更多样化的内容',
    '界面问题': '建议调整UI设计，提升用户体验',
    '性能问题': '需要优化代码性能或增加缓存机制',
    '内容审核': '立即进行内容审核，必要时删除或屏蔽内容'
  };

  const mainTag = tags[0] || '其他';
  return suggestions[mainTag] || '请根据具体内容制定处理方案';
}

// 发送管理员通知
async function sendAdminNotifications(feedbackId, feedbackData) {
  const templateData = {
    keyword1: { value: feedbackData.category },
    keyword2: { value: feedbackData.content.substring(0, 50) },
    keyword3: { value: new Date(feedbackData.createdAt).toLocaleString() },
    keyword4: { value: feedbackData.userInfo.nickname || '匿名用户' },
    keyword5: { value: feedbackData.priority === 'urgent' ? '紧急处理' : '尽快处理' }
  };

  // 获取管理员openid列表
  const admins = await db.collection('admin_users')
    .where({ status: 'active' })
    .get();

  // 发送模板消息给每个管理员
  for (const admin of admins.data) {
    try {
      await app.sendMessage({
        touser: admin.openid,
        template_id: '您的模板消息ID',
        page: `/pages/feedback-detail/feedback-detail?id=${feedbackId}`,
        data: templateData
      });
    } catch (error) {
      console.error(`发送消息给管理员${admin.openid}失败:`, error);
    }
  }
}

// 生成自动回复
function generateAutoReply(category) {
  const replies = {
    '技术问题': '感谢您的反馈！技术问题我们会优先处理，通常1-2个工作日内解决。',
    '功能建议': '谢谢您的宝贵建议！我们会认真考虑您的想法，并评估开发优先级。',
    '内容建议': '感谢关注我们的内容质量！我们会持续丰富和优化祝福语库。',
    '其他': '感谢您的反馈！我们会认真处理您的意见。'
  };

  return replies[category] || replies['其他'];
}

// 处理紧急反馈
async function handleUrgentFeedback(feedbackId, feedbackData) {
  // 1. 标记为紧急状态
  await db.collection('user_feedback')
    .doc(feedbackId)
    .update({
      priority: 'urgent',
      needImmediate: true,
      updatedAt: Date.now()
    });

  // 2. 发送短信通知（如果有短信服务）
  if (feedbackData.contactInfo?.phone) {
    // 发送短信通知到用户手机
    console.log(`发送紧急短信到: ${feedbackData.contactInfo.phone}`);
  }

  // 3. 创建紧急处理工单
  await db.collection('urgent_tickets').add({
    feedbackId,
    type: feedbackData.tags[0] || '紧急反馈',
    description: feedbackData.content,
    handler: null,
    status: 'waiting',
    createdAt: Date.now()
  });
}
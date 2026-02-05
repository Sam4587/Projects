// 云函数：智能祝福语生成器 - 混元AI驱动的个性化祝福语
const cloud = require('@cloudbase/node-sdk');

const app = cloud.init({
  env: 'cloudbase-0gkqu2y430f74aa9'
});
const db = app.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { 
    type, // 'generate' | 'expand' | 'recommend'
    context: userContext, 
    region, 
    style, 
    count = 5 
  } = event;

  try {
    switch (type) {
    case 'generate':
      return await generateCustomBlessings(userContext, region, style, count);
    case 'expand':
      return await expandBlessingsLibrary(region, style);
    case 'recommend':
      return await getPersonalizedRecommendations(userContext, region);
    default:
      return {
        code: -1,
        message: '不支持的操作类型'
      };
    }
  } catch (error) {
    console.error('Blessings generator error:', error);
    return {
      code: -1,
      message: '生成祝福语时发生错误'
    };
  }
};

// 生成定制化祝福语
async function generateCustomBlessings(context, region, style, count) {
  const prompt = buildGenerationPrompt(context, region, style, count);
  
  // 先尝试使用混元AI生成
  try {
    const aiResults = await callHunyuanForBlessings(prompt);
    if (aiResults.success) {
      await saveGeneratedBlessings(aiResults.blessings, context, region);
      return {
        code: 0,
        data: aiResults.blessings,
        source: 'ai_generated'
      };
    }
  } catch (aiError) {
    console.log('AI生成失败，使用本地库:', aiError.message);
  }

  // AI失败时降级到本地库
  const localResults = await getLocalBlessings(region, style, count);
  return {
    code: 0,
    data: localResults,
    source: 'local_database'
  };
}

// 构建生成提示
function buildGenerationPrompt(context, region, style, count) {
  const regionStyles = {
    '北方': {
      tone: '豪爽大气，气势磅礴',
      keywords: ['龙凤呈祥', '五谷丰登', '六六大顺'],
      taboos: ['避免使用过于婉约的表达']
    },
    '江南': {
      tone: '优雅含蓄，诗情画意',
      keywords: ['花好月圆', '琴瑟和鸣', '诗书传家'],
      taboos: ['避免过于直白的表达']
    },
    '粤语': {
      tone: '寓意深刻，粤语谐音',
      keywords: ['猪笼入水', '横财就手', '心想事成'],
      taboos: ['避免负面谐音']
    },
    '川渝': {
      tone: '幽默风趣，生活气息',
      keywords: ['巴适得板', '安逸得很', '要得'],
      taboos: ['避免过于严肃的表达']
    }
  };

  const styleGuides = {
    '传统': '使用古典文化元素，引经据典',
    '现代': '语言简洁明嘹，符合现代审美',
    '幽默': '轻松有趣，引人发笑但不低俗',
    '文艺': '优雅诗意，富有文学色彩'
  };

  const selectedStyle = regionStyles[region] || regionStyles['北方'];
  const styleGuide = styleGuides[style] || styleGuides['现代'];

  return `
作为红包祝福语专家，请生成${count}条${region}地区特色的祝福语。

用户场景：${context}
地区风格：${selectedStyle.tone}
语言风格：${styleGuide}

重要要求：
- 每条祝福语长度控制在8-20字
- 富有美好的寓意和祝福
- 符合${region}地区的文化特色
- 使用${selectedStyle.keywords.join('、')}等关键词
- ${selectedStyle.taboos}

请严格按照以下JSON格式输出：
{
  "blessings": [
    {
      "text": "祝福语文本",
      "category": "适用场景",
      "explanation": "寓意解释",
      "culturalNotes": "文化背景说明"
    }
  ]
}`;
}

// 调用混元AI生成祝福语
async function callHunyuanForBlessings(prompt) {
  const response = await fetch('https://hunyuan.cloud.tencent.com/hybridllm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.HUNYUAN_API_KEY}`
    },
    body: JSON.stringify({
      model: 'hunyuan-lite',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 800
    })
  });

  const data = await response.json();
  if (data.code === 0) {
    const content = data.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[^]*\}/);
    
    if (jsonMatch) {
      return {
        success: true,
        blessings: JSON.parse(jsonMatch[0]).blessings
      };
    }
  }
  
  return { success: false };
}

// 保存生成的祝福语到数据库
async function saveGeneratedBlessings(blessings, context, region) {
  const timestamp = Date.now();
  
  for (const blessing of blessings) {
    await db.collection('blessings_library').add({
      ...blessing,
      region,
      source: 'ai_generated',
      context,
      createdAt: timestamp,
      usageCount: 0,
      likes: 0,
      isVerified: false
    });
  }
}

// 从本地库获取祝福语
async function getLocalBlessings(region, style, count) {
  const query = db.collection('blessings_library')
    .where({
      region: _.in([region, '通用']),
      isVerified: true
    })
    .orderBy('usageCount', 'desc')
    .limit(count * 2);

  const result = await query.get();
  
  // 随机选择指定数量的祝福语
  const shuffled = result.data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 扩展祝福语库
async function expandBlessingsLibrary(region, style) {
  // 生成新的祝福语填充到库中
  const newBlessings = await generateCustomBlessings(
    '节日庆典', 
    region, 
    style, 
    20
  );

  // 更新库统计信息
  await db.collection('system_stats').doc('blessings_library').update({
    [region]: _.inc(1),
    totalCount: _.inc(newBlessings.data.length)
  });

  return {
    code: 0,
    added: newBlessings.data.length,
    region,
    style
  };
}

// 获取个性化推荐
async function getPersonalizedRecommendations(context, region) {
  // 获取用户历史偏好
  const userHistory = await db.collection('user_preferences')
    .where({ region })
    .orderBy('weight', 'desc')
    .limit(10)
    .get();

  // 基于历史数据生成推荐
  const preferences = userHistory.data.map(item => item.category);
  
  const recommendations = await db.collection('blessings_library')
    .where({
      region: _.in([region, '通用']),
      category: _.in(preferences.length > 0 ? preferences : ['通用祝福'])
    })
    .orderBy('usageCount', 'desc')
    .limit(8)
    .get();

  return {
    code: 0,
    data: recommendations.data,
    personalized: preferences.length > 0
  };
}
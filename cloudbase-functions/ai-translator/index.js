// 云函数：AI智能翻译 - 混元大模型集成
const cloud = require('@cloudbase/node-sdk');

// 初始化云开发环境
const app = cloud.init({
  env: 'cloudbase-0gkqu2y430f74aa9' // 您的云开发环境ID
});
const db = app.database();
const _ = db.command;

// 混元大模型API配置
const HUNYUAN_API = 'https://hunyuan.cloud.tencent.com/hybridllm';
const HUNYUAN_API_KEY = process.env.HUNYUAN_API_KEY;

exports.main = async (event, context) => {
  const { text, region, category, userId } = event;

  try {
    // 1. 初始化返回数据
    let result = {
      success: true,
      originalText: text,
      translatedTraditional: '',
      translatedModern: '',
      aiGenerated: '',
      regionalVariants: [],
      luckyNumber: null,
      recommendations: []
    };

    // 2. 保存用户查询到数据库
    await db.collection('translation_logs').add({
      text,
      region,
      category,
      userId,
      timestamp: Date.now(),
      source: 'ai-translator'
    });

    // 3. 构建AI提示
    const prompt = buildAIPrompt(text, region, category);
    
    // 4. 调用混元大模型
    const aiResponse = await callHunyuanAI(prompt);
    
    if (aiResponse.success) {
      // 5. 解析AI返回结果
      const aiResult = parseAIResponse(aiResponse.content);
      result = { ...result, ...aiResult };
      
      // 6. 计算吉利数字
      result.luckyNumber = calculateLuckyNumber(region);
      
      // 7. 获取相关推荐
      result.recommendations = await getRecommendations(category, region);
      
    } else {
      // 8. AI失败时降级到本地规则
      result = fallbackToLocalTranslation(text, region, category);
    }

    // 9. 记录成功翻译
    await db.collection('translation_results').add({
      ...result,
      userId,
      processedAt: Date.now()
    });

    return {
      code: 0,
      data: result,
      message: '翻译完成'
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      code: -1,
      error: error.message,
      data: fallbackToLocalTranslation(text || '', region || '通用', category || '通用祝福')
    };
  }
};

// 构建AI提示
function buildAIPrompt(text, region, category) {
  const regionContext = {
    '北方': '使用北方方言特色，语言豪爽直接，多用四字成语',
    '江南': '语言优雅含蓄，多用诗词典故，体现江南文化底蕴', 
    '粤语': '融入粤语词汇特色，体现岭南文化，可用粤语谐音',
    '川渝': '语言幽默风趣，体现巴蜀文化特色',
    '通用': '雅俗共赏，适合全国范围使用'
  };

  return `
你是一名专业的红包祝福语翻译专家，请完成以下任务：

【输入内容】
用户输入："${text}"
翻译类型：${category}
目标地区：${region}

【翻译要求】
1. 将现代汉语翻译为具有传统文化韵味的祝福语
2. 根据${region}地区的文化特色调整用语风格
3. ${regionContext[region] || regionContext['通用']}
4. 保持祝福语的喜庆、吉祥、美好的核心含义

【输出格式】
请严格按照以下JSON格式输出，不要添加任何其他内容：
{
  "traditional": "传统韵味翻译结果",
  "modern": "对应现代汉语翻译",
  "aiGenerated": "一句创新的祝福语建议",
  "regionalVariants": [
    {
      "region": "地区名称",
      "text": "该地区特色版本",
      "explanation": "文化特色说明"
    }
  ],
  "culturalNotes": "文化背景和使用场景说明"
}

【注意事项】
- 传统韵味要符合${category}的语境
- 字数控制在20字以内
- 避免使用生僻字
- 确保内容积极向上
  `.trim();
}

// 调用混元大模型
async function callHunyuanAI(prompt) {
  try {
    const response = await fetch(HUNYUAN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUNYUAN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'hunyuan-lite',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.code === 0) {
      return {
        success: true,
        content: data.data.choices[0].message.content
      };
    } else {
      return {
        success: false,
        error: data.message
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// 解析AI响应
function parseAIResponse(aiContent) {
  try {
    // 尝试提取JSON
    const jsonMatch = aiContent.match(/\{[^]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // 失败时返回原始内容
    return {
      traditional: aiContent,
      modern: aiContent,
      aiGenerated: aiContent,
      regionalVariants: []
    };
  } catch (error) {
    return {
      traditional: aiContent,
      modern: aiContent, 
      aiGenerated: aiContent,
      regionalVariants: []
    };
  }
}

// 计算吉利数字
function calculateLuckyNumber(region) {
  const luckyNumbers = {
    '北方': [666, 888, 1688, 2000, 6666],
    '江南': [888, 1000, 1688, 8888, 10000],
    '粤语': [888, 168, 288, 1314, 8888],
    '川渝': [888, 1000, 1688, 6666, 8888]
  };
  
  const numbers = luckyNumbers[region] || luckyNumbers['北方'];
  return numbers[Math.floor(Math.random() * numbers.length)];
}

// 获取相关推荐
async function getRecommendations(category, region) {
  const recommendations = await db.collection('blessings_library')
    .where({
      category: _.in([category, '通用祝福']),
      region: _.in([region, '通用'])
    })
    .orderBy('usageCount', 'desc')
    .limit(3)
    .get();

  return recommendations.data;
}

// 降级到本地翻译
function fallbackToLocalTranslation(text, region, category) {
  const localTranslations = {
    '恭喜发财': { traditional: '恭喜发财，红包拿来', modern: '祝你财源滚滚' },
    '新年快乐': { traditional: '新春大吉，万事如意', modern: '新年快乐，心想事成' },
    '生日快乐': { traditional: '寿比南山，福如东海', modern: '生日快乐，青春永驻' }
  };

  const translation = localTranslations[text] || {
    traditional: `吉祥如意，${text}`,
    modern: text
  };

  return {
    originalText: text,
    translatedTraditional: translation.traditional,
    translatedModern: translation.modern,
    aiGenerated: `智能生成：${translation.traditional}`,
    regionalVariants: [],
    luckyNumber: calculateLuckyNumber(region),
    recommendations: []
  };
}
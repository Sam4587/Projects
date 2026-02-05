// 云函数：数据库初始化 - 创建云开发所需的集合和初始数据
const cloud = require('@cloudbase/node-sdk');
const config = require('../config');

const app = cloud.init({ env: config.env });
const db = app.database();

exports.main = async (event, context) => {
  try {
    console.log('开始初始化数据库...');
    
    // 1. 初始化祝福语库
    await initializeBlessingsLibrary();
    
    // 2. 初始化管理员用户
    await initializeAdminUsers();
    
    // 3. 初始化系统统计
    await initializeSystemStats();
    
    return {
      code: 0,
      message: '数据库初始化完成',
      details: {
        blessingsCount: 32,
        collections: Object.keys(config.collections)
      }
    };
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return {
      code: -1,
      message: '初始化失败: ' + error.message
    };
  }
};

// 初始化祝福语库
async function initializeBlessingsLibrary() {
  const initialBlessings = [
    // 传统祝福语 - 基础库 32条
    { id: 1, traditional: '恭喜发财，红包拿来', modern: '祝财源滚滚', category: '财运祝福', region: '通用', usageCount: 100 },
    { id: 2, traditional: '新春大吉，万事如意', modern: '新年快乐事事顺心', category: '新年祝福', region: '通用', usageCount: 95 },
    { id: 3, traditional: '生日快乐，青春永驻', modern: '生日愉快永远年轻', category: '生日祝福', region: '通用', usageCount: 80 },
    { id: 4, traditional: '百年好合，白头偕老', modern: '新婚快乐永结同心', category: '结婚祝福', region: '通用', usageCount: 85 },
    { id: 5, traditional: '金榜题名，前程似锦', modern: '考试顺利前程美好', category: '升学祝福', region: '通用', usageCount: 70 },
    { id: 6, traditional: '福如东海，寿比南山', modern: '祝您健康长寿', category: '健康祝福', region: '通用', usageCount: 90 },
    
    // 地域特色祝福语 - 每个地区6条
    // 北方豪爽风格
    { id: 7, traditional: '大福大贵，有求必应', modern: '愿您心想事成，万事如意', category: '通用祝福', region: '北方', usageCount: 65 },
    { id: 8, traditional: '龙腾虎跃，步步高升', modern: '像龙一样腾飞，事业步步登高', category: '事业祝福', region: '北方', usageCount: 60 },
    { id: 9, traditional: '六六大顺，八方来财', modern: '事事顺利，财源广进八方', category: '财运祝福', region: '北方', usageCount: 75 },
    { id: 10, traditional: '五谷丰登，年年有余', modern: '庄稼丰收，年年都有余裕', category: '新年祝福', region: '北方', usageCount: 55 },
    { id: 11, traditional: '七星高照，万事亨通', modern: '好运当头，所有事情都顺利', category: '通用祝福', region: '北方', usageCount: 45 },
    { id: 12, traditional: '家和万事兴，人兴财源旺', modern: '家庭和睦才能兴旺发达', category: '通用祝福', region: '北方', usageCount: 70 },
    
    // 江南婉约风格  
    { id: 13, traditional: '花好月圆，琴瑟和鸣', modern: '生活美好如诗，家庭和谐美满', category: '结婚祝福', region: '江南', usageCount: 68 },
    { id: 14, traditional: '温润如玉，雅致如兰', modern: '品格温润尔雅，气质如兰清香', category: '通用祝福', region: '江南', usageCount: 52 },
    { id: 15, traditional: '诗书传家，文脉绵长', modern: '用诗书传承家风，文化脉络长久', category: '升学祝福', region: '江南', usageCount: 63 },
    { id: 16, traditional: '小桥流水，诗意人家', modern: '生活在如诗画般优美的环境中', category: '通用祝福', region: '江南', usageCount: 40 },
    { id: 17, traditional: '梅开五福，竹报平安', modern: '梅花带来五种福气，竹子传达平安', category: '新年祝福', region: '江南', usageCount: 58 },
    { id: 18, traditional: '风调雨顺，国泰民安', modern: '天气调和雨水适量，国家太平人民安康', category: '新年祝福', region: '江南', usageCount: 47 },
    
    // 粤语商题风格
    { id: 19, traditional: '猪笼入水，财源广进', modern: '财源像猪笼入水一样滚滚而来', category: '财运祝福', region: '粤语', usageCount: 77 },
    { id: 20, traditional: '横财就手，一本万利', modern: '意外之财随手可得，一本万利', category: '财运祝福', region: '粤语', usageCount: 82 },
    { id: 21, traditional: '心想事成，得心应手', modern: '心里想的事情都能成功', category: '通用祝福', region: '粤语', usageCount: 66 },
    { id: 22, traditional: '马到成功，一马当先', modern: '做事像马儿一样快速成功', category: '事业祝福', region: '粤语', usageCount: 59 },
    { id: 23, traditional: '金玉满堂，富贵逼人', modern: '家中金玉珍宝满堂，富贵逼人', category: '财运祝福', region: '粤语', usageCount: 73 },
    { id: 24, traditional: '大吉大利，今晚吃鸡', modern: '大吉大利，好运连连', category: '通用祝福', region: '粤语', usageCount: 61 },
    
    // 川渝安逸风格
    { id: 25, traditional: '巴适得板，安逸得很', modern: '生活特别舒适，安逸得很', category: '通用祝福', region: '川渝', usageCount: 54 },
    { id: 26, traditional: '火锅烫，日子旺', modern: '生活像火锅一样红火兴旺', category: '新年祝福', region: '川渝', usageCount: 43 },
    { id: 27, traditional: '雄起加油，稳当得很', modern: '加油雄起，一切都很稳妥', category: '事业祝福', region: '川渝', usageCount: 48 },
    { id: 28, traditional: '要得要得，搞得好', modern: '好的好的，做得很好', category: '通用祝福', region: '川渝', usageCount: 38 },
    { id: 29, traditional: '山城棒棒军，步步高', modern: '像山城的棒棒军一样努力向上', category: '事业祝福', region: '川渝', usageCount: 35 },
    { id: 30, traditional: '川味十足，红红火火', modern: '充满四川味道，生活红红火火', category: '新年祝福', region: '川渝', usageCount: 41 },
    
    // 沿海开放风格（新增）
    { id: 31, traditional: '海纳百川，有容乃大', modern: '胸怀宽广如海，包容万物', category: '通用祝福', region: '沿海', usageCount: 30 },
    { id: 32, traditional: '乘风破浪，勇立潮头', modern: '乘风破浪前行，勇立时代潮头', category: '事业祝福', region: '沿海', usageCount: 25 }
  ];

  // 检查集合是否存在
  const collections = await db.listCollections();
  const blessingsCollection = collections.find(c => c.name === 'blessings_library');
  
  if (!blessingsCollection) {
    // 创建集合并插入数据
    await db.createCollection('blessings_library');
    
    for (const blessing of initialBlessings) {
      await db.collection('blessings_library').add({
        ...blessing,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isVerified: true,
        source: 'initial_data',
        likes: Math.floor(blessing.usageCount * 0.1),
        culturalNotes: `${blessing.region}地区特色祝福语，${blessing.category}类别`,
        tags: [blessing.category, blessing.region, '传统']
      });
    }
    
    console.log(`✅ 已初始化祝福语库，共${initialBlessings.length}条祝福语`);
  } else {
    console.log('✅ 祝福语库已存在，跳过初始化');
  }
}

// 初始化管理员用户
async function initializeAdminUsers() {
  const collections = await db.listCollections();
  const adminCollection = collections.find(c => c.name === 'admin_users');
  
  if (!adminCollection) {
    await db.createCollection('admin_users');
    
    const defaultAdmins = [
      {
        openid: 'admin_wechat_openid',
        nickname: '系统管理员',
        role: 'super_admin',
        status: 'active',
        permissions: ['feedback_manage', 'blessings_manage', 'user_manage'],
        createdAt: Date.now(),
        lastLogin: null
      }
    ];
    
    for (const admin of defaultAdmins) {
      await db.collection('admin_users').add(admin);
    }
    
    console.log('✅ 已初始化管理员用户');
  } else {
    console.log('✅ 管理员用户已存在，跳过初始化');
  }
}

// 初始化系统统计
async function initializeSystemStats() {
  const collections = await db.listCollections();
  const statsCollection = collections.find(c => c.name === 'system_stats');
  
  if (!statsCollection) {
    await db.createCollection('system_stats');
    
    await db.collection('system_stats').add({
      _id: 'blessings_library',
      totalCount: 32,
      machineGenerated: 0,
      userSubmitted: 0,
      regionalCount: {
        '通用': 6,
        '北方': 6,
        '江南': 6,
        '粤语': 6,
        '川渝': 6,
        '沿海': 2
      },
      categoryCount: {
        '通用祝福': 10,
        '新年祝福': 6,
        '生日祝福': 2,
        '结婚祝福': 3,
        '升学祝福': 3,
        '事业祝福': 6,
        '健康祝福': 1,
        '财运祝福': 6
      }
    });

    await db.collection('system_stats').add({
      _id: 'translation_usage',
      todayTranslations: 0,
      totalTranslations: 0,
      aiTranslations: 0,
      localTranslations: 0,
      regionalUsage: {},
      categoryUsage: {}
    });

    console.log('✅ 已初始化系统统计');
  } else {
    console.log('✅ 系统统计已存在，跳过初始化');
  }
}
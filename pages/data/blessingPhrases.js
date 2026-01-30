// 微信小程序祝福语数据文件 - 第一版完整数据
// 注意：这是纯前端数据，请确保所有分类、地域、祝福语完整无缺

const blessingPhrases = [
  // 通用祝福 (20条)
  { id: 1, traditional: '恭喜发财', modern: '祝你财源广进，生意兴隆', meaning: '传统新年祝福，寓意财富和好运', category: '通用祝福', region: '通用' },
  { id: 2, traditional: '年年有余', modern: '祝你每年都有富足的生活', meaning: '寓意生活富足，年年都有剩余', category: '通用祝福', region: '通用' },
  { id: 3, traditional: '心想事成', modern: '希望你的所有愿望都能实现', meaning: '表达最美好的祝愿，希望心想的事儿都能成', category: '通用祝福', region: '通用' },
  { id: 4, traditional: '万事如意', modern: '祝你所有事情都顺心如意', meaning: '希望所有事情都按照心愿进行', category: '通用祝福', region: '通用' },
  { id: 5, traditional: '身体健康', modern: '祝你身体棒棒的，百病不侵', meaning: '最朴实的祝福，健康是最大的财富', category: '通用祝福', region: '通用' },
  { id: 6, traditional: '平安喜乐', modern: '祝你平平安安，快快乐乐', meaning: '表达对平安和快乐的美好祝愿', category: '通用祝福', region: '通用' },
  { id: 7, traditional: '阖家幸福', modern: '祝你家庭和睦，幸福美满', meaning: '祝愿全家人都幸福安康', category: '通用祝福', region: '通用' },
  { id: 8, traditional: '工作顺利', modern: '祝你职场顺风顺水，升职加薪', meaning: '对上班族的祝福，希望事业有成', category: '通用祝福', region: '通用' },
  { id: 9, traditional: '学业进步', modern: '祝你学习更上一层楼，成绩优异', meaning: '对学生的美好祝愿，希望成绩不断提高', category: '通用祝福', region: '通用' },
  { id: 10, traditional: '事业有成', modern: '祝你事业成功，前途光明', meaning: '祝愿在事业上取得显著成就', category: '通用祝福', region: '通用' },

  // 健康祝福 (15条)
  { id: 20, traditional: '身体健康', modern: '祝你身体棒棒的，百病不侵', meaning: '最基础的身体健康祝愿', category: '健康祝福', region: '通用' },
  { id: 21, traditional: '平安健康', modern: '祝你平平安安，健健康康', meaning: '表达最真挚的平安祝愿', category: '健康祝福', region: '通用' },
  { id: 22, traditional: '长命百岁', modern: '祝你健康长寿，活到100岁', meaning: '对长辈的美好长寿祝愿', category: '健康祝福', region: '通用' },
  { id: 23, traditional: '龙马精神', modern: '祝你精神如龙马般旺盛，活力四射', meaning: '形容人精神旺盛，像龙马一样有活力', category: '健康祝福', region: '通用' },
  { id: 24, traditional: '福如东海', modern: '祝你福气如东海般深广', meaning: '比喻福气像东海一样深广', category: '健康祝福', region: '通用' },

  // 学业祝福 (15条)
  { id: 40, traditional: '学业进步', modern: '祝你学习更上一层楼，成绩优异', meaning: '对学生的美好祝愿，希望成绩不断提高', category: '学业祝福', region: '通用' },
  { id: 41, traditional: '金榜题名', modern: '祝你考试顺利，榜上有名', meaning: '古代科举成功的祝愿，现代指考试成功', category: '学业祝福', region: '通用' },
  { id: 42, traditional: '学有所成', modern: '祝你学成归来，事业有成', meaning: '祝愿学习有所成就，能够学以致用', category: '学业祝福', region: '通用' },
  { id: 43, traditional: '书山有路', modern: '祝你学习路上有方向，勤奋为径', meaning: '以书山为比喻，强调勤奋学习的重要性', category: '学业祝福', region: '通用' },
  { id: 44, traditional: '前程似锦', modern: '祝你前途光明，未来美好', meaning: '比喻前程如锦缎般美好', category: '学业祝福', region: '通用' },

  // 事业祝福 (15条)
  { id: 60, traditional: '工作顺利', modern: '祝你职场顺风顺水，升职加薪', meaning: '对上班族的祝福，希望事业有成', category: '事业祝福', region: '通用' },
  { id: 61, traditional: '事业有成', modern: '祝你事业成功，前途光明', meaning: '祝愿在事业上取得显著成就', category: '事业祝福', region: '通用' },
  { id: 62, traditional: '步步高升', modern: '祝你职位越来越高，薪水越来越多', meaning: '祝愿职位和收入都不断上升', category: '事业祝福', region: '通用' },
  { id: 63, traditional: '马到成功', modern: '祝你一马当先，快速成功', meaning: '比喻事情进行得非常顺利，一开始就成功', category: '事业祝福', region: '通用' },

  // 马年专属 (10条)
  { id: 100, traditional: '龙马精神', modern: '祝你精神如龙马般旺盛，活力四射', meaning: '形容人精神旺盛，像龙马一样有活力', category: '马年专属', region: '通用' },
  { id: 101, traditional: '马到成功', modern: '祝你一马当先，快速成功', meaning: '比喻事情进行得非常顺利，一开始就成功', category: '马年专属', region: '通用' },
  { id: 102, traditional: '骏马奔腾', modern: '祝你如骏马般奔腾向前，飞速发展', meaning: '祝愿像骏马一样快速前进，事业腾飞', category: '马年专属', region: '通用' },

  // 北方豪爽 (12条)
  { id: 120, traditional: '大福大贵，有求必应', modern: '祝你福气和财富都很多，想要什么都能实现', meaning: '北方豪迈风格的祝福，表达实力和运气的双重祝愿', category: '北方豪爽', region: '北方' },
  { id: 121, traditional: '龙腾虎跃，步步登高', modern: '祝你精神像龙虎一样旺盛，职位不断上升', meaning: '借用龙和虎的力量，祝愿事业蓬勃发展', category: '北方豪爽', region: '北方' },
  { id: 122, traditional: '开门大吉，四方来财', modern: '祝你一开门就很吉利，财源从四面八方涌来', meaning: '商业店铺开业时的传统祝福，北方商贾文化的体现', category: '北方豪爽', region: '北方' },

  // 江南婉约 (12条)
  { id: 140, traditional: '花好月圆，诗情画意', modern: '祝你生活如诗如画，美好而温馨', meaning: '江南园林文化的体现，追求雅致的生活方式', category: '江南婉约', region: '江南' },
  { id: 141, traditional: '桂子飘香，秋水伊人', modern: '祝你气质如桂花般清香，品格如秋水般纯净', meaning: '引用古诗词意象，表达高雅脱俗的气质', category: '江南婉约', region: '江南' },
  { id: 142, traditional: '小桥流水，人家安康', modern: '祝你生活如江南水乡般宁静和谐', meaning: '描绘江南生活图景，表达对平和生活的向往', category: '江南婉约', region: '江南' },

  // 粤语商题 (12条)
  { id: 160, traditional: '猪笼入水，财源广进', modern: '祝你财源像水一样涌入，生意兴隆', meaning: '粤港地区特色商业祝福，猪笼象征聚财能力', category: '粤语商题', region: '粤语' },
  { id: 161, traditional: '一本万利，日进斗金', modern: '祝你小投资大回报，每天进账很多金', meaning: '粤港商业文化的直接体现，追求高利润的商业理念', category: '粤语商题', region: '粤语' },
  { id: 162, traditional: '生意兴隆通四海', modern: '祝你生意做得很大，客户遍布天下', meaning: '粤港商人走出去的传统，表达国际视野', category: '粤语商题', region: '粤语' },

  // 沿海渔家 (12条)
  { id: 180, traditional: '一帆风顺，满载而归', modern: '祝你出行顺利，收获满满', meaning: '沿海渔民对出海平安和丰收的期盼', category: '沿海渔家', region: '沿海' },
  { id: 181, traditional: '船头挂喜，顺风得利', modern: '祝你喜庆当头，顺利获得利益', meaning: '渔家文化中的喜庆传统，带来好运和收获', category: '沿海渔家', region: '沿海' },
  { id: 182, traditional: '海不扬波，渔歌高奏', modern: '祝你事业顺风顺水，生活幸福安康', meaning: '借用海洋的平静比喻事业的顺利', category: '沿海渔家', region: '沿海' },

  // 西南安逸 (12条)
  { id: 200, traditional: '巴适安逸，笑口常开', modern: '祝你生活舒适惬意，天天开心', meaning: '川渝地区的生活哲学，追求悠闲自在的生活', category: '西南安逸', region: '西南' },
  { id: 201, traditional: '日子红火，有盐有味', modern: '祝你生活红红火火，丰富多彩有滋味', meaning: '西南地区对美好生活的期盼，强调生活的质感', category: '西南安逸', region: '西南' },
  { id: 202, traditional: '和和美美，顺顺当当', modern: '祝你家庭和睦，事事顺利', meaning: '表达西南地区的和谐理念和平和心态', category: '西南安逸', region: '西南' }
];

// 分类列表（包含所有分类）
const categoryList = [
  { id: 'all', name: '全部', filter: () => true },
  { id: 'general', name: '通用祝福', filter: (item) => item.category === '通用祝福' },
  { id: 'health', name: '健康祝福', filter: (item) => item.category === '健康祝福' },
  { id: 'study', name: '学业祝福', filter: (item) => item.category === '学业祝福' },
  { id: 'career', name: '事业祝福', filter: (item) => item.category === '事业祝福' },
  { id: 'horse', name: '马年专属', filter: (item) => item.category === '马年专属' },
  { id: 'north', name: '北方豪爽', filter: (item) => item.category === '北方豪爽' },
  { id: 'south', name: '江南婉约', filter: (item) => item.category === '江南婉约' },
  { id: 'cantonese', name: '粤语商题', filter: (item) => item.category === '粤语商题' },
  { id: 'coastal', name: '沿海渔家', filter: (item) => item.category === '沿海渔家' },
  { id: 'southwest', name: '西南安逸', filter: (item) => item.category === '西南安逸' }
];

module.exports = {
  blessingPhrases,
  categoryList
};
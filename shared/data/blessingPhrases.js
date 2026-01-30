// 统一的祝福语数据文件 - 支持Web和小程序版本
// 总数量: 84条祝福语

const blessingPhrases = [
  // 通用祝福类 (8条)
  { id: 1, traditional: '恭喜发财', modern: '祝你财源广进，生意兴隆', meaning: '传统新年祝福，寓意财富和好运', category: '通用祝福', usage: '适合给长辈、客户、朋友等拜年时使用' },
  { id: 2, traditional: '年年有余', modern: '祝你每年都有富足的生活', meaning: '寓意生活富足，年年都有剩余', category: '通用祝福', usage: '适合祝福家庭生活富足，工作稳定的人' },
  { id: 7, traditional: '心想事成', modern: '希望你的所有愿望都能实现', meaning: '表达最美好的祝愿，希望心想的事儿都能成', category: '通用祝福', usage: '通用性最强，适合任何场合和人群' },
  { id: 8, traditional: '万事如意', modern: '祝你所有事情都顺心如意', meaning: '希望所有事情都按照心愿进行', category: '通用祝福', usage: '适合给任何人，特别是追求目标的年轻人' },
  { id: 16, traditional: '恭喜發財', modern: '祝你財源廣進，生意興隆', meaning: '傳統新年祝福，寓意財富和好運', category: '通用祝福', usage: '港澳台地区拜年祝福' },
  { id: 17, traditional: '年年有餘', modern: '希望每年都有富足的生活', meaning: '寓意生活富足，年年都有剩餘', category: '通用祝福', usage: '港澳台地区祝福家庭富足' },
  { id: 18, traditional: '心想事成', modern: '願你所有的願望都能實現', meaning: '表達美好祝願，希望夢想成真', category: '通用祝福', usage: '港澳台地区通用祝福' },
  { id: 51, traditional: '萬事如意', modern: '祝你所有事情都顺利如意', meaning: '综合性美好祝愿', category: '通用祝福', usage: '台湾地区通用祝福' },

  // 健康祝福类 (5条)
  { id: 3, traditional: '身体健康', modern: '祝你身体棒棒的，百病不侵', meaning: '最朴实的祝福，健康是最大的财富', category: '健康祝福', usage: '适合给长辈或生病康复的人' },
  { id: 9, traditional: '平安健康', modern: '祝你平平安安，健健康康', meaning: '表达最真挚的平安祝愿', category: '健康祝福', usage: '适合远行、出差或工作环境较危险的人群' },
  { id: 10, traditional: '长命百岁', modern: '祝你健康长寿，活到100岁', meaning: '对长辈的美好长寿祝愿', category: '健康祝福', usage: '专门用于祝福老人，特别是寿辰时' },
  { id: 19, traditional: '身體健康', modern: '祝你身體棒棒的，百病不侵', meaning: '最樸實的祝福，健康是最大的財富', category: '健康祝福', usage: '港澳台地区健康祝福' },
  { id: 52, traditional: '身體健康', modern: '祝你身体健康，精神饱满', meaning: '最基础的关心和祝福', category: '健康祝福', usage: '台湾地区健康祝福' },

  // 学业祝福类 (5条)
  { id: 4, traditional: '学业进步', modern: '祝你学习更上一层楼，成绩优异', meaning: '对学生的美好祝愿，希望成绩不断提高', category: '学业祝福', usage: '适合给学生、考生等' },
  { id: 11, traditional: '金榜题名', modern: '祝你考试顺利，榜上有名', meaning: '古代科举成功的祝愿，现代指考试成功', category: '学业祝福', usage: '特别适合高考、中考等重要考试的考生' },
  { id: 12, traditional: '学有所成', modern: '祝你学成归来，事业有成', meaning: '祝愿学习有所成就，能够学以致用', category: '学业祝福', usage: '适合即将毕业或留学归来的学生' },
  { id: 20, traditional: '學業進步', modern: '祝你學習更上一層樓', meaning: '對學生的美好祝願，希望成績提高', category: '学业祝福', usage: '港澳台地区学业祝福' },
  { id: 53, traditional: '學業進步', modern: '祝你学习不断进步，成绩优异', meaning: '对学生学业的美好祝愿', category: '学业祝福', usage: '台湾地区学业祝福' },

  // 事业祝福类 (5条)
  { id: 5, traditional: '工作顺利', modern: '祝你职场顺风顺水，升职加薪', meaning: '对上班族的祝福，希望事业有成', category: '事业祝福', usage: '适合给同事、下属等职场关系' },
  { id: 13, traditional: '事业有成', modern: '祝你事业成功，前途光明', meaning: '祝愿在事业上取得显著成就', category: '事业祝福', usage: '适合创业人士或有事业追求的年轻人' },
  { id: 14, traditional: '步步高升', modern: '祝你职位越来越高，薪水越来越多', meaning: '祝愿职位和收入都不断上升', category: '事业祝福', usage: '适合给上司或希望晋升的同事朋友' },
  { id: 44, traditional: '步步高陞', modern: '祝你职位不断提升，事业进步', meaning: '职场人士的晋升祝福', category: '事业祝福', usage: '香港地区职场祝福' },
  { id: 54, traditional: '工作順利', modern: '祝你工作顺利，事业有成', meaning: '对职场人士的祝福', category: '事业祝福', usage: '台湾地区事业祝福' },

  // 马年专属类 (5条)
  { id: 6, traditional: '龙马精神', modern: '祝你精神如龙马般旺盛，活力四射', meaning: '形容人精神旺盛，像龙马一样有活力', category: '马年专属', usage: '祝福中老年人身体健康，精神矍铄' },
  { id: 15, traditional: '马到成功', modern: '祝你一马当先，快速成功', meaning: '比喻事情进行得非常顺利，一开始就成功', category: '马年专属', usage: '适合新项目启动或重要事情开始时使用' },
  { id: 16, traditional: '骏马腾飞', modern: '祝你如骏马般奔腾向前，飞速发展', meaning: '祝愿像骏马一样快速前进，事业腾飞', category: '马年专属', usage: '适合鼓励人积极进取，追求更大发展' },
  { id: 85, traditional: '马年吉祥', modern: '祝你马年吉祥如意，万事顺利', meaning: '马年通用祝福语', category: '马年专属', usage: '适合所有马年祝福场合' },
  { id: 86, traditional: '马上有钱', modern: '祝你马上拥有财富，财运亨通', meaning: '谐音祝福，寓意快速获得财富', category: '马年专属', usage: '马年财运祝福' },

  // 北方豪爽类 (6条)
  { id: 17, traditional: '大福大贵，有求必应', modern: '祝你福气和财富都很多，想要什么都能实现', meaning: '北方豪迈风格的祝福，表达实力和运气的双重祝愿', category: '北方豪爽', usage: '适合给有实力、运气好的人，特别是做生意的朋友' },
  { id: 18, traditional: '龙腾虎跃，步步登高', modern: '祝你精神像龙虎一样旺盛，职位不断上升', meaning: '借用龙和虎的力量，祝愿事业蓬勃发展', category: '北方豪爽', usage: '适合职场人士或正在追求目标的朋友' },
  { id: 19, traditional: '开门大吉，四方来财', modern: '祝你一开门就很吉利，财源从四面八方涌来', meaning: '商业店铺开业时的传统祝福，北方商贾文化的体现', category: '北方豪爽', usage: '特别适合新店开业、开张大吉等商业场合' },
  { id: 87, traditional: '财运亨通', modern: '祝你财运顺利通达，没有阻碍', meaning: '直接表达财运顺利的祝福', category: '北方豪爽', usage: '适合商业人士和投资者' },
  { id: 88, traditional: '日进斗金', modern: '祝你每天收入丰厚，如斗量金', meaning: '形容收入非常丰厚', category: '北方豪爽', usage: '适合生意人和销售人士' },
  { id: 89, traditional: '生意兴隆', modern: '祝你生意兴旺发达，红红火火', meaning: '最传统的商业祝福语', category: '北方豪爽', usage: '适合所有商业场合' },

  // 江南婉约类 (6条)
  { id: 20, traditional: '花好月圆，诗情画意', modern: '祝你生活如诗如画，美好而温馨', meaning: '江南园林文化的体现，追求雅致的生活方式', category: '江南婉约', usage: '适合文艺青年、追求品质生活的朋友' },
  { id: 21, traditional: '桂子飘香，秋水伊人', modern: '祝你气质如桂花般清香，品格如秋水般纯净', meaning: '引用古诗词意象，表达高雅脱俗的气质', category: '江南婉约', usage: '特别适合有文化修养、气质优雅的朋友' },
  { id: 22, traditional: '小桥流水，人家安康', modern: '祝你生活如江南水乡般宁静和谐', meaning: '描绘江南生活图景，表达对平和生活的向往', category: '江南婉约', usage: '适合退休人士或追求宁静生活的朋友' },
  { id: 90, traditional: '书香门第', modern: '祝你出自文化世家，有教养有品位', meaning: '强调文化修养和家庭教养', category: '江南婉约', usage: '适合知识分子和文化人' },
  { id: 91, traditional: '温文尔雅', modern: '祝你态度温和，举止文雅', meaning: '形容人文雅有礼的品质', category: '江南婉约', usage: '适合有教养的绅士淑女' },
  { id: 92, traditional: '风雅颂', modern: '祝你如诗经般优美高雅', meaning: '借用诗经三部分表达优美高雅', category: '江南婉约', usage: '适合文艺爱好者' },

  // 粤语商题类 (6条)
  { id: 23, traditional: '猪笼入水，财源广进', modern: '祝你财源像水一样涌入，生意兴隆', meaning: '粤港地区特色商业祝福，猪笼象征聚财能力', category: '粤语商题', usage: '特别适合从商人士、开店老板等需要聚财的场合' },
  { id: 24, traditional: '一本万利，日进斗金', modern: '祝你小投资大回报，每天进账很多钱', meaning: '粤港商业文化的直接体现，追求高利润的商业理念', category: '粤语商题', usage: '适合做生意、投资、理财的朋友' },
  { id: 25, traditional: '生意兴隆通四海', modern: '祝你生意做得很大，客户遍布天下', meaning: '粤港商人走出去的传统，表达国际视野', category: '粤语商题', usage: '适合外贸生意、招商引资、拓展业务的朋友' },
  { id: 93, traditional: '财源滚滚', modern: '祝你钱财源源不断而来', meaning: '直接表达财运旺盛', category: '粤语商题', usage: '通用商业祝福' },
  { id: 94, traditional: '客似云来', modern: '祝你顾客如云般涌来', meaning: '形容客流量大，生意红火', category: '粤语商题', usage: '适合服务业和零售业' },
  { id: 95, traditional: '货如轮转', modern: '祝你货物周转快速，没有积压', meaning: '形容生意兴旺，货物畅销', category: '粤语商题', usage: '适合贸易和制造业' },

  // 沿海渔家类 (6条)
  { id: 26, traditional: '一帆风顺，满载而归', modern: '祝你出行顺利，收获满满', meaning: '沿海渔民对出海平安和丰收的期盼', category: '沿海渔家', usage: '适合远行、出海、创业等需要勇气和运气的场合' },
  { id: 27, traditional: '船头挂喜，顺风得利', modern: '祝你喜庆当头，顺利获得利益', meaning: '渔家文化中的喜庆传统，带来好运和收获', category: '沿海渔家', usage: '适合新项目启动、冒险投资等充满机遇的场合' },
  { id: 28, traditional: '海不扬波，渔歌高奏', modern: '祝你事业顺风顺水，生活幸福安康', meaning: '借用海洋的平静比喻事业的顺利', category: '沿海渔家', usage: '适合祝福事业稳定、生活安康的朋友' },
  { id: 96, traditional: '鱼虾满舱', modern: '祝你收获丰富，如鱼虾满舱', meaning: '渔民对丰收的直接祝愿', category: '沿海渔家', usage: '适合祝福渔民和海运业' },
  { id: 97, traditional: '风平浪静', modern: '祝你一切顺利，没有波折', meaning: '借用海洋平静比喻生活顺利', category: '沿海渔家', usage: '适合祝福平安顺利' },
  { id: 98, traditional: '出海平安', modern: '祝你出海作业平安归来', meaning: '最实在的渔民安全祝福', category: '沿海渔家', usage: '适合渔民和海运工作者' },

  // 西南安逸类 (6条)
  { id: 29, traditional: '巴适安逸，笑口常开', modern: '祝你生活舒适惬意，天天开心', meaning: '川渝地区的生活哲学，追求悠闲自在的生活', category: '西南安逸', usage: '适合追求生活品质、喜欢安逸生活的朋友' },
  { id: 30, traditional: '日子红火，有盐有味', modern: '祝你生活红红火火，丰富多彩有滋味', meaning: '西南地区对美好生活的期盼，强调生活的质感', category: '西南安逸', usage: '适合庆祝生活改善、事业有成等积极变化的场合' },
  { id: 31, traditional: '和和美美，顺顺当当', modern: '祝你家庭和睦，事事顺利', meaning: '表达西南地区的和谐理念和平和心态', category: '西南安逸', usage: '适合家庭团聚、朋友聚会等需要和谐氛围的场合' },
  { id: 99, traditional: '喝茶摆龙门阵', modern: '祝你悠闲喝茶聊天，生活惬意', meaning: '成都悠闲生活方式的体现', category: '西南安逸', usage: '适合祝福悠闲生活' },
  { id: 100, traditional: '吃香喝辣', modern: '祝你饮食丰富，生活滋润', meaning: '形容生活富足，吃喝不愁', category: '西南安逸', usage: '适合祝福物质生活丰富' },
  { id: 101, traditional: '悠闲自在', modern: '祝你生活悠闲，身心自在', meaning: '表达对自由自在生活的向往', category: '西南安逸', usage: '适合祝福退休或自由职业者' },

  // 新增分类：婚礼祝福 (6条)
  { id: 102, traditional: '永结同心', modern: '祝你俩永远一条心，感情深厚', meaning: '祝福夫妻感情牢固，心心相印', category: '婚礼祝福', usage: '适合祝福新婚夫妇' },
  { id: 103, traditional: '白头偕老', modern: '祝你俩一起到老，恩爱不渝', meaning: '祝福夫妻长相厮守，恩爱一生', category: '婚礼祝福', usage: '适合祝福婚姻长久' },
  { id: 104, traditional: '早生贵子', modern: '祝你早日生育聪明可爱的孩子', meaning: '祝福早日生育，传宗接代', category: '婚礼祝福', usage: '适合祝福新婚生育' },
  { id: 105, traditional: '花好月圆', modern: '祝你婚姻美满如花好月圆', meaning: '形容婚姻美满幸福的意境', category: '婚礼祝福', usage: '适合祝福婚姻美满' },
  { id: 106, traditional: '天作之合', modern: '祝你俩是上天安排的美好配对', meaning: '形容婚姻是上天赐予的良缘', category: '婚礼祝福', usage: '适合祝福天赐良缘' },
  { id: 107, traditional: '相爱到永远', modern: '祝你俩永远相爱，不离不弃', meaning: '直接表达永恒爱情的祝愿', category: '婚礼祝福', usage: '适合祝福爱情永恒' },

  // 新增分类：生日祝福 (6条)
  { id: 108, traditional: '福如东海长流水', modern: '祝你福气像东海流水般绵长', meaning: '祝福福气深厚持久', category: '生日祝福', usage: '适合祝福寿星福气' },
  { id: 109, traditional: '寿比南山不老松', modern: '祝你寿命如南山松柏般长青', meaning: '祝福健康长寿，永不衰老', category: '生日祝福', usage: '适合祝福长寿' },
  { id: 110, traditional: '青春永驻', modern: '祝你永远保持青春活力', meaning: '祝福保持年轻状态', category: '生日祝福', usage: '适合祝福年轻人' },
  { id: 111, traditional: '笑口常开', modern: '祝你天天开心，笑容满面', meaning: '祝福保持愉快心情', category: '生日祝福', usage: '适合祝福快乐生日' },
  { id: 112, traditional: '心想事成', modern: '祝你所有愿望都能实现', meaning: '综合性美好祝愿', category: '生日祝福', usage: '适合各种生日祝福' },
  { id: 113, traditional: '快乐每一天', modern: '祝你每天都开心快乐', meaning: '简单直接的快乐祝福', category: '生日祝福', usage: '适合日常生日祝福' },

  // 新增分类：开业祝福 (6条)
  { id: 114, traditional: '开业大吉', modern: '祝你开业大吉大利，一切顺利', meaning: '开业专用祝福语', category: '开业祝福', usage: '适合新店开业' },
  { id: 115, traditional: '财源广进', modern: '祝你钱财来源广泛，收入丰厚', meaning: '祝福财运旺盛', category: '开业祝福', usage: '适合商业开业' },
  { id: 116, traditional: '客似云来', modern: '祝你顾客如云般涌来', meaning: '祝福客流量大', category: '开业祝福', usage: '适合服务业开业' },
  { id: 117, traditional: '生意兴隆', modern: '祝你生意兴旺发达', meaning: '通用商业祝福', category: '开业祝福', usage: '适合所有商业场合' },
  { id: 118, traditional: '鸿图大展', modern: '祝你大展宏图，事业发展', meaning: '祝福事业大发展', category: '开业祝福', usage: '适合企业开业' },
  { id: 119, traditional: '万事如意', modern: '祝你一切顺利如意', meaning: '综合性美好祝愿', category: '开业祝福', usage: '适合各种开业场合' }
];

// 分类列表
const categories = [
  '全部', '通用祝福', '健康祝福', '学业祝福', '事业祝福', 
  '马年专属', '北方豪爽', '江南婉约', '粤语商题', '沿海渔家', 
  '西南安逸', '婚礼祝福', '生日祝福', '开业祝福'
];

module.exports = {
  blessingPhrases,
  categories
};

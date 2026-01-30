// 快速验证习俗数据完整性
const fs = require('fs');

const content = fs.readFileSync('./pages/customs/customs.js', 'utf8');

// 检查省份数量
const regionsCount = (content.match(/id:\s*'\w+',\s*name:\s*'[^']+'/g) || []).length;
console.log('地区总数:', regionsCount);

// 检查压岁钱数据
const giftMoneyProvinces = (content.match(/(\w+):\s*{\s*amount:/g) || []).length;
console.log('压岁钱数据省份数:', giftMoneyProvinces);

// 检查随份子数据  
const giftGivingProvinces = (content.match(/(\w+):\s*{\s*colleague:/g) || []).length;
console.log('随份子数据省份数:', giftGivingProvinces);

// 检查是否所有省份都有数据
if (regionsCount === giftMoneyProvinces && regionsCount === giftGivingProvinces) {
  console.log('✅ 所有22个省市的数据都已完整补全！');
} else {
  console.log('❌ 数据不完整，请检查缺失的省份');
  console.log('缺失压岁钱数据:', regionsCount - giftMoneyProvinces, '个省份');
  console.log('缺失随份子数据:', regionsCount - giftGivingProvinces, '个省份');
}

// 显示前几个省份的数据示例
console.log('\n📝 数据示例:');
const amountMatches = content.match(/(\w+):\s*{\s*amount:\s*'([^']+)'/g);
if (amountMatches) {
  console.log('压岁钱金额示例:');
  amountMatches.slice(0, 5).forEach(match => {
    console.log('  ', match);
  });
}
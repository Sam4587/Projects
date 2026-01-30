// 验证习俗数据完整性脚本
const fs = require('fs');
const path = require('path');

// 读取习俗数据文件
const customsFile = fs.readFileSync('./pages/customs/customs.js', 'utf8');

// 提取地区列表
const regionsMatch = customsFile.match(/regions:\s*\[([\s\S]*?)\]/);
const regions = [];
if (regionsMatch) {
    const regionsContent = regionsMatch[1];
    const regionMatches = regionsContent.matchAll(/{[^}]*id:\s*'([^']+)',\s*name:\s*'([^']+)'[^}]*}/g);
    for (const match of regionMatches) {
        regions.push({ id: match[1], name: match[2] });
    }
}

console.log('🌍 地区总数:', regions.length);
console.log('?? 地区列表:', regions.map(r => r.name).join(', '));

// 提取压岁钱数据
const giftMoneyMatch = customsFile.match(/giftMoneyData:\s*{([\s\S]*?)\s*},/);
const giftMoneyData = {};
if (giftMoneyMatch) {
    const giftMoneyContent = giftMoneyMatch[1];
    const provinceMatches = giftMoneyContent.matchAll(/(\w+):\s*{/g);
    for (const match of provinceMatches) {
        giftMoneyData[match[1]] = true;
    }
}

// 提取随份子数据
const giftGivingMatch = customsFile.match(/giftGivingData:\s*{([\s\S]*?)\s*}\s*}/);
const giftGivingData = {};
if (giftGivingMatch) {
    const giftGivingContent = giftGivingMatch[1];
    const provinceMatches = giftGivingContent.matchAll(/(\w+):\s*{/g);
    for (const match of provinceMatches) {
        giftGivingData[match[1]] = true;
    }
}

console.log('\n✅ 数据完整性检查结果:');
console.log('=======================');

let allComplete = true;

regions.forEach(region => {
    const hasGiftMoney = giftMoneyData[region.id];
    const hasGiftGiving = giftGivingData[region.id];
    
    const status = hasGiftMoney && hasGiftGiving ? '✅' : '❌';
    console.log(`${status} ${region.name}: 压岁钱${hasGiftMoney ? '✓' : '✗'} | 随份子${hasGiftGiving ? '✓' : '✗'}`);
    
    if (!hasGiftMoney || !hasGiftGiving) {
        allComplete = false;
    }
});

console.log('\n📊 统计信息:');
console.log(`压岁钱数据: ${Object.keys(giftMoneyData).length}/${regions.length}`);
console.log(`随份子数据: ${Object.keys(giftGivingData).length}/${regions.length}`);

if (allComplete) {
    console.log('\n🎉 所有地区的习俗数据都已完整！');
} else {
    console.log('\n⚠️  存在数据缺失，请检查以上标记的地区');
}

// 检查数据格式一致性
console.log('\n🔍 数据格式检查:');
const moneyPattern = /amount:\s*'([^']+)'/g;
const givingColleaguePattern = /colleague:\s*'([^']+)'/g;
const givingFriendPattern = /friend:\s*'([^']+)'/g;

let moneyAmounts = [];
let colleagueAmounts = [];
let friendAmounts = [];

let match;
while ((match = moneyPattern.exec(customsFile)) !== null) {
    moneyAmounts.push(match[1]);
}
while ((match = givingColleaguePattern.exec(customsFile)) !== null) {
    colleagueAmounts.push(match[1]);
}
while ((match = givingFriendPattern.exec(customsFile)) !== null) {
    friendAmounts.push(match[1]);
}

console.log(`压岁钱金额格式: ${moneyAmounts.length} 个记录`);
console.log(`同事随礼金额格式: ${colleagueAmounts.length} 个记录`);
console.log(`朋友随礼金额格式: ${friendAmounts.length} 个记录`);

// 输出示例数据
console.log('\n📝 数据示例:');
console.log('北京压岁钱:', moneyAmounts[0]);
console.log('北京同事随礼:', colleagueAmounts[0]);
console.log('北京朋友随礼:', friendAmounts[0]);
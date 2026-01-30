// 压缩版初始数据 - 只包含基本结构
const INITIAL_DATA_VERSION = "1.0.20250131";

// 基础数据结构
const regionsData = require('./blessings/regions.js');
const categories = require('./blessings/categories.js');

// 按需加载函数
const loadBlessingData = (category) => {
  try {
    return require(`./blessings/${category}.js`);
  } catch (error) {
    console.warn(`加载祝福数据失败: ${category}`, error);
    return [];
  }
};

const loadCustomsData = (region) => {
  try {
    return require(`./customs/${region}.js`);
  } catch (error) {
    console.warn(`加载地域习俗数据失败: ${region}`, error);
    return {};
  }
};

// 完整数据加载（用于兼容性）
const loadFullData = () => {
  console.warn('加载完整数据，请注意性能影响');
  return require('./version-1-initial-data.js');
};

module.exports = {
  INITIAL_DATA_VERSION,
  regionsData,
  categories,
  loadBlessingData,
  loadCustomsData,
  loadFullData
};
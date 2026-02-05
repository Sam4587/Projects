# 任务2.1 - 智能推荐引擎设计文档

> 任务类型: P0核心功能
> 预计工作量: 3天
> 当前状态: 设计阶段

---

## 📋 需求回顾

### 用户故事
作为用户,我想要获得更个性化的随礼金额建议,以便根据我的经济状况和关系亲疏做出最合适的决定。

### 核心需求
- 支持预算范围设置,根据预算调整推荐
- 自动应用地域习俗规则
- 记录用户反馈,持续优化推荐
- 提供推荐置信度,让用户了解推荐的可信度

### 验收标准
- WHEN 用户设置预算范围,系统 SHALL 根据预算调整推荐金额
- WHILE 用户选择地域,系统 SHALL 自动应用该地区的习俗规则
- IF 用户反馈推荐不合理,系统 SHALL 记录反馈并优化后续推荐

---

## 🏗️ 系统架构设计

### 整体架构

```
┌─────────────────────────────────────────┐
│     用户交互层              │
│  - 计算器页面                 │
│  - 预算设置                   │
│  - 反馈收集                   │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│     推荐引擎层              │
│  - 智能推荐引擎                │
│  - 多因子计算                  │
│  - 置信度评估                  │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│     数据模型层              │
│  - 用户行为模型                │
│  - 地域习俗规则                │
│  - 推荐历史记录                │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│     持久化层              │
│  - 本地存储                    │
│  - 数据版本管理                │
└─────────────────────────────────────────┘
```

---

## 🧠 智能推荐引擎设计

### 核心类设计

#### 1. SmartRecommendationEngine 类

**职责**: 协调所有推荐逻辑,提供统一的推荐接口

```javascript
class SmartRecommendationEngine {
  constructor() {
    // 数据模型
    this.userBehavior = new UserBehaviorModel();
    this.regionalRules = new RegionalRuleSystem();
    this.recommendationHistory = new RecommendationHistory();

    // 配置
    this.config = {
      enableBudgetAdjustment: true,
      enableRegionalRules: true,
      enableFeedbackLearning: true
    };
  }

  /**
   * 主要推荐方法
   * @param {Object} params - 推荐参数
   * @returns {Object} - 推荐结果
   */
  recommend(params) {
    const {
      relationship,    // 关系类型
      closeness,      // 亲疏程度
      occasion,        // 场合类型
      region,          // 地域
      budget           // 预算范围 { min, max }
    } = params;

    // 1. 基础金额计算
    const baseAmount = this.calculateBaseAmount(relationship, closeness);

    // 2. 地域习俗调整
    const regionalAdjustedAmount = this.applyRegionalRules(
      baseAmount,
      relationship,
      region
    );

    // 3. 预算调整
    const budgetAdjustedAmount = this.applyBudgetAdjustment(
      regionalAdjustedAmount,
      budget
    );

    // 4. 场合调整
    const occasionAdjustedAmount = this.applyOccasionAdjustment(
      budgetAdjustedAmount,
      occasion
    );

    // 5. 用户行为学习调整
    const personalizedAmount = this.applyPersonalization(
      occasionAdjustedAmount,
      relationship,
      region
    );

    // 6. 生成推荐结果
    return this.generateRecommendation(
      personalizedAmount,
      baseAmount,
      params
    );
  }
}
```

#### 2. UserBehaviorModel 类

**职责**: 管理用户行为数据,提供个性化调整依据

```javascript
class UserBehaviorModel {
  constructor() {
    // 用户历史记录
    this.history = []; // { relationship, closeness, region, amount, timestamp, feedback }

    // 用户偏好
    this.preferences = {
      budgetTrend: 0,        // 预算趋势
      amountMultipliers: {},    // 各关系的金额系数
      regionalAdjustments: {}  // 各地区的调整系数
    };

    // 数据统计
    this.statistics = {
      totalRecords: 0,
      averageAmount: 0,
      relationshipDistribution: {},
      regionDistribution: {}
    };
  }

  /**
   * 记录用户行为
   */
  recordBehavior(data) {
    this.history.push({
      ...data,
      timestamp: Date.now()
    });

    // 保持最近100条记录
    if (this.history.length > 100) {
      this.history.shift();
    }

    this.updateStatistics();
    this.updatePreferences();
  }

  /**
   * 获取个性化系数
   */
  getPersonalizationFactor(relationship, region) {
    let factor = 1.0;

    // 基于历史数据的系数
    if (this.preferences.amountMultipliers[relationship]) {
      factor *= this.preferences.amountMultipliers[relationship];
    }

    if (this.preferences.regionalAdjustments[region]) {
      factor *= this.preferences.regionalAdjustments[region];
    }

    return Math.max(0.8, Math.min(1.2, factor)); // 限制在0.8-1.2倍
  }
}
```

#### 3. RegionalRuleSystem 类

**职责**: 管理和应用地域习俗规则

```javascript
class RegionalRuleSystem {
  constructor() {
    // 地域规则库
    this.rules = new Map();

    // 初始化规则
    this.initializeRules();
  }

  /**
   * 初始化地域规则
   */
  initializeRules() {
    // 基于现有config/customs数据生成规则
    const regions = [
      { id: 'beijing', adjustments: { base: 1.0, family: 1.0 } },
      { id: 'shanghai', adjustments: { base: 1.2, family: 1.1 } },
      { id: 'guangdong', adjustments: { base: 1.1, friend: 0.9 } },
      // ... 其他地区
    ];

    regions.forEach(region => {
      this.rules.set(region.id, {
        adjustments: region.adjustments,
        customs: this.getRegionCustoms(region.id)
      });
    });
  }

  /**
   * 应用地域规则
   */
  applyRules(amount, relationship, regionId) {
    const rule = this.rules.get(regionId);
    if (!rule) return amount;

    const adjustment = rule.adjustments[relationship] || rule.adjustments.base || 1.0;
    return Math.round(amount * adjustment);
  }

  /**
   * 获取地域习俗说明
   */
  getRegionCustoms(regionId) {
    // 从config/customs中提取
    const customData = require(`../../config/customs/${regionId}.js`);
    return {
      preferredNumbers: customData.features?.luckyNumbers || [66, 88, 168],
      traditions: customData.giftMoney?.customs || [],
      tips: customData.giftMoney?.tips || ''
    };
  }
}
```

---

## 📊 数据模型设计

### 推荐数据结构

```javascript
{
  // 推荐金额
  amount: 800,

  // 金额范围
  range: {
    low: 600,
    high: 1000,
    recommended: 800
  },

  // 置信度 (0-1)
  confidence: 0.85,

  // 置信度说明
  confidenceLabel: '比较推荐',

  // 推荐依据
  factors: {
    relationship: '家人亲戚',
    closeness: '普通关系',
    region: '北京',
    occasion: '一般场合',
    budget: '未设置'
  },

  // 地域习俗
  customs: {
    preferredNumbers: [66, 88, 168],
    traditions: ['偏好吉利数字', '注重传统仪式感'],
    tips: '北京红包注重传统和文化内涵'
  },

  // 历史对比
  comparison: {
    userAverage: 750,
    difference: '+50',
    withinBudget: true
  }
}
```

### 用户行为数据结构

```javascript
{
  // 历史记录
  history: [
    {
      id: 'timestamp-relationship-region',
      timestamp: 1707091200000,
      relationship: 'family',
      closeness: 'normal',
      region: 'beijing',
      occasion: 'birthday',
      recommended: 800,
      actual: 850,
      feedback: 'satisfied', // satisfied, too-low, too-high
      confidence: 0.85
    }
  ],

  // 用户偏好
  preferences: {
    budgetRange: { min: 500, max: 2000 },
    relationshipPreferences: {
      family: 1.1,
      friend: 0.9,
      colleague: 0.8,
      boss: 1.2
    },
    regionalPreferences: {
      beijing: 1.0,
      shanghai: 1.1,
      guangdong: 0.9
    }
  },

  // 统计数据
  statistics: {
    totalRecords: 50,
    averageAmount: 780,
    satisfactionRate: 0.85,
    regionalUsage: { beijing: 20, shanghai: 15, ... },
    relationshipUsage: { family: 25, friend: 15, ... }
  }
}
```

---

## 🔧 核心算法设计

### 1. 基础金额计算算法

```javascript
/**
 * 计算基础推荐金额
 * @param {string} relationship - 关系类型
 * @param {string} closeness - 亲疏程度
 * @returns {number} - 基础金额
 */
calculateBaseAmount(relationship, closeness) {
  // 关系基础金额
  const baseAmounts = {
    family: 800,
    friend: 500,
    colleague: 300,
    boss: 600
  };

  // 亲疏程度系数
  const closenessMultipliers = {
    acquaintance: 0.5,
    normal: 1.0,
    close: 1.5,
    'very-close': 2.0
  };

  const base = baseAmounts[relationship] || 300;
  const multiplier = closenessMultipliers[closeness] || 1.0;

  // 确保为100的整数倍数
  return Math.max(100, Math.round(base * multiplier / 100) * 100);
}
```

### 2. 地域规则应用算法

```javascript
/**
 * 应用地域习俗规则
 * @param {number} amount - 原始金额
 * @param {string} relationship - 关系类型
 * @param {string} region - 地域ID
 * @returns {number} - 调整后金额
 */
applyRegionalRules(amount, relationship, region) {
  if (!this.config.enableRegionalRules) return amount;

  const rule = this.regionalRules.get(region);
  if (!rule) return amount;

  const adjustment = rule.adjustments[relationship] || rule.adjustments.base || 1.0;

  // 应用调整
  const adjustedAmount = Math.round(amount * adjustment);

  // 确保是100的整数倍数
  return Math.max(100, Math.round(adjustedAmount / 100) * 100);
}
```

### 3. 预算调整算法

```javascript
/**
 * 应用预算调整
 * @param {number} amount - 原始金额
 * @param {Object} budget - 预算范围 { min, max }
 * @returns {number} - 调整后金额
 */
applyBudgetAdjustment(amount, budget) {
  if (!budget || !this.config.enableBudgetAdjustment) return amount;

  const { min, max } = budget;

  // 金额在预算范围内,不做调整
  if (amount >= min && amount <= max) {
    return amount;
  }

  // 超出预算上限,调整到上限附近
  if (amount > max) {
    return max - 100; // 留出100元缓冲
  }

  // 低于预算下限,提升到下限
  if (amount < min) {
    return min;
  }

  return amount;
}
```

### 4. 置信度计算算法

```javascript
/**
 * 计算推荐置信度
 * @param {Object} factors - 影响因子
 * @returns {Object} - 置信度信息
 */
calculateConfidence(factors) {
  let score = 0;
  let reasons = [];

  // 1. 用户历史数据充足性 (30分)
  const historyCount = this.userBehavior.history.length;
  if (historyCount >= 20) {
    score += 30;
    reasons.push('基于丰富的历史数据');
  } else if (historyCount >= 10) {
    score += 20;
    reasons.push('基于部分历史数据');
  }

  // 2. 地域规则匹配 (25分)
  if (factors.region && this.regionalRules.has(factors.region)) {
    score += 25;
    reasons.push('应用地域习俗规则');
  }

  // 3. 用户反馈一致性 (20分)
  const consistency = this.userBehavior.calculateConsistency();
  score += Math.min(20, consistency * 20);
  reasons.push(`用户偏好一致性: ${(consistency * 100).toFixed(0)}%`);

  // 4. 预算符合度 (15分)
  if (factors.budget) {
    const withinBudget = factors.amount >= factors.budget.min &&
                       factors.amount <= factors.budget.max;
    if (withinBudget) {
      score += 15;
      reasons.push('符合预算范围');
    }
  }

  // 5. 场合匹配 (10分)
  if (factors.occasion) {
    score += 10;
    reasons.push('匹配当前场景');
  }

  // 计算置信度 (0-1)
  const confidence = Math.min(1.0, score / 100);

  // 置信度标签
  let label = '仅供参考';
  if (confidence >= 0.8) label = '非常推荐';
  else if (confidence >= 0.6) label = '比较推荐';
  else if (confidence >= 0.4) label = '一般推荐';

  return {
    score,
    confidence,
    label,
    reasons
  };
}
```

---

## 🎨 用户界面设计

### 预算设置界面

```wxml
<!-- 预算设置组件 -->
<view class="budget-settings">
  <view class="section-title">
    <text>预算范围设置</text>
  </view>

  <view class="budget-input">
    <view class="input-group">
      <text class="label">最低金额</text>
      <input
        type="number"
        placeholder="不设置"
        bindinput="onMinBudgetInput"
        value="{{budgetMin}}"
      />
      <text class="unit">元</text>
    </view>

    <view class="input-group">
      <text class="label">最高金额</text>
      <input
        type="number"
        placeholder="不设置"
        bindinput="onMaxBudgetInput"
        value="{{budgetMax}}"
      />
      <text class="unit">元</text>
    </view>
  </view>

  <view class="tips">
    <text>💡 设置预算后,推荐金额会自动调整到范围内</text>
  </view>
</view>
```

### 推荐结果展示界面

```wxml
<!-- 推荐结果组件 -->
<view class="recommendation-result">
  <view class="amount-section">
    <text class="label">推荐金额</text>
    <text class="amount">{{recommendation.amount}}元</text>
  </view>

  <view class="confidence-section">
    <text class="confidence-label">{{recommendation.confidenceLabel}}</text>
    <progress
      percent="{{recommendation.confidence * 100}}"
      activeColor="#E53935"
    />
  </view>

  <view class="range-section">
    <view class="range-item">
      <text class="label">参考范围</text>
      <text class="range">{{recommendation.range.low}}-{{recommendation.range.high}}元</text>
    </view>
  </view>

  <view class="factors-section">
    <text class="section-title">推荐依据</text>
    <view class="factor-list">
      <view class="factor-item" wx:for="{{recommendation.factors}}">
        <text>{{item.relationship}} × {{item.closeness}}</text>
        <text class="region">地区: {{item.region}}</text>
      </view>
    </view>
  </view>

  <view class="customs-section" wx:if="{{recommendation.customs}}">
    <text class="section-title">地域习俗</text>
    <view class="custom-list">
      <text wx:for="item in recommendation.customs.traditions">
        • {{item}}
      </text>
    </view>
    <text class="tips">{{recommendation.customs.tips}}</text>
  </view>
</view>
```

### 反馈收集界面

```wxml
<!-- 反馈收集组件 -->
<view class="feedback-modal" wx:if="{{showFeedbackModal}}">
  <view class="modal-content">
    <view class="modal-title">
      <text>推荐准确吗?</text>
    </view>

    <view class="feedback-options">
      <button
        class="feedback-btn satisfied"
        bindtap="onFeedbackSatisfied"
      >
        ✓ 很准确
      </button>

      <button
        class="feedback-btn neutral"
        bindtap="onFeedbackNeutral"
      >
        ○ 一般
      </button>

      <button
        class="feedback-btn dissatisfied"
        bindtap="onFeedbackDissatisfied"
      >
        ✗ 不准确
      </button>
    </view>

    <view class="actual-amount-section" wx:if="{{showActualAmountInput}}">
      <text class="label">您实际给了多少钱?</text>
      <input
        type="number"
        placeholder="请输入实际金额"
        bindinput="onActualAmountInput"
      />
      <text class="unit">元</text>
    </view>

    <button class="submit-btn" bindtap="submitFeedback">
      提交反馈
    </button>
  </view>
</view>
```

---

## 📦 数据持久化设计

### 存储结构

```javascript
// 存储键名
const STORAGE_KEYS = {
  USER_BEHAVIOR: 'smart_recommendation_user_behavior',
  RECOMMENDATION_HISTORY: 'smart_recommendation_history',
  USER_PREFERENCES: 'smart_recommendation_preferences',
  REGIONAL_RULES: 'smart_recommendation_regional_rules'
};

// 读取数据
function loadUserBehavior() {
  try {
    const data = wx.getStorageSync(STORAGE_KEYS.USER_BEHAVIOR);
    return data || {
      history: [],
      preferences: {},
      statistics: {}
    };
  } catch (error) {
    console.error('加载用户行为数据失败:', error);
    return getDefaultUserBehavior();
  }
}

// 保存数据
function saveUserBehavior(data) {
  try {
    wx.setStorageSync(STORAGE_KEYS.USER_BEHAVIOR, data);
  } catch (error) {
    console.error('保存用户行为数据失败:', error);
    // 清理旧数据后重试
    clearOldBehaviorData();
    wx.setStorageSync(STORAGE_KEYS.USER_BEHAVIOR, data);
  }
}
```

### 数据版本管理

```javascript
// 数据版本号
const DATA_VERSION = {
  USER_BEHAVIOR: '1.0.0',
  REGIONAL_RULES: '1.0.0'
};

// 数据迁移
function migrateData(version) {
  if (version === DATA_VERSION.USER_BEHAVIOR) return true;

  const oldData = loadUserBehavior();
  const newData = transformToNewVersion(oldData);

  saveUserBehavior(newData);

  // 更新版本号
  wx.setStorageSync('data_version', DATA_VERSION.USER_BEHAVIOR);

  return true;
}
```

---

## 🧪 单元测试设计

### 测试用例列表

```javascript
describe('智能推荐引擎', () => {
  test('基础金额计算', () => {
    const engine = new SmartRecommendationEngine();
    const result = engine.calculateBaseAmount('family', 'normal');

    expect(result).toBe(800);
  });

  test('地域规则应用', () => {
    const engine = new SmartRecommendationEngine();
    const result = engine.applyRegionalRules(800, 'family', 'beijing');

    // 北京家人关系系数应该是1.0
    expect(result).toBe(800);
  });

  test('预算调整-范围内', () => {
    const engine = new SmartRecommendationEngine();
    const result = engine.applyBudgetAdjustment(800, { min: 500, max: 1000 });

    expect(result).toBe(800);
  });

  test('预算调整-超上限', () => {
    const engine = new SmartRecommendationEngine();
    const result = engine.applyBudgetAdjustment(1500, { min: 500, max: 1000 });

    expect(result).toBe(900); // 1000 - 100
  });

  test('置信度计算', () => {
    const engine = new SmartRecommendationEngine();
    const confidence = engine.calculateConfidence({
      hasHistory: true,
      hasRegionalRule: true,
      hasBudget: true,
      hasOccasion: true
    });

    expect(confidence.score).toBeGreaterThan(80);
    expect(confidence.label).toBe('非常推荐');
  });

  test('用户行为记录', () => {
    const model = new UserBehaviorModel();
    model.recordBehavior({
      relationship: 'family',
      amount: 800,
      feedback: 'satisfied'
    });

    expect(model.history.length).toBe(1);
    expect(model.statistics.totalRecords).toBe(1);
  });
});
```

---

## 📅 实施计划

### 第1步: 基础架构搭建 (Day 1)
- [ ] 创建utils/smart-recommendation-engine.js
- [ ] 实现SmartRecommendationEngine类
- [ ] 实现UserBehaviorModel类
- [ ] 实现RegionalRuleSystem类
- [ ] 编写基础单元测试

### 第2步: 算法实现 (Day 2)
- [ ] 实现基础金额计算算法
- [ ] 实现地域规则应用算法
- [ ] 实现预算调整算法
- [ ] 实现置信度计算算法
- [ ] 完善单元测试覆盖

### 第3步: 集成到计算器页面 (Day 3)
- [ ] 修改pages/calculator/calculator.js
- [ ] 集成SmartRecommendationEngine
- [ ] 添加预算设置UI
- [ ] 添加推荐结果展示UI
- [ ] 添加反馈收集UI

---

## ⚠️ 风险与挑战

### 技术风险
1. **数据准确性**
   - 风险: 地域习俗规则可能不准确
   - 应对: 定期收集用户反馈,优化规则

2. **性能影响**
   - 风险: 复杂计算可能影响响应速度
   - 应对: 使用缓存,预计算常用结果

3. **存储空间**
   - 风险: 用户历史数据可能占用较多存储
   - 应对: 限制历史记录数量(最多100条)

### 产品风险
1. **用户接受度**
   - 风险: 用户可能不信任AI推荐
   - 应对: 提供推荐依据,允许用户手动调整

2. **隐私担忧**
   - 风险: 用户担心数据收集
   - 应对: 数据仅本地存储,明确告知用户

---

## 📋 验收检查清单

### 功能完整性
- [ ] 基础金额计算准确
- [ ] 地域规则正确应用
- [ ] 预算调整功能正常
- [ ] 置信度计算合理
- [ ] 用户行为记录正常

### 性能指标
- [ ] 推荐计算时间 <100ms
- [ ] 数据加载时间 <50ms
- [ ] 存储操作时间 <20ms
- [ ] 内存占用无明显增加

### 质量标准
- [ ] 核心算法测试覆盖率 >90%
- [ ] 整体测试覆盖率 >80%
- [ ] 代码审查通过
- [ ] 文档完整

### 用户体验
- [ ] UI清晰易用
- [ ] 推荐结果有说服力
- [ ] 反馈流程顺畅
- [ ] 配置项合理

---

## 📚 相关文档

- [v1.1.0开发任务清单](./v1.1.0-development-tasks.md)
- [性能分析报告](./performance-analysis.md)
- [代码质量审查报告](./code-quality-review.md)

---

**文档版本**: v1.0
**最后更新**: 2026-02-05
**状态**: 待审阅
**下一步**: 等待您测试反馈后调整设计

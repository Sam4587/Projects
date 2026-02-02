# 🚀 随礼那点事儿 - 开发指南

## 📋 快速开始

### 环境要求

- **微信开发者工具**：最新版本 (推荐 2.01.2510260+)
- **Node.js**：v16+ (用于工具脚本)
- **Git**：版本控制

### 项目初始化

1. **克隆代码**
```bash
git clone <项目地址>
cd redpacket-advisor
```

2. **微信小程序配置**
   - 打开微信开发者工具
   - 选择项目目录：`d:/Projects/redpacket-advisor`
   - 确认 `appid` 配置正确

3. **基础库版本**
   - 在微信开发者工具中选择基础库版本：**3.14.1**
   - 确保兼容性良好

### 项目结构

```
redpacket-advisor/
├── app.json                 # 应用配置
├── app.js                   # 应用逻辑
├── project.config.json      # 项目配置
│
├── pages/                   # 页面目录
│   ├── calculator/         # 随礼计算器
│   │   ├── calculator.js
│   │   ├── calculator.json
│   │   ├── calculator.wxml
│   │   └── calculator.wxss
│   ├── translator/         # 红包翻译器
│   │   └── ...
│   ├── customs/            # 地域习俗
│   │   └── ...
│   └── stats/              # 数据统计
│       └── ...
│
├── components/             # 组件目录
│   └── feedback/           # 用户反馈组件
│       ├── feedback.js
│       ├── feedback.json
│       ├── feedback.wxml
│       └── feedback.wxss
│
├── config/                 # 配置文件
│   ├── blessings/          # 祝福语数据
│   ├── customs/            # 地域习俗数据
│   └── version-1-initial-data-compressed.js
│
├── utils/                  # 工具函数
│   ├── analytics.js
│   ├── dingtalk-service-miniapp.js
│   └── ad-config.js
│
└── assets/                 # 静态资源
    └── tabbar/            # TabBar图标
```

## 🔧 配置说明

### 应用配置 (app.json)

```json
{
  "pages": [
    "pages/calculator/calculator",
    "pages/translator/translator",
    "pages/customs/customs",
    "pages/stats/stats"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#dc2626",
    "navigationBarTitleText": "随礼那点事儿",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "color": "#666666",
    "selectedColor": "#E53935",
    "backgroundColor": "#F5F5F5",
    "list": [...]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents",
  "version": "1.0.0"
}
```

### 页面配置示例

```json
{
  "navigationBarTitleText": "随礼计算器",
  "navigationBarBackgroundColor": "#dc2626",
  "navigationBarTextStyle": "white",
  "usingComponents": {
    "feedback": "/components/feedback/feedback"
  }
}
```

## 💻 开发规范

### JavaScript 规范

#### 1. 页面结构
```javascript
// pages/xxx/xxx.js
const app = getApp();
const moduleData = require('../../config/data');

Page({
  data: {
    // 页面数据
  },

  // 生命周期函数
  onLoad(options) {
    app.globalData.currentRoute = '当前页面路径';
    // 页面初始化
  },

  onShow() {
    // 页面显示
  },

  onHide() {
    // 页面隐藏
  },

  onUnload() {
    // 页面卸载
  },

  // 事件处理函数
  handleEvent(e) {
    // 事件处理
  },

  // 自定义方法
  customMethod() {
    // 自定义逻辑
  }
});
```

#### 2. 组件结构
```javascript
// components/xxx/xxx.js
Component({
  properties: {
    // 组件属性
    propName: {
      type: String,
      value: ''
    }
  },

  data: {
    // 组件数据
  },

  lifetimes: {
    attached() {
      // 组件生命周期
    }
  },

  methods: {
    // 组件方法
    handleClick() {
      this.triggerEvent('eventname', { data: 'value' });
    }
  }
});
```

#### 3. 数据管理
```javascript
// 获取数据
const { blessingPhrases, categories } = require('../../config/version-1-initial-data');

// 设置数据
this.setData({
  data: value
});

// 异步数据加载
const loadData = async (regionId) => {
  try {
    return await require(`../../config/customs/${regionId}`);
  } catch (error) {
    console.warn('数据加载失败:', error);
    return {};
  }
};
```

### WXML 规范

#### 1. 基础结构
```xml
<!-- pages/xxx/xxx.wxml -->
<view class="container">
  <!-- 头部 -->
  <view class="header">
    <text class="title">页面标题</text>
  </view>

  <!-- 内容区域 -->
  <view class="content">
    <!-- 表单 -->
    <view class="form-group">
      <view class="form-label">标签</view>
      <input class="form-input" placeholder="请输入" />
    </view>

    <!-- 按钮 -->
    <button class="btn btn-primary" bindtap="handleClick">
      按钮文案
    </button>
  </view>

  <!-- 反馈组件 -->
  <feedback pageName="页面名称" />
</view>
```

#### 2. 条件渲染
```xml
<!-- 条件显示 -->
<view wx:if="{{condition}}">条件为真时显示</view>
<view wx:elif="{{condition2}}">条件2为真时显示</view>
<view wx:else>其他情况显示</view>

<!-- 列表渲染 -->
<view wx:for="{{list}}" wx:key="id">
  <text>{{item.name}}</text>
</view>
```

#### 3. 事件绑定
```xml
<!-- 点击事件 -->
<view bindtap="handleClick">点击</view>

<!-- 输入事件 -->
<input bindinput="onInput" />

<!-- 带参数的事件 -->
<view bindtap="handleClick" data-id="{{item.id}}">点击</view>
```

### WXSS 规范

#### 1. 基础样式
```css
/* pages/xxx/xxx.wxss */
.container {
  padding: 32rpx;
  background: #f8f9fa;
}

.header {
  text-align: center;
  margin-bottom: 32rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #dc2626;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 28rpx;
  color: #374151;
  margin-bottom: 8rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
}

.btn {
  height: 88rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.btn-primary {
  background: #dc2626;
  color: white;
}
```

#### 2. 响应式设计
```css
/* 适配不同屏幕 */
@media screen and (max-width: 375px) {
  .title {
    font-size: 32rpx;
  }
}

/* 安全区域适配 */
.container {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 🎯 核心功能开发

### 1. 随礼计算器开发

```javascript
// 计算逻辑
calculateAmount() {
  const { relationship, closeness } = this.data;
  
  // 输入验证
  if (!relationship || !closeness) return;
  
  // 基础金额配置
  const baseAmounts = {
    family: 800,
    friend: 500,
    colleague: 300,
    boss: 600
  };
  
  // 亲疏程度系数
  const multipliers = {
    acquaintance: 0.5,
    normal: 1,
    close: 1.5,
    'very-close': 2
  };
  
  // 计算推荐金额
  const base = baseAmounts[relationship] || 300;
  const multiplier = multipliers[closeness] || 1;
  const amount = Math.max(0, Math.round(base * multiplier / 100) * 100);
  
  // 设置结果
  this.setData({
    result: {
      amount,
      low: amount - 200,
      high: amount + 400,
      message: '推荐说明'
    }
  });
}
```

### 2. 红包翻译器开发

```javascript
// 翻译逻辑
translateText() {
  const { inputText, phrases } = this.data;
  
  // 精确匹配
  const exactMatch = phrases.find(p => 
    p.traditional === inputText || p.modern === inputText
  );
  
  if (exactMatch) {
    this.setData({
      translation: {
        traditional: exactMatch.traditional,
        modern: exactMatch.modern,
        meaning: exactMatch.meaning,
        usage: exactMatch.usage
      }
    });
    return;
  }
  
  // 模糊匹配
  const fuzzyMatch = phrases.find(p => 
    p.traditional.includes(inputText) || 
    p.modern.includes(inputText)
  );
  
  if (fuzzyMatch) {
    // 模糊匹配结果
    this.setData({ translation: fuzzyMatch });
  } else {
    // 未找到匹配
    wx.showToast({
      title: '未找到匹配结果',
      icon: 'none'
    });
  }
}
```

### 3. 地域习俗数据加载

```javascript
// 数据加载
onRegionChange(e) {
  const index = e.detail.value;
  const region = this.data.regions[index];
  
  // 边界检查
  if (!region) {
    wx.showToast({
      title: '地区选择无效',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载状态
  this.setData({
    selectedRegion: region.id,
    loading: true
  });
  
  // 异步加载数据
  setTimeout(async () => {
    try {
      const regionData = await this.loadCustomsData(region.id);
      this.setData({
        giftMoneyData: regionData,
        loading: false
      });
    } catch (error) {
      // 使用默认数据
      this.setData({
        giftMoneyData: this.createDefaultData(region.name),
        loading: false
      });
    }
  }, 300);
}
```

## 🔧 调试和测试

### 调试技巧

1. **日志输出**
```javascript
console.log('调试信息:', data);
console.warn('警告信息:', warning);
console.error('错误信息:', error);
```

2. **网络请求调试**
```javascript
// 在微信开发者工具中
// 查看Network面板
// 查看Console面板
// 查看Storage面板
```

3. **数据查看**
```javascript
// 查看页面的data
console.log('页面数据:', this.data);

// 查看本地存储
console.log('本地存储:', wx.getStorageSync('key'));
```

### 测试要点

1. **功能测试**
   - 页面跳转是否正常
   - 按钮点击是否有响应
   - 数据计算是否正确
   - 组件显示是否正常

2. **边界测试**
   - 空输入处理
   - 超长输入处理
   - 快速连续操作
   - 网络异常情况

3. **性能测试**
   - 页面加载时间
   - 操作响应时间
   - 内存占用情况
   - 搜索性能

## 🚀 发布流程

### 1. 代码检查
```bash
# 在微信开发者工具中
# 1. 工具 -> 代码检查
# 2. 查看是否有错误或警告
# 3. 修复所有问题
```

### 2. 功能测试
```
测试清单：
- [ ] 随礼计算器功能正常
- [ ] 红包翻译器功能正常
- [ ] 地域习俗数据正常
- [ ] 用户反馈功能正常
- [ ] 所有页面切换正常
- [ ] TabBar导航正常
```

### 3. 性能检查
```
性能指标：
- [ ] 首屏加载时间 < 2秒
- [ ] 操作响应时间 < 200ms
- [ ] 无内存泄漏
- [ ] 搜索响应流畅
```

### 4. 提交审核
```bash
# 1. 清理编译缓存
# 2. 重新编译项目
# 3. 上传代码到微信小程序后台
# 4. 填写版本说明
# 5. 提交审核
```

## 📚 API 参考

### 微信小程序 API

- `wx.showToast()` - 显示消息提示框
- `wx.showLoading()` - 显示加载提示框
- `wx.setStorageSync()` - 本地数据存储
- `wx.getStorageSync()` - 本地数据读取
- `wx.navigateTo()` - 页面跳转
- `wx.request()` - 网络请求

### 自定义 API

- `app.trackEvent()` - 事件统计
- `app.trackPageView()` - 页面访问统计
- `dingTalkService.sendFeedback()` - 钉钉反馈
- `adManager.createInterstitialAd()` - 广告管理

---

**📝 维护者**：随礼那点事儿开发团队  
**最后更新**：2026年1月30日
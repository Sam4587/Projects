# 钉钉机器人反馈系统部署指南

## 概述

本系统提供了一套完整的用户反馈解决方案，支持先尝试钉钉机器人提交，失败后自动降级到本地存储的机制。具备以下特点：

- ✅ **智能降级**：网络异常时自动降级到本地存储
- ✅ **多平台支持**：微信小程序、Web应用均可使用
- ✅ **实时状态监控**：显示钉钉服务在线状态
- ✅ **自动重试**：网络恢复后自动重试失败的反馈
- ✅ **统计追踪**：完整的反馈统计和分析
- ✅ **快速部署**：5分钟即可集成到新项目

## 快速开始

### 1. 基础配置

在项目根目录创建配置文件 `feedback-config.js`：

```javascript
// feedback-config.js
module.exports = {
  projectName: '你的项目名称',
  projectVersion: '1.0.0',
  environment: 'production', // development | production
  
  dingtalk: {
    enabled: true,
    webhook: 'https://oapi.dingtalk.com/robot/send?access_token=你的token',
    secret: '你的加签密钥'
  },
  
  fallback: {
    enabled: true,
    maxRetries: 3,
    retryInterval: 30000,
    maxQueueSize: 100
  }
};
```

### 2. 微信小程序集成

#### 安装反馈组件

将 `components/feedback/` 目录复制到你的小程序项目中。

#### 在页面中使用

```javascript
// pages/index/index.js
Page({
  data: {},
  
  onLoad() {
    // 在页面中引入反馈组件
  }
});
```

```xml
<!-- pages/index/index.wxml -->
<view>
  <!-- 页面内容 -->
  <feedback pageName="首页" />
</view>
```

```json
// pages/index/index.json
{
  "usingComponents": {
    "feedback": "/components/feedback/feedback"
  }
}
```

### 3. React/Web应用集成

#### 安装依赖（可选）

```bash
npm install lucide-react  # 如果使用图标
```

#### 使用反馈组件

```jsx
// src/components/FeedbackButton.jsx
import React from 'react';
import UserFeedback from './UserFeedback';

const App = () => {
  return (
    <div>
      {/* 你的应用内容 */}
      <UserFeedback />
    </div>
  );
};

export default App;
```

### 4. 直接使用管理器API

```javascript
// 在任何JavaScript环境中使用
import { createFeedbackManager } from './utils/feedback-manager';

// 创建管理器实例
const feedbackManager = createFeedbackManager({
  projectName: '我的项目',
  projectVersion: '1.0.0'
});

// 提交反馈
async function submitFeedback() {
  try {
    const result = await feedbackManager.submitFeedback({
      rating: 5,
      type: 'feature',
      content: '功能建议内容',
      pageName: '设置页面'
    });
    
    if (result.success) {
      if (result.fallback) {
        console.log('反馈已保存到本地');
      } else {
        console.log('反馈已发送到钉钉');
      }
    }
  } catch (error) {
    console.error('提交失败:', error);
  }
}
```

## 配置说明

### 钉钉机器人配置

1. 在钉钉群中创建自定义机器人
2. 获取Webhook地址和加签密钥
3. 安全设置建议：
   - 启用加签
   - 设置IP白名单（可选）
   - 限制关键词（可选）

### 降级配置选项

```javascript
fallback: {
  enabled: true,           // 是否启用降级
  maxRetries: 3,           // 最大重试次数
  retryInterval: 30000,    // 重试间隔(ms)
  maxQueueSize: 100        // 本地队列最大长度
}
```

## 高级功能

### 1. 自定义反馈类型

```javascript
// 修改 feedbackTypes 数组
const customFeedbackTypes = [
  { value: 'bug', label: '🐛 Bug报告' },
  { value: 'feature', label: '✨ 新功能建议' },
  { value: 'ui', label: '🎨 界面优化' },
  { value: 'performance', label: '⚡ 性能问题' },
  { value: 'content', label: '📝 内容错误' },
  { value: 'other', label: '💭 其他反馈' }
];
```

### 2. 事件监听

```javascript
// 监听反馈状态变化
feedbackManager.on('statusChange', (status) => {
  console.log('服务状态变化:', status);
});

feedbackManager.on('feedbackSuccess', (data) => {
  console.log('反馈提交成功:', data);
});

feedbackManager.on('fallbackTriggered', (data) => {
  console.log('触发降级机制:', data);
});
```

### 3. 统计数据分析

```javascript
// 获取统计信息
const stats = feedbackManager.getStats();
console.log('反馈统计:', stats);

// 获取待处理反馈
const pending = feedbackManager.getPendingFeedbacks();
console.log('待处理反馈:', pending.length);
```

### 4. 手动管理

```javascript
// 手动重试失败的反馈
await feedbackManager.manualRetry();

// 清空本地队列
feedbackManager.clearPendingFeedbacks();

// 检查服务状态
const status = await feedbackManager.checkServiceStatus();
```

## 部署到其他项目

### 步骤1：复制必要文件

```
复制以下文件到新项目：
- utils/dingtalk-feedback.js      # 钉钉服务核心
- utils/feedback-manager.js       # 通用管理器
- components/feedback/            # 小程序组件
- src/components/UserFeedback.jsx # React组件
```

### 步骤2：更新配置

修改配置中的项目名称、版本号和钉钉机器人信息。

### 步骤3：集成组件

根据项目类型选择集成方式：
- 微信小程序：使用 `feedback` 组件
- React项目：使用 `UserFeedback` 组件
- 其他项目：直接使用 `FeedbackManager` API

### 步骤4：测试验证

1. 测试正常提交流程
2. 断开网络测试降级机制
3. 恢复网络测试自动重试

## 故障排除

### 常见问题

**Q: 钉钉机器人收不到消息**
A: 检查Webhook地址和加签密钥是否正确，确认网络连接正常。

**Q: 降级机制不工作**
A: 确认 `fallback.enabled` 设置为 `true`，检查本地存储权限。

**Q: 自动重试不生效**
A: 确认网络恢复后系统是否自动检测，检查重试间隔设置。

**Q: 统计信息不准确**
A: 确认存储权限正常，统计信息会定期保存到本地。

### 调试方法

```javascript
// 启用详细日志
feedbackManager.on('feedbackSubmit', (data) => {
  console.log('提交反馈:', data);
});

// 检查服务状态
console.log('当前状态:', feedbackManager.getStatus());

// 手动触发状态检查
await feedbackManager.checkServiceStatus();
```

## 最佳实践

1. **用户引导**：首次使用时简单说明反馈流程
2. **频率限制**：避免用户频繁提交，可设置时间间隔
3. **内容验证**：确保反馈内容有意义，可设置最小长度
4. **隐私保护**：避免收集敏感信息，匿名化用户标识
5. **及时响应**：定期查看钉钉消息，及时处理反馈

## 扩展开发

### 自定义存储后端

```javascript
class CustomStorage {
  async save(feedbackData) {
    // 实现自定义存储逻辑
    // 例如：保存到云存储、数据库等
  }
  
  async load() {
    // 实现加载逻辑
  }
}
```

### 集成其他通知渠道

```javascript
// 扩展支持企业微信、飞书等
class MultiChannelFeedback extends FeedbackManager {
  async submitToChannels(feedbackData) {
    // 实现多渠道提交
  }
}
```

## 技术支持

如有问题或建议，欢迎通过以下方式联系：

- 提交Issue到项目仓库
- 通过钉钉机器人反馈问题
- 查看在线文档和示例

---

**版本信息**
- 当前版本：v1.0.0
- 最后更新：2025年1月29日
- 适用平台：微信小程序、Web应用
- 依赖要求：无外部依赖，纯前端实现
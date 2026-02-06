# 项目文件目录管理说明

## 目录结构总览

本项目采用清晰的目录结构，便于代码维护和团队协作。

```
/
├── .monkeycode/                    # 项目文档和规格说明（新增）
│   ├── docs/                      # 项目文档
│   │   ├── PROJECT_OVERVIEW.md      # 项目概述文档
│   │   └── TASK_TRACKING.md        # 任务追踪文档
│   └── specs/                     # 功能规格说明（待添加）
├── pages/                          # 页面文件
│   ├── calculator/                  # 随礼计算器页面
│   │   ├── calculator.js
│   │   ├── calculator.wxml
│   │   ├── calculator.wxss
│   │   └── calculator.json
│   ├── translator/                  # 红包翻译器页面
│   │   ├── translator.js
│   │   ├── translator.wxml
│   │   ├── translator.wxss
│   │   └── translator.json
│   ├── customs/                    # 地域习俗页面
│   ├── stats/                      # 数据统计页面
│   └── index/                      # 首页
├── components/                     # 公共组件
│   └── feedback/                  # 用户反馈组件
│       ├── feedback.js
│       ├── feedback.wxml
│       ├── feedback.wxss
│       └── feedback.json
├── config/                         # 配置文件
│   ├── blessings/                  # 祝福语数据配置
│   │   ├── general.js              # 通用祝福
│   │   ├── health.js              # 健康祝福
│   │   ├── study.js               # 学业祝福
│   │   ├── career.js              # 事业祝福
│   │   ├── horse.js               # 马年专属
│   │   ├── north.js               # 北方豪爽
│   │   ├── south.js               # 江南婉约
│   │   ├── cantonese.js           # 粤语商题
│   │   ├── coastal.js             # 沿海渔家
│   │   ├── southwest.js           # 西南安逸
│   │   ├── wedding.js             # 婚礼祝福
│   │   ├── birthday.js            # 生日祝福
│   │   └── opening.js             # 开业祝福
│   └── customs/                    # 地域习俗数据配置
│       ├── beijing.js             # 北京习俗
│       ├── shanghai.js            # 上海习俗
│       └── ...                   # 其他地区习俗
├── utils/                          # 工具函数
│   ├── regional-rule-system.js       # 地域规则系统
│   ├── smart-recommendation-engine.js # 智能推荐引擎
│   ├── ad-config.js                # 广告配置
│   ├── dingtalk-feedback.js         # 钉钉反馈服务
│   ├── dingtalk-feedback-miniprogram.js # 钉钉小程序反馈
│   ├── dingtalk-service-miniapp.js  # 钉钉服务
│   ├── dingtalk-signature.js       # 钉钉签名
│   ├── dingtalk-signature-server.js # 钉钉签名服务端
│   ├── dingtalk-signature-miniprogram.js # 钉钉签名小程序
│   ├── dingtalk-signature-weapp.js # 钉钉签名微信小程序
│   ├── dingtalk-signature-weapp-miniprogram.js # 钉钉签名微信小程序版本
│   ├── dingtalk-signature-browser.js # 钉钉签名浏览器版
│   ├── dingtalk-signature-weapp-miniprogram.js # 钉钉签名微信小程序版本（重复）
│   ├── feedback-manager.js          # 反馈管理器
│   ├── hmac-sha256-weapp.js       # HMAC-SHA256微信小程序版
│   ├── hmac-sha256-browser.js      # HMAC-SHA256浏览器版
│   ├── hmac-sha256-weapp-miniprogram.js # HMAC-SHA256微信小程序版
│   ├── hmac-sha256-weapp-miniprogram.js # HMAC-SHA256微信小程序版（重复）
│   ├── network-utils.js            # 网络工具
│   ├── analytics.js                # 数据分析
│   ├── user-behavior-model.js      # 用户行为模型
│   └── dingtalk-feedback-miniprogram.js # 钉钉反馈小程序版
├── assets/                         # 静态资源
│   └── tabbar/                    # 底部导航栏图标
├── cloudbase-functions/            # 云函数（备用）
│   ├── blessings-generator/
│   ├── database-init/
│   ├── ai-translator/
│   └── user-feedback/
├── dingtalk-api/                   # 钉钉API
│   └── api/
│       └── send.js
├── docs/                           # 项目文档（旧版）
│   └── feature-plans/
├── minitest/                        # 测试文件
├── scripts/                        # 脚本工具
├── shared/                         # 共享数据
│   └── data/
│       └── blessingPhrases.js
├── tencent-cloud-function-serverless/ # 腾讯云函数（无服务器）
└── docs/                           # 项目文档根目录
    ├── PROJECT_OVERVIEW.md           # 项目概述
    ├── TASK_TRACKING.md             # 任务追踪
    ├── CODE_MANAGEMENT.md           # 代码管理规范
    ├── DATA_INTEGRITY_ANALYSIS.md   # 数据完整性分析
    ├── implementation_priority_evaluation.md # 实施优先级评估
    ├── README.md                   # 项目说明
    ├── CHANGELOG.md                # 变更日志
    ├── CONTRIBUTING.md              # 贡献指南
    ├── data_integrity_issue_list.md  # 数据完整性问题列表
    └── Git推送检查清单.md          # Git推送检查清单
```

## 目录职责说明

### 页面目录 (pages/)
存放小程序的所有页面，每个页面一个独立文件夹，包含4个文件：
- `.js` - 页面逻辑
- `.wxml` - 页面结构
- `.wxss` - 页面样式
- `.json` - 页面配置

### 组件目录 (components/)
存放可复用的公共组件，组件结构同页面。

### 配置目录 (config/)
存放应用配置数据：
- `blessings/` - 各类祝福语数据
- `customs/` - 各地区域习俗数据

### 工具目录 (utils/)
存放可复用的工具函数和业务逻辑：
- 核心业务逻辑（推荐引擎、地域规则等）
- 第三方服务集成（钉钉、广告等）
- 通用工具函数（网络、加密等）

### 资源目录 (assets/)
存放静态资源文件：
- 图片、图标等媒体资源
- 底部导航栏图标

### 文档目录 (.monkeycode/docs/)
存放项目相关的文档：
- 项目概述
- 任务追踪
- 技术规范
- 功能规格

### 规格目录 (.monkeycode/specs/)
存放功能规格说明文档（待添加）

## 文件命名规范

### 页面文件
- 文件夹：小写字母，多个单词用连字符连接（如：calculator, translator）
- 文件名：与文件夹名相同

### 组件文件
- 文件夹：小写字母，多个单词用连字符连接（如：feedback）
- 文件名：与文件夹名相同

### JavaScript文件
- 变量：camelCase（如：inputText, userName）
- 函数：camelCase，动词开头（如：getTranslation, handleInput）
- 常量：UPPER_SNAKE_CASE（如：MAX_RETRY_COUNT, API_TIMEOUT）

### 配置文件
- 与对应的页面或功能名称相同
- 使用描述性名称（如：beijing.js, general.js）

## 文件管理最佳实践

### 1. 文件组织
- 相关文件放在同一目录下
- 按功能模块组织代码
- 避免过深的嵌套层级（建议不超过3层）

### 2. 代码复用
- 公共组件放在components/目录
- 工具函数放在utils/目录
- 配置数据放在config/目录

### 3. 文件大小控制
- 单个JavaScript文件不超过1000行
- 单个组件文件不超过800行
- 超过建议拆分为多个文件

### 4. 文档维护
- 新功能需要更新TASK_TRACKING.md
- 重要修改需要更新CHANGELOG.md
- 定期更新PROJECT_OVERVIEW.md

### 5. 版本控制
- 使用.gitignore忽略不必要的文件
- 提交前检查改动内容
- 使用有意义的commit message

## 常见操作

### 创建新页面
```bash
# 1. 创建页面目录
mkdir -p pages/new-page

# 2. 创建页面文件
touch pages/new-page/new-page.js
touch pages/new-page/new-page.wxml
touch pages/new-page/new-page.wxss
touch pages/new-page/new-page.json

# 3. 在app.json中注册页面
```

### 创建新组件
```bash
# 1. 创建组件目录
mkdir -p components/new-component

# 2. 创建组件文件
touch components/new-component/new-component.js
touch components/new-component/new-component.wxml
touch components/new-component/new-component.wxss
touch components/new-component/new-component.json
```

### 添加新工具函数
```bash
# 1. 创建工具文件
touch utils/new-util.js

# 2. 导出工具函数
module.exports = {
  newFunction: function() { ... }
};
```

## 注意事项

1. **避免重复文件**
   - 检查是否存在相似功能的文件
   - 避免创建重复的配置或工具

2. **保持目录整洁**
   - 及时删除不再使用的文件
   - 避免在根目录直接创建文件

3. **文档同步**
   - 代码修改后更新相关文档
   - 保持文档与代码的一致性

4. **文件权限**
   - 确保文件具有正确的读写权限
   - 避免权限问题导致部署失败

## 维护记录

- 2026-02-06: 创建文件目录管理说明文档
- 随礼那点事儿项目组持续维护更新

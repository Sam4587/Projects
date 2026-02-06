# Git 推送操作指南

> 用户: Sam4587
> 仓库: https://github.com/Sam4587/Projects.git
> 目的: 推送代码以便通过 Git 获取项目文件

---

## 📋 准备工作

### 1. 确认提交内容

**最新提交记录**:
```
ff618de docs(邮件): 添加邮件申请项目文件草稿
9b611df refactor(文档): 整理下载相关文档到docs目录
e37ed39 docs(技术支持): 添加联系MonkeyCode技术支持模板
a4a8b32 docs(行动清单): 添加下载解决后的开发任务清单
234968f fix(翻译页面): 完善收藏功能和反馈按钮拖拽交互
```

**包含的修改**:
- ✅ 收藏功能完善(取消收藏、提示更新)
- ✅ 反馈按钮拖拽优化(角落磁吸)
- ✅ 下载相关文档(操作指南、问题分析、行动清单、邮件申请)

---

## 🔄 推送代码到 GitHub

### 方式 A: 使用 Git 命令行(推荐)

#### 步骤 1: 获取 Personal Access Token

1. **登录 GitHub**
   - 访问: https://github.com
   - 点击右上角头像
   - 选择 "Settings"

2. **生成 Token**
   - 左侧选择 "Developer settings"
   - 选择 "Personal access tokens" → "Tokens (classic)"
   - 点击 "Generate new token"
   - 勾选 `repo` 权限(仓库访问)
   - 设置过期时间(如 90 days)
   - 点击 "Generate token"
   - **重要**: 复制生成的 token(只显示一次)

#### 步骤 2: 推送代码

在项目目录打开命令行/终端,执行:

```bash
# 进入项目目录
cd /path/to/your/project

# 推送到 GitHub(会提示输入用户名和密码)
git push --set-upstream origin main

# 输入用户名
Username: Sam4587

# 输入密码(粘贴刚才复制的 Token)
Password: [粘贴您的 Token]
```

---

### 方式 B: 使用 GitHub Desktop(简单)

如果您不熟悉命令行:

1. **下载 GitHub Desktop**
   - 访问: https://desktop.github.com
   - 下载并安装

2. **克隆仓库**
   ```bash
   git clone https://github.com/Sam4587/Projects.git
   ```

3. **推送修改**
   - GitHub Desktop 会自动检测到修改
   - 点击 "Push origin" 按钮
   - 或者直接在界面中点击"Publish branch"

---

### 方式 C: 使用可视化工具

如果您使用其他 Git 客户端:
- **SourceTree**: https://www.sourcetreeapp.com/
- **TortoiseGit**: https://tortoisegit.org/
- **GitKraken**: https://www.gitkraken.com/

操作步骤:
1. 克隆或添加现有仓库
2. 推送本地修改
3. 确认远程仓库已更新

---

## 📞 推送成功后的操作

### 在 GitHub 上验证

推送成功后,访问以下链接确认:
- **仓库主页**: https://github.com/Sam4587/Projects
- **最新提交**: https://github.com/Sam4587/Projects/commits/main
- **文件列表**: https://github.com/Sam4587/Projects/tree/main

### 检查文件内容

确认以下文件已上传:
- ✅ `pages/translator/translator.js` (收藏功能)
- ✅ `components/feedback/feedback.js` (拖拽优化)
- ✅ `docs/` 目录下所有文档

---

## 🚀 获取项目文件

### 方式 1: 通过 Git Clone(最简单)

**推荐理由**:
- 最稳定可靠
- 不会遇到下载问题
- 可以追踪代码版本变化

**操作步骤**:

```bash
# 克隆仓库到本地
git clone https://github.com/Sam4587/Projects.git

# 进入项目目录
cd Projects

# 查看项目文件
ls -la
```

### 方式 2: 直接下载 ZIP

如果 Git clone 不可用,可以:
1. 访问仓库: https://github.com/Sam4587/Projects
2. 点击绿色 "Code" 按钮
3. 选择 "Download ZIP"
4. 下载并解压

---

## ⚠️ 常见问题

### 问题 1: 推送时提示认证失败

**原因**: GitHub 不再支持账户密码登录

**解决方法**:
- 必须使用 Personal Access Token
- Token 就是密码
- 不要输入 GitHub 账户密码

### 问题 2: 推送失败

**可能原因**:
- 网络问题
- Token 权限不足
- 本地和远程冲突

**解决方法**:
```bash
# 先拉取远程更新
git pull origin main

# 解决冲突后再推送
git push origin main
```

### 问题 3: Token 失效

**解决方法**:
1. 重新生成 Personal Access Token
2. 使用新 Token 进行推送

---

## 📝 推送成功后的下一步

1. **在本地解压项目文件**(如果通过 ZIP 下载)
2. **安装微信开发者工具**
3. **导入项目到开发者工具**
4. **测试已修复的功能**:
   - 收藏: 点击取消收藏
   - 反馈按钮: 拖拽测试
5. **开始新的开发任务**

---

**指南创建时间**: 2026-02-06 02:35
**下一步**: 推送代码后,通过 Git clone 获取项目

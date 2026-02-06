# 推送代码到 GitHub 操作指南

> 目的: 推送代码使您能通过 Git Clone 获取项目文件
> 用户: Sam4587
> 仓库: https://github.com/Sam4587/Projects.git
> 操作时间: 2026-02-06

---

## 🎯 任务目标

将本地 Git 仓库的代码推送到 GitHub,让您能够:
1. 通过 `git clone https://github.com/Sam4587/Projects.git` 获取项目文件
2. 开始本地开发环境配置
3. 测试已修复的收藏和反馈功能

---

## 📋 推送步骤(需要您执行)

### 步骤 1: 获取 GitHub Personal Access Token

#### 在浏览器中操作:

1. **登录 GitHub**
   - 访问: https://github.com
   - 使用您的账户登录

2. **进入设置**
   - 点击右上角头像
   - 选择 "Settings"

3. **创建 Token**
   - 左侧菜单选择 "Developer settings"
   - 点击 "Personal access tokens" → "Tokens (classic)"
   - 点击 "Generate new token" 绿色按钮

4. **配置 Token**
   - **Note**: 填写描述,如 "MonkeyCode Push"
   - **Expiration**: 选择 "90 days" 或 "No expiration"
   - **Select scopes**: 勾选 `repo` (完整仓库权限)
   - 点击底部的 "Generate token" 按钮

5. **复制 Token**
   - ⚠️ **重要**: Token 只会显示一次,立即复制保存!
   - Token 格式类似: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 步骤 2: 推送代码到 GitHub

#### 在项目目录的命令行/终端执行:

**如果您在项目目录**:
```bash
# 进入项目目录(如果不在)
cd /path/to/workspace

# 推送代码到 GitHub
git push --set-upstream origin main
```

**系统会提示**:
- **Username**: 输入 `Sam4587`
- **Password**: 粘贴刚才复制的 Token

**预期输出**:
```
Enumerating objects: x, done.
Counting objects: x, done.
Delta compression using up to x threads.
Compressing objects: 100% (x/x)
Writing objects: 100% (x/x)
Total x (delta x), reused x (delta x), pack-reused 0
To https://github.com/Sam4587/Projects.git
   * [new branch]            main
   1234567..abc1234 -> main
```

---

## ✅ 验证推送成功

### 在 GitHub 网站检查:

1. **访问仓库**
   - 地址: https://github.com/Sam4587/Projects
   - 确认能看到最新的提交

2. **检查最新提交**
   - 地址: https://github.com/Sam4587/Projects/commits/main
   - 应该能看到最新的文档提交

3. **验证文件列表**
   - 地址: https://github.com/Sam4587/Projects/tree/main
   - 确认能看到 `docs/` 目录和代码文件

---

## 📱 获取项目文件到本地

### 推送成功后执行:

**方式 1: 通过 Git Clone(推荐)**

```bash
# 克隆仓库到本地
git clone https://github.com/Sam4587/Projects.git

# 进入项目目录
cd Projects

# 查看项目文件
ls -la

# 应该看到:
# - pages/
# - components/
# - utils/
# - config/
# - docs/
# - 以及其他配置文件
```

**方式 2: 下载 ZIP(备选)**

如果 Git Clone 不可用:

1. **访问仓库**
   - 地址: https://github.com/Sam4587/Projects

2. **点击绿色 "Code" 按钮**
3. **选择 "Download ZIP"**
4. **下载并解压**

---

## 🛠️ 配置本地开发环境

### 安装微信开发者工具:

1. **下载微信开发者工具**
   - 地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 选择对应操作系统版本(Windows/Mac)
   - 下载并安装

2. **配置项目**
   - 打开微信开发者工具
   - 点击 "导入项目"
   - 选择 Git Clone 的 `Projects` 文件夹
   - 填写测试 AppID(如有)

---

## 🧪 测试已修复的功能

### 测试收藏功能(`pages/translator/translator.js`):

1. **打开翻译页面**
   - 输入祝福语并翻译

2. **测试收藏**
   - 点击收藏按钮,验证提示"已收藏"
   - 从收藏列表选择,验证内容填充
   - **关键测试**: 点击已收藏状态的按钮
     - 应该显示"已取消收藏"提示
     - 收藏列表中该项目应该被移除
     - 翻译结果应该显示为未收藏状态

3. **测试收藏列表更新**
   - 取消收藏后重新打开收藏列表
   - 确认已移除的项目不在列表中

### 测试反馈按钮拖拽(`components/feedback/feedback.js`):

1. **打开有反馈按钮的页面**

2. **测试拖拽到角落**
   - 拖拽按钮到屏幕左上角
   - **预期**: 自动吸附到安全位置,不停在角落
   - 按钮应该移动到距边缘 80px 的位置

3. **测试其他三个角落**
   - 右上角、左下角、右下角
   - 每个角落都应该触发磁吸保护

4. **测试正常拖拽**
   - 在安全区域(非角落)自由拖拽
   - 按钮应该跟随手指移动

---

## 📝 开发任务清单

推送成功后,可以参考 `docs/下载问题解决后的行动清单.md` 进行后续开发。

---

## ⚠️ 常见问题

### 问题 1: Token 提示认证失败

**原因**: GitHub 不再支持密码登录

**解决方法**:
- 确认使用 Personal Access Token 作为密码
- 不要使用 GitHub 账户密码

### 问题 2: 推送失败 - 权限不足

**错误信息**:
```
remote: Permission denied
```

**解决方法**:
1. 重新生成 Token,确保勾选 `repo` 权限
2. 使用新 Token 重新推送

### 问题 3: 推送失败 - 冲突

**错误信息**:
```
! [rejected] main -> main (fetch first)
```

**解决方法**:
```bash
# 先拉取远程更新
git pull origin main

# 解决冲突后再推送
git push origin main
```

---

## 💡 重要提示

### Token 保存
- Token 只会显示一次,建议保存到安全的地方
- Token 相当于密码,不要分享给他人
- 如果 Token 泄露,立即删除并重新生成

### 推送完成后
- 所有修改都会立即同步到 GitHub
- 您可以在任何地方通过 Git Clone 获取最新代码
- 微信开发者工具可以正常导入项目

---

**指南创建时间**: 2026-02-06 03:00
**下一步**: 等待您完成推送,开始本地开发

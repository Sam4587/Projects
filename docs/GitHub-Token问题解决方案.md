# GitHub Token 问题排查和解决方案

## 问题诊断

### 当前状态
- Token: `ghp_WBLj6ynPDmI1zF9BjbWo2UMWdb9o64E4uw8`
- 验证结果: 401 Bad credentials (无效的凭据)
- 错误原因: Token 无效、已过期或被撤销

---

## 解决方案

### 方案一：重新生成 Personal Access Token（推荐）

#### 步骤 1：访问 GitHub Token 设置
打开浏览器访问：
https://github.com/settings/tokens

#### 步骤 2：生成新 Token
1. 点击 "Generate new token" 按钮
2. 选择 Token 类型：
   - **Generate new token (classic)** - 适用于旧版 API
   - **Generate new token (fine-grained)** - 新版细粒度 Token

#### 步骤 3：配置 Token 权限（classic 模式）
勾选以下权限：
- `repo` - 完整的仓库访问权限（必需）
  - `repo:status` - 仓库状态
  - `repo_deployment` - 部署权限
  - `public_repo` - 公开仓库访问
  - `repo:invite` - 邀请协作者

#### 步骤 4：设置 Token 有效期
- 选择有效期：30天 / 60天 / 90天 / 无有效期
- **重要**: 选择"无有效期"最方便，但安全性较低

#### 步骤 5：生成并复制
1. 点击"Generate token"按钮
2. **立即复制生成的 Token**（只会显示一次）
3. 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxx`

#### 步骤 6：配置 Git 使用新 Token
```bash
# 方法 A: 配置远程仓库 URL（推荐）
git remote set-url origin https://YOUR_TOKEN@github.com/Sam4587/Projects.git

# 替换 YOUR_TOKEN 为实际 Token，例如：
git remote set-url origin https://ghp_NEW_TOKEN_HERE@github.com/Sam4587/Projects.git

# 方法 B: 使用 Git Credential Helper（临时）
git config credential.helper store
git push
# 然后输入用户名: Sam4587
# 然后粘贴新 Token 作为密码
```

#### 步骤 7：推送代码
```bash
git push
```

---

### 方案二：使用 SSH 密钥（更安全）

#### 步骤 1：生成 SSH 密钥对
在本地电脑（不是 MonkeyCode 平台）执行：
```bash
# Windows (Git Bash)
ssh-keygen -t ed25519 -C "sam_chun@126.com" -f ~/.ssh/id_ed25519

# 或使用 RSA（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "sam_chun@126.com" -f ~/.ssh/id_rsa
```

#### 步骤 2：复制公钥
```bash
# Windows (Git Bash)
cat ~/.ssh/id_ed25519.pub | clip

# 或手动打开文件复制
notepad ~/.ssh/id_ed25519.pub
```

#### 步骤 3：添加 SSH 公钥到 GitHub
1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. Title: 填入 `MonkeyCode Key`
4. Key: 粘贴刚才复制的公钥内容
5. 点击 "Add SSH key"

#### 步骤 4：配置 Git 使用 SSH
```bash
# 查看当前远程仓库 URL
git remote -v

# 切换为 SSH URL
git remote set-url origin git@github.com:Sam4587/Projects.git

# 测试连接
ssh -T git@github.com
```

#### 步骤 5：推送代码
```bash
git push
```

---

## 当前项目状态

### 本地仓库
- 位置: `/workspace`
- 分支: `main`
- 已提交: 3 次提交（包含最近的修复）
- 状态: 待推送到远程

### 远程仓库
- URL: `https://github.com/Sam4587/Projects`
- 状态: 无法访问（Token 无效）
- GitHub 页面: https://github.com/Sam4587/Projects

---

## 验证 Token 的正确步骤

### 1. 确认 Token 有效性
```bash
# 替换 TOKEN 为实际值
curl -H "Authorization: token TOKEN" https://api.github.com/user

# 成功返回用户信息，失败返回 401
```

### 2. 确认仓库访问权限
```bash
# 查看仓库信息
curl -H "Authorization: token TOKEN" https://api.github.com/repos/Sam4587/Projects

# 返回仓库信息表示有权限，403 表示无权限
```

---

## MonkeyCode 平台开发

由于 GitHub 推送问题，建议：

### 当前优势
1. 代码已保存在 MonkeyCode 工作空间
2. 微信开发者工具可以直接访问 `/workspace` 目录
3. 无需担心 GitHub 同步问题

### 开发流程
1. 在 MonkeyCode 平台编写/修改代码
2. 使用微信开发者工具打开 `/workspace` 项目
3. 实时测试和调试
4. 代码自动保存到 MonkeyCode

### 代码备份策略
- 方案 A: 定期下载完整项目代码（zip 格式）
- 方案 B: 解决 GitHub Token 问题后，手动推送
- 方案 C: 使用其他 Git 平台（Gitee、GitLab）

---

## 快速参考

### Git 常用命令
```bash
# 查看远程仓库
git remote -v

# 配置远程仓库 URL（HTTPS）
git remote set-url origin https://TOKEN@github.com/USERNAME/REPO.git

# 配置远程仓库 URL（SSH）
git remote set-url origin git@github.com:USERNAME/REPO.git

# 推送代码
git push
git push -u origin main  # 首次推送设置上游

# 查看提交历史
git log --oneline
```

### Token 格式检查
- 正确格式: `ghp_xxxxxxxxxxxxxxxxxxxxxxxx`
- 前缀: `ghp_` (Personal Access Token)
- 长度: 通常 40 字符
- 字符: 字母数字混合

---

## 下一步行动

1. **立即操作**: 在 GitHub 生成新的 Personal Access Token
2. **验证 Token**: 使用 `curl` 命令验证 Token 有效性
3. **配置 Git**: 使用新 Token 配置远程仓库 URL
4. **推送代码**: 执行 `git push` 推送最新修改

如果遇到其他问题，请查看：
- GitHub 官方文档: https://docs.github.com/authentication
- Git 文档: https://git-scm.com/doc

---

**文档版本**: v1.0
**最后更新**: 2026-02-06
**状态**: Token 无效，需要重新生成

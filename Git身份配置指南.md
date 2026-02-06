# Git 身份配置指南

> 从 Token 切换到 SSH 密钥认证
> 用户: Sam4587

---

## 🔴 删除现有 Token 配置

### 步骤 1: 删除 Git 保存的 Token

如果之前配置过 Token 作为密码,需要先删除:

**Windows 用户**:
```bash
# 打开凭据管理器
# 找到 GitHub 的凭据
# 删除或编辑
```

**Mac/Linux 用户**:
```bash
# 打开凭据管理器
git credential-manager delete https://github.com

# 或者直接删除凭据文件
rm ~/.git-credentials
rm ~/.git-credentials-osxkeychain
```

---

## 🔑 生成 SSH 密钥

### 步骤 1: 检查是否已有 SSH 密钥

```bash
# 查看是否已有 SSH 密钥
ls -la ~/.ssh/id_rsa*

# 如果已有,可以直接使用
# 如果没有,需要生成新密钥
```

### 步骤 2: 生成新的 SSH 密钥

```bash
# 生成 RSA 密钥(推荐 4096 位)
ssh-keygen -t rsa -b 4096 -C "sam_chun@126.com"

# 或生成 ED25519 密钥(更安全)
ssh-keygen -t ed25519 -C "sam_chun@126.com"

# 生成时按 Enter 使用默认设置
# 不需要设置密码(方便自动推送)
```

### 步骤 3: 查看生成的密钥

```bash
# 查看公钥内容
cat ~/.ssh/id_rsa.pub

# 或查看 ED25519 公钥
cat ~/.ssh/id_ed25519.pub
```

---

## 📤 添加 SSH 密钥到 GitHub

### 步骤 1: 复制公钥

```bash
# 复制公钥到剪贴板(RSA)
cat ~/.ssh/id_rsa.pub | clip

# 或复制 ED25519 公钥
cat ~/.ssh/id_ed25519.pub | clip

# 如果不支持 clip 命令,手动复制
```

### 步骤 2: 添加到 GitHub

1. **登录 GitHub**
   - 访问: https://github.com

2. **进入 SSH 设置**
   - 点击右上角头像
   - 选择 "Settings"

3. **添加 SSH 密钥**
   - 左侧选择 "SSH and GPG keys"
   - 点击 "New SSH key"
   - 填写:
     - **Title**: My Computer (或任意名称)
     - **Key**: 粘贴刚才复制的公钥内容
     - Key type: 保持默认 "Authentication Key"
   - 点击 "Add SSH key"

---

## 🔄 配置 Git 使用 SSH

### 步骤 1: 测试 SSH 连接

```bash
# 测试连接到 GitHub
ssh -T git@github.com

# 第一次连接会提示:
# The authenticity of host 'github.com' can't be established.
# Are you sure you want to continue connecting (yes/no)?
# 输入: yes

# 成功会显示:
# Hi sam4587! You've successfully authenticated...
```

### 步骤 2: 配置仓库使用 SSH

**方法 A: 修改现有仓库**

```bash
# 进入项目目录
cd /path/to/Projects

# 修改远程 URL 为 SSH
git remote set-url origin git@github.com:Sam4587/Projects.git

# 验证远程 URL
git remote -v

# 推送(不再需要密码)
git push origin main
```

**方法 B: 克隆时直接使用 SSH**

```bash
# 克隆使用 SSH(以后直接用这个命令)
git clone git@github.com:Sam4587/Projects.git
```

---

## ✅ 验证 SSH 配置成功

### 测试推送

```bash
# 现在推送应该不需要输入密码
git push origin main

# 如果成功,会显示:
# To git@github.com:Sam4587/Projects.git
#   main -> main
```

### 查看远程配置

```bash
# 确认远程 URL 是 SSH 格式
git remote -v

# 应该显示:
# origin  git@github.com:Sam4587/Projects.git (fetch)
# origin  git@github.com:Sam4587/Projects.git (push)
```

---

## 🔒 SSH 密钥的优势

### 相比 Token 的优势

1. **更安全**
   - 密钥加密强度更高
   - 不需要在代码中存储敏感信息

2. **更方便**
   - 配置一次,永久使用
   - 不需要每次输入 Token

3. **支持多仓库**
   - 同一个密钥可以访问所有仓库
   - 不需要为每个仓库配置

4. **可以设置密码**
   - 增加密密钥保护
   - 即使电脑被盗用也安全

---

## ⚠️ 常见问题

### 问题 1: SSH 连接被拒绝

**错误信息**:
```
Permission denied (publickey)
```

**解决方法**:
1. 检查公钥是否正确添加到 GitHub
2. 确认私钥文件存在且权限正确
3. 尝试重新生成密钥

### 问题 2: 仍然提示输入密码

**原因**: 远程 URL 还是 HTTPS 格式

**解决方法**:
```bash
# 修改为 SSH URL
git remote set-url origin git@github.com:Sam4587/Projects.git
```

### 问题 3: Host key verification failed

**解决方法**:
```bash
# 删除旧的 known_hosts 记录
ssh-keygen -R github.com

# 重新测试连接
ssh -T git@github.com
```

---

## 📝 完整操作流程总结

### 第一次配置(需要执行的步骤)

1. [ ] 生成 SSH 密钥: `ssh-keygen -t ed25519 -C "sam_chun@126.com"`
2. [ ] 复制公钥: `cat ~/.ssh/id_ed25519.pub`
3. [ ] 添加到 GitHub: Settings → SSH and GPG keys → New SSH key
4. [ ] 测试连接: `ssh -T git@github.com`
5. [ ] 修改远程 URL: `git remote set-url origin git@github.com:Sam4587/Projects.git`
6. [ ] 推送测试: `git push origin main`

### 后续使用(配置完成后)

```bash
# 克隆新仓库时直接使用 SSH
git clone git@github.com:Sam4587/Projects.git

# 推送时不再需要密码
git push origin main
```

---

**指南创建时间**: 2026-02-06 02:45
**下一步**: 按照步骤配置 SSH 密钥

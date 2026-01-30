# 钉钉机器人环境变量配置指南

## 🔧 推荐服务器部署方式 (更安全)

### Vercel 平台设置
1. 登录 [Vercel 控制台](https://vercel.com/)
2. 打开您的钉钉API项目 (dingtalk-api)
3. 点击 "Project Settings" → "Environment Variables"
4. 添加两个环境变量：

| 变量名 | 变量值 |
|--------|--------|
| `DINGTALK_TOKEN` | `88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a` |
| `DINGTALK_SECRET` | `SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc` |

5. 点击 "Save"
6. 重新部署项目

### 本地开发环境设置

创建 `.env` 文件在项目根目录：

```env
DINGTALK_TOKEN=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a
DINGTALK_SECRET=SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc
```

## ⚠️ 重要安全说明

1. **敏感信息保护**
   - `.env` 文件要添加到 `.gitignore`
   - 不要将配置文件提交到代码仓库
   - 生产环境必须使用环境变量方式

2. **测试消息验证**
   配置完成后，可以发送测试消息验证：
   ```text
   【随礼那点事儿】用户反馈系统配置测试 - 一切正常！
   ```

## 🔒 回退方案

如果环境变量设置失败，代码会自动回退到配置文件中的占位符值，但无法发送真实消息。

```javascript
// 配置读取优先级
webhook: process.env.DINGTALK_TOKEN 
  ? `https://oapi.dingtalk.com/robot/send?access_token=${process.env.DINGTALK_TOKEN}`
  : 'https://oapi.dingtalk.com/robot/send?access_token=你的钉钉token', // 占位符
```

---
*数据安全第一，请妥善保管您的Token和Secret*

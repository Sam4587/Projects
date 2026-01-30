# 钉钉反馈API部署指南

## 🚀 快速部署到Vercel (推荐)

### 方法1：一键部署按钮

点击下方按钮即可将钉钉API一键部署到Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo&env=DINGTALK_TOKEN,DINGTALK_SECRET&envDescription=钉钉机器人Token和Secret&envLink=https%3A%2F%2Fdevelopers.dingtalk.com%2Fdoc%2Frobot%2Ffaq)

### 方法2：手动部署步骤

1. **安装Vercel CLI** (如未安装)
   ```bash
   npm install -g vercel
   ```

2. **进入钉钉API目录**
   ```bash
   cd D:\Projects\redpacket-advisor\dingtalk-api
   ```

3. **登录Vercel账户**
   ```bash
   vercel login
   ```

4. **部署项目**
   ```bash
   vercel --prod
   ```

5. **在Vercel控制台设置环境变量**
   - 进入 [Vercel Dashboard](https://vercel.com/dashboard)
   - 打开刚才部署的项目
   - 点击 "Settings" → "Environment Variables"
   - 添加变量：
     - `DINGTALK_TOKEN` = `88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a`
     - `DINGTALK_SECRET` = `SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc`

## 🔧 API接口说明

### 发送文本消息
```bash
POST https://your-vercel-app.vercel.app/api/send
Content-Type: application/json

{
  "message": "用户反馈内容",
  "title": "反馈标题（可选）",
  "userId": "用户ID（可选）",
  "page": "页面名称（可选）"
}
```

### 成功响应
```json
{
  "success": true,
  "message": "发送成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述"
}
```

## 🧪 测试API是否正常工作

### 使用curl测试
```bash
curl -X POST https://your-vercel-app.vercel.app/api/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "【随礼那点事儿】API测试消息 - 部署成功！",
    "title": "🎉 部署验证"
  }'
```

### 使用JavaScript测试
```javascript
// 在小程序中测试
wx.request({
  url: 'https://your-vercel-app.vercel.app/api/send',
  method: 'POST',
  data: {
    message: '来自小程序的反馈',
    title: '用户反馈',
    userId: 'wx_user_123',
    page: 'calculator'
  },
  success: (res) => {
    if (res.data.success) {
      wx.showToast({
        title: '反馈发送成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '发送失败: ' + res.data.error,
        icon: 'none'
      });
    }
  },
  fail: (error) => {
    wx.showToast({
      title: '网络异常',
      icon: 'none'
    });
  }
});
```

## 🔒 安全配置

### 环境变量保护
- `DINGTALK_TOKEN` 和 `DINGTALK_SECRET` **必须** 通过环境变量设置
- 不要在代码中硬编码这些敏感信息
- 使用Vercel的环境变量管理功能

### 验证配置是否生效
```bash
# 临时输出环境变量值检查（仅调试用）
vercel env pull .env.development.local
cat .env.development.local | grep DINGTALK
```

## ⚠️ 常见问题

### Q: 钉钉机器人收不到消息？
A: 检查以下几点：
1. 环境变量是否正确设置
2. 机器人是否已在群里
3. webhook地址是否包含正确的access_token
4. 签名密钥是否输入正确

### Q: 部署后访问API返回500错误？
A: 查看Vercel的log：
```bash
vercel logs your-project-name
```

### Q: 如何本地开发测试？
A: 创建本地 `.env` 文件：
```env
DINGTALK_TOKEN=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a
DINGTALK_SECRET=SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc
```

然后运行：
```bash
cd dingtalk-api
vercel dev
```

## 📞 机器人效果预览

配置成功后，您的用户提交反馈时，钉钉群将收到如下消息：

```text
用户提交反馈

评分: 5 ⭐
类型: 功能建议
内容: 建议添加更多节日祝福语
联系方式: user@example.com
页面: translator
用户ID: wx_user_123

---
来自随礼那点事儿小程序
```

---
*API部署完成后即可投入使用*

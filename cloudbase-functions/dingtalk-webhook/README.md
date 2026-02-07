# 钉钉 Webhook 云函数

这个云函数用于在微信小程序中转发消息到钉钉机器人，绕过微信小程序的域名白名单限制。

## 功能说明

微信小程序有严格的域名白名单限制，不允许直接调用钉钉 API (`https://oapi.dingtalk.com`)。这个云函数作为中间层，接收小程序的请求，然后转发到钉钉 API。

## 部署步骤

### 1. 上传云函数

在微信开发者工具中：

1. 右键点击 `cloudbase-functions/dingtalk-webhook` 文件夹
2. 选择 "上传并部署：云端安装依赖"
3. 等待部署完成

### 2. 配置钉钉机器人

云函数中已经内置了钉钉机器人的配置：

```javascript
const DINGTALK_CONFIG = {
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a',
  secret: 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc'
};
```

如果需要更换钉钉机器人，请修改 `index.js` 中的配置。

## 使用方法

### 在小程序中调用

```javascript
// 发送消息到钉钉
wx.cloud.callFunction({
  name: 'dingtalk-webhook',
  data: {
    action: 'send',
    data: {
      msgtype: 'markdown',
      markdown: {
        title: '消息标题',
        text: '消息内容'
      }
    }
  }
}).then(res => {
  console.log('发送成功:', res);
}).catch(err => {
  console.error('发送失败:', err);
});
```

### 测试连通性

```javascript
wx.cloud.callFunction({
  name: 'dingtalk-webhook',
  data: {
    action: 'test'
  }
}).then(res => {
  console.log('测试结果:', res);
});
```

## 云函数接口

### action: 'send'

发送消息到钉钉机器人。

**请求参数：**

```javascript
{
  action: 'send',
  data: {
    msgtype: 'text' | 'markdown',
    text: {
      content: '文本消息内容'
    },
    markdown: {
      title: '标题',
      text: 'Markdown 内容'
    }
  }
}
```

**返回值：**

```javascript
{
  code: 0,  // 0 表示成功
  data: {
    success: true,
    data: { errcode: 0, errmsg: 'ok' }
  },
  message: '发送成功'
}
```

### action: 'test'

测试钉钉机器人连通性，发送一条测试消息。

**请求参数：**

```javascript
{
  action: 'test'
}
```

**返回值：**

```javascript
{
  code: 0,
  data: {
    success: true,
    data: { errcode: 0, errmsg: 'ok' }
  },
  message: '测试成功'
}
```

## 错误处理

云函数会返回统一的错误格式：

```javascript
{
  code: -1,
  message: '错误描述'
}
```

常见错误：

- **云函数调用失败**: 检查云函数是否正确部署
- **发送失败**: 检查钉钉机器人配置是否正确
- **签名不匹配**: 检查 webhook URL 和 secret 是否正确

## 注意事项

1. 云函数使用 Node.js 的 `crypto` 模块生成签名，不需要额外的依赖
2. 签名生成逻辑严格遵循钉钉官方文档规范
3. 云函数会自动重试失败的网络请求（可配置重试次数）
4. 建议在生产环境添加请求限流和错误监控

## 相关文件

- `index.js` - 云函数主逻辑
- `package.json` - 依赖配置
- `../utils/dingtalk-feedback-miniprogram.js` - 小程序端调用封装

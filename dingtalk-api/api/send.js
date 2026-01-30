const crypto = require('crypto');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, title, userId, page } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // 从环境变量获取钉钉配置
    // ⚠️ 上线前必须设置环境变量，不能依赖默认值
    const DINGTALK_TOKEN = process.env.DINGTALK_TOKEN;
    const DINGTALK_SECRET = process.env.DINGTALK_SECRET;

    if (!DINGTALK_TOKEN || !DINGTALK_SECRET) {
      res.status(500).json({ error: 'DingTalk configuration missing' });
      return;
    }

    // 准备消息内容
    const timestamp = Date.now();
    const stringToSign = `${timestamp}\n${DINGTALK_SECRET}`;
    
    // 使用HmacSHA256算法计算签名，然后进行Base64 encode，最后再进行urlEncode
    const signature = crypto.createHmac('sha256', DINGTALK_SECRET)
      .update(stringToSign, 'utf8')  // 明确指定UTF-8编码
      .digest('base64');
    
    // 构建 DingTalk webhook URL，确保timestamp和sign都在URL中
    const url = `https://oapi.dingtalk.com/robot/send?access_token=${DINGTALK_TOKEN}&timestamp=${timestamp}&sign=${encodeURIComponent(signature)}`;
    
    // 准备文本消息
    let textContent = message;
    if (title) textContent += `\n\n标题: ${title}`;
    if (userId) textContent += `\n用户ID: ${userId}`;
    if (page) textContent += `\n页面: ${page}`;
    textContent += '\n\n---\n来自随礼那点事儿小程序';
    
    // 发送请求到钉钉
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content: textContent
        }
      })
    });

    const result = await response.json();
    
    if (result.errcode === 0) {
      res.status(200).json({ 
        success: true, 
        message: '反馈已成功发送到钉钉',
        msgId: result.msgid
      });
    } else {
      res.status(500).json({ 
        error: `钉钉发送失败: ${result.errmsg}`,
        errcode: result.errcode
      });
    }
    
  } catch (error) {
    console.error('Error sending to DingTalk:', error);
    res.status(500).json({ 
      error: '发送消息时发生错误',
      details: error.message
    });
  }
};

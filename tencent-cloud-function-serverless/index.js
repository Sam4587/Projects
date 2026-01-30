const crypto = require('crypto');
const http = require('http');
const https = require('https');

// 自动选择http/https模块
const fetch = (url, options) => {
  const client = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => JSON.parse(data)
          });
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

exports.main_handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      isBase64Encoded: false,
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let body;
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, 'base64').toString('utf8');
    } else {
      body = event.body || '{}';
    }
    
    const { message, title, userId, page } = JSON.parse(body);

    if (!message) {
      return {
        isBase64Encoded: false,
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // 从环境变量获取钉钉配置
    const DINGTALK_TOKEN = process.env.DINGTALK_TOKEN;
    const DINGTALK_SECRET = process.env.DINGTALK_SECRET;

    if (!DINGTALK_TOKEN || !DINGTALK_SECRET) {
      return {
        isBase64Encoded: false,
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({ error: 'DingTalk configuration missing' })
      };
    }

    // 准备消息内容
    const timestamp = Date.now();
    const stringToSign = `${timestamp}\n${DINGTALK_SECRET}`;
    const signature = crypto.createHmac('sha256', DINGTALK_SECRET)
      .update(stringToSign)
      .digest('base64');

    // 构建钉钉webhook URL
    const url = `https://oapi.dingtalk.com/robot/send?access_token=${DINGTALK_TOKEN}&timestamp=${timestamp}&sign=${encodeURIComponent(signature)}`;

    // 准备文本消息
    let textContent = message;
    if (title) textContent += `\n\n标题: ${title}`;
    if (userId) textContent += `\n用户ID: ${userId}`;
    if (page) textContent += `\n页面: ${page}`;
    textContent += '\n\n---\n来自随礼那点事儿小程序';

    // 发送到钉钉
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
      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          success: true,
          message: '反馈已成功发送到钉钉',
          msgId: result.msgid
        })
      };
    } else {
      return {
        isBase64Encoded: false,
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          error: `钉钉发送失败: ${result.errmsg}`,
          errcode: result.errcode
        })
      };
    }

  } catch (error) {
    console.error('Error sending to DingTalk:', error);
    return {
      isBase64Encoded: false,
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: '发送消息时发生错误',
        details: error.message
      })
    };
  }
};
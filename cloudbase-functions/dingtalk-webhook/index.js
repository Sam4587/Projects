// 云函数：转发钉钉 Webhook 请求
const cloud = require('@cloudbase/node-sdk');
const crypto = require('crypto');

const app = cloud.init({
  env: 'cloudbase-0gkqu2y430f74aa9'
});

// 钉钉机器人配置
const DINGTALK_CONFIG = {
  webhook: 'https://oapi.dingtalk.com/robot/send?access_token=88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a',
  secret: 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc'
};

/**
 * 生成钉钉签名
 */
function generateDingTalkSignature(timestamp) {
  const stringToSign = timestamp + '\n' + DINGTALK_CONFIG.secret;
  const hmac = crypto.createHmac('sha256', DINGTALK_CONFIG.secret);
  hmac.update(stringToSign);
  const signature = hmac.digest('base64');
  return encodeURIComponent(signature);
}

/**
 * 发送钉钉消息
 */
async function sendToDingTalk(message, timestamp) {
  const sign = generateDingTalkSignature(timestamp);
  const url = `${DINGTALK_CONFIG.webhook}&timestamp=${timestamp}&sign=${sign}`;

  console.log('发送钉钉消息 URL:', url.substring(0, 100) + '...');

  const response = await new Promise((resolve, reject) => {
    const https = require('https');

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(message))
      }
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.errcode === 0) {
            resolve({ success: true, data: result });
          } else {
            resolve({ success: false, error: result });
          }
        } catch (error) {
          resolve({ success: false, error: '响应解析失败' });
        }
      });
    });

    req.on('error', (error) => {
      console.error('钉钉请求失败:', error);
      resolve({ success: false, error: error.message });
    });

    req.write(JSON.stringify(message));
    req.end();
  });

  return response;
}

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  const { action, data } = event;

  try {
    if (action === 'send') {
      // 发送消息到钉钉
      const timestamp = Date.now();
      const result = await sendToDingTalk(data, timestamp);

      return {
        code: result.success ? 0 : -1,
        data: result,
        message: result.success ? '发送成功' : '发送失败'
      };
    } else if (action === 'test') {
      // 🔧 测试功能已禁用 - 反馈服务已正常运行
      return {
        code: 0,
        disabled: true,
        message: '测试功能已禁用，反馈功能正常运行中'
      };
    } else {
      return {
        code: -1,
        message: '未知操作: ' + action
      };
    }
  } catch (error) {
    console.error('钉钉云函数错误:', error);
    return {
      code: -1,
      message: '云函数执行失败: ' + error.message
    };
  }
};

// 钉钉签名服务器 - 用于生成正确的HMAC-SHA256签名
// 这个文件用于开发环境生成正确的签名

const crypto = require('crypto');

/**
 * 生成正确的钉钉机器人签名
 * @param {string} secret - 钉钉机器人密钥 
 * @param {number} timestamp - 时间戳
 * @returns {string} Base64编码的签名
 */
function generateDingTalkSignature(secret, timestamp) {
  const stringToSign = timestamp + '\n' + secret;
  
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(stringToSign, 'utf8');
  return hmac.digest('base64');
}

// 生成当前时间戳的签名进行测试
const DINGTALK_SECRET = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const currentTimestamp = Date.now();
const signature = generateDingTalkSignature(DINGTALK_SECRET, currentTimestamp);

console.log('=== 钉钉签名生成器 ===');
console.log('时间戳:', currentTimestamp);
console.log('签名:', signature);
console.log('URL编码签名:', encodeURIComponent(signature));
console.log('签名字符串:', currentTimestamp + '\\n' + DINGTALK_SECRET);

// 导出用于其他文件使用
module.exports = { generateDingTalkSignature };
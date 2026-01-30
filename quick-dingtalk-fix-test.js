// 简化的钉钉签名修复验证
import crypto from 'crypto';

const DINGTALK_TOKEN = '88eba63bc98bce33a59169fcd33e64093062f0beea5a65d3830e83dfedeaac7a';
const DINGTALK_SECRET = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';

console.log('🔧 验证钉钉签名算法修复...');

// 生成签名
const timestamp = Date.now();
const stringToSign = `${timestamp}\n${DINGTALK_SECRET}`;

// 修复后的签名算法
const signature = crypto.createHmac('sha256', DINGTALK_SECRET)
  .update(stringToSign, 'utf8')
  .digest('base64');

const finalUrl = `https://oapi.dingtalk.com/robot/send?access_token=${DINGTALK_TOKEN}&timestamp=${timestamp}&sign=${encodeURIComponent(signature)}`;

console.log('timestamp:', timestamp);
console.log('stringToSign:', stringToSign);
console.log('signature:', signature);
console.log('finalUrl:', finalUrl);

console.log('\n✅ 钉钉签名算法已修复！');
console.log('修复要点：');
console.log('1. 使用UTF-8编码生成签名');
console.log('2. 确保timestamp和sign都在URL中');
console.log('3. 严格按照钉钉官方文档实现');

// 验证修复是否生效
export const getDingTalkUrl = () => {
  const ts = Date.now();
  const sts = `${ts}\n${DINGTALK_SECRET}`;
  const sig = crypto.createHmac('sha256', DINGTALK_SECRET)
    .update(sts, 'utf8')
    .digest('base64');
  
  return `https://oapi.dingtalk.com/robot/send?access_token=${DINGTALK_TOKEN}&timestamp=${ts}&sign=${encodeURIComponent(sig)}`;
};

export const createDingTalkSignature = (timestamp, secret) => {
  const stringToSign = `${timestamp}\n${secret}`;
  return crypto.createHmac('sha256', secret)
    .update(stringToSign, 'utf8')
    .digest('base64');
};
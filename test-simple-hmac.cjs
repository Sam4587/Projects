// 测试简单版HMAC
const { hmacSHA256 } = require('./utils/hmac-sha256-simple.cjs');

// 测试参数
const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const timestamp = 1769673852247;
const stringToSign = timestamp + '\n' + secret;

console.log('=== 简单版HMAC测试 ===');
const result = hmacSHA256(secret, stringToSign);
console.log('结果:', result);
console.log('预期:', 'ij6XSnXGHCVLUymhgdPIeATSRBDuInhN1GufYuJiFEU=');
console.log('匹配:', result === 'ij6XSnXGHCVLUymhgdPIeATSRBDuInhN1GufYuJiFEU=');
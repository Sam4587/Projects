// 调试HMAC实现问题
const crypto = require('crypto');

function nodeHmac(key, message) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(message, 'utf8');
  return hmac.digest('base64');
}

// 测试参数
const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const timestamp = 1769673852247;
const stringToSign = timestamp + '\n' + secret;

console.log('输入参数:');
console.log('secret:', secret);
console.log('timestamp:', timestamp);
console.log('stringToSign:', stringToSign);
console.log('stringToSign length:', stringToSign.length);
console.log('stringToSign bytes:', Buffer.from(stringToSign, 'utf8'));

// Node.js HMAC
const nodeResult = nodeHmac(secret, stringToSign);
console.log('\nNode.js HMAC-SHA256:', nodeResult);

// 测试密钥长度
const secretBytes = Buffer.from(secret, 'utf8');
console.log('\n密钥信息:');
console.log('密钥字节长度:', secretBytes.length);
console.log('密钥是否超过64字节:', secretBytes.length > 64);

// 测试用手动SHA256哈希
const secretHash = crypto.createHash('sha256').update(secret, 'utf8').digest();
console.log('密钥SHA256哈希:', secretHash.toString('hex'));
console.log('密钥SHA256哈希长度:', secretHash.length);

// 验证预期的签名
const expectedSignature = 'ij6XSnXGHCVLUymhgdPIeATSRBDuInhN1GufYuJiFEU=';
console.log('\n预期签名:', expectedSignature);
console.log('Node实际签名:', nodeResult);
console.log('是否匹配:', nodeResult === expectedSignature);
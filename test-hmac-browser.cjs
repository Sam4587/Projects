const { hmacSHA256 } = require('./utils/hmac-sha256-browser.cjs');

const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const timestamp = 1769673852247;
const stringToSign = timestamp + '\n' + secret;

const signature = hmacSHA256(secret, stringToSign);
console.log('timestamp:', timestamp);
console.log('signature (browser):', signature);
console.log('urlEncoded (browser):', encodeURIComponent(signature));

// Compare with Node
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', secret);
hmac.update(stringToSign, 'utf8');
const signatureNode = hmac.digest('base64');
console.log('signature (node):', signatureNode);
console.log('urlEncoded (node):', encodeURIComponent(signatureNode));

console.log('Matches?', signature === signatureNode);
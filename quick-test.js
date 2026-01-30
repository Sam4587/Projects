import { createHmac } from 'crypto';

const ts = 1769673872473;
const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
const stringToSign = ts + '\n' + secret;
const hmac = createHmac('sha256', secret);
hmac.update(stringToSign, 'utf8');
const signature = hmac.digest('base64');
console.log('timestamp:', ts);
console.log('signature:', signature);
console.log('urlEncoded:', encodeURIComponent(signature));

import { createHmac } from 'crypto';

const key = 'key';
const data = 'The quick brown fox jumps over the lazy dog';
const hmac = createHmac('sha256', key);
hmac.update(data);
const signature = hmac.digest('base64');
console.log(signature); //  f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8

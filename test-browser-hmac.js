// test-browser-hmac.js
// 用 node 执行来验证 browser hmac 与 node 一致

// 用 node-crypto 模拟
import { createHmac } from 'crypto';

// 模拟 browser 的 TextEncoder polyfill
class TextEncoderPolyfill {
  encode(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push(0xc0 | (code >> 6));
        bytes.push(0x80 | (code & 0x3f));
      } else if (code < 0x10000) {
        bytes.push(0xe0 | (code >> 12));
        bytes.push(0x80 | ((code >> 6) & 0x3f));
        bytes.push(0x80 | (code & 0x3f));
      }
    }
    return new Uint8Array(bytes);
  }
}

// 复制 utils/hmac-sha256-browser.js 里的实现
function utf8ToBytes(str) {
  return Array.from(new TextEncoderPolyfill().encode(str));
}

function bytesToBase64(bytes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = bytes[i + 1] || 0;
    const c = bytes[i + 2] || 0;

    const n = (a << 16) | (b << 8) | c;

    result += chars[(n >> 18) & 0x3f];
    result += chars[(n >> 12) & 0x3f];
    // padding
    if (i + 1 < bytes.length) result += chars[(n >> 6) & 0x3f];
    else result += '=';
    if (i + 2 < bytes.length) result += chars[n & 0x3f];
    else result += '=';
  }

  return result;
}

function sha256(bytes) {
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19, 0x71374491, 0x3c6ef372
  ];

  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  // 预处理
  const len = bytes.length;
  const bitLen = len * 8;

  const padBytes = [0x80];
  const zeroBytesNeeded = (64 - ((len + 1 + 8) % 64)) % 64;
  for (let i = 0; i < zeroBytesNeeded; i++) padBytes.push(0x00);

  for (let i = 0; i < 8; i++) {
    padBytes.push((bitLen >>> (56 - i * 8)) & 0xff);
  }

  const paddedBytes = [...bytes, ...padBytes];

  const numBlocks = paddedBytes.length / 64;

  // 分块处理
  for (let block = 0; block < numBlocks; block++) {
    const w = new Array(64);

    for (let i = 0; i < 16; i++) {
      const offset = block * 64 + i * 4;
      w[i] = (paddedBytes[offset] << 24) | (paddedBytes[offset + 1] << 16) | (paddedBytes[offset + 2] << 8) | paddedBytes[offset + 3];
    }

    for (let i = 16; i < 64; i++) {
      const s0 = ((w[i - 15] >>> 7) | (w[i - 15] << 25)) ^ ((w[i - 15] >>> 18) | (w[i - 15] << 14)) ^ (w[i - 15] >>> 3);
      const s1 = ((w[i - 2] >>> 17) | (w[i - 2] << 15)) ^ ((w[i - 2] >>> 19) | (w[i - 2] << 13)) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;
    }

    // 主循环
    let a = h[0], b = h[1], c = h[2], d = h[3];
    let e = h[4], f = h[5], g = h[6], hh = h[7];

    for (let i = 0; i < 64; i++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + k[i % k.length] + w[i]) & 0xffffffff;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) & 0xffffffff;

      hh = g;
      g = f;
      f = e;
      e = (d + temp1) & 0xffffffff;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) & 0xffffffff;
    }

    h[0] = (h[0] + a) & 0xffffffff;
    h[1] = (h[1] + b) & 0xffffffff;
    h[2] = (h[2] + c) & 0xffffffff;
    h[3] = (h[3] + d) & 0xffffffff;
    h[4] = (h[4] + e) & 0xffffffff;
    h[5] = (h[5] + f) & 0xffffffff;
    h[6] = (h[6] + g) & 0xffffffff;
    h[7] = (h[7] + hh) & 0xffffffff;
  }

  // 转为字节数组 (大端)
  const result = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    const val = h[i];
    result[i * 4] = (val >>> 24) & 0xff;
    result[i * 4 + 1] = (val >>> 16) & 0xff;
    result[i * 4 + 2] = (val >>> 8) & 0xff;
    result[i * 4 + 3] = val & 0xff;
  }
  return Array.from(result);
}

function hmacSHA256(key, message) {
  const keyBytes = utf8ToBytes(key);
  const msgBytes = utf8ToBytes(message);

  const blockSize = 64;

  // 密钥判断
  let keyHash = keyBytes;
  if (keyHash.length > blockSize) {
    keyHash = sha256(keyHash);
    if (!keyHash) throw new Error('密钥哈希失败');
  }

  // 补到64字节
  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(keyHash);

  // ipad opad
  const ipad = new Uint8Array(blockSize);
  const opad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    ipad[i] = 0x36;
    opad[i] = 0x5c;
  }

  // 生成 innerKey outerKey
  const innerKey = new Uint8Array(blockSize);
  const outerKey = new Uint8Array(blockSize);

  for (let i = 0; i < blockSize; i++) {
    innerKey[i] = paddedKey[i] ^ ipad[i];
    outerKey[i] = paddedKey[i] ^ opad[i];
  }

  // innerBytes = innerKey + msgBytes
  const innerBytes = new Uint8Array(innerKey.length + msgBytes.length);
  innerBytes.set(innerKey);
  innerBytes.set(msgBytes, innerKey.length);

  const innerHash = sha256(Array.from(innerBytes));
  if (!innerHash) throw new Error('inner hash失败');

  // outerBytes = outerKey + innerHash
  const outerBytes = new Uint8Array(outerKey.length + innerHash.length);
  outerBytes.set(outerKey);
  outerBytes.set(innerHash, outerKey.length);

  const outerHash = sha256(Array.from(outerBytes));
  if (!outerHash) throw new Error('outer hash失败');

  return bytesToBase64(outerHash);
}

// Node crypto 参照
function nodeHmac(key, message) {
  const hmac = createHmac('sha256', key);
  hmac.update(message, 'utf8');
  return hmac.digest('base64');
}

(async () => {
  const ts = 1769672877376;
  const secret = 'SEC243a3635982cb428719783a0ac2e8359acea9ced01231fede326bd5b281820fc';
  const stringToSign = ts + '\n' + secret;

  // Node
  const nodeResult = nodeHmac(secret, stringToSign);
  console.log('✅ Node crypto签名:', nodeResult);

  // Browser
  const browserResult = hmacSHA256(secret, stringToSign);
  console.log('🌐 Browser签名   :', browserResult);

  // 判是否一致
  if (nodeResult === browserResult) {
    console.log('🎉 签名一致！纯前端可以直接用，去掉vercel依赖');
  } else {
    console.warn('❌ 签名不一致，可能需调sha256 K数组或padding逻辑');
  }
})();

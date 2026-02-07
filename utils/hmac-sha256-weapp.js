// utils/hmac-sha256-weapp.js

/**
 * HMAC-SHA256 签名生成函数
 * @param {string} key - 密钥
 * @param {string} message - 待签名的消息
 * @returns {string} Base64 编码的签名
 */
function hmacSHA256(key, message) {
  try {
    const CryptoJS = require('./crypto-js-min.js');
    const hmac = CryptoJS.HmacSHA256(message, key);
    const result = CryptoJS.enc.Base64.stringify(hmac);
        return result;
  } catch (e) {
    console.warn('本地 crypto-js 不可用:', e.message);
  }
  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(message);
      return hmac.digest('base64');
    } catch (e) {
      console.warn('Node.js crypto 不可用:', e.message);
    }
  }
  return hmacSHA256PureJS(key, message);
}

/**
 * 纯 JavaScript HMAC-SHA256 实现
 * 更简单、更可靠的版本
 */
function hmacSHA256PureJS(key, message) {
  const BLOCK_SIZE = 64;
  const keyBytes = utf8Encode(key);
  const msgBytes = utf8Encode(message);
  let processedKey = keyBytes;
  if (keyBytes.length > BLOCK_SIZE) {
    processedKey = sha256Hash(keyBytes);
  }
  const keyBlock = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    keyBlock[i] = i < processedKey.length ? processedKey[i] : 0;
  }
  const iPad = new Uint8Array(BLOCK_SIZE);
  const oPad = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    iPad[i] = keyBlock[i] ^ 0x36;
    oPad[i] = keyBlock[i] ^ 0x5c;
  }
  const innerInput = new Uint8Array(BLOCK_SIZE + msgBytes.length);
  innerInput.set(iPad, 0);
  innerInput.set(msgBytes, BLOCK_SIZE);
  const innerHash = sha256Hash(innerInput);
  const outerInput = new Uint8Array(BLOCK_SIZE + 32);
  outerInput.set(oPad, 0);
  outerInput.set(innerHash, BLOCK_SIZE);
  const outerHash = sha256Hash(outerInput);
  return base64Encode(outerHash);
}

/**
 * SHA-256 哈希函数
 */
function sha256Hash(data) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
           0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

  const len = data.length;
  const bits = len * 8;
  const paddingLength = (56 - (len + 1) % 64) % 64;
  const paddedLength = len + 1 + paddingLength + 8;
  const padded = new Uint8Array(paddedLength);

  padded.set(data);
  padded[len] = 0x80;
  for (let i = 0; i < 8; i++) {
    padded[paddedLength - 8 + i] = (bits >>> (56 - i * 8)) & 0xff;
  }
  for (let offset = 0; offset < paddedLength; offset += 64) {
    const W = new Array(64);
    for (let i = 0; i < 16; i++) {
      const pos = offset + i * 4;
      W[i] = ((padded[pos] << 24) | (padded[pos + 1] << 16) |
               (padded[pos + 2] << 8) | padded[pos + 3]) >>> 0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rightRotate(W[i - 15], 7) ^ rightRotate(W[i - 15], 18) ^ (W[i - 15] >>> 3);
      const s1 = rightRotate(W[i - 2], 17) ^ rightRotate(W[i - 2], 19) ^ (W[i - 2] >>> 10);
      W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3];
    let e = H[4], f = H[5], g = H[6], h = H[7];
    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;

      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }
  const result = new Uint8Array(32);
  for (let i = 0; i < 8; i++) {
    const idx = i * 4;
    result[idx] = (H[i] >>> 24) & 0xff;
    result[idx + 1] = (H[i] >>> 16) & 0xff;
    result[idx + 2] = (H[i] >>> 8) & 0xff;
    result[idx + 3] = H[i] & 0xff;
  }

  return result;
}

/**
 * 右旋转函数
 */
function rightRotate(value, bits) {
  return ((value >>> bits) | (value << (32 - bits))) >>> 0;
}

/**
 * UTF-8 编码
 */
function utf8Encode(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(((code >> 6) & 0x3F) | 0xC0);
      bytes.push((code & 0x3F) | 0x80);
    } else if (code < 0xD800 || code >= 0xE000) {
      bytes.push(((code >> 12) & 0x0F) | 0xE0);
      bytes.push(((code >> 6) & 0x3F) | 0x80);
      bytes.push((code & 0x3F) | 0x80);
    } else {
      if (i + 1 < str.length) {
        const next = str.charCodeAt(i + 1);
        if (code >= 0xD800 && code < 0xDC00 && next >= 0xDC00 && next < 0xE000) {
          const surrogate = 0x10000 + ((code & 0x3FF) << 10) + (next & 0x3FF);
          bytes.push(((surrogate >> 18) & 0x07) | 0xF0);
          bytes.push(((surrogate >> 12) & 0x3F) | 0x80);
          bytes.push(((surrogate >> 6) & 0x3F) | 0x80);
          bytes.push((surrogate & 0x3F) | 0x80);
          i++;
        } else {
          bytes.push(0xEF, 0xBF, 0xBD);
        }
      } else {
        bytes.push(0xEF, 0xBF, 0xBD);
      }
    }
  }
  return bytes;
}

/**
 * Base64 编码
 */
function base64Encode(bytes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < bytes.length ? bytes[i + 1] : undefined;
    const b3 = i + 2 < bytes.length ? bytes[i + 2] : undefined;

    const enc1 = b1 >> 2;
    const enc2 = ((b1 & 3) << 4) | (b2 !== undefined ? b2 >> 4 : 0);
    const enc3 = b2 !== undefined ? ((b2 & 15) << 2) | (b3 !== undefined ? b3 >> 6 : 0) : 0;
    const enc4 = b3 !== undefined ? b3 & 63 : 0;

    if (b2 === undefined) {
      result += chars.charAt(enc1) + chars.charAt(enc2) + '==';
    } else if (b3 === undefined) {
      result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + '=';
    } else {
      result += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
  }

  return result;
}
module.exports = { hmacSHA256 };

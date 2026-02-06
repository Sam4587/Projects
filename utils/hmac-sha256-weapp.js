// utils/hmac-sha256-weapp.js
// 微信小程序专用 HMAC-SHA256 实现

/**
 * HMAC-SHA256 签名生成函数
 * @param {string} key - 密钥
 * @param {string} message - 待签名的消息
 * @returns {string} Base64 编码的签名
 */
function hmacSHA256(key, message) {
  // 优先使用 Node.js 的 crypto.createHmac (微信开发者工具环境)
  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      console.log('✅ 使用Node.js crypto.createHmac');
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(message);
      return hmac.digest('base64');
    } catch (e) {
      console.warn('⚠️ Node.js crypto.createHmac不可用,使用纯JavaScript实现, 错误:', e.message);
    }
  }

  // 纯JavaScript实现 (备用方案 - 微信小程序真机环境)
  const BLOCK_SIZE = 64;
  const OUTPUT_SIZE = 32; // SHA256输出32字节

  // SHA256算法 - 严格按照FIPS 180-4实现
  function sha256(messageBytes) {
    // SHA256常量 - 前64个质数的立方根小数部分前32位
    const K = new Uint32Array([
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    // 初始哈希值 - 前8个质数的平方根小数部分前32位
    const H = new Uint32Array([
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ]);

    const messageLength = messageBytes.length;
    const bitLength = messageLength * 8;

    // 消息填充
    const paddingLength = (56 - (messageLength + 1) % 64) % 64;
    const paddedLength = messageLength + 1 + paddingLength + 8;
    const paddedMessage = new Uint8Array(paddedLength);

    // 复制原始消息
    paddedMessage.set(messageBytes);
    // 添加0x80字节
    paddedMessage[messageLength] = 0x80;
    // 添加长度信息(64位大端)
    for (let i = 0; i < 8; i++) {
      paddedMessage[paddedLength - 8 + i] = (bitLength >>> (56 - i * 8)) & 0xff;
    }

    // 处理每个512位块
    for (let offset = 0; offset < paddedLength; offset += 64) {
      const W = new Uint32Array(64);

      // 将16个32位字从字节数组复制到W[0..15]
      for (let i = 0; i < 16; i++) {
        const pos = offset + i * 4;
        W[i] = (paddedMessage[pos] << 24) | (paddedMessage[pos + 1] << 16) |
               (paddedMessage[pos + 2] << 8) | paddedMessage[pos + 3];
      }

      // 扩展消息调度数组
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(W[i-15], 7) ^ rightRotate(W[i-15], 18) ^ (W[i-15] >>> 3);
        const s1 = rightRotate(W[i-2], 17) ^ rightRotate(W[i-2], 19) ^ (W[i-2] >>> 10);
        W[i] = (W[i-16] + s0 + W[i-7] + s1) >>> 0;
      }

      // 初始化工作变量
      let a = H[0], b = H[1], c = H[2], d = H[3];
      let e = H[4], f = H[5], g = H[6], h = H[7];

      // 主循环
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

      // 添加压缩后的结果到当前哈希值
      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;
    }

    // 输出哈希值
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

  // 右旋转辅助函数
  function rightRotate(value, bits) {
    return (value >>> bits) | (value << (32 - bits));
  }

  // UTF-8编码
  function utf8ToBytes(str) {
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
        // 处理代理对
        if (i + 1 < str.length) {
          const next = str.charCodeAt(i + 1);
          if (code >= 0xD800 && code < 0xDC00 && next >= 0xDC00 && next < 0xE000) {
            const surrogate = 0x10000 + ((code & 0x3FF) << 10) + (next & 0x3FF);
            bytes.push(((surrogate >> 18) & 0x07) | 0xF0);
            bytes.push(((surrogate >> 12) & 0x3F) | 0x80);
            bytes.push(((surrogate >> 6) & 0x3F) | 0x80);
            bytes.push((surrogate & 0x3F) | 0x80);
            i++; // 跳过下一个字符
          } else {
            bytes.push(0xEF, 0xBF, 0xBD); // Unicode替换字符
          }
        } else {
          bytes.push(0xEF, 0xBF, 0xBD); // Unicode替换字符
        }
      }
    }
    return bytes;
  }

  // Base64编码 - 微信小程序兼容版本
  function bytesToBase64(bytes) {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;

    // 处理每3个字节转换为4个Base64字符
    while (i < bytes.length) {
      const byte1 = bytes[i++];
      const byte2 = bytes[i++];
      const byte3 = bytes[i++];

      // 取出6位二进制，转换为Base64字符
      const enc1 = byte1 >> 2;
      const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
      const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
      const enc4 = byte3 & 63;

      // 处理边界情况
      if (isNaN(byte2)) {
        result += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + '==';
      } else if (isNaN(byte3)) {
        result += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + '=';
      } else {
        result += base64Chars.charAt(enc1) + base64Chars.charAt(enc2) + base64Chars.charAt(enc3) + base64Chars.charAt(enc4);
      }
    }

    return result;
  }

  // HMAC主逻辑
  let keyBytes = utf8ToBytes(key);

  // 如果密钥长度超过块大小，先哈希
  if (keyBytes.length > BLOCK_SIZE) {
    const keyArray = sha256(keyBytes);
    keyBytes = Array.from(keyArray);
  }

  // 创建填充后的密钥块
  const keyBlock = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    keyBlock[i] = i < keyBytes.length ? keyBytes[i] : 0;
  }

  // 创建ipad和opad
  const ipad = new Uint8Array(BLOCK_SIZE);
  const opad = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    ipad[i] = keyBlock[i] ^ 0x36;
    opad[i] = keyBlock[i] ^ 0x5c;
  }

  // 内层哈希: H(ipad + message)
  const messageBytes = utf8ToBytes(message);
  const innerMessage = new Uint8Array(BLOCK_SIZE + messageBytes.length);
  innerMessage.set(ipad);
  innerMessage.set(messageBytes, BLOCK_SIZE);
  const innerHash = sha256(innerMessage);

  // 外层哈希: H(opad + innerHash)
  const outerMessage = new Uint8Array(BLOCK_SIZE + 32);
  outerMessage.set(opad);
  outerMessage.set(innerHash, BLOCK_SIZE);
  const outerHash = sha256(outerMessage);

  return bytesToBase64(Array.from(outerHash));
}

// 导出模块
module.exports = { hmacSHA256 };

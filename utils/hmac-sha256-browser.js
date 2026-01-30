// utils/hmac-sha256-browser.js
// HMAC-SHA256 implementation matching Node.js crypto

function hmacSHA256(key, message) {
  const BLOCK_SIZE = 64;

  // SHA256 implementation
  function sha256(msgBytes) {
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];

    const len = msgBytes.length;
    const bitLen = len * 8;

    const padBytes = [0x80];
    const zeroBytesNeeded = (64 - ((len + 1 + 8) % 64)) % 64;
    for (let i = 0; i < zeroBytesNeeded; i++) padBytes.push(0x00);

    for (let i = 0; i < 8; i++) {
      padBytes.push((bitLen >>> (56 - i * 8)) & 0xff);
    }

    const paddedBytes = [...msgBytes, ...padBytes];
    const numBlocks = paddedBytes.length / 64;

    for (let block = 0; block < numBlocks; block++) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) {
        const offset = block * 64 + i * 4;
        w[i] = (paddedBytes[offset] << 24) | (paddedBytes[offset + 1] << 16) | (paddedBytes[offset + 2] << 8) | paddedBytes[offset + 3];
      }

      for (let i = 16; i < 64; i++) {
        w[i] = (w[i-16] + w[i-7] +
                ((w[i-15] >>> 7) | (w[i-15] << 25)) ^ ((w[i-15] >>> 18) | (w[i-15] << 14)) ^ (w[i-15] >>> 3) +
                ((w[i-2] >>> 17) | (w[i-2] << 15)) ^ ((w[i-2] >>> 19) | (w[i-2] << 13)) ^ (w[i-2] >>> 10)) & 0xffffffff;
      }

      let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];

      for (let i = 0; i < 64; i++) {
        const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const ch = (e & f) ^ (~e & g);
        const temp1 = (hh + S1 + ch + k[i] + w[i]) & 0xffffffff;
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

    const result = new Uint8Array(32);
    for (let i = 0; i < 8; i++) {
      result[i * 4] = (h[i] >>> 24) & 0xff;
      result[i * 4 + 1] = (h[i] >>> 16) & 0xff;
      result[i * 4 + 2] = (h[i] >>> 8) & 0xff;
      result[i * 4 + 3] = h[i] & 0xff;
    }
    return Array.from(result);
  }

  function utf8ToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 0x80) {
        bytes.push(code);
      } else if (code < 0x800) {
        bytes.push((code >> 6) | 0xc0);
        bytes.push((code & 0x3f) | 0x80);
      } else if (code < 0x10000) {
        bytes.push((code >> 12) | 0xe0);
        bytes.push(((code >> 6) & 0x3f) | 0x80);
        bytes.push((code & 0x3f) | 0x80);
      } else {
        throw new Error('Invalid UTF-8 character');
      }
    }
    return bytes;
  }

  function bytesToBase64(bytes) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
      const c = (i + 2 < bytes.length) ? bytes[i + 2] : 0;
      const n = (a << 16) | (b << 8) | c;
      result += chars[(n >> 18) & 0x3f];
      result += chars[(n >> 12) & 0x3f];
      result += (i + 1 < bytes.length) ? chars[(n >> 6) & 0x3f] : '=';
      result += (i + 2 < bytes.length) ? chars[n & 0x3f] : '=';
    }
    return result;
  }

  // HMAC logic
  let keyBytes = utf8ToBytes(key);
  if (keyBytes.length > BLOCK_SIZE) {
    keyBytes = sha256(keyBytes);
  }

  const paddedKey = new Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    paddedKey[i] = (i < keyBytes.length) ? keyBytes[i] : 0;
  }

  const ipad = new Array(BLOCK_SIZE);
  const opad = new Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    ipad[i] = paddedKey[i] ^ 0x36;
    opad[i] = paddedKey[i] ^ 0x5c;
  }

  const msgBytes = utf8ToBytes(message);
  const innerHashInput = [...ipad, ...msgBytes];
  const innerHash = sha256(innerHashInput);

  const outerHashInput = [...opad, ...innerHash];
  const outerHash = sha256(outerHashInput);

  return bytesToBase64(outerHash);
}

module.exports = { hmacSHA256 };

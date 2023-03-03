const sha1 = (message) => {
  let h0 = 1732584193;
  let h1 = 4023233417;
  let h2 = 2562383102;
  let h3 = 271733878;
  let h4 = 3285377520;
  message.length;
  const messageInBits = stringToBitsArray(message);
  const messageLengthInBits = messageInBits.length;
  const k = 512 - (messageLengthInBits + 1 + 64) % 512;
  messageInBits.push(1);
  messageInBits.push(...Array(k).fill(0));
  messageInBits.push(...Array(32).fill(0), ...int32ToBitsArray(messageLengthInBits));
  const chunks = chunkArray(messageInBits, 512);
  chunks.forEach((chunk) => {
    const w = chunkArray(chunk, 32).map((bits) => bitsArrayToInt32(bits));
    for (let i = 16; i < 80; i++) {
      w[i] = leftRotate(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1);
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    for (let i = 0; i < 80; i++) {
      let f, k2;
      if (i < 20) {
        f = b & c ^ ~b & d;
        k2 = 1518500249;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k2 = 1859775393;
      } else if (i < 60) {
        f = b & c ^ b & d ^ c & d;
        k2 = 2400959708;
      } else {
        f = b ^ c ^ d;
        k2 = 3395469782;
      }
      const temp = leftRotate(a, 5) + f + e + k2 + w[i];
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }
    h0 = h0 + a;
    h1 = h1 + b;
    h2 = h2 + c;
    h3 = h3 + d;
    h4 = h4 + e;
  });
  const hashInBits = [...int32ToBitsArray(h0), ...int32ToBitsArray(h1), ...int32ToBitsArray(h2), ...int32ToBitsArray(h3), ...int32ToBitsArray(h4)];
  return bitsArrayToHexString(hashInBits);
};
const leftRotate = (n, bits) => n << bits | n >>> 32 - bits;
const stringToBitsArray = (str) => {
  str = encodeStringToUTF8(str);
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      result.push(charCode >> j & 1);
    }
  }
  return result;
};
const encodeStringToUTF8 = (str) => {
  return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt("0x" + p1));
  });
};
const int32ToBitsArray = (n) => {
  const result = [];
  for (let i = 31; i >= 0; i--) {
    result.push(n >> i & 1);
  }
  return result;
};
const bitsArrayToInt32 = (arr) => {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i] << arr.length - i - 1;
  }
  return result;
};
const bitsArrayToHexString = (arr) => {
  const result = chunkArray(arr, 4).map((bits) => bits.join(""));
  return result.map((bits) => parseInt(bits, 2).toString(16)).join("");
};
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export { sha1 };

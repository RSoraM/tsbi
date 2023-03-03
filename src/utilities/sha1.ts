// SHA-1
// https://zh.wikipedia.org/wiki/SHA-1

export const sha1 = (message: string): string => {
  // Initial variables:
  let h0 = 0x67452301
  let h1 = 0xefcdab89
  let h2 = 0x98badcfe
  let h3 = 0x10325476
  let h4 = 0xc3d2e1f0
  // Pre-processing:
  const messageLength = message.length
  // append the bit '1' to the message
  // append k bits '0', where k is the minimum number >= 0 such that the resulting message length (in bits) is congruent to 448 (mod 512)
  // append length of message (before pre-processing), in bits, as 64-bit big-endian integer
  const messageInBits = stringToBitsArray(message)
  const messageLengthInBits = messageInBits.length
  const k = 512 - ((messageLengthInBits + 1 + 64) % 512)
  messageInBits.push(1)
  messageInBits.push(...Array(k).fill(0))
  messageInBits.push(...Array(32).fill(0), ...int32ToBitsArray(messageLengthInBits))
  // Process the message in successive 512-bit chunks:
  // break message into 512-bit chunks
  const chunks = chunkArray(messageInBits, 512)
  // for each chunk
  chunks.forEach((chunk) => {
    // break chunk into sixteen 32-bit big-endian words w[i], 0 ≤ i ≤ 15
    const w = chunkArray(chunk, 32).map((bits) => bitsArrayToInt32(bits))
    // Extend the sixteen 32-bit words into eighty 32-bit words:
    for (let i = 16; i < 80; i++) {
      w[i] = leftRotate(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1)
    }
    // Initialize hash value for this chunk:
    let a = h0
    let b = h1
    let c = h2
    let d = h3
    let e = h4
    // Main loop:
    for (let i = 0; i < 80; i++) {
      let f, k
      if (i < 20) {
        f = (b & c) ^ (~b & d)
        k = 0x5a827999
      } else if (i < 40) {
        f = b ^ c ^ d
        k = 0x6ed9eba1
      } else if (i < 60) {
        f = (b & c) ^ (b & d) ^ (c & d)
        k = 0x8f1bbcdc
      } else {
        f = b ^ c ^ d
        k = 0xca62c1d6
      }
      const temp = leftRotate(a, 5) + f + e + k + w[i]
      e = d
      d = c
      c = leftRotate(b, 30)
      b = a
      a = temp
    }
    // Add this chunk's hash to result so far
    h0 = h0 + a
    h1 = h1 + b
    h2 = h2 + c
    h3 = h3 + d
    h4 = h4 + e
  })
  // Produce the final hash value (big-endian):
  const hashInBits = [...int32ToBitsArray(h0), ...int32ToBitsArray(h1), ...int32ToBitsArray(h2), ...int32ToBitsArray(h3), ...int32ToBitsArray(h4)]
  return bitsArrayToHexString(hashInBits)
}

const leftRotate = (n: number, bits: number): number => (n << bits) | (n >>> (32 - bits))

/**
 * string to bits array
 */
const stringToBitsArray = (str: string): number[] => {
  str = encodeStringToUTF8(str)
  const result = []
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    for (let j = 7; j >= 0; j--) {
      result.push((charCode >> j) & 1)
    }
  }
  return result
}

/**
 * encode string to UTF-8
 */
const encodeStringToUTF8 = (str: string): string => {
  return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode(parseInt('0x' + p1))
  })
}

/**
 * int32 to bits array
 */
const int32ToBitsArray = (n: number): number[] => {
  const result = []
  for (let i = 31; i >= 0; i--) {
    result.push((n >> i) & 1)
  }
  return result
}

/**
 * bits array to int32
 */
const bitsArrayToInt32 = (arr: number[]): number => {
  let result = 0
  for (let i = 0; i < arr.length; i++) {
    result += arr[i] << (arr.length - i - 1)
  }
  return result
}

/**
 * bits array to hex string
 */
const bitsArrayToHexString = (arr: number[]): string => {
  const result = chunkArray(arr, 4).map((bits) => bits.join(''))
  return result.map((bits) => parseInt(bits, 2).toString(16)).join('')
}

/**
 * chunk array
 * @param arr source
 * @param size size
 * @returns
 */
const chunkArray = <T = any>(arr: T[], size: number): T[][] => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

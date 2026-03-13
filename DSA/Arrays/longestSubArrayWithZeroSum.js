function longestSubArrayWithZeroSum(arr, n) {
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    let sum = arr[i];

    for (let j = i + 1; j < n; j++) {
      sum += arr[j];

      if (sum === 0) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }
  return maxLen;
}

const arr = [9, -3, 3, -1, 6, -5],
  n = arr.length;

console.log(longestSubArrayWithZeroSum(arr, n));



//using prefixSum & hashMap
function longestSubArrayWithZeroSum1(arr, n) {
  let hashedMap = new Map();
  let sum = 0;
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    sum += arr[i];

    if (sum === 0) {
      maxLen = i + 1;
    }

    if (hashedMap.has(sum)) {
      maxLen = Math.max(maxLen, i - hashedMap.get(sum));
    } else {
      hashedMap.set(sum, i);
    }
  }
  return maxLen;
}

console.log(longestSubArrayWithZeroSum1(arr, n));

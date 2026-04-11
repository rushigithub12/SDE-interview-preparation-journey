function longestSubArray(arr, n, k) {
  let resultArr = [];
  let maxLen = 0;

  for (let i = 0; i < n; i++) {
    let sum = 0;

    for (let j = i; j < n; j++) {
      sum += arr[j];

      if (sum === k) {
        if (j - i + 1 > maxLen) {
          maxLen = j - i + 1;
          resultArr = [i, j];
        }
      }
    }
  }
  return {
    resultArr,
    maxLen,
  };
}

const arr = [10, 5, 2, 7, 1, 9];
const n = arr.length;
const k = 15;

console.log(longestSubArray(arr, n, k));

///using prefixSum + hashmap

function longestSubArray1(arr, k) {
  let mp = new Map();
  let res = 0;
  let prefSum = 0;

  for (let i = 0; i < arr.length; ++i) {
    prefSum += arr[i];

    // Check if the entire prefix sums to k
    if (prefSum === k) {
      res = i + 1;
    }

    // If prefixSum - k exists in the map then there exist such
    // subarray from (index of previous prefix + 1) to i.
    else if (mp.has(prefSum - k)) {
      res = Math.max(res, i - mp.get(prefSum - k));
    }
    // Store only first occurrence index of prefSum
    if (!mp.has(prefSum)) {
      mp.set(prefSum, i);
    }
  }

  return res;
}

console.log(longestSubArray1(arr, k));


///using Two pointer
function longestSubArray2(arr, k){
    let n = arr.length;
    let left = 0;
    let right = 0;

    let maxLen = 0;

    let sum = arr[0];

    while(right < n){
        while(left <= right && sum > k){
            sum -= arr[left];
            left++;
        }

        if(sum === k){
            maxLen = Math.max(maxLen, right - left + 1)
        }

        right++;

        if(right< n){
            sum += arr[right]
        }

    }

    return maxLen
}

console.log(longestSubArray2(arr, k));

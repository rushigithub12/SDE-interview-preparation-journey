const nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
const k = 3;

function longestOnes(nums, k) {
  let maxLen = 0;

  for (let i = 0; i < nums.length; i++) {
    let zeros = 0;
    for (let j = i; j < nums.length; j++) {
      if (nums[j] === 0) {
        zeros++;
      }

      if (zeros <= k) {
        maxLen = Math.max(maxLen, j - i + 1);
      } else {
        break;
      }
    }
  }
  return maxLen;
}

console.log(longestOnes(nums, k));

//using sliding window
function longestOnes1(nums, k) {
  let maxLen = 0;
  let left = 0;
  let zeros = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) {
      zeros++;
    }

    if (zeros > k) {
      if (nums[left] === 0) {
        zeros--;
      }
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

console.log(longestOnes1(nums, k));

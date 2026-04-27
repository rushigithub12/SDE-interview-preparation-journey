const nums = [2, 3, 5, 2, 9, 7, 1];
const k = 3;

function findMaximumSumOfSubArray(nums, k) {
  let maxSum = -Infinity;

  for (let i = 0; i <= nums.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += nums[j];
    }
    maxSum = Math.max(maxSum, sum);
  }
  return maxSum;
}

console.log(findMaximumSumOfSubArray(nums, k));

//optimal sliding window
function findMaximumSumOfSubArray1(nums, k) {
  let i = 0;
  let j = 0;

  let sum = 0;
  let maxSum = -Infinity;

  while (j < nums.length) {
    sum += nums[j];

    if (j - i + 1 === k) {
      maxSum = Math.max(maxSum, sum);

      sum -= nums[i];
      i++;
    }
    j++;
  }

  return maxSum;
}

console.log(findMaximumSumOfSubArray1(nums, k));

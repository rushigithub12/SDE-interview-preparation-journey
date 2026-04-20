//kadane's algorithm

const arr = [2, 3, 5, -2, 7, -4];

function maximumSubArray(arr) {
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i; j < arr.length; j++) {
      let sum = 0;

      for (let k = i; k <= j; k++) {
        sum += arr[k];
      }

      maxSum = Math.max(maxSum, sum);
    }
  }
  return maxSum;
} //O(n^3)

console.log(maximumSubArray(arr));

function maximumSubArray1(arr) {
  let maxSum = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    let sum = 0;

    for (let j = i; j < arr.length; j++) {
      sum += arr[j];

      maxSum = Math.max(sum, maxSum);
    }
  }
  return maxSum;
}

console.log(maximumSubArray1(arr));

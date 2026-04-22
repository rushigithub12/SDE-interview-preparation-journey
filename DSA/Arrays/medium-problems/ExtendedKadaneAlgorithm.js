const arr = [2, 3, 5, -2, 7, -4];
const arr1 = [-2, -3, -7, -2, -10, -4];
const arr2 = [-2,1,-3,4,-1,2,1,-5,4]
const arr3 = [5,4,-1,7,8]

function ExtendedKadaneAlgorithm(arr) {
  let maxNum = -Infinity;
  let currentSum = 0;
  let start = 0;
  let ansStart = 0;
  let ansEnd = 0;

  for (let i = 0; i < arr.length; i++) {
    if (currentSum === 0) {
      start = i;
    }
    currentSum += arr[i];

    if (currentSum > maxNum) {
      maxNum = currentSum;
      ansStart = start;
      ansEnd = i;
    }

    if (currentSum < 0) {
      currentSum = 0;
    }
  }
  let subArr = arr.slice(ansStart, ansEnd + 1);

  return { maxNum, subArr };
}

console.log(ExtendedKadaneAlgorithm(arr));
console.log(ExtendedKadaneAlgorithm(arr1));
console.log(ExtendedKadaneAlgorithm(arr2));
console.log(ExtendedKadaneAlgorithm(arr3));

const arr = [2, 3, 5, -2, 7, -4];

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

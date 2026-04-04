const arr = [1, 2, 3, 4, 5],
  n = arr.length,
  limit = 8;

function checkSum(arr, div) {
  let sum = 0;
  for (let num of arr) {
    sum += Math.ceil(num / div);
  }
  return sum;
}

function findSmallestDivisorUnderLimit(arr, n, limit) {
  let maxVal = Math.max(...arr);
  for (let i = 1; i <= maxVal; i++) {
    let sum = checkSum(arr, i);
    if (sum <= limit) {
      return i;
    }
  }
  return -1;
}

console.log(findSmallestDivisorUnderLimit(arr, n, limit));

function findSmallestDivisorUnderLimit1(arr, n, limit) {
  if (n > limit) return -1;

  let low = 1;
  let high = Math.max(...arr);

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);

    let sum = checkSum(arr, mid);

    if (sum <= limit) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

console.log(findSmallestDivisorUnderLimit1(arr, n, limit))
function findUpperBound(arr, x) {
  let n = arr.length;

  for (let i = 0; i < n; i++) {
    if (arr[i] > x) {
      return i;
    }
  }
  return n;
}

const arr = [1, 2, 2, 3];
const x = 2;

console.log(findUpperBound(arr, x));

//using two pointer

function findLowerBound1(arr, x) {
  let n = arr.length;
  let low = 0,
    high = n - 1;

  let ans = n;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] > x) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

console.log(findLowerBound1(arr, x));

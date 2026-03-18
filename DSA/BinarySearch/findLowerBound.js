function findLowerBound(arr, x) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    if (arr[i] >= x) {
      return i;
    }
  }
  return n;
}

const arr = [1, 2, 2, 3];
const x = 2;

console.log(findLowerBound(arr, x));

//using two pointer
function findLowerBound1(arr, x) {
  let low = 0,
    high = arr.length - 1;
  let ans = arr.length;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] >= x) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

const arr1 = [3, 5, 8, 13, 15, 19],
  x1 = 9;

console.log(findLowerBound1(arr, x1));

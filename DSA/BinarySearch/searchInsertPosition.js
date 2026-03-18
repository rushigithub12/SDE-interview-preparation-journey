function searchInsertPosition(arr, x) {
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

const arr = [1, 2, 4, 7];
const x = 6;

const arr1 = [1, 3, 5, 6];
const x1 = 7;

console.log(searchInsertPosition(arr, x));
console.log(searchInsertPosition(arr1, x1));

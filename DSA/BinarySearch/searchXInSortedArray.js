function searchXInSortedArray(arr, target) {
  let low = 0,
    high = n - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (target === arr[mid]) return mid;
    else if (target > arr[mid]) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const arr = [3, 4, 6, 7, 9, 12, 16, 17],
  n = arr.length;

console.log(searchXInSortedArray(arr, 6));

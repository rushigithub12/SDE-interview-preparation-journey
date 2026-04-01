const arr = [1, 2, 1, 3, 5, 6, 4],
  n = arr.length;

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 5, 1],
  n1 = arr1.length;

const arr2 = [5, 4, 3, 2, 1],
  n2 = arr2.length;

function findPeakElement(arr, n) {
  if (n === 1 || arr[0] > arr[1]) return 0;

  for (let i = 1; i < n - 1; i++) {
    if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) {
      return i;
    }
  }

  if (arr[n - 1] > arr[n - 2]) return n - 1;

  return -1;
}

console.log(findPeakElement(arr, n));
console.log(findPeakElement(arr1, n1));
console.log(findPeakElement(arr2, n2));

//optimal approach
function findPeakElement1(arr, n) {
  let low = 0,
    high = n - 1;

  while (low < high) {
    let mid = low + Math.floor((high - low) / 2);

    if (arr[mid] > arr[mid + 1]) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return low;
}

console.log(findPeakElement1(arr, n));
console.log(findPeakElement1(arr1, n1));
console.log(findPeakElement1(arr2, n2));

function minimumInSortedArr(arr, n) {
  let min = Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }
  return min;
}

const arr = [4, 5, 6, 7, 0, 1, 2, 3],
  n = arr.length;

const arr1 = [3, 4, 5, 1, 2],
  n1 = arr1.length;

const arr2 = [3, 1, 2],
  n2 = arr2.length;

console.log(minimumInSortedArr(arr, n));
console.log(minimumInSortedArr(arr1, n1));

///optimal soln
function minimumInSortedArr1(arr) {
  let low = 0,
    high = arr.length - 1;

  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);

    if (arr[mid] > arr[high]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return arr[low];
}

console.log(minimumInSortedArr1(arr));
console.log(minimumInSortedArr1(arr1));
console.log(minimumInSortedArr1(arr2));

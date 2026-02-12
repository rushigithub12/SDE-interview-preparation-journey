function checkIfArrayIsSorted(arr, n) {
  let small = arr[0];
  let isSorted = false;
  for (let i = 1; i < n; i++) {
    if (small <= arr[i]) {
      isSorted = true;
      small = arr[i];
    } else {
      isSorted = false;
      break;
    }
  }
  return isSorted;
}

const arr = [1, 2, 3, 4, 5, 6];
const n = arr.length;

const arr1 = [5, 3, 4, 1, 2, 6];
const n1 = arr1.length;

console.log(checkIfArrayIsSorted(arr, n));
console.log(checkIfArrayIsSorted(arr1, n1));

function isArraySorted(arr, n) {
  if (n <= 1) return false;
  for (let i = 1; i < n; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

console.log(isArraySorted(arr, n));
console.log(isArraySorted(arr1, n1));

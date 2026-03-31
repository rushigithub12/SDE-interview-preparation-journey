function findFirst(arr, x) {
  let left = 0, right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === x) {
      result = mid;
      right = mid - 1; // move left
    } else if (arr[mid] > x) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

function findLast(arr, x) {
  let left = 0, right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === x) {
      result = mid;
      left = mid + 1; // move right
    } else if (arr[mid] > x) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return result;
}

function countOccurrence(arr, x) {
  let first = findFirst(arr, x);
  if (first === -1) return 0;

  let last = findLast(arr, x);
  return last - first + 1;
}

const arr = [2, 2, 3, 3, 3, 3, 4];
const x = 3;

console.log(countOccurrence(arr, x)); // 4
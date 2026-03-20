function firstLastOccurenceIndex(arr, x) {
  let first = -1,
    last = -1;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === x) {
      first = i;
      break;
    }
  }
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === x) {
      last = i;
      break;
    }
  }
  return [first, last];
}

function firstLastOccurenceIndex1(arr, x) {
  let low = 0,
    high = arr.length - 1;
  let first = -1,
    last = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] === x) {
      first = mid;
      high = mid - 1;
    } else if (x < arr[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  // RESET pointers
  low = 0;
  high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] === x) {
      last = mid;
      low = mid + 1;
    } else if (x < arr[mid]) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return [first, last];
}

const arr = [3, 4, 13, 13, 13, 20, 40];
const target = 13;

const arr1 = [5, 7, 7, 8, 8, 10];
const target1 = 8;

console.log(firstLastOccurenceIndex(arr1, target1));

console.log(firstLastOccurenceIndex1(arr1, target1));

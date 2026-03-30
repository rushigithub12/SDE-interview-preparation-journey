function searchKInRotatedArr(arr, k) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === k) {
      return true;
    }
  }
  return false;
}

const arr = [7, 8, 1, 2, 3, 3, 3, 4, 5, 6];
const k = 3;

console.log(searchKInRotatedArr(arr, k));

//optimal soln
function searchKInRotatedArr1(arr, k) {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === k) {
      return true;
    }

    if (arr[left] === arr[mid] && arr[mid] === arr[right]) {
      left++;
      right--;
      continue;
    }

    if (arr[left] <= arr[mid]) {
      if (k >= arr[left] && k < arr[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (k <= arr[right] && k > arr[mid]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  return false;
}

console.log(searchKInRotatedArr1(arr, k));

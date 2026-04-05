const arr = [4, 7, 9, 10],
  n = arr.length;
const k = 5;

function findKthMissingElement(arr, n, k) {
  for (let i = 0; i < n; i++) {
    if (arr[i] <= k) {
      k++;
    } else {
      break;
    }
  }
  return k;
}

console.log(findKthMissingElement(arr, n, k));

//optimal approach
function findKthMissingElement1(arr, k) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let missing = arr[mid] - (mid + 1);

    if (missing < k) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return k + high + 1;
}

console.log(findKthMissingElement1(arr, k));

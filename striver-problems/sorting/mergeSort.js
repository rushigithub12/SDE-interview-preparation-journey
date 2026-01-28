function merge(arr, low, mid, high) {
  let left = low,
    right = mid + 1;
  let temp = [];

  while (left <= mid && right <= high) {
    if (arr[left] < arr[right]) {
      temp.push(arr[left]);
      left++;
    } else {
      temp.push(arr[right]);
      right++;
    }
  }

  while (left <= mid) {
    temp.push(arr[left]);
    left++;
  }

  while (right <= high) {
    temp.push(arr[right]);
    right++;
  }

  for (let i = low; i <= high; i++) {
    arr[i] = temp[i - low];
  }
}

function mergeSort(arr, low, high) {
  if (!arr) return;
  if (!arr.length) return;
  if (low >= high) return;

  let mid = Math.floor((low + high) / 2);

  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);

  merge(arr, low, mid, high);
}

const arr = [3, 2, 8, 5, 1, 4, 23];
const low = 0;
const high = arr.length - 1;

mergeSort(arr, low, high);

console.log(arr);

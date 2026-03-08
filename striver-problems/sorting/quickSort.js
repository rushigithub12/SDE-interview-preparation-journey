function partition(arr, low, high) {
  let pivot = arr[low];
  let i = low,
    j = high;

  while (i < j) {
    while (arr[i] <= pivot && i <= high - 1) {
      i++;
    }
    while (arr[j] > pivot && j >= low + 1) {
      j--;
    }

    if (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[low], arr[j]] = [arr[j], arr[low]];

  return j;
}

function quickSort(arr, low, high) {
  if (low < high) {
    let pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr
}

const arr = [4,1, 7, 3];
const low = 0;
const high = arr.length - 1;

console.log(quickSort(arr, low, high));

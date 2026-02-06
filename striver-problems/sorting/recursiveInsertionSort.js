function recursiveInsertionSort(arr, n, i = 0) {
  if (i > n) return;

  let j = i;

  while (j > 0 && arr[j - 1] > arr[j]) {
    let temp = arr[j - 1];
    arr[j - 1] = arr[j];
    arr[j] = temp;

    j--;
  }

  recursiveInsertionSort(arr, n, i + 1);
}

const arr = [4, 2, 3, 1, 5];
const n = arr.length;

recursiveInsertionSort(arr, n);

console.log(arr);

function recursiveBubbleSort(arr, n) {
  if (n === 1) return;

  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      let temp = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = temp;
    }
  }

  recursiveBubbleSort(arr, n - 1);
}

const arr = [3, 5, 2, 1, 4];
const n = arr.length;

recursiveBubbleSort(arr, n);

console.log(arr);

function rotateArrayLeft(arr, n) {
  let temp = arr[0];
  for (let i = 1; i < n; i++) {
    arr[i - 1] = arr[i];
  }
  arr[n - 1] = temp;
  return arr;
}
const arr = [1, 2, 3, 4, 5];
const n = arr.length;

console.log(rotateArrayLeft(arr, n));

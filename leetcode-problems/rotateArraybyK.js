function rotateArraybyK(arr, k) {
  let n = arr.length;

  k = k % n;

  function reverse(arr, left, right) {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  }

  reverse(arr, 0, n - 1);
  reverse(arr, 0, k - 1);
  reverse(arr, k, n - 1);
}

const arr = [1, 2, 3, 4, 5];
const k = 8;

rotateArraybyK(arr, k)

console.log(arr)

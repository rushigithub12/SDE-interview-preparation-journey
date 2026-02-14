function rotateArrayByK(arr, n, k, dir) {
  if (dir === "left") {
    if (k <= 0) return;

    let firstEl = arr[0];
    for (let i = 1; i < n; i++) {
      arr[i - 1] = arr[i];
    }
    arr[n - 1] = firstEl;

    return rotateArrayByK(arr, n, k - 1, dir);
  } else {
    if (k <= 0) return;

    let lastEl = arr[n - 1];
    for (let i = n - 2; i >= 0; i--) {
      arr[i + 1] = arr[i];
    }
    arr[0] = lastEl;

    return rotateArrayByK(arr, n, k - 1, dir);
  }
}

const arr = [1, 2, 3, 4, 5, 6];
const n = arr.length;

const arr1 = [1, 2, 3, 4, 5, 6, 7];
const n1 = arr1.length;

rotateArrayByK(arr, n, 2, "left");
rotateArrayByK(arr1, n1, 2, "right");

console.log(arr);
console.log(arr1);

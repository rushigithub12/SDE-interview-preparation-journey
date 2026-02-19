function countMaxOne(arr, n) {
  let count = 0,
    max = 0;

  for (let i = 0; i < n; i++) {
    if (arr[i] === 1) {
      count++;
    } else {
      count = 0;
    }
    max = Math.max(max, count);
  }
  return max;
}

const arr = [1, 1, 0, 1, 1, 1],
  n = arr.length;
const arr1 = [1, 0, 1, 1, 0, 1],
  n1 = arr1.length;

console.log(countMaxOne(arr, n));
console.log(countMaxOne(arr1, n1));

function moveZeroes(arr, n) {
  let j = 0;

  for (let i = 0; i < n; i++) {
    if (arr[i] !== 0) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      j++;
    }
  }
  return arr;
}

const arr = [1, 0, 3, 2, 0, 4, 0, 1],
  n = arr.length;

console.log(moveZeroes(arr, n));

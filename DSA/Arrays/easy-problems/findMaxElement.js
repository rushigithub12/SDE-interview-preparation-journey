function findMaxElement(arr) {
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

const arr = [13, 46, -52, 20, 24, 24, 9];

console.log(findMaxElement(arr));

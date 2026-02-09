const arr = [1, 2, 4, 7, 7, 5];
const n = arr.length;

const arr1 = [3, 3];
const n1 = arr1.length;

function secondMaxSecondSmall(arr, n) {
  if (n === 0 || n === 1) return "Array must be 2 or greater";

  arr.sort((a, b) => a - b);

  const secondMax = arr[n - 2];
  const secondSmall = arr[1];

  return [secondSmall, secondMax];
}

console.log(secondMaxSecondSmall(arr, n));
console.log(secondMaxSecondSmall(arr1, n1));

function secondMax(arr, n) {
  let largest = arr[0],
    sLargest = -1;

  for (let i = 0; i < n; i++) {
    if (arr[i] > largest) {
      sLargest = largest;
      largest = arr[i];
    } else if (arr[i] < largest && arr[i] > sLargest) {
      sLargest = arr[i];
    }
  }

  return sLargest;
}

console.log(secondMax(arr, n));
console.log(secondMax(arr1, n1));

function secondSmall(arr, n) {
  let smallest = arr[0],
    secSmallest = Infinity;

  for (let i = 1; i < n; i++) {
    if (arr[i] < smallest) {
      secSmallest = smallest;
      smallest = arr[i];
    } else if (arr[i] !== smallest && arr[i] < secSmallest) {
      secSmallest = arr[i];
    }
  }
  return secSmallest;
}

console.log(secondSmall(arr, n));
console.log(secondSmall(arr1, n1));

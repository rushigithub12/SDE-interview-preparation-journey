const arr = [1, 3, 3, 2, 1, 2, 4];
const n = arr.length;

const arr1 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
const n1 = arr1.length;

function removeDuplicate(arr, n) {
  if (n <= 1) return arr;

  const newArr = [];

  for (let i = 0; i < n; i++) {
    if (arr.indexOf(arr[i]) === i) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

console.log(removeDuplicate(arr, n));

function removeDuplicate1(arr, n) {
  if (n <= 1) return arr;

  const newArr = [...new Set(arr)];
  return newArr;
}

console.log(removeDuplicate1(arr, n));

//when array is sorted, two pointer

function removeDuplicate2(arr, n) {
  if (n < 1) return 0;

  let i = 0;

  for (let j = 1; j < n; j++) {
    if (arr[j] !== arr[i]) {
      i++;
      arr[i] = arr[j];
    }
  }
  return i + 1;
}
const k = removeDuplicate2(arr1, n1);
console.log(arr1.slice(0, k));

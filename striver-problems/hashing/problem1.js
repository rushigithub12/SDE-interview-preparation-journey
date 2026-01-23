function hashing1(arr, q) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === q) {
      count++;
    }
  }
  return count;
}

let inputArr = [1, 2, 1, 3, 2];
let queries = [1, 3, 4, 2, 10];
// console.log(hashing1([1, 2, 1, 3, 2], 1));
// console.log(hashing1([1, 2, 1, 3, 2], 4));

for (let i = 0; i < queries.length; i++) {
  console.log(hashing1(inputArr, queries[i]));
}

//function check if missing in the current range [1, max] then finds else return -1
function findMissingElement(arr) {
  if (arr.length === 0) return -1;

  const max = Math.max(...arr);
  const numsSet = new Set(arr);

  for (let i = 1; i <= max; i++) {
    if (!numsSet.has(i)) {
      return i;
    }
  }
  return -1;
}
const arr = [1, 2, 3];
const arr1 = [1, 2, 3, 5];

console.log(findMissingElement(arr));
console.log(findMissingElement(arr1));

//this function always consider element is missing and finds the next element
function findMissingElement1(arr) {
  if (arr.length === 0) return -1;

  const max = Math.max(...arr);

  if (arr.length === max) {
    return -1;
  }

  let expectedSum = (max * (max + 1)) / 2;
  let actualSum = arr.reduce((acc, curr) => acc + curr, 0);

  return expectedSum - actualSum;
}

console.log(findMissingElement1(arr));
console.log(findMissingElement1(arr1));

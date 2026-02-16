function unionOfSortedArray(arr1, n1, arr2, n2) {
  const hash = new Map();

  for (let i = 0; i < n1; i++) {
    const key = arr1[i];

    hash.set(key, (hash.get(key) || 0) + 1);
  }

  for (let i = 0; i < n2; i++) {
    const key = arr2[i];

    hash.set(key, (hash.get(key) || 0) + 1);
  }

  const unionArr = Array.from(hash.keys()).sort((a, b) => a - b);

  return unionArr;
}

const arr1 = [1, 2, 3, 4, 5],
  n1 = 5;
const arr2 = [2, 3, 4, 4, 5],
  n2 = 5;

const arr3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  n3 = arr3.length;

const arr4 = [2, 3, 4, 4, 5, 11, 12],
  n4 = arr4.length;

console.log(unionOfSortedArray(arr1, n1, arr2, n2));
console.log(unionOfSortedArray(arr3, n3, arr4, n4));

///using Two pointer
function unionOfSortedArrPointer(arr1, m, arr2, n) {
  let unionArr = [];

  let i = 0,
    j = 0;

  while (i < m && j < n) {
    if (arr1[i] < arr2[j]) {
      if (unionArr.length === 0 || unionArr[unionArr.length - 1] !== arr1[i]) {
        unionArr.push(arr1[i]);
        i++;
      }
    } else if (arr2[j] < arr1[i]) {
      if (unionArr.length === 0 || unionArr[unionArr.length - 1] !== arr2[j]) {
        unionArr.push(arr2[j]);
        j++;
      }
    } else {
      if (unionArr.length === 0 || unionArr[unionArr.length - 1] !== arr1[i]) {
        unionArr.push(arr1[i]);
        i++;
        j++;
      }
    }
  }

  while (i < m) {
    if (unionArr.length === 0 || unionArr[unionArr.length - 1] !== arr1[i]) {
      unionArr.push(arr1[i]);
      i++;
    }
  }

  while (j < n) {
    if (unionArr.length === 0 || unionArr[unionArr.length - 1] !== arr2[j]) {
      unionArr.push(arr2[j]);
      j++;
    }
  }

  return unionArr;
}

const arr5 = [1, 2, 3],
  m = arr5.length;
const arr6 = [2, 3, 4],
  n = arr6.length;

console.log(unionOfSortedArrPointer(arr5, m, arr6, n));

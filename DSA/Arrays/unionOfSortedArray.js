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

function removeDuplicate(arr, n) {
  let store = new Map();

  for (let num of arr) {
    store.set(num, (store.get(num) || 0) + 1);
  }

  const k = store.size;
  let result = Array.from(n).fill(0);

  store.forEach((value, key) => {
    result.push(key);
  });

  const resultLength = result.length;

  for (let i = 0; i < n - resultLength; i++) {
    result.push('_');
  }

   return [k, result]
}

const arr1 = [1, 1, 2],
  n = arr1.length;
console.log(removeDuplicate(arr1, n));

const arr2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
  n2 = arr2.length;
console.log(removeDuplicate(arr2, n2));

/////////////

function removeDuplicate1(arr, n) {
  let store = new Map();
  let result = [];

  for (let num of arr) {
    store.set(num, (store.get(num) || 0) + 1);
  }

  store.forEach((value, key) => {
    result.push(key);
  });

   return result
}


console.log(removeDuplicate1(arr1, n));

console.log(removeDuplicate1(arr2, n2));
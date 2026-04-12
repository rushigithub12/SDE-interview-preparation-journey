const arr = [7, 0, 0, 1, 7, 7, 2, 7, 7];
const n = arr.length;

function majorityElementInArray(arr, n) {
  let freq = new Map();

  for (let num of arr) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  for (let [key, value] of freq.entries()) {
    if (value > n / 2) {
      return key;
    }
  }

  return -1;
}

console.log(majorityElementInArray(arr, n));

//using counter

function majorityElementInArray1(arr, n) {
  for (let i = 0; i < n; i++) {
    let count = 0;
    for (let j = 0; j < n; j++) {
      count++;
    }
    if (count > n / 2) {
      return arr[i];
    }
  }
  return -1;
}
console.log(majorityElementInArray1(arr, n));

//optimal
function majorityElementInArray2(arr, n) {
  let count = 0;
  let el = 0;

  for (let num of arr) {
    if (count === 0) {
      count = 1;
      el = num;
    } else if (el === num) {
      count++;
    } else {
      count--;
    }
  }

  let count1 = arr.filter((num) => num === el).length;

  if (count1 > Math.floor(n / 2)) {
    return el;
  }
  return -1;
}

console.log(majorityElementInArray2(arr, n));

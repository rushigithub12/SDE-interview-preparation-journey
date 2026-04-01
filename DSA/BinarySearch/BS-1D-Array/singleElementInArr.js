const arr = [1, 1, 3, 5, 5],
  n = arr.length;

const arr1 = [1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6],
  n1 = arr1.length;

function singleElementInArr(arr, n) {
  if (n === 1) return arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (i === 0) {
      if (arr[i] !== arr[i + 1]) {
        return arr[i];
      }
    } else if (i === n - 1) {
      if (arr[i] !== arr[i - 1]) {
        return arr[i];
      }
    } else {
      if (arr[i] !== arr[i + 1] && arr[i] !== arr[i - 1]) {
        return arr[i];
      }
    }
  }
  return -1;
}

console.log(singleElementInArr(arr, n));

//XOR
function singleElementInArr1(arr, n) {
  let ans = 0;
  for (let i = 0; i < n; i++) {
    ans ^= arr[i];
  }
  return ans;
}

console.log(singleElementInArr1(arr, n));

///optimal approach
function singleElementInArr2(arr, n) {
  if (n === 1) return arr[0];
  if (arr[0] !== arr[1]) return arr[0];
  if (arr[n - 1] !== arr[n - 2]) return arr[n - 1];

  let low = 1,
    high = n - 2;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] !== arr[mid - 1] && arr[mid] !== arr[mid + 1]) {
      return arr[mid];
    } else if (
      (mid % 2 === 1 && arr[mid] === arr[mid - 1]) ||
      (mid % 2 === 0 && arr[mid] === arr[mid + 1])
    ) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}

console.log(singleElementInArr2(arr, n));
console.log(singleElementInArr2(arr1, n1));

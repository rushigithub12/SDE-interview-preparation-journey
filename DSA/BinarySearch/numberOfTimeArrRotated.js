function numberOfTimeArrRotated(arr) {
  let min = Infinity;
  let minIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }
  return { minIndex, min };
}

const arr = [4, 5, 6, 7, 0, 1, 2, 3];
const arr1 = [3, 4, 5, 1, 2];

console.log(numberOfTimeArrRotated(arr));
console.log(numberOfTimeArrRotated(arr1));

///optimal
function numberOfTimeArrRotated1(arr) {
  let low = 0,
    high = arr.length - 1;

  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);

    if (arr[mid] > arr[high]) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

console.log(numberOfTimeArrRotated1(arr));
console.log(numberOfTimeArrRotated1(arr1));

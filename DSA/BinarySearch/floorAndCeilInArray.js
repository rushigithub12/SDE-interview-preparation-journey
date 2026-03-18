function floorAndCeilInArray(arr, x) {
  let low = 0,
    high = arr.length - 1;
  let floor = -1;
  let ceil = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (arr[mid] >= x) {
      ceil = arr[mid];
      high = mid - 1;
    }
    if (arr[mid] <= x) {
      floor = arr[mid];
      low = mid + 1;
    }
  }
  return [floor, ceil];
}

const arr = [3, 4, 4, 7, 8, 10];
const x = 8;

console.log(floorAndCeilInArray(arr, x));

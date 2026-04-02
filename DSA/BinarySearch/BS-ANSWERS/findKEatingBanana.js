const arr = [3, 6, 7, 11],
  n = arr.length,
  h = 8;

function calculateHrs(arr, hourly) {
  let totalHrs = 0;

  for (let pile of arr) {
    totalHrs += Math.ceil(pile / hourly);
  }
  return totalHrs;
}

function findKEatingBanana(arr, n, h) {
  let maxVal = Math.max(...arr);

  for (let i = 1; i <= maxVal; i++) {
    let hrs = calculateHrs(arr, i);

    if (hrs <= h) {
      return i;
    }
  }
  return maxVal;
}

console.log(findKEatingBanana(arr, n, h));

///optimal approach

function findKEatingBanana1(arr, h) {
  let low = 1;
  let high = Math.max(...arr);
  let ans = high;

  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);

    let hrs = calculateHrs(arr, mid);

    if (hrs <= h) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

console.log(findKEatingBanana1(arr, h));

const bloomDays = [7, 7, 7, 7, 13, 11, 12, 7];
const k = 3;
const m = 2;

function isPossible(bloomDays, day, m, k) {
  let count = 0;
  let bouquet = 0;

  for (let bloom of bloomDays) {
    if (bloom <= day) {
      count++;

      if (count === k) {
        bouquet++;
        count = 0;
      }
    } else {
      count = 0;
    }
  }
  return bouquet >= m;
}

function minDaysToMakeBouquet(bloomDays, m, k) {
  let totalFlowers = m * k;
  if (totalFlowers > bloomDays.length) return -1;

  let minDay = Math.min(...bloomDays);
  let maxDay = Math.max(...bloomDays);

  for (let day = minDay; day <= maxDay; day++) {
    if (isPossible(bloomDays, day, m, k)) {
      return day;
    }
  }
  return -1;
}

console.log(minDaysToMakeBouquet(bloomDays, m, k));

//optimal approach

function minDaysToMakeBouquet1(bloomDays, m, k) {
  let totalFlowers = m * k;
  if (totalFlowers > bloomDays.length) return -1;

  let minDay = Math.min(...bloomDays);
  let maxDay = Math.max(...bloomDays);
  let result = -1;

  while (minDay <= maxDay) {
    let mid = Math.floor((minDay + maxDay) / 2);

    if (isPossible(bloomDays, mid, m, k)) {
      result = mid;
      maxDay = mid - 1;
    } else {
      minDay = mid + 1;
    }
  }
  return result;
}

console.log(minDaysToMakeBouquet1(bloomDays, m, k));

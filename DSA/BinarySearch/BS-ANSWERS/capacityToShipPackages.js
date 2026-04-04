const weights = [5, 4, 5, 2, 3, 4, 5, 6],
  n = weights.length;
const days = 5;

function calculateDaysRequired(wtt, capacity) {
  let dayNeeded = 1,
    loaded = 0;

  for (let num of wtt) {
    if (loaded + num > capacity) {
      dayNeeded++;
      loaded = num;
    } else {
      loaded += num;
    }
  }
  return dayNeeded;
}

function capacityToShipPackages(weights, n, d) {
  let minCapacity = Math.max(...weights);
  let maxCapacity = weights.reduce((a, b) => a + b, 0);

  for (let i = minCapacity; i <= maxCapacity; i++) {
    let daysRequired = calculateDaysRequired(weights, i);

    if (daysRequired <= d) {
      return i;
    }
  }

  return -1;
}

console.log(capacityToShipPackages(weights, n, days));

///optimal approach

function capacityToShipPackages1(weights, days) {
  let left = Math.max(...weights);
  let right = weights.reduce((a, b) => a + b, 0);

  while (left < right) {
    let mid = Math.floor((left + right) / 2);

    let daysRequired = calculateDaysRequired(weights, mid);

    if (daysRequired <= days) {
      right = mid;
    }else{
        left = mid + 1;
    }
  }
  return left;
}

console.log(capacityToShipPackages1(weights, days));

function findClosestNumber(n, m) {
  if (m <= 0) return;
  let rem = Math.abs(n % m);

  let lower = n >= 0 ? n - rem :  n + rem;
  let upper = n >= 0 ? n + (m - rem) : n - (m - rem);
  console.log("rem==>>", rem, "lower=>", lower, "upper=>", upper, Math.abs(n - lower) < Math.abs(upper - n))
  if (Math.abs(n - lower) < Math.abs(upper - n)) {
    return lower;
  } else {
    return upper;
  }
}

// console.log(findClosestNumber(13, 4));
console.log(findClosestNumber(-15, 6));
// console.log(findClosestNumber(22, 8));

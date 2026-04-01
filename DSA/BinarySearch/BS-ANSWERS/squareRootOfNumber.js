function squareRootOfNumber(n) {
  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (i * i <= n) {
      ans = i;
    } else {
      break;
    }
  }
  return ans;
}

console.log(squareRootOfNumber(36));

//optimal approach
function squareRootOfNumber1(n) {
  if (n < 2) return n;

  let left = 1,
    right = Math.floor(n / 2),
    ans = 0;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);

    if (mid * mid <= n) {
      ans = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return ans;
}

console.log(squareRootOfNumber1(36));

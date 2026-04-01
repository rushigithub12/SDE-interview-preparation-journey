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

function findNthRoot(n, m) {
  for (let i = 1; i < m; i++) {
    let power = Math.pow(i, n); // squareRoot 27 => 3, 256 => 4

    if (power === m) return i;
    if (power > m) break;
  }
  return -1;
}

console.log(findNthRoot(3, 27));
console.log(findNthRoot(4, 1024));
console.log(findNthRoot(5, 3125));


//optimal approach 
function findNthRoot1(n, m) {
  let low = 1;
  high = m;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    let ans = 1;
    for (let i = 0; i < n; i++) {
      ans *= mid;
      if (ans > m) break;
    }

    if (ans === m) return mid;
    if (ans < m) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

console.log(findNthRoot1(3, 27));
console.log(findNthRoot1(4, 1024));
console.log(findNthRoot1(5, 3125));

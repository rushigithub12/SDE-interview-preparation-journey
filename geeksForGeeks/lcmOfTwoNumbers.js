function lcmOfTwoNumbers(a, b) {
  let max = Math.max(a, b);

  while (true) {
    if (max % a === 0 && max % b === 0) {
      return max;
    }
    max++;
  }
}

console.log(lcmOfTwoNumbers(5, 10));

function gcdOfNum(a, b) {
  return b === 0 ? a : gcdOfNum(b, a % b);
}

function lcmUsingGcd(a, b) {
  let gcd = gcdOfNum(a, b);

  return (a * b) / gcd;
}

console.log(lcmOfTwoNumbers(10, 5));

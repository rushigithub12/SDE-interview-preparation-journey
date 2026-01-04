function gcdOfNumber(n1, n2) {
  let gcd = 1;
  for (let i = 0; i <= Math.min(n1, n2); i++) {
    if (n1 % i === 0 && n2 % i === 0) {
      gcd = i;
    }
  }
  return gcd;
}

console.log(gcdOfNumber(9, 12));
console.log(gcdOfNumber(20, 15));

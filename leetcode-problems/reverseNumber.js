function reverseNumber(x) {
  let n = Math.abs(x);
  const MAX_INT = 2147483647;
  const MIN_INT = -2147483648;

  let reversed = 0;

  while (n > 0) {
    const rem = Math.floor(n % 10);
    reversed = reversed * 10 + rem;
    n = Math.floor(n / 10);
  }

  if (reversed > MAX_INT || reversed < MIN_INT) {
    return 0;
  } else if (x < 0) {
    return -reversed;
  } else {
    return reversed;
  }
}

console.log(reverseNumber(123));
console.log(reverseNumber(-123));
console.log(reverseNumber(1534236469));
console.log(reverseNumber(120));
console.log(reverseNumber(-2147483412));
console.log(reverseNumber(1563847412));

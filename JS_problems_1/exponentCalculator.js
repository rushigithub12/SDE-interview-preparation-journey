function exponentCalculator(base, exp) {
  // return Math.pow(base, exp)
  if (
    typeof base !== "number" ||
    typeof exp !== "number" ||
    base < 0 ||
    exp < 0
  )
    return "Enter valid exp and base";
  let result = 1;
  for (let i = 0; i < exp; i++) {
    result *= base;
  }
  return result;
}

console.log(exponentCalculator(2, 5));
console.log(exponentCalculator(-2, 5));
console.log(exponentCalculator(2, "abcd"));

function findAllFactorsOfNumber(n) {
  if (typeof n !== "number" || n <= 0) return "Enter valid number";

  let factors = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      factors.push(i);
    }
  }
  return factors;
}

console.log(findAllFactorsOfNumber(10));
console.log(findAllFactorsOfNumber("abcdefg"));
console.log(findAllFactorsOfNumber(-25));

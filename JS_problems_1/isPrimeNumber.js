function isPrimeNumber(n) {
  if (n <= 0) return "Enter positive number";

  if (n === 1) return "Not a prime nor composite";

  if (n % 2 === 0) return false;

  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }

  return true;
}

console.log(isPrimeNumber(2));
console.log(isPrimeNumber(-2));
console.log(isPrimeNumber(40));
console.log(isPrimeNumber(47));

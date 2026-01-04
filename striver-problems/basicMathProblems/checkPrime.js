function isPrime(n) {
  if (n <= 1) return false;
  if(n ===2 ) return true;
  if(n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

function printAllPrimeNumbers(n) {
  let result = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) {
      result.push(i);
    }
  }
  return result;
}

console.log(isPrime(2), printAllPrimeNumbers(2));
console.log(isPrime(10), printAllPrimeNumbers(10));
console.log(isPrime(13), printAllPrimeNumbers(13));
console.log(isPrime(29), printAllPrimeNumbers(29));
console.log(isPrime(32), printAllPrimeNumbers(32));

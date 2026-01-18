function sumOfDigits(n) {
  if (n < 0) return "Enter positive number";
  let sum = 0;
  let x = n;
  while (x > 0) {
    let rem = Math.floor(x % 10);
    sum += rem;
    x = Math.floor(x / 10);
  }
  return sum;
}

console.log(sumOfDigits(1234));
console.log(sumOfDigits(-1234));

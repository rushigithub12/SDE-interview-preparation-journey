function factorialNumber(n) {
  if (n < 0) return "Factorial cannot be done";
  if (n === 0) return 1;
  return n * factorialNumber(n - 1);
}

function factorialNumber1(n) {
  if (n < 0) return "Factorial cannot be done";
  if (n === 0) return 1;
  let mult = n;
  for (let i = 1; i < n; i++) {
    mult *= n - i;
  }
  return mult;
}

function factorialNumber2(n) {
  if (n < 0) return "Factorial cannot be done";
  if (n === 0) return 1;
  let mult = 1;
  for (let i = 1; i <= n; i++) {
    mult *= i;
  }
  return mult;
}
console.log(factorialNumber(5));
console.log(factorialNumber(0));
console.log(factorialNumber(-3));
console.log(factorialNumber(12));
console.log(factorialNumber1(1));

console.log(factorialNumber1(5));
console.log(factorialNumber1(0));
console.log(factorialNumber1(-3));
console.log(factorialNumber1(12));
console.log(factorialNumber1(1));

console.log(factorialNumber2(5));
console.log(factorialNumber2(0));
console.log(factorialNumber2(-3));
console.log(factorialNumber2(12));

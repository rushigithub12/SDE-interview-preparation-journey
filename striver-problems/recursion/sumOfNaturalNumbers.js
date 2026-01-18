//using recursion
function sumOfNaturalNumbers(n) {
  if (n === 1) return 1;
  return n + sumOfNaturalNumbers(n - 1);
}

console.log(sumOfNaturalNumbers(5));

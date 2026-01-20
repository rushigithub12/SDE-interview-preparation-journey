function fibonacciSeries(n) {
  if (typeof n !== "number" || n < 0) return "Enter corret number";
  let result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 2] + result[i - 1]);
  }
  return result;
}

console.log(fibonacciSeries(5));
console.log(fibonacciSeries(-1));
console.log(fibonacciSeries("abcde"));

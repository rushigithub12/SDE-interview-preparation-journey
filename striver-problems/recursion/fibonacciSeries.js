function fibonacciSeries(n) {
  if (typeof n !== "number" || n < 0) return "Enter corret number";
  let result = [0, 1];
  for (let i = 2; i < n; i++) {
    result.push(result[i - 2] + result[i - 1]);
  }
  return result;
}

function fibonacciSeries1(n) {
  if (n < 2) return n;
  return fibonacciSeries1(n - 2) + fibonacciSeries1(n - 1);
}

let n = 5;
let fibSeries = [];
for (let i = 0; i < n; i++) {
  fibSeries.push(fibonacciSeries1(i));
}

console.log(fibonacciSeries(5));
console.log(fibonacciSeries(-1));
console.log(fibonacciSeries("abcde"));

console.log("fibSeries==>>", fibSeries);

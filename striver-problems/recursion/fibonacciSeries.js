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

//using optimization & dynamic programming
function fib(n, dp = {}) {
  if (n <= 1) return n;

  if (dp[n] !== undefined) return dp[n];

  dp[n] = fib(n - 2, dp) + fib(n - 1, dp);
  console.log(dp);
  return dp[n];
}

console.log(fib(5));
//fib[3] already calculated series re-use O(n)

//reduce space complexity
function fib1(n) {
  if (n <= 1) return n;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i++) {
    let c = a + b;
    b = a;
    a = c;
  }
  return a;
}

console.log(fib1(6));

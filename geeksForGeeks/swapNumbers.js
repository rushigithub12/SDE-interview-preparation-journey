// function swapNumbers(a, b) {
//   let temp = a;
//   a = b;
//   b = temp;
//   return [a, b];
// }

function swapNumbers(a, b) {
    [a, b] = [b, a]
  return [a, b];
}

console.log(swapNumbers(2, 3));

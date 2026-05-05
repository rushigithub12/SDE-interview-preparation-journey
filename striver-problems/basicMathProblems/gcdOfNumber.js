// function gcdOfNumber(n1, n2) {
//   let gcd = 1;
//   for (let i = 0; i <= Math.min(n1, n2); i++) {
//     if (n1 % i === 0 && n2 % i === 0) {
//       gcd = i;
//     }
//   }
//   return gcd;
// }

//euclidean alogorithm
// function gcdOfNumber(a, b) {
//   if (a < 0 || b < 0) return false;
//   if (a === 0) {
//     return b;
//   } else if (b === 0) {
//     return a;
//   } else if (a === b) {
//     return a;
//   } else if (a > b) {
//     return gcdOfNumber(a - b, b);
//   } else {
//     return gcdOfNumber(a, b - a);
//   }
// }

function gcdOfNumber(a, b) {
  return b === 0 ? a : gcdOfNumber(b, a % b);
}

console.log(gcdOfNumber(9, 12));
console.log(gcdOfNumber(20, 15));
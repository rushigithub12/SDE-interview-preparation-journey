// function isEvenNumber(n){
//     return n % 2 === 0;
// }

function isEvenNumber(n) {
  return (n & 1) === 0 ? true : false;
} //bitwise comparison compare last bit of a number if 0 EVEN else ODD

console.log(isEvenNumber(4)); // 4 = 100 & 1 = 001 => 000
console.log(isEvenNumber(5));

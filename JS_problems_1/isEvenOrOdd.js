function isEvenOrOdd(n) {
  if (n === 0) {
    return `${n} is Even`;
  }
  if (n % 1 !== 0) {
    return `${n} is neither Even nor Odd`;
  } else if (n % 2 === 0) {
    return `${n} is Even`;
  } else {
    return `${n} is Odd`;
  }
}

console.log(isEvenOrOdd(2));
console.log(isEvenOrOdd(-3));
console.log(isEvenOrOdd(0.5));
console.log(isEvenOrOdd(6.7));
console.log(isEvenOrOdd(-0.4));
console.log(isEvenOrOdd(0));

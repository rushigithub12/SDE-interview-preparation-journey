function isEvenOrOdd(n) {
  if (n < 0)
    throw new RangeError("Numbers should be greater than or equal to zero");
  if (n % 2 === 0) {
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

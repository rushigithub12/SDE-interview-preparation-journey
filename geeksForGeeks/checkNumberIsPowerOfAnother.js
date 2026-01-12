function checkNumberIsPowerOfAnother(x, y) {
  if (x === 1) {
    return y === 1;
  }
  if (y === 1) return true;
  if (x === 0 || y === 0) return false;

  while (y % x === 0) {
    y = y / x;
  }

  return y === 1;
}

console.log(checkNumberIsPowerOfAnother(10, 1000));
console.log(checkNumberIsPowerOfAnother(10, 1001));
console.log(checkNumberIsPowerOfAnother(10, 1));
console.log(checkNumberIsPowerOfAnother(6, 36));
console.log(checkNumberIsPowerOfAnother(1, 5));
console.log(checkNumberIsPowerOfAnother(2, 128));

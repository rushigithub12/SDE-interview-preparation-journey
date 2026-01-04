function armStrongNumber(n) {
  let sum = 0;
  let x = n;
  let len = n.toString().length;
  while (x > 0) {
    let rem = Math.floor(x % 10);
    sum += Math.pow(rem, len);
    x = Math.floor(x / 10);
  }
  return sum === n;
}
console.log(armStrongNumber(153));

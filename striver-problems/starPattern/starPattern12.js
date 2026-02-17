function printStarPattern12(n) {
  let str = "";
  for (let i = 1; i < n; i++) {
    for (let j = 1; j <= i; j++) {
      str += j;
    }
    for (let k = 0; k < 2 * n - 2 * i - 2; k++) {
      str += " ";
    }
    for (let j = i; j >= 1; j--) {
      str += j;
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern12(5));

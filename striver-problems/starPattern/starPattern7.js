function printStarPattern7(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let m = 0; m < n - i; m++) {
      str += " ";
    }
    for (let k = 1; k <= i; k++) {
      str += "*";
    }
    for (let j = 0; j <= i; j++) {
      str += "*";
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern7(5));

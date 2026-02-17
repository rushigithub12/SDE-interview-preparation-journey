function printStarPattern8(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) {
      str += " ";
    }
    for (let j = 0; j < n - i; j++) {
      str += "*";
    }
    for (let j = 1; j < n - i; j++) {
      str += "*";
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern8(5));

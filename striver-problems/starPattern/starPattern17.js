function printStarPattern17(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let k = 0; k <= n - i - 1; k++) {
      str += " ";
    }
    for (let j = 0; j <= i; j++) {
      str += String.fromCharCode(65 + j);
    }
    for (let j = i - 1; j >= 0; j--) {
      str += String.fromCharCode(65 + j);
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern17(5));

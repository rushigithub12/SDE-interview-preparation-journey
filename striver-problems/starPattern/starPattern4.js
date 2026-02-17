function printStarPattern4(n) {
  let str = "";
  for (let i = 0; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      str += i;
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern4(5));

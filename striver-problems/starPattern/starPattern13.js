function printStarPattern13(n) {
  let str = "";
  let num = 1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      str += num + " ";
      num++;
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern13(5));

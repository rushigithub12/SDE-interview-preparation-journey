function printStarPattern14(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      str += String.fromCharCode(65 + j) + " ";
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern14(5));
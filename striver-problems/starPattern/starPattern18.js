function printStarPattern18(n) {
  let str = "";
  for (let i = n - 1; i >= 0; i--) {
    for (let j =  i; j <= n - 1; j++) {
      str += String.fromCharCode(65 + j);
    }
    str += "\n";
  }
  return str;
}

console.log(printStarPattern18(5));

function printStarPattern11(n) {
  let str = "";
  let start = 1;
  for (let i = 0; i < n; i++) {
    start = i % 2 === 0 ? 0 : 1;
    for (let j = 0; j <= i; j++) {
      start = 1 - start;
      str += start;
    }
    str += "\n";
  }
  return str;
}

console.log(printStarPattern11(5));

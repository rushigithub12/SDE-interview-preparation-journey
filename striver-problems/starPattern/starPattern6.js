function printStarPattern6(n) {
  let str = "";
  for (let i = 0; i <= n; i++) {
    for (let j = 1; j <= n - i; j++) {
      str += j;
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern6(5));

function printStarPattern21(n) {
  let str = "";
  for (let i = 0; i < 2 * n - 1; i++) {
    for (let j = 0; j < 2 * n - 1; j++) {
        let top = i;
        let bottom = j;
        let right = (2 * n - 2) - j;
        let left = (2 * n - 2) - i;
        let midst = Math.min(top, bottom, right, left);

      str += (n - midst) + " ";
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern21(4));

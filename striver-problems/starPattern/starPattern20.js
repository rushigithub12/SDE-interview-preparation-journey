function printStarPattern20(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      str += "*";
    }
    for (let j = 1; j < n - i; j++) {
      str += " ";
    }
    for (let j = 1; j < n - i; j++) {
      str += " ";
    }
    for (let j = 0; j <= i; j++) {
      str += "*";
    }
    str += "\n";
  }
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < n - i; j++) {
      str += "*";
    }
    for (let j = 1; j <= i; j++) {
      str += " ";
    }
    for (let j = 1; j <= i; j++) {
      str += " ";
    }
    for (let j = 0; j < n - i; j++) {
      str += "*";
    }
    str += "\n";
  }
  return str;
}
console.log(printStarPattern20(5));

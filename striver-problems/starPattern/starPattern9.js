function printStarPattern9(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    for (let m = 0; m < n - i; m++) {
      str += " ";
    }
    for (let j = 0; j <= i; j++) {
      str += "*";
    }

    for (let k = 1; k <= i; k++) {
      str += "*";
    }
    str += "\n";
  }
  for (let i = 0; i < n; i++) {
    for (let m = 0; m <= i; m++) {
      str += " ";
    }
    for (let j = 0; j < n - i; j++) {
      str += "*";
    }

    for (let k = 1; k < n- i; k++) {
      str += "*";
    }
    str += "\n";
  }
  return str;
}

console.log(printStarPattern9(5));

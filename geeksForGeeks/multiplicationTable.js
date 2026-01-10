function multiplicationTable(n) {
  let str = "";
  for (let i = 1; i <= 10; i++) {
    str += n * i;
    str += "\n";
  }
  return str;
}

console.log(multiplicationTable(5));

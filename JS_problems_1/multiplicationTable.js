function multiplicationTable(a, n) {
  if (typeof a !== "number" || a < 0)
    return "Number should positive & string";
  let mult = "";
  for (let i = 1; i <= n; i++) {
    mult += a * i + "\n";
  }
  return mult;
}

function multiplicationTable2(tableOf, n) {
  for (let i = tableOf; i <= tableOf * n; i = i + tableOf) {
    console.log(`tableOf ${tableOf}`, i);
  }
}

function multiplicationTable1(a, b) {
  if (b < 1) return 1;
  a * multiplicationTable1(a, b - 1);
  console.log(a * b);
}

console.log(multiplicationTable(2, 10));
console.log(multiplicationTable(5, 5));
console.log(multiplicationTable(-1, 4));
console.log("\n");
multiplicationTable1(2, 10);
console.log("\n");
multiplicationTable1(5, 5);

multiplicationTable1(-1, 4);
multiplicationTable2(2, 4);

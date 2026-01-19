function recursion1(n, count, name) {
  if (n === count) return;
  console.log("printName=>", name);
  return recursion1(n, count + 1, name);
}

// recursion1(3, 0, "Rushi");
recursion1(1, 0, "Rushi");

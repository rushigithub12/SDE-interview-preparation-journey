function recursion3(n) {
  if (n < 1) return;
  console.log("print n", n);
  recursion3(n - 1);
} //forward tracking

function recursion4(n) {
  if (n < 1) return;
  recursion4(n - 1);
  console.log("print n", n);
} //backward tracking

recursion3(4);
recursion4(4);

function recursion2(count, n) {
  if (count > n) return;
  console.log("print 1 to n=>", count);

  return recursion2(count + 1, n);
} //forward tracking first result then print numbers again looping back whteer result is there in current

function recursion3(count, n) {
  if (count > n) return;

  recursion3(count + 1, n);
  console.log(count + " ");
}//backtracking, computed resulted printed in backwards

recursion2(1, 4);
recursion3(1, 4);

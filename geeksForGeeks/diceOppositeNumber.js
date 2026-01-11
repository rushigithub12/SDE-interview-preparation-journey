function diceOppositeNumber(n) {
  let ans;
  if (n == 1) {
    ans = 6;
  } else if (n === 2) {
    ans = 5;
  } else if (n === 3) {
    ans = 4;
  } else if (n === 4) {
    ans = 3;
  } else if (n === 5) {
    ans = 2;
  } else {
    ans = 1;
  }
  return ans;
}

function diceOppositeNumber(n) {
  return 7 - n;
} //(1 + 6 =7, 2 + 5 = 7, 3 + 4 = 7)

console.log(diceOppositeNumber(2));
console.log(diceOppositeNumber(6));

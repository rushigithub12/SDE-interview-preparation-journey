function rotateStringGoal(s, goal) {
  if (s.length !== goal.length) return false;

  let rotated = "";
  for (let i = 0; i < s.length; i++) {
    rotated = s.substring(i) + s.substring(0, i);

    if (rotated === goal) {
      return true;
    }
  }

  return false;
}

const s = "rotation";
const goal = "tionrota";

const s1 = "hello";
const goal1 = "lohelx";

console.log(rotateStringGoal(s, goal));
console.log(rotateStringGoal(s1, goal1));

//optimal solution
function rotateStringGoal1(s, goal) {
  if (s.length !== goal.length) return false;

  let doubleS = s + s;

  return doubleS.includes(goal);
}

console.log(rotateStringGoal1(s, goal));
console.log(rotateStringGoal1(s1, goal1));

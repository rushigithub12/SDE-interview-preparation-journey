function removeOuterMostParenthesis(str) {
  let resultStr = "";
  let count = 0;

  for (let ch of str) {
    if (ch === "(") {
      count++;
      if (count > 1) {
        resultStr += "(";
      }
    } else if (ch === ")") {
      count--;
      if (count > 0) {
        resultStr += ")";
      }
    }
  }
  return resultStr;
}

const str = "(()())(())";
console.log(removeOuterMostParenthesis(str));

const str1 = "(()())(())(()(()))";
console.log(removeOuterMostParenthesis(str1));

const str2 = "()()";
console.log(removeOuterMostParenthesis(str2))
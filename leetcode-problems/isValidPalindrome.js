function isAlphaNumeric(char) {
  return /[a-zA-Z0-9]/.test(char);
}

function isValidPalindromeStr(str) {
  let reversedArr = [];

  for (let ch of str) {
    if (isAlphaNumeric(ch)) {
      reversedArr.push(ch.toLowerCase());
    }
  }

  let i = 0,
    j = reversedArr.length - 1;

  while (i < j) {
    if (reversedArr[i] !== reversedArr[j]) return false;
    i++;
    j--;
  }

  return true;
}

console.log(isValidPalindromeStr("A man, a plan, a canal: Panama"));
console.log(isValidPalindromeStr("race a car"));
console.log(isValidPalindromeStr(" "));
console.log(isValidPalindromeStr("m a da m"));

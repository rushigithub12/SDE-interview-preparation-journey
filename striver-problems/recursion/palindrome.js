function palindrome(str) {
  let inputStr = str.toLowerCase();
  for (let i = 0; i <= inputStr.length / 2; i++) {
    if (inputStr[i] !== inputStr[inputStr.length - 1 - i]) return false;
  }
  return true;
}

function palindrome1(i, str) {
  if (i >= str.length / 2) return true;

  if (str[i] !== str[str.length - 1 - i]) return false;

  return palindrome1(i + 1, str);
}

console.log(palindrome("MADAM"));
console.log(palindrome1(0, "MADAM"));
console.log(palindrome1(0, "STRING"));

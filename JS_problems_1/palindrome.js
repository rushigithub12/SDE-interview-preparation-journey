function palindrome(str) {
  if (typeof str !== "string") return "Enter string";
  let reversedStr = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversedStr += str[i];
  }
  return reversedStr === str;
}

function palindrome3(str) {
  if (typeof str !== "string") return "Enter string";
  let reversedStr = "";
  for (let i = 0; i <= str.length - 1; i++) {
    reversedStr += str[str.length - 1 - i];
  }
  return reversedStr === str;
}

function palindrome2(str) {
  if (typeof str !== "string") return "Enter string";

  return str.split("").reverse().join("") === str;
}

function palindrome4(str) {
  let inputStr = str.toLowerCase();
  if (typeof str !== "string") return "Enter string";
  for (let i = 0; i <= inputStr.length / 2; i++) {
    //chek first and last element are equal
    if (inputStr[i] !== inputStr[inputStr.length - 1 - i]) return false;
  }
  return true;
}

// console.log(palindrome("string"));
// console.log(palindrome("madam"));
// console.log(palindrome(1234));
// console.log(palindrome(null));

// console.log(palindrome2("madam"));
// console.log(palindrome2("string"));

// console.log(palindrome3("string"));
// console.log(palindrome3("madam"));

console.log(palindrome4("string"));
console.log(palindrome4("madam"));

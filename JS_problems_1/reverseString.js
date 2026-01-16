function reverseString(s) {
  if (typeof s !== "string") return "not a string";
  let newStr = "";
  for (let i = s.length - 1; i >= 0; i--) {
    newStr += s[i];
  }
  return newStr;
}

function reverseString2(s) {
  if (typeof s !== "string") return "not a string";
  return s.split("").reverse().join("");
}

console.log(reverseString("Javascript"));
console.log(reverseString("Software Development"));
console.log(reverseString(12351658));

//
console.log(reverseString2("Javascript"));
console.log(reverseString2("Software Development"));
console.log(reverseString2(12351658));

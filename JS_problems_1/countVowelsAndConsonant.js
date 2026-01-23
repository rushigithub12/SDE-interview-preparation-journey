function countVowelsAndConsonant(str) {
  if (typeof str !== "string") return "Enter string";
  let vowels = "aeiou";
  let vowelsCount = 0;
  let consonantCount = 0;

  for (let i = 0; i < str.length; i++) {
    let ch = str[i].toLowerCase();

    if (ch >= "a" && ch <= "z") {
      if (vowels.includes(ch)) {
        vowelsCount++;
      } else {
        consonantCount++;
      }
    }
  }
  return { vowelsCount, consonantCount };
}
console.log(countVowelsAndConsonant("abcdefh"));
console.log(countVowelsAndConsonant("Hello World"));
console.log(countVowelsAndConsonant(12234));

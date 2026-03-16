function reverseWordsInString(str) {
  return str.trim().split(/\s+/).reverse().join(" ");
}

const str1 = "a good   example";
console.log(reverseWordsInString(str1));

//using two pointer

function reverseStr(str) {
  let resultStr = "";

  let i = str.length - 1;

  while (i >= 0) {
    while (i >= 0 && str[i] === " ") {
      i--;
    }

    if (i < 0) break;

    let end = i;

    while (i >= 0 && str[i] !== " ") {
      i--;
    }
    let word = str.substring(i + 1, end + 1);

    if (resultStr.length > 0) {
      resultStr += " ";
    }

    resultStr += word;
  }

  return resultStr;
}

console.log(reverseStr(str1));

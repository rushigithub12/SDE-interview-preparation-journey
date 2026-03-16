function largestOddString(str) {
  if (!str.length) return "";
  for (let i = str.length - 1; i >= 0; i--) {
    if (str[i] % 2 === 1) {
      return str.slice(0, i + 1);
    }
  }
  return "";
}

const str = "5347";
console.log(largestOddString(str));

///for leading zero
function largestOddString1(str) {
  let start = -1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "0") {
      start = i;
      break;
    }
  }

  if (start === -1) return "";

  for (let j = str.length - 1; j >= start; j--) {
    if (str[j] % 2 === 1) {
      return str.slice(start, j + 1);
    }
  }
  return "";
}

const str1 = "0214638";
console.log(largestOddString1(str1));

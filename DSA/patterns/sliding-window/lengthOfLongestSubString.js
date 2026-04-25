const str = "abcddabac";
const str1 = "aaabbbccc";

function lengthOfLongestSubString(str) {
  let maxLen = 0;

  for (let i = 0; i < str.length - 1; i++) {
    let subStr = "";
    for (let j = i; j < str.length; j++) {
      if (subStr.includes(str[j])) {
        break;
      }
      subStr += str[j];
      maxLen = Math.max(maxLen, subStr.length);
    }
  }
  return maxLen;
}

console.log(lengthOfLongestSubString(str));
console.log(lengthOfLongestSubString(str1));

//using set
function lengthOfLongestSubString1(str) {
  let maxLen = 0;

  for (let i = 0; i < str.length; i++) {
    let hashSet = new Set();

    for (let j = i; j < str.length; j++) {
      if (hashSet.has(str[j])) {
        break;
      }

      hashSet.add(str[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }

  return maxLen;
}

console.log(lengthOfLongestSubString1(str));
console.log(lengthOfLongestSubString1(str1));

//using optimal approach hashArray
function lengthOfLongestSubString2(str) {
  let maxLen = 0;
  let hashSet = new Set();
  let left = 0;

  for (let right = 0; right < str.length; right++) {
    while (hashSet.has(str[right])) {
      hashSet.delete(str[left]);
      left++;
    }
    console.log(hashSet);
    hashSet.add(str[right]);
    console.log(hashSet);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

console.log(lengthOfLongestSubString2(str));
console.log(lengthOfLongestSubString2(str1));

///using map
function lengthOfLongestSubString3(str) {
  let maxLen = 0;
  let hashMap = new Map();
  let left = 0;

  for (let right = 0; right < str.length; right++) {
    if (hashMap.has(str[right])) {
      left = Math.max(hashMap.get(str[right]) + 1, left);
    }

    hashMap.set(str[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

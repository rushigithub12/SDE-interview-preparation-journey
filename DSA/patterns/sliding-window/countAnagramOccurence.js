const txt = "forxxorfxdofr";
const pat = "for";

const txt1 = "aabaabaa";
const pat1 = "aaba";

function countAnagramOccurence(txt, pat) {
  let k = pat.length;
  let sortedPat = pat.split("").sort().join("");
  let count = 0;

  for (let i = 0; i <= txt.length - k; i++) {
    let sub = txt.slice(i, i + k);
    let sortedSub = sub.split("").sort().join("");

    if (sortedPat === sortedSub) {
      count++;
    }
  }
  return count;
}

console.log(countAnagramOccurence(txt, pat));
console.log(countAnagramOccurence(txt1, pat1));


//using sliding window
function countAnagrams(txt, pat) {
  let k = pat.length;
  let count = 0;

  let freq = new Map();

  for (let ch of pat) {
    freq.set(ch, (freq.get(ch) || 0) + 1);
  }

  let distinctCount = freq.size;
  let i = 0;

  for (let j = 0; j < txt.length; j++) {
    if (freq.has(txt[j])) {
      freq.set(txt[j], freq.get(txt[j]) - 1);

      if (freq.get(txt[j]) === 0) {
        distinctCount--;
      }
    }

    if (j - i + 1 < k) {
      continue; //j++
    } else if (j - i + 1 === k) {
      if (distinctCount === 0) {
        count++;
      }

      if (freq.has(txt[i])) {
        if (freq.get(txt[i]) === 0) {
          distinctCount++;
        }
        freq.set(txt[i], freq.get(txt[i]) + 1);
      }

      i++;
    }
  }

  return count;
}

console.log(countAnagrams(txt, pat));
console.log(countAnagrams(txt1, pat1));

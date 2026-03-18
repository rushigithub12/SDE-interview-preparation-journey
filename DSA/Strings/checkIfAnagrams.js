function checkIfAnagrams(s, g) {
  if (s.length !== g.length) return false;
  let s1 = s.split("").sort().join("");
  let g1 = g.split("").sort().join("");

  if (s1 === g1) {
    return true;
  }
  return false;
}

const s = "CAT";
const g = "ACT";

console.log(checkIfAnagrams(s, g));

//optimal approach
function checkIfAnagrams1(s, g) {
  if (s.length !== g.length) return false;

  let freq = new Array(26).fill(0);

  for (let i = 0; i < s.length; i++) {
    freq[s.charCodeAt(i) - "A".charCodeAt(0)]++;
  }

  for (let i = 0; i < g.length; i++) {
    freq[g.charCodeAt(i) - "A".charCodeAt(0)]--;
  }

  for (let i = 0; i < 26; i++) {
    if (freq[i] !== 0) {
      return false;
    }
  }

  return true;
}

const s1 = "rat", t1= "car"
console.log(checkIfAnagrams1(s1, t1));

function isomorphicString(s, t) {
  if (s.length !== t.length) return false;

  let mapST = {};
  let mapTS = {};

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    if (
      (mapST[charS] && mapST[charS] !== charT) ||
      (mapTS[charT] && mapTS[charT] !== charS)
    ) {
      return false;
    }
    mapST[charS] = charT;
    mapTS[charT] = charS;
  }
  return true;
}

const s = "paper";
const t = "title";

const s1 = "foo";
const t1 = "bar";

console.log(isomorphicString(s, t));
console.log(isomorphicString(s1, t1));

///using array hash space complexity O(1)
function isomorphicString1(s, t) {
  if (s.length !== t.length) return false;

  let hash1 = new Array(256).fill(-1);
  let hash2 = new Array(256).fill(-1);

  for (let i = 0; i < s.length; i++) {
    if (hash1[s.charCodeAt(i)] !== hash2[t.charCodeAt(i)]) {
      return false;
    }
    hash1[s.charCodeAt(i)] = i + 1;
    hash2[t.charCodeAt(i)] = i + 1;
  }
  console.log(hash1)
  return true;
}

console.log(isomorphicString1(s, t));

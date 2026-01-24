function characterHashing(inputStr, queries) {
  let hasedObj = {};
  for (let i = 0; i < inputStr.length; i++) {
    let key = inputStr[i];
    hasedObj[key] = (hasedObj[key] || 0) + 1;
  }

  for (let i = 0; i < queries.length; i++) {
    let q = queries[i];
    console.log(`Frquency of ${q} = ${(hasedObj[q] = hasedObj[q] || 0)}`);
  }
  return hasedObj;
}

function characterHashing1(str, queries) {
  let hashedArr = new Array(26).fill(0);
  for (let i = 0; i < str.length; i++) {
    let index = str.charCodeAt(i) - "a".charCodeAt(0);
    hashedArr[index]++;
  }

  for (let i = 0; i < queries.length; i++) {
    if (hashedArr[i] === queries[i]) {
      console.log(hashedArr[i]);
    }
  }
  return hashedArr;
}

//using Map

function characterHashing2(str, arr) {
  let inputStrArr = str.split("");
  let freq = new Map();

  for (let el of inputStrArr) {
    freq.set(el, (freq.get(el) || 0) + 1);
  }
  for (let i = 0; i < arr.length; i++) {
    let q = arr[i];
     console.log(`Frequency of ${q} = ${freq.get(q) || 0}`);
  }
  return freq;
}

console.log(characterHashing("abcdabefc", ["a", "c", "z"]));

console.log(characterHashing1("abcdabefc", ["a", "c", "z"]));

console.log(characterHashing2("abcdabefc", ["a", "c", "z"]));

console.log(("first").split(""))

//collision case in maps

function hashArray(arr, size){
    let hash = new Array(size).fill(0);

    for(let i=0; i<arr.length; i++){
        let index = arr[i] % size;
        hash[index]++;
    } 
    return hash;
}

console.log(hashArray([2,5,16,28,139,12], 10))
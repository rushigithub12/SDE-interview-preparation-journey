function preStoreFetch(inputArr, queries) {
  let hashObj = {};
  for (let i = 0; i < inputArr.length; i++) {
    let key = inputArr[i];
    hashObj[key] = (hashObj[key] || 0) + 1;
  }//pre-storing

  for (let i = 0; i < queries.length; i++) {
    let q = queries[i];
    console.log(`Frequencies of ${q} = ${hashObj[q] || 0}`); //fetching
  }
  return hashObj;
}

let inputArr = [1, 2, 1, 3, 2];
let queries = [1, 3, 4, 2, 10];

console.log(preStoreFetch(inputArr, queries));

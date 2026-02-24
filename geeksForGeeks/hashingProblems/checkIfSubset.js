//using object
function checkIfSubset(a, b) {
  const hashObj = {};

  for (let num of a) {
    hashObj[num] = (hashObj[num] || 0) + 1;
  }

  for (let query of b) {
    if (!hashObj[query]) {
      return false;
    }
  }
  return true;
}

const arr1 = [11, 1, 13, 21, 3, 7];
const query1 = [11, 3, 7, 1];

const arr2 = [10, 5, 2, 23, 19];
const query2 = [19, 5, 3];

console.log(checkIfSubset(arr1, query1));
console.log(checkIfSubset(arr2, query2));


//using hashSet
function checkIfSubset1(a, b) {
  const hashSet = new Set(a);

  for (let query of b) {
    if (!hashSet.has(query)) {
      return false;
    }
  }
  return true;
}

console.log(checkIfSubset1(arr1, query1));
console.log(checkIfSubset1(arr2, query2));

//using two pointer
function checkIfSubset2(a, b){
    a.sort((x, y) => x - y);
    b.sort((x, y) => x - y);

    let i=0, j=0;
    let m = a.length, n = b.length;

    while(i < m && j < n){
        if(a[i] < b[j]){
            i++;
        }else if(a[i] === b[j]){
            i++;
            j++;
        }else {
            return false;
        }
    }
    return (j === n)
}

console.log(checkIfSubset2(arr1, query1));
console.log(checkIfSubset2(arr2, query2));
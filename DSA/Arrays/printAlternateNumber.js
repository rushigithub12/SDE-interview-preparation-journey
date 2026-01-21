function printAlternateNumber(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i = i + 2) {
    newArr.push(arr[i]);
  }
  return newArr;
}

function printAlternateNumber2(arr, idx, res) {
    if(idx < arr.length){
        res.push(arr[idx]);
        printAlternateNumber2(arr, idx + 2, res)
    }
}

function getResult(arr, idx){
    let res = [];
    printAlternateNumber2(arr, idx, res)
    return res;
}

console.log(printAlternateNumber([10, 20, 30])); //output 10, 30
console.log(printAlternateNumber([-5, 1, 4, 2, 12]).join()); //output 10, 30
console.log(getResult([10, 20, 30], 0)); //output 10, 30

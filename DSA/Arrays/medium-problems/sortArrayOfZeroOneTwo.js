const arr = [1, 0, 2, 1, 0];
const n = arr.length;

function sortArrayOfZeroOneTwo(arr, n) {
  return arr.sort((a, b) => a - b);
}

console.log(sortArrayOfZeroOneTwo(arr, n));

//count each numbers frequency
function sortArrayOfZeroOneTwo1(arr) {
  let zerosCount = 0;
  let onesCount = 0;
  let twosCount = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      zerosCount++;
    } else if (arr[i] === 1) {
      onesCount++;
    } else {
      twosCount++;
    }
  }

  let index = 0;

  while (zerosCount--) {
    arr[index++] = 0;
  }

  while (onesCount--) {
    arr[index++] = 1;
  }

  while (twosCount--) {
    arr[index++] = 2;
  }

  return arr;
}

console.log(sortArrayOfZeroOneTwo1(arr));

///better appraoch
function sortArrayOfZeroOneTwo2(arr, n) {
  let count0 = 0,
    count1 = 0,
    count2 = 0;

  for (let i = 0; i < n; i++) {
    if (arr[i] === 0) count0++;
    else if (arr[i] === 1) count1++;
    else count2++;
  }

  for (let i = 0; i < count0; i++) {
    arr[i] = 0;
  }

  for (let i = count0; i < count0 + count1; i++) {
    arr[i] = 1;
  }

  for (let i = count0 + count1 + count2; i < n; i++) {
    arr[i] = 2;
  }

  return arr;
}

console.log(sortArrayOfZeroOneTwo2(arr, n));

//using three pointers
function sortArrayOfZeroOneTwo3(arr, n){
    let low = 0, mid = 0, high = n-1;

    while(mid <= high){
        if(arr[mid] === 0){
            [arr[mid], arr[low]] = [arr[low], arr[mid]];
            mid++;
            low++;
        }else if(arr[mid] === 1){
            mid++;
        }else{
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
            high--;
        }
    }
    return arr;
}

console.log(sortArrayOfZeroOneTwo3(arr, n))
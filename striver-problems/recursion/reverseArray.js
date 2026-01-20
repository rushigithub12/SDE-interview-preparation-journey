function reverseArray(arr) {
  let reversedArr = [];

  for (let i = 0; i < arr.length; i++) {
    reversedArr.push(arr[arr.length - 1 - i]);
  }

  return reversedArr;
}

//using two pointer
function reverseArray1(arr) {
  if (!arr || arr.length === 0) return "Enter values in array";
  let pointer1 = 0,
    pointer2 = arr.length - 1;
  while (pointer1 < pointer2) {
    // [arr[pointer1], arr[pointer2]] = [arr[pointer2], arr[pointer1]];

    let temp = arr[pointer1];
    arr[pointer1] = arr[pointer2];
    arr[pointer2] = temp;

    pointer1 = pointer1 + 1;
    pointer2 = pointer2 - 1;
  }
  return arr;
}

// console.log(reverseArray([1, 2, 3, 4, 5]))
console.log(reverseArray1([1, 2, 3, 4, 5]));
console.log(reverseArray1(["a", "b", "c", "d"]));

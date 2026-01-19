function maxNumberInArray(arr) {
  if (!arr || arr.length === 0) return "Provide numbers";
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (typeof (arr[i]) !== "number") return "Check type of element in array";
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

console.log(maxNumberInArray([1, 2, -4, 6, -30, 5]));
console.log(maxNumberInArray([1, 1]));
console.log(maxNumberInArray([]));
console.log(maxNumberInArray(null));
console.log(maxNumberInArray([1, 2, "3"]));
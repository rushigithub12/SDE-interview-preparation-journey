function averageOfNumbers(arr) {
  if(!arr || !arr.length) return "Enter array elements.";

  let sum = 0;
  let len = arr.length;

  for (let i = 0; i < len; i++) {
    if(typeof arr[i] !== "number" || arr[i] <= 0) return "Enter valid numbers"
    sum += arr[i];
  }

  return sum / len;
}

console.log(averageOfNumbers([2, 4, 5]));
console.log(averageOfNumbers([-2, 5, 0]));
console.log(averageOfNumbers([1, 2, 3, 4, 5]));

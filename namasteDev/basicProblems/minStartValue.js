// function minStartValue(nums) {
//   let startValue = 1;

//   while (true) {
//     let sum = startValue;
//     let isValid = true;

//     for (let i = 0; i < nums.length; i++) {
//       sum += nums[i];

//       if (sum < 1) {
//         startValue++;
//         isValid = false;
//         break;
//       }
//     }
//     if (isValid) return startValue;
//   }
// }

function minStartValue(nums){
    let minVal = 0;
    let currSum = 0;
    for(let i=0; i<nums.length; i++){
        currSum += nums[i];
        minVal = Math.min(minVal, currSum)
    }
    return 1 - minVal;
}

console.log(minStartValue([-3, 2, -3, 4, 2]));
console.log(minStartValue([1, 2]));
console.log(minStartValue([1, -2, -3]));

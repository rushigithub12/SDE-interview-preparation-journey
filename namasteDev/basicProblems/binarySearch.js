// function binarySearch(nums, target) {
//   let ind = -1;

//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] === target) {
//       ind = i;
//       break;
//     }
//   }
//   return ind;
// }

function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (target > nums[mid]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9));
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 2));

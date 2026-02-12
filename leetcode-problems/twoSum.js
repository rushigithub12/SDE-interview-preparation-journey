//two for loops O(n2)
function twoSum(nums, target) {
  let len = nums.length;
  if (len >= 2) {
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        if (nums[i] + nums[j] === target) {
          return [i, j];
        }
      }
    }
  }
}

//using hasMap O(n)
function twoSumHash(arr, target){
  const hash = {};
  const len = arr.length;
  for(let i=0; i < len; i++){
    const complement = target - arr[i];
    console.log(hash)
    if(complement in hash){
      return [hash[complement], i];
    }
    hash[arr[i]] = i;
  }
}

// console.log(twoSum([2, 7, 11, 15], 9));
// console.log(twoSum([3, 2, 4], 6));
// console.log(twoSum([3, 3], 6));
// console.log(twoSum([3, 2, 3], 6));


console.log(twoSumHash([2, 7, 11, 15], 9));
console.log(twoSumHash([3, 2, 4], 6));
console.log(twoSumHash([3, 3], 6));
console.log(twoSumHash([3, 2, 3], 6));

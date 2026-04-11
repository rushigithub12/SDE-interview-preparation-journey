const arr = [2, 6, 5, 8, 11];
const n = arr.length;
const target = 14;

function twoSum(arr, n, target) {
  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j++) {
      if (arr[i] + arr[j] === target) {
        return [i, j];
      }
    }
  }
  return -1;
}

console.log(twoSum(arr, n, 14));

//better approach hashmap
function twoSum1(arr, n, target) {
  const map = new Map();

  for (let i = 0; i < n; i++) {
    let complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(arr[i], i);
  }
  return -1;
}

console.log(twoSum1(arr, n, target));

//using optimal approach using two pointers
function twoSum2(arr, n, target) {
  let left = 0,
    right = n - 1;

  while (left <= right) {
    let complement = arr[left] + arr[right];
    if (complement === target) {
      return [left, right];
    } else if (target < complement) {
      right--;
    } else {
      left++;
    }
  }
  return -1;
}

console.log(twoSum2(arr, n, target));

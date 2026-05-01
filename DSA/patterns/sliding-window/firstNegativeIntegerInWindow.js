const nums = [12, -1, -7, 30, 16, 28, 8, -15];
const k = 3;

function firstNegativeIntegerInWindow(nums, k) {
  let result = [];

  for (let i = 0; i <= nums.length - k; i++) {
    let found = false;
    for (let j = i; j < i + k; j++) {
      if (nums[j] < 0) {
        result.push(nums[j]);
        found = true;
        break;
      }
    }
    if (!found) result.push(0);
  }
  return result;
}

console.log(firstNegativeIntegerInWindow(nums, k));

//using sliding window
function firstNegativeIntegerInWindow1(nums, k) {
  let result = [];
  let queue = [];
  let i = 0;

  for (let j = i; j < nums.length; j++) {
    if (nums[j] < 0) {
      queue.push(j);
    }

    if (j - i + 1 === k) {
      if (queue.length > 0) {
        result.push(nums[queue[0]]);
      } else {
        result.push(0);
      }

      if (queue.length > 0 && queue[0] === i) {
        queue.shift();
      }
      i++;
    }
  }

  return result;
}

console.log(firstNegativeIntegerInWindow1(nums, k));

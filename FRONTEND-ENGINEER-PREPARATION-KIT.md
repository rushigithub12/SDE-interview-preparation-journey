# Senior Frontend Engineer — Complete Interview Bible
### DSA Patterns · JavaScript Deep Dives · React Internals · System Design · Company-Specific Prep

> **Target:** Senior Frontend Engineer | 5–8 YOE | 30–50 LPA | Indian Product Companies  
> **Companies:** Flipkart · Swiggy · Razorpay · CRED · Meesho · Dream11 · Zepto · PhonePe · Groww · Zomato · Juspay · Atlassian  
> **Philosophy:** 40–50 well-understood problems beat 200 rushed ones. DSA opens the door. Frontend depth gets the offer.

---

## Table of Contents

1. [How to Use This Document](#1-how-to-use-this-document)
2. [DSA Patterns — Complete Syllabus](#2-dsa-patterns--complete-syllabus)
   - 2.1 Arrays & Two Pointers
   - 2.2 Sliding Window
   - 2.3 HashMap & Sets
   - 2.4 Stack & Monotonic Stack
   - 2.5 Queue & Deque
   - 2.6 Binary Search
   - 2.7 Recursion & Backtracking
   - 2.8 Trees — BFS & DFS
   - 2.9 Linked Lists
   - 2.10 Greedy & Intervals
   - 2.11 Dynamic Programming (1D)
   - 2.12 Graphs — BFS/DFS
3. [JavaScript Problems — Deep Dive](#3-javascript-problems--deep-dive)
   - 3.1 Closures & Scope
   - 3.2 Promises & Async
   - 3.3 Event Loop & Microtasks
   - 3.4 Prototype & Inheritance
   - 3.5 Functional Programming
   - 3.6 DOM & Browser APIs
   - 3.7 Performance & Memory
   - 3.8 JS Machine Coding
4. [React Problems — Deep Dive](#4-react-problems--deep-dive)
   - 4.1 Hooks Internals
   - 4.2 Performance Optimization
   - 4.3 State Management
   - 4.4 React Machine Coding
   - 4.5 React Architecture
5. [Frontend System Design](#5-frontend-system-design)
6. [Company-Specific Interview Patterns](#6-company-specific-interview-patterns)
7. [Machine Coding Problems — Full List](#7-machine-coding-problems--full-list)
8. [LLD for Frontend Engineers](#8-lld-for-frontend-engineers)
9. [Behavioral & Leadership Questions](#9-behavioral--leadership-questions)
10. [30-Day Study Plan](#10-30-day-study-plan)

---

## 1. How to Use This Document

### Priority Legend
| Symbol | Meaning |
|--------|---------|
| 🔴 MUST | Asked at almost every company. Do not skip. |
| 🟡 NICE | Asked at harder companies (Flipkart, CRED). Good to know. |
| ⚪ SKIP | Advanced. Out of scope for 30–50 LPA frontend roles. |

### Interview Weight by Company Tier

| Area | Razorpay | Swiggy | CRED | Flipkart | Meesho | Dream11 |
|------|----------|--------|------|----------|--------|---------|
| DSA | 30% | 20% | 35% | 40% | 20% | 25% |
| JS Depth | 35% | 25% | 25% | 20% | 25% | 20% |
| React/UI | 20% | 30% | 20% | 15% | 30% | 25% |
| System Design | 15% | 25% | 20% | 25% | 25% | 30% |

### Golden Rule for Senior Engineers
You are not evaluated like a fresher. You are expected to:
- Write optimal code **and** explain time/space complexity without being asked
- Connect DSA problems to real frontend scenarios (e.g., "this sliding window is basically how I'd throttle API calls")
- Drive the conversation — ask clarifying questions before coding

---

## 2. DSA Patterns — Complete Syllabus

---

### 2.1 Arrays & Two Pointers 🔴 MUST

**Core Idea:** Use two indices moving toward each other (or at different speeds) to avoid O(n²) brute force.

**When to use:**
- Sorted array problems
- Finding pairs/triplets that meet a condition
- Palindrome checks
- Removing duplicates

**Pattern Template:**
```javascript
function twoPointers(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    if (condition(arr[left], arr[right])) {
      // process
      left++;
      right--;
    } else if (needLarger) {
      left++;
    } else {
      right--;
    }
  }
}
```

#### Problems

**1. Two Sum (🔴 MUST)**
```javascript
// Given sorted array, find indices of two numbers that add to target
function twoSum(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}
// Time: O(n) | Space: O(1)
```

**2. Container With Most Water (🔴 MUST)**
```javascript
function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}
// Time: O(n) | Space: O(1)
```

**3. 3Sum (🟡 NICE)**
```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // skip duplicates
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}
// Time: O(n²) | Space: O(1) excluding output
```

**4. Trapping Rain Water (🟡 NICE — asked at Flipkart, CRED)**
```javascript
function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      height[left] >= leftMax ? (leftMax = height[left]) : (water += leftMax - height[left]);
      left++;
    } else {
      height[right] >= rightMax ? (rightMax = height[right]) : (water += rightMax - height[right]);
      right--;
    }
  }
  return water;
}
// Time: O(n) | Space: O(1)
```

**5. Move Zeroes (🔴 MUST — warm-up at Swiggy, Meesho)**
```javascript
function moveZeroes(nums) {
  let insertPos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) nums[insertPos++] = nums[i];
  }
  while (insertPos < nums.length) nums[insertPos++] = 0;
}
// Time: O(n) | Space: O(1)
```

---

### 2.2 Sliding Window 🔴 MUST

**Core Idea:** Maintain a window [left, right] and expand/shrink it to satisfy a constraint. Avoids nested loops.

**Fixed-size window template:**
```javascript
function fixedWindow(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}
```

**Variable-size window template:**
```javascript
function variableWindow(arr, target) {
  let left = 0, result = 0;
  let windowState = /* initial state */;
  for (let right = 0; right < arr.length; right++) {
    // expand window: add arr[right]
    while (/* window invalid */) {
      // shrink: remove arr[left], left++
    }
    // update result
  }
  return result;
}
```

#### Problems

**1. Longest Substring Without Repeating Characters (🔴 MUST)**
```javascript
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    if (map.has(s[right])) {
      left = Math.max(left, map.get(s[right]) + 1);
    }
    map.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// Time: O(n) | Space: O(min(n, alphabet))
// Frontend relevance: throttling unique events in a stream
```

**2. Minimum Window Substring (🟡 NICE)**
```javascript
function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let left = 0, have = 0, required = need.size;
  let result = '', minLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      need.set(c, need.get(c) - 1);
      if (need.get(c) === 0) have++;
    }
    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        result = s.slice(left, right + 1);
      }
      const lc = s[left++];
      if (need.has(lc)) {
        need.set(lc, need.get(lc) + 1);
        if (need.get(lc) > 0) have--;
      }
    }
  }
  return result;
}
// Time: O(n) | Space: O(|t|)
```

**3. Maximum Sum Subarray of Size K (🔴 MUST)**
```javascript
function maxSumSubarray(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b);
  let max = sum;
  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k];
    max = Math.max(max, sum);
  }
  return max;
}
```

**4. Longest Subarray with Sum ≤ K (🟡 NICE)**
```javascript
function longestSubarray(arr, k) {
  let left = 0, sum = 0, maxLen = 0;
  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum > k) sum -= arr[left++];
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
```

---

### 2.3 HashMap & Sets 🔴 MUST

**Core Idea:** Trade space for time. O(1) lookups convert many O(n²) problems to O(n).

#### Problems

**1. Two Sum — Unsorted (🔴 MUST)**
```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}
// Time: O(n) | Space: O(n)
```

**2. Group Anagrams (🔴 MUST — asked at Swiggy, Meesho)**
```javascript
function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const key = str.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(str);
  }
  return [...map.values()];
}
// Time: O(n * k log k) where k = max string length
```

**3. Longest Consecutive Sequence (🟡 NICE — Flipkart)**
```javascript
function longestConsecutive(nums) {
  const set = new Set(nums);
  let maxLen = 0;
  for (const num of set) {
    if (!set.has(num - 1)) { // start of sequence
      let curr = num, len = 1;
      while (set.has(curr + 1)) { curr++; len++; }
      maxLen = Math.max(maxLen, len);
    }
  }
  return maxLen;
}
// Time: O(n) | Space: O(n)
```

**4. Subarray Sum Equals K (🟡 NICE)**
```javascript
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;
  for (const num of nums) {
    sum += num;
    count += map.get(sum - k) || 0;
    map.set(sum, (map.get(sum) || 0) + 1);
  }
  return count;
}
// Prefix sum + hashmap pattern
```

**5. Top K Frequent Elements (🟡 NICE)**
```javascript
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}
// Time: O(n log n) | Can do O(n) with bucket sort
```

---

### 2.4 Stack & Monotonic Stack 🔴 MUST

**Core Idea:** Stack for LIFO problems. Monotonic stack maintains increasing/decreasing order to find "next greater/smaller" in O(n).

**Frontend relevance:** Undo/redo, browser history, balanced parentheses in template parsers, call stack debugging.

#### Problems

**1. Valid Parentheses (🔴 MUST)**
```javascript
function isValid(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}
// Time: O(n) | Space: O(n)
```

**2. Next Greater Element (🔴 MUST — monotonic stack)**
```javascript
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // stores indices
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
// Time: O(n) | Space: O(n)
```

**3. Daily Temperatures (🔴 MUST)**
```javascript
function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = [];
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}
```

**4. Largest Rectangle in Histogram (🟡 NICE — Flipkart, CRED)**
```javascript
function largestRectangleArea(heights) {
  const stack = [-1];
  let maxArea = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack[stack.length - 1] !== -1 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const width = i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }
  return maxArea;
}
```

**5. Implement Stack Using Queue (🟡 NICE)**
```javascript
class MyStack {
  constructor() { this.queue = []; }
  push(x) {
    this.queue.push(x);
    for (let i = 0; i < this.queue.length - 1; i++)
      this.queue.push(this.queue.shift());
  }
  pop() { return this.queue.shift(); }
  top() { return this.queue[0]; }
  empty() { return this.queue.length === 0; }
}
```

---

### 2.5 Queue & Deque 🔴 MUST

**Core Idea:** Queue for BFS/level-order problems. Deque (double-ended) for sliding window maximum.

**Frontend relevance:** Task queues, microtask scheduling, render queue, animation frame queue.

#### Problems

**1. Sliding Window Maximum (🟡 NICE — Flipkart)**
```javascript
function maxSlidingWindow(nums, k) {
  const deque = [], result = [];
  for (let i = 0; i < nums.length; i++) {
    // remove elements outside window
    while (deque.length && deque[0] < i - k + 1) deque.shift();
    // remove smaller elements (maintain decreasing deque)
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}
// Time: O(n) | Space: O(k)
```

**2. Design Circular Queue (🟡 NICE)**
```javascript
class MyCircularQueue {
  constructor(k) {
    this.size = k;
    this.queue = new Array(k);
    this.head = 0;
    this.tail = -1;
    this.count = 0;
  }
  enQueue(val) {
    if (this.isFull()) return false;
    this.tail = (this.tail + 1) % this.size;
    this.queue[this.tail] = val;
    this.count++;
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.size;
    this.count--;
    return true;
  }
  Front() { return this.isEmpty() ? -1 : this.queue[this.head]; }
  Rear() { return this.isEmpty() ? -1 : this.queue[this.tail]; }
  isEmpty() { return this.count === 0; }
  isFull() { return this.count === this.size; }
}
```

---

### 2.6 Binary Search 🔴 MUST

**Core Idea:** Reduce search space by half each iteration. Works on sorted data OR on a monotonic answer space.

**Template (always use this — avoids off-by-one bugs):**
```javascript
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2); // avoids overflow
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
```

**Find leftmost / rightmost occurrence:**
```javascript
function findLeft(arr, target) {
  let left = 0, right = arr.length - 1, result = -1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) { result = mid; right = mid - 1; } // keep going left
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return result;
}
```

#### Problems

**1. Search in Rotated Sorted Array (🔴 MUST)**
```javascript
function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) { // left half sorted
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else { // right half sorted
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return -1;
}
```

**2. Find Minimum in Rotated Sorted Array (🔴 MUST)**
```javascript
function findMin(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}
```

**3. Koko Eating Bananas — Binary search on answer (🟡 NICE)**
```javascript
function minEatingSpeed(piles, h) {
  let left = 1, right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const hours = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0);
    if (hours <= h) right = mid;
    else left = mid + 1;
  }
  return left;
}
// Pattern: binary search on answer space (speed), not array index
```

**4. Find Peak Element (🟡 NICE)**
```javascript
function findPeakElement(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[mid + 1]) right = mid;
    else left = mid + 1;
  }
  return left;
}
```

---

### 2.7 Recursion & Backtracking 🔴 MUST

**Core Idea:** Explore all possibilities by making a choice, recursing, then undoing the choice.

**Template:**
```javascript
function backtrack(current, choices) {
  if (baseCase(current)) {
    result.push([...current]);
    return;
  }
  for (const choice of choices) {
    current.push(choice);          // make choice
    backtrack(current, remaining); // explore
    current.pop();                 // undo choice
  }
}
```

#### Problems

**1. Subsets (🔴 MUST)**
```javascript
function subsets(nums) {
  const result = [];
  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  backtrack(0, []);
  return result;
}
```

**2. Permutations (🔴 MUST)**
```javascript
function permute(nums) {
  const result = [];
  function backtrack(current, remaining) {
    if (!remaining.length) { result.push([...current]); return; }
    for (let i = 0; i < remaining.length; i++) {
      current.push(remaining[i]);
      backtrack(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
      current.pop();
    }
  }
  backtrack([], nums);
  return result;
}
```

**3. Combination Sum (🔴 MUST)**
```javascript
function combinationSum(candidates, target) {
  const result = [];
  function backtrack(start, current, remaining) {
    if (remaining === 0) { result.push([...current]); return; }
    if (remaining < 0) return;
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, current, remaining - candidates[i]);
      current.pop();
    }
  }
  backtrack(0, [], target);
  return result;
}
```

**4. Word Search in Grid (🟡 NICE — asked at CRED)**
```javascript
function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, idx) {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[idx]) return false;
    const temp = board[r][c];
    board[r][c] = '#'; // mark visited
    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1);
    board[r][c] = temp; // restore
    return found;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}
```

**5. N-Queens (🟡 NICE)**
```javascript
function solveNQueens(n) {
  const result = [], board = Array.from({length: n}, () => '.'.repeat(n).split(''));
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  function backtrack(row) {
    if (row === n) { result.push(board.map(r => r.join(''))); return; }
    for (let col = 0; col < n; col++) {
      if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
      cols.add(col); diag1.add(row - col); diag2.add(row + col);
      board[row][col] = 'Q';
      backtrack(row + 1);
      board[row][col] = '.';
      cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
    }
  }
  backtrack(0);
  return result;
}
```

---

### 2.8 Trees — BFS & DFS 🔴 MUST

**Frontend relevance:** DOM tree traversal, virtual DOM diffing, component tree, file system explorer.

**DFS Templates:**
```javascript
// Preorder: root → left → right
function preorder(node) {
  if (!node) return;
  process(node);
  preorder(node.left);
  preorder(node.right);
}

// Inorder: left → root → right (gives sorted output for BST)
function inorder(node) {
  if (!node) return;
  inorder(node.left);
  process(node);
  inorder(node.right);
}

// Postorder: left → right → root (good for deletion, size calculation)
function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  process(node);
}
```

**BFS Template:**
```javascript
function bfs(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

#### Problems

**1. Maximum Depth of Binary Tree (🔴 MUST)**
```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**2. Invert Binary Tree (🔴 MUST)**
```javascript
function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}
```

**3. Lowest Common Ancestor (🔴 MUST — asked at Flipkart, CRED)**
```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return left && right ? root : left || right;
}
// Frontend analogy: find closest common parent component
```

**4. Level Order Traversal (🔴 MUST)**
```javascript
function levelOrder(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

**5. Validate BST (🔴 MUST)**
```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}
```

**6. Serialize & Deserialize Binary Tree (🟡 NICE — CRED)**
```javascript
function serialize(root) {
  if (!root) return 'null';
  return `${root.val},${serialize(root.left)},${serialize(root.right)}`;
}
function deserialize(data) {
  const nodes = data.split(',');
  let idx = 0;
  function build() {
    if (nodes[idx] === 'null') { idx++; return null; }
    const node = new TreeNode(+nodes[idx++]);
    node.left = build();
    node.right = build();
    return node;
  }
  return build();
}
```

**7. Path Sum II — Find all root-to-leaf paths (🟡 NICE)**
```javascript
function pathSum(root, target) {
  const result = [];
  function dfs(node, remaining, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right && remaining === node.val) result.push([...path]);
    dfs(node.left, remaining - node.val, path);
    dfs(node.right, remaining - node.val, path);
    path.pop();
  }
  dfs(root, target, []);
  return result;
}
```

**8. Flatten Binary Tree to Linked List (🟡 NICE — Flipkart)**
```javascript
function flatten(root) {
  let curr = root;
  while (curr) {
    if (curr.left) {
      let rightmost = curr.left;
      while (rightmost.right) rightmost = rightmost.right;
      rightmost.right = curr.right;
      curr.right = curr.left;
      curr.left = null;
    }
    curr = curr.right;
  }
}
```

---

### 2.9 Linked Lists 🟡 NICE

**Core patterns:** Fast/slow pointer (Floyd's cycle), reverse in-place, merge sorted lists.

#### Problems

**1. Reverse Linked List (🔴 MUST)**
```javascript
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```

**2. Detect Cycle — Floyd's Algorithm (🔴 MUST)**
```javascript
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

**3. Merge Two Sorted Lists (🔴 MUST)**
```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}
```

**4. LRU Cache (🔴 MUST — asked everywhere)**
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map maintains insertion order
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // move to end (most recent)
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value); // delete LRU (first)
    }
    this.cache.set(key, value);
  }
}
// Time: O(1) for both get/put | Space: O(capacity)
// Frontend: browser cache, memoization cache, API response cache
```

---

### 2.10 Greedy & Intervals 🟡 NICE

**Core Idea:** Make locally optimal choice at each step. Most common: interval scheduling.

#### Problems

**1. Merge Intervals (🔴 MUST)**
```javascript
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = result[result.length - 1];
    if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]);
    else result.push(intervals[i]);
  }
  return result;
}
// Frontend: merging overlapping time slots, calendar events
```

**2. Non-overlapping Intervals (🟡 NICE — Dream11)**
```javascript
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // sort by end time
  let count = 0, end = -Infinity;
  for (const [start, finish] of intervals) {
    if (start >= end) end = finish;
    else count++;
  }
  return count;
}
```

**3. Meeting Rooms II — min rooms needed (🟡 NICE)**
```javascript
function minMeetingRooms(intervals) {
  const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
  const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
  let rooms = 0, endPtr = 0;
  for (let i = 0; i < starts.length; i++) {
    if (starts[i] < ends[endPtr]) rooms++;
    else endPtr++;
  }
  return rooms;
}
```

**4. Jump Game (🟡 NICE)**
```javascript
function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}
```

---

### 2.11 Dynamic Programming — 1D 🟡 NICE

**Core Idea:** Break into subproblems, cache results. For interviews: identify state, recurrence, base case.

**Only learn 1D DP for this target band. Skip 2D.**

#### Problems

**1. Climbing Stairs (🔴 MUST)**
```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    [prev2, prev1] = [prev1, prev1 + prev2];
  }
  return prev1;
}
```

**2. Coin Change (🔴 MUST)**
```javascript
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

**3. Longest Common Subsequence (🟡 NICE)**
```javascript
function lcs(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = text1[i-1] === text2[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}
```

**4. House Robber (🔴 MUST)**
```javascript
function rob(nums) {
  let prev2 = 0, prev1 = 0;
  for (const num of nums) {
    [prev2, prev1] = [prev1, Math.max(prev1, prev2 + num)];
  }
  return prev1;
}
```

**5. Word Break (🟡 NICE — Flipkart, CRED)**
```javascript
function wordBreak(s, wordDict) {
  const wordSet = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && wordSet.has(s.slice(j, i))) { dp[i] = true; break; }
    }
  }
  return dp[s.length];
}
```

---

### 2.12 Graphs — BFS/DFS 🟡 NICE

**Only BFS and DFS. Skip Dijkstra, Bellman-Ford, Prim's for this target.**

#### Problems

**1. Number of Islands (🔴 MUST)**
```javascript
function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  for (let r = 0; r < grid.length; r++)
    for (let c = 0; c < grid[0].length; c++)
      if (grid[r][c] === '1') { count++; dfs(r, c); }
  return count;
}
```

**2. Clone Graph (🟡 NICE)**
```javascript
function cloneGraph(node) {
  if (!node) return null;
  const visited = new Map();
  function dfs(n) {
    if (visited.has(n)) return visited.get(n);
    const clone = new Node(n.val);
    visited.set(n, clone);
    clone.neighbors = n.neighbors.map(dfs);
    return clone;
  }
  return dfs(node);
}
```

**3. Course Schedule — Cycle detection (🟡 NICE)**
```javascript
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({length: numCourses}, () => []);
  for (const [a, b] of prerequisites) graph[b].push(a);
  const state = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited
  function dfs(node) {
    if (state[node] === 1) return false; // cycle
    if (state[node] === 2) return true;
    state[node] = 1;
    for (const neighbor of graph[node]) if (!dfs(neighbor)) return false;
    state[node] = 2;
    return true;
  }
  return Array.from({length: numCourses}, (_, i) => i).every(dfs);
}
```

---

## 3. JavaScript Problems — Deep Dive

---

### 3.1 Closures & Scope 🔴 MUST

**1. Classic closure trap — loop + var**
```javascript
// PROBLEM: All log the same value
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // logs 5,5,5,5,5
}

// FIX 1: let (block scope)
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100); // logs 0,1,2,3,4
}

// FIX 2: IIFE closure
for (var i = 0; i < 5; i++) {
  ((j) => setTimeout(() => console.log(j), 100))(i);
}
```

**2. Implement a counter with closure**
```javascript
function makeCounter(initial = 0) {
  let count = initial;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initial; },
    value: () => count,
  };
}
const counter = makeCounter(10);
counter.increment(); // 11
counter.decrement(); // 10
```

**3. Memoize function (🔴 MUST — asked everywhere)**
```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Usage
const memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});
```

**4. Partial Application**
```javascript
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}
const add = (a, b, c) => a + b + c;
const add5 = partial(add, 2, 3);
add5(10); // 15
```

**5. Currying (🔴 MUST)**
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}
const curriedAdd = curry((a, b, c) => a + b + c);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
```

---

### 3.2 Promises & Async 🔴 MUST

**1. Implement Promise.all from scratch (🔴 MUST — Razorpay)**
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) { resolve([]); return; }
    const results = new Array(promises.length);
    let resolved = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++resolved === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
```

**2. Implement Promise.allSettled**
```javascript
function promiseAllSettled(promises) {
  return Promise.all(promises.map(p =>
    Promise.resolve(p)
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }))
  ));
}
```

**3. Implement Promise.race**
```javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve).catch(reject));
  });
}
```

**4. Implement Promise.any**
```javascript
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let rejected = 0;
    const errors = new Array(promises.length);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(resolve).catch(err => {
        errors[i] = err;
        if (++rejected === promises.length) reject(new AggregateError(errors));
      });
    });
  });
}
```

**5. Promise chaining — sequential execution**
```javascript
async function runSequential(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task()); // truly sequential
  }
  return results;
}

// With reduce (no async/await)
function runSequentialReduce(tasks) {
  return tasks.reduce(
    (chain, task) => chain.then(results => task().then(r => [...results, r])),
    Promise.resolve([])
  );
}
```

**6. Retry with exponential backoff**
```javascript
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay * 2 ** i));
    }
  }
}
```

**7. Concurrent API calls with concurrency limit**
```javascript
async function fetchWithConcurrency(urls, limit = 3) {
  const results = [];
  const queue = [...urls];
  async function worker() {
    while (queue.length) {
      const url = queue.shift();
      results.push(await fetch(url).then(r => r.json()));
    }
  }
  await Promise.all(Array.from({length: limit}, worker));
  return results;
}
```

---

### 3.3 Event Loop & Microtasks 🔴 MUST

**Execution order:**
1. Synchronous code
2. Microtasks (Promise callbacks, queueMicrotask)
3. Macrotasks (setTimeout, setInterval, setImmediate)
4. Render (requestAnimationFrame)

**Classic output question:**
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
// Explanation: sync(1,4) → microtask(3) → macrotask(2)
```

**Advanced:**
```javascript
setTimeout(() => console.log('timeout 1'), 0);
Promise.resolve().then(() => {
  console.log('promise 1');
  setTimeout(() => console.log('timeout 2'), 0);
  Promise.resolve().then(() => console.log('promise 2'));
});
setTimeout(() => console.log('timeout 3'), 0);
// Output: promise 1, promise 2, timeout 1, timeout 3, timeout 2
```

**1. Implement debounce (🔴 MUST)**
```javascript
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
// Use: search input, resize handler, form validation
```

**2. Implement throttle (🔴 MUST)**
```javascript
function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}
// Use: scroll handler, button click rate limiting
```

**3. Implement throttle with leading + trailing edge**
```javascript
function throttleFull(fn, limit) {
  let lastCall = 0, timer;
  return function(...args) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    if (remaining <= 0) {
      clearTimeout(timer);
      lastCall = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

**4. Implement setInterval using setTimeout**
```javascript
function mySetInterval(fn, delay) {
  let id;
  function loop() {
    fn();
    id = setTimeout(loop, delay);
  }
  id = setTimeout(loop, delay);
  return { clear: () => clearTimeout(id) };
}
```

---

### 3.4 Prototype & Inheritance 🔴 MUST

**1. Implement new operator from scratch**
```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

**2. Implement Object.create**
```javascript
function myObjectCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

**3. Implement bind from scratch (🔴 MUST)**
```javascript
Function.prototype.myBind = function(context, ...preArgs) {
  const fn = this;
  return function(...laterArgs) {
    return fn.apply(context, [...preArgs, ...laterArgs]);
  };
};
```

**4. Implement call and apply**
```javascript
Function.prototype.myCall = function(context, ...args) {
  context = context || globalThis;
  const sym = Symbol();
  context[sym] = this;
  const result = context[sym](...args);
  delete context[sym];
  return result;
};

Function.prototype.myApply = function(context, args = []) {
  return this.myCall(context, ...args);
};
```

**5. Prototypal inheritance pattern**
```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound.`; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function() { return `${this.name} barks.`; };
```

---

### 3.5 Functional Programming 🔴 MUST

**1. Implement Array.map, filter, reduce from scratch**
```javascript
Array.prototype.myMap = function(fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(fn(this[i], i, this));
  return result;
};

Array.prototype.myFilter = function(fn) {
  const result = [];
  for (let i = 0; i < this.length; i++) if (fn(this[i], i, this)) result.push(this[i]);
  return result;
};

Array.prototype.myReduce = function(fn, initial) {
  let acc = initial !== undefined ? initial : this[0];
  let start = initial !== undefined ? 0 : 1;
  for (let i = start; i < this.length; i++) acc = fn(acc, this[i], i, this);
  return acc;
};
```

**2. Compose and Pipe functions**
```javascript
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const double = x => x * 2;
const addOne = x => x + 1;
const square = x => x ** 2;

const transform = pipe(double, addOne, square);
transform(3); // ((3*2)+1)^2 = 49
```

**3. Flatten nested array (🔴 MUST — Razorpay)**
```javascript
// Recursive
function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) acc.push(...flatten(item, depth - 1));
    else acc.push(item);
    return acc;
  }, []);
}

// Iterative
function flattenIterative(arr) {
  const stack = [...arr], result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else result.unshift(item);
  }
  return result;
}
```

**4. Deep clone an object**
```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(deepClone);
  if (obj instanceof Map) return new Map([...obj].map(([k, v]) => [deepClone(k), deepClone(v)]));
  if (obj instanceof Set) return new Set([...obj].map(deepClone));
  const clone = {};
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}
// Note: structuredClone() is the modern native solution
```

**5. Deep equal comparison**
```javascript
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}
```

---

### 3.6 DOM & Browser APIs 🔴 MUST

**1. Implement event delegation**
```javascript
// Instead of attaching listeners to each child:
document.querySelector('#list').addEventListener('click', (e) => {
  const item = e.target.closest('[data-item]');
  if (item) handleItemClick(item.dataset.item);
});
// Benefit: O(1) listeners instead of O(n), handles dynamic elements
```

**2. Implement event emitter (🔴 MUST — Swiggy, Dream11)**
```javascript
class EventEmitter {
  constructor() { this.events = new Map(); }
  on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(listener);
    return this; // chainable
  }
  off(event, listener) {
    if (!this.events.has(event)) return this;
    this.events.set(event, this.events.get(event).filter(l => l !== listener));
    return this;
  }
  once(event, listener) {
    const wrapper = (...args) => { listener(...args); this.off(event, wrapper); };
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    if (!this.events.has(event)) return false;
    this.events.get(event).forEach(l => l(...args));
    return true;
  }
}
```

**3. Implement querySelector from scratch**
```javascript
function myQuerySelector(selector, root = document) {
  // Simple single tag/class/id support
  if (selector.startsWith('#')) {
    return findById(root, selector.slice(1));
  } else if (selector.startsWith('.')) {
    return findByClass(root, selector.slice(1));
  } else {
    return findByTag(root, selector.toUpperCase());
  }
}
function findByClass(node, className) {
  if (node.classList?.contains(className)) return node;
  for (const child of node.children || []) {
    const result = findByClass(child, className);
    if (result) return result;
  }
  return null;
}
```

**4. Virtual DOM diff algorithm concept**
```javascript
function diff(oldVNode, newVNode) {
  // Different types: replace entirely
  if (oldVNode.type !== newVNode.type) return { type: 'REPLACE', node: newVNode };
  // Same type: check props
  if (typeof newVNode !== 'object') {
    if (oldVNode !== newVNode) return { type: 'TEXT', content: newVNode };
    return null;
  }
  const patches = [];
  const propChanges = diffProps(oldVNode.props, newVNode.props);
  if (propChanges.length) patches.push({ type: 'PROPS', changes: propChanges });
  // Recurse children
  const maxLen = Math.max(oldVNode.children.length, newVNode.children.length);
  for (let i = 0; i < maxLen; i++) {
    patches.push(diff(oldVNode.children[i], newVNode.children[i]));
  }
  return patches;
}
```

**5. Implement lazy loading images (🔴 MUST)**
```javascript
function lazyLoadImages() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' }); // load 200px before visible

  document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}
```

---

### 3.7 Performance & Memory 🔴 MUST

**1. Virtualized list for 10,000 items (🔴 MUST)**
```javascript
class VirtualList {
  constructor({ itemHeight, visibleCount, totalItems, renderItem, container }) {
    this.itemHeight = itemHeight;
    this.visibleCount = visibleCount;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.container = container;
    this.scrollTop = 0;
    this.init();
  }
  init() {
    this.container.style.position = 'relative';
    this.container.style.overflowY = 'scroll';
    this.container.style.height = `${this.visibleCount * this.itemHeight}px`;

    this.inner = document.createElement('div');
    this.inner.style.height = `${this.totalItems * this.itemHeight}px`;
    this.container.appendChild(this.inner);

    this.container.addEventListener('scroll', () => this.render());
    this.render();
  }
  render() {
    const scrollTop = this.container.scrollTop;
    const startIdx = Math.floor(scrollTop / this.itemHeight);
    const endIdx = Math.min(startIdx + this.visibleCount + 1, this.totalItems);

    this.inner.innerHTML = '';
    for (let i = startIdx; i < endIdx; i++) {
      const item = this.renderItem(i);
      item.style.position = 'absolute';
      item.style.top = `${i * this.itemHeight}px`;
      this.inner.appendChild(item);
    }
  }
}
```

**2. Memory leak patterns to avoid**
```javascript
// BAD: closure holds reference to large object
function createLeak() {
  const largeData = new Array(1000000).fill('data');
  return function() {
    console.log(largeData.length); // largeData never GC'd
  };
}

// GOOD: only capture what you need
function noLeak() {
  const size = new Array(1000000).fill('data').length;
  return function() {
    console.log(size); // primitive, no reference to array
  };
}

// BAD: forgotten event listeners
const el = document.getElementById('btn');
el.addEventListener('click', handler); // if el removed from DOM, handler still holds ref

// GOOD: clean up
el.addEventListener('click', handler);
// later:
el.removeEventListener('click', handler);
// Or use AbortController:
const controller = new AbortController();
el.addEventListener('click', handler, { signal: controller.signal });
controller.abort(); // removes all listeners
```

**3. requestAnimationFrame for smooth animations**
```javascript
function animate(element, targetX, duration) {
  const startX = parseFloat(element.style.left) || 0;
  const startTime = performance.now();
  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    element.style.left = `${startX + (targetX - startX) * eased}px`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
```

---

### 3.8 JS Machine Coding Problems 🔴 MUST

**1. Implement a rate limiter**
```javascript
class RateLimiter {
  constructor(maxCalls, windowMs) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.calls = [];
  }
  isAllowed() {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < this.windowMs);
    if (this.calls.length < this.maxCalls) {
      this.calls.push(now);
      return true;
    }
    return false;
  }
}
```

**2. Implement a pub-sub system (🔴 MUST — Dream11)**
```javascript
class PubSub {
  constructor() { this.subscribers = {}; }
  subscribe(topic, callback) {
    if (!this.subscribers[topic]) this.subscribers[topic] = [];
    const id = Symbol();
    this.subscribers[topic].push({ id, callback });
    return () => this.unsubscribe(topic, id); // return unsubscribe fn
  }
  unsubscribe(topic, id) {
    if (this.subscribers[topic]) {
      this.subscribers[topic] = this.subscribers[topic].filter(s => s.id !== id);
    }
  }
  publish(topic, data) {
    (this.subscribers[topic] || []).forEach(({ callback }) => callback(data));
  }
}
```

**3. Task scheduler with priority queue**
```javascript
class TaskScheduler {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.run();
    });
  }
  async run() {
    if (this.running >= this.concurrency || !this.queue.length) return;
    this.running++;
    const { task, resolve, reject } = this.queue.shift();
    try { resolve(await task()); }
    catch (e) { reject(e); }
    finally { this.running--; this.run(); }
  }
}
```

---

## 4. React Problems — Deep Dive

---

### 4.1 Hooks Internals 🔴 MUST

**How useState works internally:**
```javascript
// Simplified React hooks implementation
let state = [];
let index = 0;

function useState(initialValue) {
  const currentIndex = index;
  state[currentIndex] = state[currentIndex] ?? initialValue;
  const setState = (newValue) => {
    state[currentIndex] = typeof newValue === 'function'
      ? newValue(state[currentIndex])
      : newValue;
    rerender(); // trigger re-render
  };
  index++;
  return [state[currentIndex], setState];
}
// KEY INSIGHT: Hooks rely on call order. This is why you can't use hooks conditionally.
```

**How useEffect works:**
```javascript
// Simplified
let effects = [], cleanups = [];

function useEffect(callback, deps) {
  const prevDeps = effects[index];
  const hasChanged = !prevDeps || deps.some((d, i) => d !== prevDeps[i]);
  if (hasChanged) {
    if (cleanups[index]) cleanups[index](); // run previous cleanup
    cleanups[index] = callback(); // run effect, store cleanup
    effects[index] = deps;
  }
  index++;
}
```

**Custom Hooks:**

**1. useDebounce**
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on value/delay change
  }, [value, delay]);
  return debouncedValue;
}
```

**2. usePrevious**
```javascript
function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => { ref.current = value; });
  return ref.current; // returns value from previous render
}
```

**3. useLocalStorage**
```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  const setStoredValue = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  return [value, setStoredValue];
}
```

**4. useFetch**
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setError(err); setLoading(false); });
    return () => controller.abort();
  }, [url]);
  return { data, loading, error };
}
```

**5. useIntersectionObserver**
```javascript
function useIntersectionObserver(ref, options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);
  return isIntersecting;
}
```

---

### 4.2 React Performance Optimization 🔴 MUST

**React.memo — when to use:**
```javascript
// Use when: component re-renders with same props frequently
const ExpensiveComponent = React.memo(({ items, onSelect }) => {
  return items.map(item => <Item key={item.id} item={item} onSelect={onSelect} />);
}, (prevProps, nextProps) => {
  // Custom comparison — return true if props are "equal" (skip re-render)
  return prevProps.items === nextProps.items && prevProps.onSelect === nextProps.onSelect;
});

// Pitfall: memo is useless if you pass new object/array/function literals each render
// BAD:
<ExpensiveComponent items={[1,2,3]} onSelect={() => {}} /> // new refs every render
// GOOD:
const items = useMemo(() => [1,2,3], []);
const onSelect = useCallback(() => {}, []);
<ExpensiveComponent items={items} onSelect={onSelect} />
```

**useMemo vs useCallback:**
```javascript
// useMemo: memoize the RESULT of a computation
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // only re-sorts when items changes

// useCallback: memoize the FUNCTION itself (referential equality)
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id));
}, []); // stable reference — doesn't break memo on child components
```

**Code splitting with React.lazy:**
```javascript
const Dashboard = React.lazy(() => import('./Dashboard'));
const Settings = React.lazy(() => import('./Settings'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Avoiding unnecessary re-renders — checklist:**
- Use `key` prop correctly (stable ID, never array index for dynamic lists)
- Lift state down — don't lift state higher than needed
- Split context — don't put frequently-changing values in the same context as stable values
- Use `useRef` for values that don't need to trigger re-renders
- Batch updates with `unstable_batchedUpdates` (React 17) or automatic batching (React 18)

---

### 4.3 State Management 🔴 MUST

**1. useReducer for complex state**
```javascript
const initialState = { count: 0, status: 'idle', error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'FETCH_START': return { ...state, status: 'loading' };
    case 'FETCH_SUCCESS': return { ...state, status: 'success', data: action.payload };
    case 'FETCH_ERROR': return { ...state, status: 'error', error: action.payload };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{state.count}</button>;
}
```

**2. Context + Reducer (mini Redux)**
```javascript
const StoreContext = createContext(null);
const DispatchContext = createContext(null);

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={state}>
        {children}
      </StoreContext.Provider>
    </DispatchContext.Provider>
  );
}
// Split contexts so components that only dispatch don't re-render on state changes
```

**3. Zustand-like store pattern**
```javascript
function createStore(createState) {
  let state, listeners = new Set();
  const setState = (partial) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    if (next !== state) {
      state = { ...state, ...next };
      listeners.forEach(l => l());
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  state = createState(setState, getState);
  return { getState, setState, subscribe };
}
```

---

### 4.4 React Machine Coding 🔴 MUST

**1. Infinite scroll component**
```javascript
function InfiniteList({ fetchMore }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && hasMore && !loading) {
        setLoading(true);
        const newItems = await fetchMore(page);
        if (!newItems.length) setHasMore(false);
        setItems(prev => [...prev, ...newItems]);
        setPage(p => p + 1);
        setLoading(false);
      }
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <div>
      {items.map(item => <Item key={item.id} item={item} />)}
      {hasMore && <div ref={loaderRef}>{loading ? 'Loading...' : ''}</div>}
    </div>
  );
}
```

**2. Autocomplete / Typeahead**
```javascript
function Autocomplete({ fetchSuggestions }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [highlighted, setHighlighted] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const cache = useRef(new Map());

  useEffect(() => {
    if (!debouncedQuery.trim()) { setSuggestions([]); return; }
    if (cache.current.has(debouncedQuery)) {
      setSuggestions(cache.current.get(debouncedQuery));
      return;
    }
    fetchSuggestions(debouncedQuery).then(results => {
      cache.current.set(debouncedQuery, results);
      setSuggestions(results);
    });
  }, [debouncedQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    if (e.key === 'ArrowUp') setHighlighted(h => Math.max(h - 1, 0));
    if (e.key === 'Enter' && highlighted >= 0) {
      setQuery(suggestions[highlighted].label);
      setSuggestions([]);
    }
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((s, i) => (
            <li key={s.id} style={{ background: i === highlighted ? '#eee' : '' }}
                onClick={() => { setQuery(s.label); setSuggestions([]); }}>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**3. Drag and drop kanban board (concept)**
```javascript
function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: [{ id: '1', title: 'Task 1' }],
    inProgress: [],
    done: [],
  });
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (item, fromColumn) => setDragging({ item, fromColumn });

  const handleDrop = (toColumn) => {
    if (!dragging || dragging.fromColumn === toColumn) return;
    setColumns(prev => ({
      ...prev,
      [dragging.fromColumn]: prev[dragging.fromColumn].filter(i => i.id !== dragging.item.id),
      [toColumn]: [...prev[toColumn], dragging.item],
    }));
    setDragging(null);
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {Object.entries(columns).map(([col, items]) => (
        <div key={col} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(col)}>
          <h3>{col}</h3>
          {items.map(item => (
            <div key={item.id} draggable onDragStart={() => handleDragStart(item, col)}>
              {item.title}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

---

### 4.5 React Architecture 🔴 MUST

**Component design principles:**
- Single responsibility — one reason to change
- Composition over configuration — prefer children/render props over complex prop APIs
- Controlled vs uncontrolled — know when to use each
- Co-locate state — state lives as close to where it's used as possible

**Render props pattern:**
```javascript
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  );
}
// Usage: <MouseTracker render={({x, y}) => <p>{x}, {y}</p>} />
```

**Compound components:**
```javascript
const Tabs = ({ children, defaultTab }) => {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
};
Tabs.Tab = ({ id, label }) => {
  const { active, setActive } = useContext(TabsContext);
  return <button style={{ fontWeight: active === id ? 'bold' : 'normal' }} onClick={() => setActive(id)}>{label}</button>;
};
Tabs.Panel = ({ id, children }) => {
  const { active } = useContext(TabsContext);
  return active === id ? <div>{children}</div> : null;
};
// Usage:
// <Tabs defaultTab="a"><Tabs.Tab id="a" label="Tab A" /><Tabs.Panel id="a">Content A</Tabs.Panel></Tabs>
```

---

## 5. Frontend System Design

---

### Design Principles for Frontend

1. **Start with requirements** — clarify functional vs non-functional (performance, scale, accessibility)
2. **Define the data model** — what entities exist, what shape is the API response
3. **Component hierarchy** — top-down decomposition
4. **State management strategy** — local vs global, server state (React Query) vs client state
5. **Performance plan** — caching, lazy loading, pagination strategy
6. **Network layer** — REST vs WebSocket, retry logic, optimistic updates
7. **Error handling & loading states** — user experience under failure

---

### Design Problem 1: Design a News Feed (Swiggy, Meesho)

**Requirements clarification:**
- Infinite scroll vs pagination?
- Real-time updates?
- Offline support?

**Data model:**
```
Post: { id, authorId, content, mediaUrls, likes, comments, createdAt }
User: { id, name, avatar, isFollowing }
Feed: Post[] (paginated by cursor)
```

**Component hierarchy:**
```
<FeedPage>
  <Header />
  <StoriesBar />
  <FeedList>
    <Post>
      <PostHeader (author, time) />
      <PostMedia (lazy loaded) />
      <PostActions (like, comment, share) />
      <CommentSection (lazy loaded) />
    </Post>
  </FeedList>
  <InfiniteScrollTrigger />
```

**State management:**
```
Server state: React Query / SWR
- queryKey: ['feed', userId, cursor]
- staleTime: 30s
- Optimistic updates for likes

Client state: useState/Zustand
- UI state (modal open, filter selected)
```

**Performance optimizations:**
- Virtual list for feed items (only render ~5 visible + buffer)
- Image lazy loading with IntersectionObserver
- Route-level code splitting
- Prefetch next page when user is 80% scrolled
- Cache API responses with service worker

---

### Design Problem 2: Design Google Docs Collaborative Editor

**Key challenges:** Conflict resolution, real-time sync, offline support

**Architecture:**
```
Client ←→ WebSocket Server ←→ Operational Transform (OT) Service
                    ↓
              Document State (Redis for current, DB for history)
```

**Operational Transform concepts:**
- Every edit is an "operation" (insert, delete at position)
- Server transforms concurrent operations before applying
- Client applies local ops immediately (optimistic), then reconciles

**Frontend state:**
```javascript
const editorState = {
  document: DocumentNode, // ProseMirror / Slate AST
  pending: Operation[],   // sent to server, not yet ack'd
  revision: number,       // current server revision
  collaborators: { [userId]: { cursor, selection, color } }
}
```

---

### Design Problem 3: Design Razorpay Payment Widget

**Key requirements:** Security, cross-browser, performance, PCI compliance

**Architecture:**
```
Merchant Page → iframe (isolated origin) → Payment API
```

**Why iframe?**
- Isolates card data from merchant's JS (XSS protection)
- PCI DSS compliance — card data never touches merchant's domain

**Communication:**
```javascript
// Parent to iframe
iframe.contentWindow.postMessage({ type: 'INIT', config }, 'https://checkout.razorpay.com');

// iframe to parent
window.parent.postMessage({ type: 'PAYMENT_SUCCESS', data }, merchantOrigin);

// Always validate origin:
window.addEventListener('message', (e) => {
  if (e.origin !== TRUSTED_ORIGIN) return;
  // process message
});
```

---

### Design Problem 4: Design Real-time Leaderboard (Dream11)

**Requirements:** 10,000 concurrent users, sub-second updates

**Architecture:**
```
Client → WebSocket (Socket.io) → Server → Redis Sorted Set
                                              ↓ (every 500ms)
                                   Rank computation → Broadcast
```

**Frontend:**
```javascript
// WebSocket connection with reconnect logic
function useLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [myRank, setMyRank] = useState(null);
  useEffect(() => {
    const socket = io('/leaderboard', { reconnectionAttempts: 5 });
    socket.on('rank_update', (data) => {
      setEntries(data.top10);
      setMyRank(data.myRank);
    });
    return () => socket.disconnect();
  }, []);
  return { entries, myRank };
}
```

**Optimization:**
- Only send delta updates (changes), not full leaderboard
- Debounce renders: batch 100ms of updates before re-render
- Use `requestAnimationFrame` for smooth number animations

---

### Design Problem 5: Design Autocomplete Search (All companies)

**Trie-based client-side search:**
```javascript
class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; this.data = null; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word, data) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true; node.data = data;
  }
  search(prefix, limit = 5) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    const results = [];
    this.dfs(node, prefix, results, limit);
    return results;
  }
  dfs(node, prefix, results, limit) {
    if (results.length >= limit) return;
    if (node.isEnd) results.push(node.data);
    for (const char of Object.keys(node.children)) {
      this.dfs(node.children[char], prefix + char, results, limit);
    }
  }
}
```

---

### Design Problem 6: Design a Component Library (Flipkart LLD)

**Core principles:**

```
Accessibility first → ARIA attributes, keyboard navigation, focus management
Composition over complexity → compound component pattern
Theming → CSS custom properties (tokens)
Tree-shakeable → named exports, no barrel files
```

**Button component design:**
```javascript
// API design
<Button
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  onClick={handler}
  as="a" // polymorphic
>
  Label
</Button>

// Internal
const Button = forwardRef(({ variant, size, loading, as: Tag = 'button', ...props }, ref) => {
  return (
    <Tag
      ref={ref}
      className={cn(styles.base, styles[variant], styles[size], loading && styles.loading)}
      disabled={loading || props.disabled}
      aria-busy={loading}
      {...props}
    />
  );
});
```

---

## 6. Company-Specific Interview Patterns

---

### Flipkart

**Process:** 5–6 rounds (2 DSA → LLD → HLD → Bar Raiser → VP)

**DSA Level:** Medium–Hard. Expects O(n log n) solutions, handles edge cases, tests follow-ups ("can you do it in O(1) space?")

**Must-know topics:**
- Trees (all variants), DP (1D + 2D), Graphs (BFS/DFS + topo sort)
- LRU Cache, LFU Cache implementation
- Implement real data structures (not just solve problems)

**Specific questions asked:**
1. Flatten a multilevel linked list
2. Word break II (backtracking + memoization)
3. Kth largest element in stream
4. Design Flipkart product listing page (pagination, filters, sort)
5. Design a notification system (HLD)
6. Build a responsive grid component with drag to reorder (LLD)
7. React: Why does my component re-render too often? Debug this code.

**Tips:**
- VP round is culture + leadership. Prepare STAR format stories.
- Bar raiser cares about "why" — justify every design decision.
- LLD: draw class diagrams, talk about SOLID principles.

---

### Razorpay

**Process:** 4 rounds (DSA → JS Deep Dive → System Design → Hiring Manager)

**DSA Level:** Medium. 45-minute window, 1–2 problems. Focus on clean code.

**Specific questions asked:**
1. Implement Promise.all, Promise.race, Promise.allSettled
2. Build a debounce with cancel and flush support
3. Design Razorpay payment form — security, validation, UX
4. Explain microtask queue with code that outputs in specific order
5. Build a retry mechanism with exponential backoff
6. Implement deep clone (handle circular references)
7. Design a frontend SDK that merchants can embed

**Deep clone handling circular references:**
```javascript
function deepCloneCircular(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepCloneCircular(obj[key], seen);
  }
  return clone;
}
```

---

### CRED

**Process:** 4–5 rounds (1–2 DSA → Frontend depth → System Design → Culture)

**DSA Level:** Medium–Hard. Expects you to ask clarifying questions, discuss tradeoffs.

**Specific questions asked:**
1. Word search in 2D grid (backtracking)
2. Serialize/deserialize n-ary tree
3. LCA in binary tree + BST
4. Build a multi-step form with validation, back/forward navigation
5. Implement virtual DOM with reconciliation
6. Design CRED home feed with personalized cards
7. How would you optimize a page from 8s to under 1s?

**Performance optimization answer framework:**
```
1. Measure: Lighthouse, Web Vitals (LCP, FID, CLS), Performance tab
2. Network: gzip, CDN, HTTP/2, lazy load images/routes
3. JavaScript: bundle size (tree shaking, code split), defer non-critical
4. Rendering: avoid layout thrash, CSS contain, will-change
5. Caching: service worker, HTTP Cache-Control, stale-while-revalidate
```

---

### Swiggy

**Process:** 4 rounds (DSA → Machine Coding → System Design → Manager)

**DSA Level:** Easy–Medium. Warm up questions.

**Machine coding is the key differentiator.** 90 minutes to build a functional UI.

**Specific questions asked:**
1. Build a real-time order tracking page (status updates via WebSocket)
2. Implement a restaurant menu with cart — add/remove, quantity, total
3. Infinite scroll product listing with search and filter
4. Design a food delivery feed system
5. Merge intervals (DSA)
6. Build an autocomplete search with keyboard navigation

**Machine coding evaluation criteria:**
- Working functionality (primary)
- Code structure and component separation
- Error and loading state handling
- Performance considerations mentioned (even if not implemented)

---

### Meesho

**Process:** 3–4 rounds (DSA → Frontend → System Design → Manager)

**DSA Level:** Easy–Medium. Friendly bar.

**Focus areas:**
- React performance on low-end devices (Meesho's primary market)
- Vernacular UI considerations (RTL, font sizes, dynamic text)
- Image optimization for 2G networks

**Specific questions asked:**
1. Build a product card grid with lazy images
2. Implement a filter/sort UI with URL state sync
3. Explain virtualization — why and how
4. How do you test React components? (RTL, Jest)
5. Design a lightweight analytics SDK
6. Merge intervals (DSA)
7. Implement useDebounce and explain why you need it

---

### Dream11

**Process:** 3–4 rounds (DSA → Machine Coding → System Design → Culture)

**DSA Level:** Medium. Real-time and gaming flavored.

**Focus areas:**
- Real-time systems, WebSocket
- Animation and interactive UI
- Leaderboard, scoring systems

**Specific questions asked:**
1. Meeting rooms — min rooms needed (greedy)
2. Sliding window maximum
3. Build a live fantasy team selection UI with player swap
4. Design real-time leaderboard (WebSocket + virtual list)
5. Implement a countdown timer component with pause/resume
6. Design Dream11 contest results page

---

### Zepto

**Process:** 3 rounds (DSA → Machine Coding → Design)

**DSA Level:** Easy–Medium.

**Focus areas:**
- Quick commerce UX patterns (10-min delivery flows)
- Cart management, OTP flow, location handling

**Specific questions asked:**
1. Build a cart with coupon code application
2. Implement smooth scroll-to-section navigation
3. Design a real-time slot booking UI
4. Two sum, anagram grouping (DSA)

---

### PhonePe / Juspay

**Process:** 4–5 rounds

**Focus areas:**
- Payment SDK architecture
- Security (iframe isolation, postMessage)
- Cross-browser compatibility
- Deep JavaScript (closures, event loop, prototype)

**Specific questions asked:**
1. How does postMessage work for cross-origin communication?
2. Implement a secure payment form inside an iframe
3. Build a retry queue for failed API calls
4. How would you detect and prevent XSS in a form?
5. Implement a custom hook for payment status polling

---

### Groww

**Process:** 4 rounds

**Focus areas:**
- Financial data visualization (charts, graphs)
- Real-time stock price updates
- Complex state management (portfolio, watchlist)

**Specific questions asked:**
1. Build a stock ticker with live price updates
2. Implement a candlestick chart component
3. Design a mutual fund comparison tool
4. Optimize a portfolio dashboard with 100+ holdings

---

### Atlassian

**Process:** 5 rounds (Coding → System Design → Values → Team → Bar Raiser)

**DSA Level:** Medium (LeetCode-style, but also open-ended design problems)

**Focus areas:**
- Collaborative tools (Jira, Confluence patterns)
- Accessibility (WCAG 2.1 AA)
- Scale (millions of users)

**Specific questions asked:**
1. Design a rich text editor (Confluence)
2. Build a drag-and-drop sprint board (Jira)
3. How would you make a complex SPA fully keyboard navigable?
4. Design a real-time commenting system
5. Graph traversal for dependency resolution (Jira issue dependencies)

---

## 7. Machine Coding Problems — Full List

### Category A: Data Display & Lists

| Problem | Companies | Key Concepts |
|---------|-----------|-------------|
| Infinite scroll list | Swiggy, Meesho | IntersectionObserver, pagination |
| Virtual list (10k items) | All | DOM virtualization, scroll math |
| Sortable & filterable table | Flipkart, Atlassian | Controlled state, URL sync |
| Tree view (file explorer) | Flipkart | Recursive components, expand/collapse |
| Accordion component | All | Controlled/uncontrolled, a11y |
| Tabs component | All | Compound pattern, ARIA roles |
| Paginated data grid | Flipkart, CRED | Client/server pagination |

### Category B: Forms & Input

| Problem | Companies | Key Concepts |
|---------|-----------|-------------|
| Multi-step form wizard | CRED, Razorpay | State machine, validation |
| Autocomplete / typeahead | All | Debounce, caching, keyboard nav |
| OTP input component | PhonePe, Razorpay | Controlled, paste handling |
| Rich text editor (basic) | Atlassian | contentEditable, Selection API |
| Form builder | Flipkart | Dynamic forms, schema-driven |
| Date range picker | All | Calendar logic, keyboard nav |

### Category C: Real-time & Interactive

| Problem | Companies | Key Concepts |
|---------|-----------|-------------|
| Real-time leaderboard | Dream11 | WebSocket, virtual list |
| Live stock ticker | Groww | WebSocket, animation |
| Collaborative whiteboard | Atlassian | Canvas, real-time sync |
| Chat application | All | WebSocket, message pagination |
| Live sports score | Dream11 | Polling vs WebSocket |
| Multiplayer tic-tac-toe | Startups | WebSocket, state sync |

### Category D: E-commerce

| Problem | Companies | Key Concepts |
|---------|-----------|-------------|
| Shopping cart | Swiggy, Zepto | State management, optimistic UI |
| Product image gallery | Meesho, Flipkart | Lazy load, zoom, carousel |
| Search with filters | All | URL state, multi-select |
| Payment flow (3 steps) | Razorpay, PhonePe | Form validation, security |
| Order tracking timeline | Swiggy | Real-time, polling |
| Coupon code application | Zepto, Meesho | Validation, error states |

### Category E: Utility Components

| Problem | Companies | Key Concepts |
|---------|-----------|-------------|
| Toast notification system | All | Portal, queue, auto-dismiss |
| Modal / Dialog | All | Focus trap, Esc close, a11y |
| Tooltip | All | Positioning, overflow detection |
| Drag and drop | Flipkart, Atlassian | HTML5 DnD API, touch support |
| Carousel / Slider | Meesho | Touch events, autoplay |
| Progress stepper | CRED, Razorpay | Controlled steps, validation |
| Color picker | Atlassian | HSL conversion, canvas |

---

## 8. LLD for Frontend Engineers

---

### Design Principles

**SOLID in frontend context:**
- **S** — Single responsibility: Button component only handles click state, not data fetching
- **O** — Open/closed: Extend via composition (children, render props), not modification
- **L** — Liskov: Child component should work wherever parent is used (compound components)
- **I** — Interface segregation: Split large contexts/stores into smaller focused ones
- **D** — Dependency inversion: Components depend on interfaces (props), not implementations

---

### LLD Problem 1: Design a Toast Notification System

**Requirements:** Show toasts, auto-dismiss, queue multiple, accessible

```javascript
// API Design
toast.success('Saved!', { duration: 3000 });
toast.error('Failed to save', { duration: 5000, action: { label: 'Retry', onClick: fn } });
toast.dismiss('toast-id');

// Implementation
class ToastManager {
  constructor() {
    this.toasts = [];
    this.listeners = new Set();
    this.counter = 0;
  }
  add(message, type = 'info', options = {}) {
    const id = `toast-${++this.counter}`;
    const toast = { id, message, type, duration: 3000, ...options };
    this.toasts = [...this.toasts, toast];
    this.notify();
    if (toast.duration !== Infinity) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
    return id;
  }
  dismiss(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  notify() { this.listeners.forEach(l => l(this.toasts)); }
}

export const toast = new ToastManager();
toast.success = (msg, opts) => toast.add(msg, 'success', opts);
toast.error = (msg, opts) => toast.add(msg, 'error', opts);
```

---

### LLD Problem 2: Design a Form Validation Library

```javascript
// API Design
const form = useForm({
  initialValues: { email: '', password: '' },
  validators: {
    email: [required(), email(), maxLength(100)],
    password: [required(), minLength(8)],
  },
  onSubmit: async (values) => { /* ... */ },
});

// Core validator functions
const required = () => (value) =>
  !value || !String(value).trim() ? 'This field is required' : null;

const email = () => (value) =>
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email' : null;

const minLength = (min) => (value) =>
  value.length < min ? `Minimum ${min} characters` : null;

// useForm implementation
function useForm({ initialValues, validators, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (fieldValues = values) => {
    const newErrors = {};
    for (const [field, rules] of Object.entries(validators)) {
      for (const rule of rules) {
        const error = rule(fieldValues[field]);
        if (error) { newErrors[field] = error; break; }
      }
    }
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validate({ ...values, [field]: value })[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validate()[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;
    setSubmitting(true);
    try { await onSubmit(values); }
    finally { setSubmitting(false); }
  };

  return { values, errors, touched, submitting, handleChange, handleBlur, handleSubmit };
}
```

---

### LLD Problem 3: Design an Analytics SDK

```javascript
class Analytics {
  constructor(config) {
    this.config = config;
    this.queue = [];
    this.sessionId = this.generateSession();
    this.userId = null;
    this.batchTimer = null;
    this.flushInterval = config.flushInterval || 5000;
    this.batchSize = config.batchSize || 20;
    this.setupAutoFlush();
    this.setupBeforeUnload();
  }

  track(event, properties = {}) {
    const entry = {
      event,
      properties,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
    };
    this.queue.push(entry);
    if (this.queue.length >= this.batchSize) this.flush();
  }

  identify(userId, traits = {}) {
    this.userId = userId;
    this.track('identify', traits);
  }

  page(name) {
    this.track('page_view', { name, title: document.title });
  }

  async flush() {
    if (!this.queue.length) return;
    const batch = this.queue.splice(0, this.batchSize);
    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
        keepalive: true, // important for beforeunload
      });
    } catch {
      this.queue.unshift(...batch); // re-queue on failure
    }
  }

  setupAutoFlush() {
    this.batchTimer = setInterval(() => this.flush(), this.flushInterval);
  }

  setupBeforeUnload() {
    window.addEventListener('beforeunload', () => this.flush());
    // Modern: use sendBeacon for guaranteed delivery
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        navigator.sendBeacon(this.config.endpoint, JSON.stringify({ events: this.queue }));
        this.queue = [];
      }
    });
  }

  generateSession() { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }

  destroy() {
    clearInterval(this.batchTimer);
    this.flush();
  }
}
```

---

## 9. Behavioral & Leadership Questions

For senior roles, you spend 1–2 rounds on these. Prepare with STAR format.

### Common Questions & Frameworks

**1. Tell me about a technically challenging project**
- Situation: Context, team size, timeline
- Task: What you owned
- Action: Specific technical decisions and tradeoffs
- Result: Measurable outcome (performance improvement %, user growth, etc.)

**2. Conflict with a colleague or tech lead**
- Show: You raise concerns early, with data
- Show: You can disagree but commit
- Avoid: Blaming, "they were wrong"

**3. Why are you leaving your current company?**
- Frame as: Growth, impact, scale — not frustration
- Tie it to the target company's mission

**4. How do you handle ambiguous requirements?**
- Clarify with product/design before coding
- Break into phases — MVP then iterate
- Document assumptions explicitly

**5. Mentorship / team contribution**
- Code reviews, documenting patterns, lunch-and-learns
- Junior engineers you helped grow

### Questions to Ask the Interviewer
- What does the frontend team's biggest technical challenge look like right now?
- How is engineering work balanced between features and technical debt?
- What does a typical sprint look like for the frontend team?
- How do you measure frontend performance in production?

---

## 10. 30-Day Study Plan

### Week 1 — Foundation (Days 1–7)

| Day | Focus | Resources |
|-----|-------|-----------|
| Day 1 | Arrays, Two Pointers (10 problems) | LeetCode Easy→Medium |
| Day 2 | Sliding Window (8 problems) | LeetCode |
| Day 3 | HashMap & Sets (8 problems) | LeetCode |
| Day 4 | Stack + Monotonic Stack (8 problems) | LeetCode |
| Day 5 | Binary Search (10 problems) | LeetCode |
| Day 6 | JS: Closures, Currying, Memoize | MDN + Implement from scratch |
| Day 7 | Revision + mock (45-min timed) | Revisit weak areas |

### Week 2 — Core Depth (Days 8–14)

| Day | Focus | Resources |
|-----|-------|-----------|
| Day 8 | Trees: BFS/DFS (10 problems) | LeetCode |
| Day 9 | Trees: LCA, Serialize, Path problems | LeetCode |
| Day 10 | Recursion + Backtracking (8 problems) | LeetCode |
| Day 11 | JS: Promises, async/await, event loop | Implement Promise.all etc. |
| Day 12 | JS: Prototype, call/apply/bind from scratch | MDN |
| Day 13 | React: Hooks internals + custom hooks | Build 5 custom hooks |
| Day 14 | Mock interview (DSA + JS round) | Pramp / peer |

### Week 3 — Company Prep (Days 15–21)

| Day | Focus | Resources |
|-----|-------|-----------|
| Day 15 | Linked Lists + LRU Cache | LeetCode |
| Day 16 | Greedy + Intervals (6 problems) | LeetCode |
| Day 17 | 1D DP (8 problems) | LeetCode |
| Day 18 | React: Performance, memo, useMemo, splitting | Build optimized app |
| Day 19 | Machine Coding: Infinite scroll + Autocomplete | Build in 90 min |
| Day 20 | System Design: Feed, Leaderboard, Payment | Study + whiteboard |
| Day 21 | Full mock round (Swiggy/Razorpay style) | Peer or mock platform |

### Week 4 — Polish (Days 22–30)

| Day | Focus | Resources |
|-----|-------|-----------|
| Day 22 | Graphs: BFS/DFS (5 problems) | LeetCode |
| Day 23 | Machine Coding: Kanban / Rich form | Build in 90 min |
| Day 24 | LLD: Toast system + Form library | Build from scratch |
| Day 25 | Behavioral prep — 5 STAR stories | Write them out |
| Day 26 | Company deep-dive: Flipkart specific | Research + simulate |
| Day 27 | Company deep-dive: Razorpay specific | Research + simulate |
| Day 28 | Full mock: DSA + System Design + Behavioral | 3-hour mock |
| Day 29 | Revision: all weak areas flagged this month | Notes review |
| Day 30 | Rest + light revision only | Mental prep |

---

### LeetCode Problem List — Curated 50

**Must solve (🔴 — target 100% completion):**
1. Two Sum (#1)
2. Best Time to Buy and Sell Stock (#121)
3. Contains Duplicate (#217)
4. Maximum Subarray (#53)
5. Longest Substring Without Repeating Characters (#3)
6. Valid Parentheses (#20)
7. Merge Intervals (#56)
8. Reverse Linked List (#206)
9. Linked List Cycle (#141)
10. Merge Two Sorted Lists (#21)
11. Invert Binary Tree (#226)
12. Maximum Depth of Binary Tree (#104)
13. Level Order Traversal (#102)
14. Validate BST (#98)
15. Lowest Common Ancestor (#236)
16. Climbing Stairs (#70)
17. Coin Change (#322)
18. House Robber (#198)
19. Search in Rotated Sorted Array (#33)
20. Number of Islands (#200)
21. 3Sum (#15)
22. Group Anagrams (#49)
23. Product of Array Except Self (#238)
24. Word Search (#79)
25. Subsets (#78)
26. Permutations (#46)
27. Daily Temperatures (#739)
28. LRU Cache (#146)
29. Top K Frequent Elements (#347)
30. Find Minimum in Rotated Sorted Array (#153)

**Good to solve (🟡):**
31. Trapping Rain Water (#42)
32. Sliding Window Maximum (#239)
33. Serialize and Deserialize Binary Tree (#297)
34. Word Break (#139)
35. Course Schedule (#207)
36. Longest Consecutive Sequence (#128)
37. Non-overlapping Intervals (#435)
38. Combination Sum (#39)
39. Jump Game (#55)
40. Koko Eating Bananas (#875)
41. Minimum Window Substring (#76)
42. Largest Rectangle in Histogram (#84)
43. Subarray Sum Equals K (#560)
44. Clone Graph (#133)
45. N-Queens (#51)
46. Path Sum II (#113)
47. Meeting Rooms II (#253)
48. Decode Ways (#91)
49. Container With Most Water (#11)
50. Flatten Nested List Iterator (#341)

---

### Quick Reference — Complexity Cheatsheet

| Operation | Array | HashMap | BST | Sorted Array |
|-----------|-------|---------|-----|-------------|
| Search | O(n) | O(1) avg | O(log n) | O(log n) |
| Insert | O(1) amort | O(1) avg | O(log n) | O(n) |
| Delete | O(n) | O(1) avg | O(log n) | O(n) |
| Min/Max | O(n) | O(n) | O(log n) | O(1) |

| Algorithm | Time | Space |
|-----------|------|-------|
| Bubble Sort | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Quick Sort | O(n log n) avg | O(log n) |
| Binary Search | O(log n) | O(1) |
| BFS/DFS | O(V+E) | O(V) |
| Dijkstra | O(E log V) | O(V) |

---

*Document prepared for senior frontend engineers targeting 30–50 LPA at Indian product companies.*  
*Last updated: 2025 | Covers: DSA · JavaScript · React · System Design · LLD · Company Patterns*

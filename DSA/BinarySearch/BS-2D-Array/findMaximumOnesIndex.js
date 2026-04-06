const mat = [
  [1, 1, 1],
  [0, 0, 1],
  [0, 0, 0],
];
const n = 3,
  m = 3;

const mat1 = [
    [0, 0],
    [0, 0],
  ],
  n1 = 2,
  m1 = 2;

function findMaximumOnesIndex(mat, n, m) {
  let indToReturn = -1;
  let maxCount = 0;
  for (let i = 0; i <= n - 1; i++) {
    let countRow = 0;
    for (let j = 0; j <= m - 1; j++) {
      countRow += mat[i][j];
    }
    if (countRow > maxCount) {
      maxCount = countRow;
      indToReturn = i;
    }
  }
  return indToReturn;
}

console.log(findMaximumOnesIndex(mat, n, m));
console.log(findMaximumOnesIndex(mat1, n1, m1));

///optimal approach  using lowerbound arr[i] >= x on the child

function lowerBound(arr, m, x) {
  let low = 0;
  let high = m - 1;
  let ans = m;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] >= x) {
      ans = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return ans;
}

function findKthMissingElement1(mat, n, m) {
  let indToReturn = -1;
  let maxCount = 0;

  for (let i = 0; i < n; i++) {
    let countOnes = m - lowerBound(mat[i], m, 1);

    if (countOnes > maxCount) {
      maxCount = countOnes;
      indToReturn = i;
    }
  }
  return indToReturn;
}

console.log("optimal", findKthMissingElement1(mat, m, n));
console.log("optimal", findKthMissingElement1(mat1, m1, n1));

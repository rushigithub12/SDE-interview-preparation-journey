const mat = [
  [5, 10, 8],
  [4, 25, 7],
  [3, 9, 6],
];
const n = mat.length;
const m = mat[0].length;

function findPeakInMatrix(mat, n, m) {
  let peak = -Infinity;
  let indResult = {};

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (mat[i][j] > peak) {
        peak = mat[i][j];
        indResult = { i, j };
      }
    }
  }
  return { peak, indResult };
}

console.log(findPeakInMatrix(mat, m, n));

///optimal approach
function maxElementInColumn(arr, col) {
  let maxVal = Number.MIN_SAFE_INTEGER;
  let maxRow = -1;

  for (let row = 0; row < arr.length; row++) {
    if (arr[row][col] > maxVal) {
      maxVal = arr[row][col];
      maxRow = row;
    }
  }
  return maxRow;
}

function findPeakInMatrix1(mat, n, m) {
  let low = 0,
    high = m - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let row = maxElementInColumn(mat, mid);

    let midVal = mat[row][mid];
    let leftVal = mid > 0 ? mat[row][mid - 1] : Number.MIN_SAFE_INTEGER;
    let rightVal = mid < m - 1 ? mat[row][mid + 1] : Number.MIN_SAFE_INTEGER;

    if (midVal > leftVal && midVal > rightVal) {
      return [row, mid];
    } else if (leftVal > midVal) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return [-1, -1];
}

console.log(findPeakInMatrix1(mat, n, m));

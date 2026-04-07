const mat = [
  [1, 4, 7, 11],
  [2, 5, 8, 12],
  [3, 6, 9, 16],
  [10, 13, 14, 17],
];
const n = mat.length;
const m = mat[0].length;

function searchTargetInColumnSortedMatrix(mat, n, m, target) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (mat[i][j] === target) {
        return { i, j };
      }
    }
  }
  return false;
}

console.log(searchTargetInColumnSortedMatrix(mat, n, m, 9));

//better approach
function binarySearch(arr, m, x) {
  let low = 0,
    high = m - 1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === x) {
      return mid;
    } else if (arr[mid] > x) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
}

function searchTargetInColumnSortedMatrix1(mat, n, m, target) {
  for (let i = 0; i < n; i++) {
    if (mat[i][0] <= target && target <= mat[i][m - 1]) {
      let binSearch = binarySearch(mat[i], m, target);
      if (mat[i][binSearch] === target) {
        return true;
      }
    }
  }
  return false;
}

console.log(searchTargetInColumnSortedMatrix1(mat, n, m, 9));

//optimal approach
function searchTargetInColumnSortedMatrix2(mat, n, m, target) {
  let row = 0,
    col = m - 1;

  while (row < n && col >= 0) {
    const current = mat[row][col];
    if (current === target) {
      return true;
    } else if (current > target) {
      col--;
    } else {
      row++;
    }
  }
  return false;
}

console.log(searchTargetInColumnSortedMatrix2(mat, n, m, 9));


//more optimal
function searchTargetInColumnSortedMatrix3(matrix, target) {
  let row;
  while (matrix.length > 0) {
    row = matrix.pop();
    if (row.includes(target)) return true;
  }
  return false;
}
console.log(searchTargetInColumnSortedMatrix3(mat, 9));

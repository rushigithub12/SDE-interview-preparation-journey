const mat = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];
const n = 3,
  m = 4;

function searchTargetInMatrix(mat, n, m, target) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (mat[i][j] === target) {
        return true;
      }
    }
  }
  return false;
}

console.log(searchTargetInMatrix(mat, n, m, 8));

//better approach binary search
function searchInChildArr(arr, m, target) {
  let low = 0,
    high = m - 1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return -1;
}

function searchTargetInMatrix1(mat, n, m, target) {
  for (let i = 0; i < n; i++) {
    if (mat[i][0] <= target && target <= mat[i][m - 1]) {
      let binSearchEl = searchInChildArr(mat[i], m, target);
      if (mat[i][binSearchEl] === target) {
        return true;
      }
    }
  }
  return false;
}

console.log(searchTargetInMatrix1(mat, n, m, 8));

//imaginary flatten array
function searchTargetInMatrix2(mat, n, m, target) {
  let low = 0,
    high = n * m - 1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    const row = Math.floor(mid / m);
    const col = mid % m;

    if (mat[row][col] === target) {
      return true;
    } else if (mat[row][col] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
  return false;
}

console.log(searchTargetInMatrix2(mat, n, m, 8));

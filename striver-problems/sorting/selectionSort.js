function selectionSort(arr) {
  let newArr = [...arr];
  let n = newArr.length;
  
  for (let i = 0; i < n - 2; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (newArr[j] < newArr[minIndex]) {
        minIndex = j;
      }
    }

    let temp = newArr[minIndex];
    newArr[minIndex] = newArr[i];
    newArr[i] = temp;
  }
  return newArr;
}

console.log(selectionSort([13, 46, 24, 52, 20, 9]));

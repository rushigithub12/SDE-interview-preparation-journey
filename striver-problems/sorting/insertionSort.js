function insertionSort(arr){
    let newArr = [...arr];
    let n = newArr.length;

    for(let i=0; i< n; i++){
        let j = i;
        while(j > 0 && newArr[j-1] > newArr[j]){
            let temp = newArr[j-1];
            newArr[j-1] = newArr[j];
            newArr[j] = temp;
            j--;
        }
    }
    return newArr;
}

console.log(insertionSort([14, 9, 15, 12, 6, 8, 13]))
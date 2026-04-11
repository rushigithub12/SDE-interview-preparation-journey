function linearSearch(arr, n, target){
    for(let i=0; i<n; i++){
        if(arr[i] === target){
            return i
        }
    }
    return -1;
}

const arr = [1, 2, 3, 4, 5];
const n = arr.length;


const arr1 = [1, 2, 3, 4, 5];
const n1 = arr.length;

console.log(linearSearch(arr, n, 3))
console.log(linearSearch(arr1, n1, 7))
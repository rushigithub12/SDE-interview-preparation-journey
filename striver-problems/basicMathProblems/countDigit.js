// function countDigit(n){
//     let count = 0;
//     let x = n;
//     while(x > 0){
//         x = Math.floor(x / 10);
//         count++;
//     }
//     return count;
// }

function countDigit(n){
    let count = Math.floor(Math.log10(n) + 1);
    return count;
} 
console.log(countDigit(12345), Math.log10(2))
console.log(countDigit(7789))
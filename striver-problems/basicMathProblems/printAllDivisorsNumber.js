function printAllDivisorsNumber(n){
    let result = [];
    for(let i=1; i<=n; i++){
        if(n % i === 0){
            result.push(i)
        }
    }
    return result;
}

function printAllDivisorsNumber(n){
    let result = [];
    for(let i=1; i<=Math.sqrt(n); i++){
        if(n % i === 0){
            result.push(i);
            if(i !== n / i){
                result.push(n/ i)
            }
        }
    }
    return result;
}

console.log(printAllDivisorsNumber(36))
console.log(printAllDivisorsNumber(12));
console.log(printAllDivisorsNumber(25));

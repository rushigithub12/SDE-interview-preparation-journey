function gcdOfNum(a, b){
    return b === 0 ? a : gcdOfNum(b, a % b);
}

function reduceFraction(a, b){
    let gcd = gcdOfNum(a, b);

    let x = parseInt(a / gcd);
    let y = parseInt(b / gcd);

    return [x, y]
}

console.log(reduceFraction(16, 10))
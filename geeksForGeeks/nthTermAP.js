function nthTermAP(a1, a2, n){
    let d = a2 - a1;
    let tn = a1 + (n - 1) * d;
    return tn
}

console.log(nthTermAP(2, 3, 4))
console.log(nthTermAP(1, 3, 10))
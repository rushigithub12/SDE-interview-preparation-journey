function gcdOfTwonumbers(a, b){
    let result = Math.min(a, b);

    while(result > 0){
        if(a % result === 0 && b % result === 0){
            break;
        };
        result --;
    }
    return result;
}

console.log(gcdOfTwonumbers(18, 24));


function gcdOfTwonumbers1(a, b){
    if(a === b){
        return a;
    }
    if(a > b){
        return gcdOfTwonumbers1(a - b, b);
    }
    if(a < b){
        return gcdOfTwonumbers1(a, b - a);
    }
}

console.log(gcdOfTwonumbers1(18, 24))
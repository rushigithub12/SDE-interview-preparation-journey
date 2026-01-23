function characterHashing(inputStr, queries){
    let hasedObj = {};
    for(let i=0; i<inputStr.length; i++){
        let key = inputStr[i];
        hasedObj[key] = (hasedObj[key] || 0) + 1;
    }

    for(let i=0; i<queries.length; i++){
        let q = queries[i];
        console.log(`Frquency of ${q} = ${hasedObj[q] = hasedObj[q] || 0}`)
    }
    return hasedObj;
}

function characterHashing1(str, queries){
    let hashedArr = new Array(26).fill(0);
    for(let i=0; i<str.length; i++){
        let index = str.charCodeAt(i) - "a".charCodeAt(0);
        hashedArr[index]++;
    }

    for(let i=0; i<queries.length; i++){
        if(hashedArr[i] === queries[i]){
            console.log(hashedArr[i])
        }
    }
    return hashedArr
}

console.log(characterHashing("abcdabefc", ["a", "c", "z"]));


console.log(characterHashing1("abcdabefc", ["a", "c", "z"]))
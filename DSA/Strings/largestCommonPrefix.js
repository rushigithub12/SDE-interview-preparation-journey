function largestCommonPrefix(strs){
    let commonPrefix = "";

    strs.sort();

    const first = strs[0];
    const last = strs[strs.length - 1]

    for(let i=0; i<Math.min(first.length, last.length); i++){
        if(first[i] !== last[i]){
            return commonPrefix;
        }

        commonPrefix += first[i]
    };

    return commonPrefix;
}

const strs = ["flower", "flow", "flight"];

console.log(largestCommonPrefix(strs))
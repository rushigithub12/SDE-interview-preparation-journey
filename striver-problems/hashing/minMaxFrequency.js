function minMaxFrequency(arr) {
  let len = arr.length;
  const visited = new Array(len).fill(false);

  let maxFreq = 0,
    minFreq = len;
  let maxEl = 0,
    minEl = 0;

  for (let i = 0; i < len; i++) {
    if (visited[i]) continue;
    let count = 1;
    for (let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        console.log(arr[i], arr[j]);
        visited[j] = true;
        count++;
      }
    }

    if (count > maxFreq) {
      maxEl = arr[i];
      maxFreq = count;
    }

    if (count < minFreq) {
      minEl = arr[i];
      minFreq = count;
    }
  }

  return { maxEl, minEl };
}

console.log(minMaxFrequency([10, 5, 10, 15, 10, 5]));


//using optimal approach MAP

function minMaxFrequency2(arr){
    let freqMap = new Map();

    let maxFreq = 0, minFreq = arr.length;
    let maxEl = 0, minEl = 0;

    for(let el of arr){
        freqMap.set(el, (freqMap.get(el) || 0) + 1);
    }

    for(let [elem, count] of freqMap.entries()){
        if(count > maxFreq){
            maxFreq = count;
            maxEl = elem
        }
        if(count < minFreq){
            minFreq = count;
            minEl = elem;
        }
    }
    return { maxEl, minEl }
}

console.log(minMaxFrequency2([10, 5, 10, 15, 10, 5]))
console.log(minMaxFrequency2([10, -5, 10, 15, -10, 5]))
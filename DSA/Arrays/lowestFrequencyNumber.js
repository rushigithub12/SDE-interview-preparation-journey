function lowestFrequencyNumber(arr) {
  let store = new Map();

  for (let num of arr) {
    store.set(num, (store.get(num) || 0) + 1);
  }

  let minFreq = Infinity,
    result = null;

  for (let [key, value] of store.entries()) {
    if (value < minFreq || (value === minFreq && key < result)) {
      minFreq = value;
      result = key;
    }
  }

  return result;
}

const arr = [1, 2, 2, 1, 4];

console.log(lowestFrequencyNumber(arr));

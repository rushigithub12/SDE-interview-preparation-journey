function smallestAmong(a, b, c) {
  let smallest = null;
  if (typeof a === "number" && !Number.isNaN(a)) {
    smallest = a;
  }
  if (typeof b == "number" && !Number.isNaN(b)) {
    if (smallest === null || b < smallest) {
      smallest = b;
    }
  }
  if (typeof c === "number" && !Number.isNaN(c)) {
    if (smallest === null || c < smallest) {
      smallest = c;
    }
  }
  return smallest === null ? "Not a valid Number" : smallest;
}
console.log(smallestAmong(3, 1, 6));
console.log(smallestAmong(-1, -6, 9));
console.log(smallestAmong(9, 9, 9));
console.log(smallestAmong(3, 3, 1));
console.log(smallestAmong(3, 1, 0));
console.log(smallestAmong("abcd", 11, 9)); //when comparing with string JS convert string into Number(string) then try to compare, here Number("abcd") => NaN , any comparison with NaN is false.

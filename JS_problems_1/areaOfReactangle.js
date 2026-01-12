function areaOfReactangle(l, b) {
  if (l > 0 && b > 0) {
    return l * b;
  }
  throw new RangeError("Length & Breadth should be a positive number");
}
console.log(areaOfReactangle(5, 4));
console.log(areaOfReactangle(2.5, 6));
console.log(areaOfReactangle(3.4, 9.1));
console.log(areaOfReactangle(3.4, -4)); // edge case length & breadth can't be negative
console.log(areaOfReactangle(0, 8)); // edge case length & breadth can't be negative

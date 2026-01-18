function isLeapYear(year) {
  if (typeof year !== "number") return "Provide number";
  if (year <= 0) return "Not a valid year";
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    return true;
  }
  return false;
}

function isLeapyear1(year){
    const leap = new Date(year, 1, 29).getDate();
    console.log(new Date(year, 1, 29))
    return leap === 29;
}

console.log(isLeapYear(2000));
console.log(isLeapYear(1995));
console.log(isLeapYear(0));
console.log(isLeapYear(-2343));
console.log(isLeapYear(2023));
console.log(isLeapYear(2024));
console.log(isLeapYear("abcdef"));


console.log(isLeapyear1(2024))
console.log(isLeapyear1(2023))
console.log(isLeapyear1(2000))
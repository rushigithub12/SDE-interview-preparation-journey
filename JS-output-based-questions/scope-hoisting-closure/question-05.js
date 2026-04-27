const question = `What will be logged?`;

(function () {
  var a = (b = 3);
})();
console.log(typeof a, typeof b);

//a has a function scope so it is undefined accessing outside
//b is global so it has global access outside the function => number
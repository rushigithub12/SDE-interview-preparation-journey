const question1 = "What is the output of the following?";

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

//output: 3 3 3
//var has a function scope when i reaches value 3, then callback executes

const question2 = "How would you fix the previous loop to print 0,1,2?";

//use let block scoped variable
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

//Use let instead of var (creates a new binding per iteration), or use an IIFE to capture the current value, or use .bind() to pass the value

for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 0);
  })(i);
}

for (var i = 0; i < 3; i++) {
  setTimeout(console.log.bind(null, i), 0);
}

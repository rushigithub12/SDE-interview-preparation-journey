const question = "What will be logged?";
var a = 1;
function foo() {
  console.log(a);
  var a = 2;
}
foo();


//variable is a has function scope, and console statement is above the declaration initially variable has assigned value as undefined
// so it return undefined.
//var a is hoisted at top with initial assigned value as undefined
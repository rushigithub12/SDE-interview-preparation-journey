const question = `What will be logged?;`;

function outer() {
  let x = 10;
  function inner() {
    console.log(x);
  }
  x = 20;
  return inner;
}
const fn = outer();
fn();

//20 as the value of x changed before returning inner fn

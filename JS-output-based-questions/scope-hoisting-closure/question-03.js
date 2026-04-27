const question = "Explain the concept of closure with a practical example.";

function increment() {
  let counter = 0;
  return function plus() {
    counter += 1;
    return counter;
  };
}

const add = increment();
console.log(add());
console.log(add());
console.log(add());


//closure function has access to its outer scope even after outer function has returned
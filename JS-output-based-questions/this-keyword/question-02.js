const question = " What is the output? ";

function Person(name) {
  this.name = name;
  setTimeout(
    function () {
      console.log(this.name);
    },
    100,
  );
}
new Person("Bob");


//undefined 

//use arrow functions or bind(this)

//use arrow
function Person1(name){
    this.name = name;
    setTimeout(() => {
        console.log(this.name)
    }, 100)
}

new Person1("John")

//using bind
function Person2(name){
    this.name = name;
    setTimeout(function() {
        console.log(this.name)
    }.bind(this), 100)
}

new Person2("Json")
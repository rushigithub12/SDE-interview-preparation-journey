const question = "What will be logged?";

const obj = {
  name: "Alice",
  greet: function () {
    console.log(this.name);
  },
};
obj.greet();

const grt = obj.greet;
grt();

//returns undefined 


let user = {};

user.me = user;

let clone = structuredClone(user)

console.log(clone)
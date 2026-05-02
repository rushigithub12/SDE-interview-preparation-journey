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
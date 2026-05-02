const question = "What will be logged?";
const obj = {
  a: 1,
  foo: function () {
    return this.a;
  },
};
console.log(obj.foo.call({ a: 2 }));

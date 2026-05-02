const question = "What will be logged?";
const obj = {
  a: 1,
  foo: function () {
    return this.a;
  },
};
const bound = obj.foo.bind(obj);
console.log(bound());

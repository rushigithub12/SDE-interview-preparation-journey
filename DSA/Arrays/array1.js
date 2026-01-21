//array literal
let a = [1, 2];

console.log(a);

//array constructor fn
let b = new Array(-3, 4, 0);
console.log(b)

let c = new Array(5); //creates empty slots with length mentioned
console.log(c, c.length)

console.log("array typeOf=>", typeof a);
console.log("isArray =>", Array.isArray(a))
const fruits = ["Banana", "Orange", "Apple", "Mango"];
let nums = [1, 2, 3, 4]

//length
console.log(fruits.length);

fruits.length = 2;
console.log(fruits);

//toString()
let nums1 = nums.toString();
console.log(nums1)

//at
console.log(fruits.at(1)); //get the 2rd element

//join()
let fruits1 = fruits.join("*");
console.log(fruits1); //converts to string same as toString but u can specify separator

//pop()
let lastEl = nums.pop();
console.log(lastEl); //pop out last element of an array

//push()
let ele1 = 100;
nums.push(ele1);
console.log(nums)// inject new element to the last


//shift()
let newNums = nums.shift();
console.log(newNums)// remove the first element from array

//unshift();
let newNums1 = [1, 2, 3, 4, 5]
let newNums01 = newNums1.unshift(100);
console.log("unshift=>",newNums01, newNums1)// add new element to start of the array and return newlength of an array


//flat()
const myArr1 = [[1,2],[3,4],[5,6]];
const newArr1 = myArr1.flat();
console.log(newArr1)

//flatmap
const myArr2 = [1, 2, 3, 4, 5,6];
const newArr2 = myArr2.flatMap(x => [x, x * 10]);
console.log(myArr2, newArr2)

//splice
const myArr3 = [1, 2, 3, 4, 5];
myArr3.splice(2, 0, 7); //2 index to be addded, 0 elements to be removed from index 2, 7 element added at tht position
console.log(myArr3)

myArr3.splice(1, 1);//remove element at index 1, 1 element to be removed;
console.log(myArr3)


//toSpliced
const months = ["Jan", "Feb", "Mar", "Apr"];
const spliced = months.toSpliced(0, 1); //new method return new arr removing element from index 0, 1 element to be removed
console.log(spliced)

//slice
const myArr4 = ["Car1", "Car2", "Car3", "Car4", "Car5", "Car6"];
const newMyArr4 = myArr4.slice(1);//slices out elements from 1 > length -1 into new Array
console.log(newMyArr4)

const newArr5 = myArr4.slice(1, 3); //start and end index no, last index not includes, return new arr
console.log(newArr5)
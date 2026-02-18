function isPalindrome(n) {
  if (n < 0) return false;
  let x = n;
  let reversed = 0;

  while (x > 0) {
    let rem = Math.floor(x % 10);
    reversed = reversed * 10 + rem;
    x = Math.floor(x / 10);
  }

  return reversed === n;
}


console.log(isPalindrome(121));
console.log(isPalindrome(-121));
console.log(isPalindrome(10));

function simpleInterest(P, R, T) {
  if (typeof P !== "number" || typeof R !== "number" || typeof T !== "number")
    return "enter valid number";

  if (P <= 0 || R <= 0 || T <= 0) return "Enter positive number";

  let si = (P * R * T) / 100;

  return si.toFixed(2);
}

console.log(simpleInterest(5000, 10, 2));
console.log(simpleInterest(-1, 0, 0));
console.log(simpleInterest(3128, 2.5, 3.5));

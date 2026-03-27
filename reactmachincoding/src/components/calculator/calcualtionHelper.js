export const calculate = (expression) => {
  const nums = [];
  const ops = [];

  const precedence = (op) => {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
  };

  const applyOperation = () => {
    const b = nums.pop();
    const a = nums.pop();
    const op = ops.pop();

    switch (op) {
      case "+":
        nums.push(a + b);
        break;
      case "-":
        nums.push(a - b);
        break;
      case "*":
        nums.push(a * b);
        break;
      case "/":
        nums.push(a / b);
        break;
      default:
        break;
    }
  };

  let i = 0;

  while (i < expression.length) {
    if (expression[i] === " ") {
      i++;
      continue;
    }

    if (!isNaN(expression[i]) || expression[i] === ".") {
      let num = "";
      while (
        i < expression.length &&
        (!isNaN(expression[i]) || expression[i] === ".")
      ) {
        num += expression[i++];
      }
      nums.push(parseFloat(num));
      continue;
    }

    while (
      ops.length &&
      precedence(ops[ops.length - 1]) >= precedence(expression[i])
    ) {
      applyOperation();
    }

    ops.push(expression[i]);
    i++;
  }

  while (ops.length) {
    applyOperation();
  }

  return nums.pop();
};

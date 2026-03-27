import React, { useState } from "react";
import "./Calculator.css";
import { calculate } from "./calcualtionHelper";

const btns = [1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "*", 0, "/", "C", "="];
const operators = ["+", "-", "*", "/"];

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const isOperator = (val) => operators.includes(val);

  const handleButtonClick = (value) => {
    if (value === "C") {
      setInput("");
      setResult("");
      return;
    }

    if (value === "=") {
      try {
        const res = calculate(input);
        setResult(res);
        setInput(res.toString());
      } catch (e) {
        setResult(e.toString());
      }
      return;
    }

    setInput((prev) => {
      if (isOperator(prev.slice(-1)) && isOperator(value)) {
        //check if the last char is operator and the input entered is operator then delete the last char and replace it with the value new input entered otherwise numbers
        return prev.slice(0, -1) + value;
      }
      return prev + value;
    });
  };

  return (
    <div className="calculator-container">
      <input type="text" value={input} readOnly className="calculator-input" />
      <div className="result">Result: {result}</div>
      <div className="buttons-container">
        {btns.map((btn) => (
          <button
            key={btn}
            onClick={() => handleButtonClick(btn.toString())}
            className={`calculator-button ${
              btn === "C" ? "clear" : btn === "=" ? "equal" : ""
            }`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;

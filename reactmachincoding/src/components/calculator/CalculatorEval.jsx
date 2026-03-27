import React, { useState } from "react";
import "./Calculator.css";

const btns = [1, 2, 3, "+", 4, 5, 6, "-", 7, 8, 9, "*", 0, "/", "c", "="];

export const CalculatorEval = () => {
  const [input, setInput] = useState("");

  const handleClick = (btnVal) => {
    if (btnVal === "=") {
      try {
        const result = eval(input);
        setInput(result.toString());
        return;
      } catch (e) {
        console.error(e);
      }
    } else if (btnVal === "c") {
      setInput("");
      return;
    }

    setInput((prev) => prev + btnVal);
  };

  return (
    <div className="calculator-container">
      <input type="text" className="calculator-input" readOnly value={input} />
      <div className="buttons-container">
        {btns?.map((btn, ind) => (
          <button
            className={`calculator-button ${
              btn === "c" ? "clear" : btn === "=" ? "equal" : ""
            }`}
            onClick={() => handleClick(btn.toString())}
            key={ind}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

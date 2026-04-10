import React from "react";

const InputComponent = ({ type, onChange, label, value, name, error }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type={type || "text"}
        onChange={onChange}
        value={value}
        name={name}
      />
      {error && <span>{error.toString()}</span>}
    </div>
  );
};

export default InputComponent;

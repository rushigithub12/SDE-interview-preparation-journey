import React, { useState } from "react";

const Dropdown2 = () => {
  const [selectedOptions, setSelectedOptions] = useState("");

  const data = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  const handleSelectChange = (e) => {
    setSelectedOptions(e.target.value);
  };

  console.log(selectedOptions);

  return (
    <div>
      <header>Dropdown2</header>
      <select name="" id="" onChange={handleSelectChange}>
        <option value="">Select Options</option>
        {data.map((item, ind) => (
          <option key={ind} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown2;

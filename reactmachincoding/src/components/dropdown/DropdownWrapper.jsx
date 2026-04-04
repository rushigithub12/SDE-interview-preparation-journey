import React from "react";
import DropDown from "./DropDown";
import "./DropDown.css";


const DropdownWrapper = () => {
  const data = [
    {
      title: "Title 01",
      options: ["Option 01", "Option 02"],
    },
    {
      title: "Title 02",
      options: ["Option 01", "Option 02"],
    },
  ];

  return (
    <div className="dropdown-wrapper" >
      {data?.map((item, ind) => (
        <DropDown key={ind} componentObject={item} />
      ))}
    </div>
  );
};

export default DropdownWrapper;

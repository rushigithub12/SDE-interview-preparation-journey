import React, { useState } from "react";
import "./DropDown.css";

const DropDown = ({ componentObject }) => {
  const [clickedHeader, setClickHeader] = useState("");

  const handleTitleClick = () => {
    if (clickedHeader === componentObject.title) {
      setClickHeader("");
    } else {
      setClickHeader(componentObject.title);
    }
  };

  const handleOptionClick = (option) => {
    console.log("clicked option", option);
  };

  const getReturnOptions = (componentObject) => {
    if (clickedHeader === componentObject.title) {
      let options = [];

      {
        componentObject.options.map((item, ind) => {
          options.push(
            <span key={ind} onClick={() => handleOptionClick(item)}>
              {item}
            </span>,
          );
        });
      }
      return options;
    } else {
      return null;
    }
  };

  return (
    <div className="dropdown-componentTile">
      <div className="dropdown-componentHeader" onClick={handleTitleClick}>
        {componentObject.title}
      </div>
      <div className="dropdown-componentOption">
        {getReturnOptions(componentObject)}
      </div>
    </div>
  );
};

export default DropDown;

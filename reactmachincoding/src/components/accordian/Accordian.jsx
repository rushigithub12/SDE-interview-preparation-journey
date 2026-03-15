import { useState } from "react";
import accordianData from "./accordianData.json";
import "./Accordian.css";

const Accordian = () => {
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleClick = (ind) => {
    setCurrentIndex(currentIndex === ind ? null : ind);
  };

  return (
    <div className="componentContainer">
      <header>
        <h1>Accordian</h1>
      </header>
      {accordianData.Data?.map((accData, index) => (
        <div key={index} className="accordionContainer">
          <div onClick={() => handleClick(index)} className="accordionHeader">
            {accData.header}
          </div>
          {currentIndex === index && (
            <div className="accordionBody">{accData.content}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordian;

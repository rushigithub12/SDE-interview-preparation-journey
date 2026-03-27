import React, { useState } from "react";
import "./Carousel.css";

const images = [
  "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
  "https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg",
  "https://images.pexels.com/photos/572897/pexels-photo-572897.jpeg",
  "https://images.pexels.com/photos/270756/pexels-photo-270756.jpeg",
];

const Carousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleBtnClick = (btn) => {
    if (btn === "prev") {
      if (activeIndex === 0) {
        setActiveIndex((prev) => images.length - 1);
      } else {
        setActiveIndex((prev) => prev - 1);
      }
    } else {
      if (activeIndex === images.length - 1) {
        setActiveIndex((prev) => 0);
      } else {
        setActiveIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="Carousel-container">
      <div className="carousel-imageContainer">
        <button onClick={() => handleBtnClick("prev")}>Prev</button>
        <img src={images[activeIndex]} alt="" height={500} width={500} />
        <button onClick={() => handleBtnClick("prev")}>Next</button>
         <div className="carousel-textContainer">
          <span className="carousel-text">{`${activeIndex+1} of ${images.length}`}</span>
        </div>
      </div>
    </div>
  );
};

export default Carousel;

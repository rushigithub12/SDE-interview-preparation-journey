import React, { useEffect, useState } from "react";
import "./GridLightsComponent.css";

const GridLightsComponent = () => {
  const [clickedTiles, setClickedTiles] = useState([]);
  const [removeTiles, setRemoveTiles] = useState(false);

  const handleTileClick = (ind) => {
    if (ind !== 4 && !clickedTiles.includes(ind)) {
      setClickedTiles((prev) => {
        let newTiles = [...prev, ind];

        if (newTiles.length === 8) {
          setRemoveTiles(true);
        }
        return newTiles;
      });
    }
  };

  useEffect(() => {
    let interval;

    if (removeTiles) {
      interval = setInterval(() => {
        setClickedTiles((prev) => {
          if (prev.length === 0) {
            setRemoveTiles(false);
            return prev;
          }

          let newTiles = prev.slice(0, -1);
          return newTiles;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [removeTiles]);

  const renderTiles = () => {
    let cells = [];

    for (let i = 0; i < 9; i++) {
      cells.push(
        <div
          key={i}
          className={`grid-tile ${clickedTiles.includes(i) ? "grid-tile-filled" : ""}`}
          onClick={() => handleTileClick(i)}
        >{`${i + 1}`}</div>,
      );
    }

    return cells;
  };

  return (
    <div className="gridLightsComponent-wrapper">
      <h4>GridLightsComponent</h4>
      <div className="tiles-holder">{renderTiles()}</div>
    </div>
  );
};

export default GridLightsComponent;

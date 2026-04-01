import React, { useState } from "react";
import "./DragNDropComponent.css"

const data = [
  { id: 1, text: "Div 01" },
  { id: 2, text: "Div 02" },
  { id: 3, text: "Div 03" },
  { id: 4, text: "Div 04" },
  { id: 5, text: "Div 05" },
];

const DragNDropComponent = () => {
  const [items, setItems] = useState(data);
  const [draggedItemIndex, setdraggedItemIndex] = useState(null);

  const handleDragStart = (e, indx) => {
    e.dataTransfer.effectAllowed = "move";
    setdraggedItemIndex(indx);
  };

  const handleDragEnd = () => {
    setdraggedItemIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, indx) => {
    e.preventDefault();

    if (draggedItemIndex === indx) return;

    let newItems = items.filter((item, ind) => ind !== draggedItemIndex);
    newItems.splice(indx, 0, items[draggedItemIndex]);

    setItems(newItems);
  };

  return (
    <div className="holder">
      <header>DragNDropComponent</header>

      {items?.map((item, index) => (
        <div
          key={item.id}
          className="drag-item"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={(e) => handleDragOver(e)}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default DragNDropComponent;

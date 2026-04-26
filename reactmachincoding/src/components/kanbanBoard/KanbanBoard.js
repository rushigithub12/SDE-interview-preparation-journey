import React, { useState } from "react";
import "./KanbanBoard.css";

const data = {
  todo: [
    {
      id: 1,
      title: "Todo 1",
    },
    {
      id: 2,
      title: "Todo 2",
    },
  ],
  progress: [
    {
      id: 3,
      title: "Todo 3",
    },
  ],
  complete: [
    {
      id: 4,
      title: "Todo 4",
    },
  ],
};

const KanbanBoard = () => {
  const [taskList, setTaskList] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [dragItem, setDragItem] = useState("");
  const [source, setSource] = useState("")

  const handleDragStart = (e, item, header) => {
    setDragItem(item);
    setSource(header)
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = true;
  };

  const handleDrop = (e, header) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = true;

    setTaskList((prev) => {
        let sourceItem = prev[source];
        let updateSourceItem = sourceItem.filter((item) => dragItem.id !== item.id);

        let dropItem = [...prev[header], dragItem];

        return {
            ...prev,
            [source]: updateSourceItem,
            [header]: dropItem
        }
    })
  };

  const handleTaskAdd = () => {
    setTaskList((prev) => {
      let updatedList = prev["todo"];
      return {
        ...prev,
        ["todo"]: [...updatedList, { id: inputValue, title: inputValue }],
      };
    });
  };

  const renderSection = (header, items) => {
    return (
      <div
        className="board-section"
        onDrop={(e) => handleDrop(e, header)}
        onDragOver={(e) => handleDragOver(e)}
      >
        <div className="board-header">{header}</div>
        <div className="board-data">
          {items.map((item) => (
            <div
              className="board-item"
              key={item.id}
              onDragStart={(e) => handleDragStart(e, item, header)}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUI = () => {
    let ui = [];
    for (let key in taskList) {
      ui.push(renderSection(key, taskList[key]));
    }
    return ui;
  };

  return (
    <div>
      <h2>KanbanBoard</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleTaskAdd}>Add</button>
      <div className="board-holder">{renderUI()}</div>
    </div>
  );
};

export default KanbanBoard;

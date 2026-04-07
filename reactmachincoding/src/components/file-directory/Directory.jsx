import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FileDirectory from "./FileDirectory";
import "./Directory.css";

const Directory = () => {
  const [directory, setDirectory] = useState([
    {
      id: uuidv4(),
      name: "src",
      type: "directory",
      isOpen: true,
      children: [
        { id: uuidv4(), name: "index.js", type: "file", children: [] },
        {
          id: uuidv4(),
          name: "components",
          type: "directory",
          isOpen: true,
          children: [
            { id: uuidv4(), name: "Button.js", type: "file", children: [] },
          ],
        },
      ],
    },
    { id: uuidv4(), name: "package.json", type: "file", children: [] },
  ]);

  const updateTree = (tree, id, callback) => {
    return tree.map((node) => {
      if (node.id === id) {
        return callback(node);
      }

      if (node.children) {
        return {
          ...node,
          children: updateTree(node.children, id, callback),
        };
      }

      return node;
    });
  };

  const createNode = (parentId, type) => {
    const name = prompt(`Enter ${type} name`);

    const newNode = {
      id: uuidv4(),
      name,
      type,
      children: type === "directory" ? [] : [],
    };

    setDirectory((prev) =>
      updateTree(prev, parentId, (node) => ({
        ...node,
        children: [...node.children, newNode],
      })),
    );
  };

  return (
    <div>
      <header>
        <h1>File Explorer</h1>
      </header>
      <div>
        {directory?.map((dir, ind) => (
          <FileDirectory key={dir.id} fileData={dir} onCreate={createNode} />
        ))}
      </div>
    </div>
  );
};

export default Directory;

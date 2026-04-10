import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FileDirectory from "./FileDirectory";
import fileData from "./file-data.json";
import "./Directory.css";

//helper
const addsTotree = (tree) => {
  return tree.map((node) => ({
    ...node,
    id: uuidv4(),
    isOpen: node.type === "directory" ? (node.isOpen ?? false) : undefined,
    children: node.children ? addsTotree(node.children) : [],
  }));
};

const Directory = () => {
  const [directory, setDirectory] = useState(addsTotree(fileData));

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
    if(!name) return

    const newNode = {
      id: uuidv4(),
      name,
      type,
      isOpen: type === "directory" ? true : false,
      children: type === "directory" ? [] : null,
    };

    setDirectory((prev) =>
      updateTree(prev, parentId, (node) => ({
        ...node,
        children: [...node.children, newNode],
      })),
    );
  };

  const onRename = (id) => {
    const newName = prompt("Enter name");
    if (!newName) return;

    setDirectory((prev) =>
      updateTree(prev, id, (node) => ({
        ...node,
        name: newName,
      })),
    );
  };

  const onDelete = (id) => {
    const deleteNode = (tree) => {
      return tree
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: node.children ? deleteNode(node.children) : [],
        }));
    };
    setDirectory((prev) => deleteNode(prev));
  };

  const handleToggle = (id) => {
    const updateTree = (tree) => {
      return tree.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            isOpen: node.type === "directory" ? !node.isOpen : false,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children ? updateTree(node.children) : [],
          };
        }
        return node;
      });
    };

    setDirectory((prev) => updateTree(prev));
  };

  return (
    <div className="directory-container">
      <header>
        <h1>File Explorer</h1>
      </header>
      <div>
        {directory?.map((dir, ind) => (
          <FileDirectory
            key={dir.id}
            fileData={dir}
            onCreate={createNode}
            onRename={onRename}
            onDelete={onDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default Directory;

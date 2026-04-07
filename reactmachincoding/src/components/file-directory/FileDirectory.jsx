import React, { useState } from "react";
import "./Directory.css";

const FileDirectory = ({ fileData, onCreate }) => {
  const [showChildren, setShowChildren] = useState(false);

  const handleShowChild = () => {
    setShowChildren(!showChildren);
  };

  return (
    <div>
      <h5>
        {fileData?.type === "directory" ? (showChildren ? "📂" : "📁") : "📄"}
        <span className="directory-folder-name" onClick={handleShowChild}>
          {fileData.name}
        </span>
        {fileData?.type === "directory" && (
          <>
            <button onClick={() => onCreate(fileData.id, "file")}>+File</button>
            <button onClick={() => onCreate(fileData.id, "directory")}>
              +Folder
            </button>
          </>
        )}
      </h5>
      <div>
        {showChildren &&
          fileData?.children?.map((files, ind) => (
            <FileDirectory key={files.id} fileData={files} onCreate={onCreate} />
          ))}
      </div>
    </div>
  );
};

export default FileDirectory;

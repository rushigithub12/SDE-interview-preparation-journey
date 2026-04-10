import React from "react";
import "./Directory.css";

const FileDirectory = ({
  fileData,
  onCreate,
  onRename,
  onDelete,
  onToggle,
}) => {
  return (
    <div className="filedirectory-container">
      <div>
        <span className="filedirectory-icon">
          {fileData?.type === "directory"
            ? fileData.isOpen
              ? "📂"
              : "📁"
            : "📄"}
        </span>
        <span
          className="directory-folder-name"
          onClick={() => onToggle(fileData.id)}
        >
          {fileData.name}
        </span>
        <span className="filedirectory-action">
          <button onClick={() => onRename(fileData.id)}>✏️</button>
          <button onClick={() => onDelete(fileData.id)}>❌</button>

          {fileData?.type === "directory" && (
            <>
              <button onClick={() => onCreate(fileData.id, "file")}>
                +File
              </button>
              <button onClick={() => onCreate(fileData.id, "directory")}>
                +Folder
              </button>
            </>
          )}
        </span>
      </div>
      <div>
        {fileData.isOpen &&
          fileData?.children?.map((files, ind) => (
            <FileDirectory
              key={files.id}
              fileData={files}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
      </div>
    </div>
  );
};

export default FileDirectory;

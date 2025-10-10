import React from "react";

const FileMenu = ({
  fileMenuOpen,
  onFileAction,
  isSummarizing,
  isPreparing,
}) => {
  if (!fileMenuOpen) return null;

  return (
    <div className="absolute mt-2 w-48 bg-white border shadow rounded">
      <button
        onClick={() => onFileAction("summarize")}
        disabled={isSummarizing}
        className="w-full px-3 py-2 text-left hover:bg-gray-100"
      >
        {isSummarizing ? "Summarizing..." : "Summarize"}
      </button>
      <button
        onClick={() => onFileAction("prepareQuestions")}
        disabled={isPreparing}
        className="w-full px-3 py-2 text-left hover:bg-gray-100"
      >
        {isPreparing ? "Preparing..." : "Prepare Questions"}
      </button>
      <button
        onClick={() => onFileAction("exportPDF")}
        className="w-full px-3 py-2 text-left hover:bg-gray-100"
      >
        Export PDF
      </button>
      <button
        onClick={() => onFileAction("rename")}
        className="w-full px-3 py-2 text-left hover:bg-gray-100"
      >
        Rename
      </button>
    </div>
  );
};

export default FileMenu;

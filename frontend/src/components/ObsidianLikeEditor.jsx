import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function ObsidianLikeEditor() {
  const [content, setContent] = useState("# Heading 1\n\nSome text here");

  const lines = content.split("\n");

  const updateLine = (index, newValue) => {
    const newLines = [...lines];
    newLines[index] = newValue;
    setContent(newLines.join("\n"));
  };

  return (
    <div className="p-4 bg-white text-black">
      {lines.map((line, idx) => (
        <LineBlock
          key={idx}
          value={line}
          onChange={(v) => updateLine(idx, v)}
        />
      ))}
    </div>
  );
}

function LineBlock({ value, onChange }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        rows={1}
        className="w-full resize-none bg-transparent focus:outline-none font-mono transition-all"
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      />
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="cursor-text hover:bg-gray-50 rounded px-1 transition-colors"
    >
      <ReactMarkdown>{value || " "}</ReactMarkdown>
    </div>
  );
}

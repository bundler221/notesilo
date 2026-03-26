import React, { useState } from "react";

export default function AddReferenceForm({ noteId, onAdded }) {
  const [toNoteId, setToNoteId] = useState("");
  const [fromHeading, setFromHeading] = useState("");
  const [toHeading, setToHeading] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/notes/${noteId}/references`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toNoteId, fromHeading, toHeading }),
    });

    if (res.ok) {
      const data = await res.json();
      onAdded(data.references);
    } else {
      alert("Failed to add reference");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2 bg-gray-100 rounded">
      <h2 className="font-bold">➕ Add Reference</h2>
      <input
        type="text"
        placeholder="Target Note ID"
        value={toNoteId}
        onChange={(e) => setToNoteId(e.target.value)}
        className="border p-1 w-full"
      />
      <input
        type="text"
        placeholder="From Heading"
        value={fromHeading}
        onChange={(e) => setFromHeading(e.target.value)}
        className="border p-1 w-full"
      />
      <input
        type="text"
        placeholder="To Heading"
        value={toHeading}
        onChange={(e) => setToHeading(e.target.value)}
        className="border p-1 w-full"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
        Add Reference
      </button>
    </form>
  );
}

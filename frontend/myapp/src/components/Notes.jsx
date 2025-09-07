import { useEffect, useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setNotes(data.notes || []));
  }, []);

  return (
    <div>
      <h2>Your Notes</h2>
      <ul>
        {notes.map((n) => (
          <li key={n._id}>{n.text}</li>
        ))}
      </ul>
    </div>
  );
}

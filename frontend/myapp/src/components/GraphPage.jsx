// src/components/GraphPage.jsx
import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API_URL = "http://localhost:5000/api/graph/all";

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setGraphData(data))
      .catch((err) => console.error("Graph fetch failed:", err));
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <h1 className="text-xl font-bold p-4">📌 Notes Graph</h1>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="title"
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        nodeAutoColorBy="tags"
        width={window.innerWidth}
        height={window.innerHeight - 60}
        onNodeClick={(node) => {
          alert(`Clicked: ${node.title}`);
        }}
      />
    </div>
  );
}

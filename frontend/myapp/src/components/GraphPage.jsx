import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/graph/all";

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();
  const navigate = useNavigate();

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
          navigate(`/notes?noteId=${node.id}`);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.title;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const padding = 5;
          const width = textWidth + padding * 2;
          const height = fontSize + padding * 2;

          // Draw rectangle
          ctx.fillStyle = node.color || "#4a90e2";
          ctx.fillRect(node.x - width / 2, node.y - height / 2, width, height);

          // Draw text
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y);
        }}
        linkCanvasObject={(link, ctx, globalScale) => {
          // Draw simple line
          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.strokeStyle = "#999999";
          ctx.lineWidth = 1 / globalScale;
          ctx.stroke();

          // Draw arrowhead
          const arrowLength = 9;
          const arrowWidth = 3;
          const endX = link.target.x;
          const endY = link.target.y;
          const startX = link.source.x;
          const startY = link.source.y;
          const dx = endX - startX;
          const dy = endY - startY;
          const angle = Math.atan2(dy, dx);
          ctx.save();
          ctx.translate(endX, endY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-arrowLength, -arrowWidth);
          ctx.lineTo(0, 0);
          ctx.lineTo(-arrowLength, arrowWidth);
          ctx.fillStyle = "#999999";
          ctx.fill();
          ctx.restore();

          // Draw link label
          if (link.label) {
            const fontSize = 10 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const midX = (link.source.x + link.target.x) / 2;
            const midY = (link.source.y + link.target.y) / 2;
            ctx.fillText(link.label, midX, midY);
          }
        }}
      />
    </div>
  );
}
// src/components/MindMap.jsx
import { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import 'reactflow/dist/style.css';
import axios from "axios";

export default function MindMap({ token }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchGraph = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/graph/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nodes: backendNodes, links } = res.data;

        // Simple grid layout instead of random
        const flowNodes = backendNodes.map((node, i) => ({
          id: node.id,
          data: { label: node.title },
          position: { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 },
        }));

        const flowEdges = links.map(link => ({
          id: `${link.source}-${link.target}`,
          source: link.source,
          target: link.target,
          label: link.label,
          animated: true,
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        console.error("Failed to fetch graph:", err);
      }
    };

    fetchGraph();
  }, [token]);

  return (
    <div style={{ height: "80vh", border: "1px solid #ddd", borderRadius: 8 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

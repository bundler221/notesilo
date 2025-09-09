 
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
        const res = await axios.get("http://localhost:5000/api/notes/graph/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { nodes: backendNodes, links } = res.data;

        // Convert nodes for React Flow
        const flowNodes = backendNodes.map(node => ({
          id: node.id,
          data: { label: node.title },
          position: { x: Math.random() * 500, y: Math.random() * 500 }, // simple layout
        }));

        // Convert links to edges for React Flow
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
    <div style={{ height: 500, border: "1px solid #ddd", borderRadius: 8 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

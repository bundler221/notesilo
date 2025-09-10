import React, { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

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

  // Add lights for shiny effects
  useEffect(() => {
    if (fgRef.current) {
      const scene = fgRef.current.scene();

      // Remove old lights if they exist
      scene.children = scene.children.filter(
        (obj) => !(obj.isLight && obj.userData.fromGraphPage)
      );

      // Soft ambient light
      const ambient = new THREE.AmbientLight(0xaaaaaa, 0.6);
      ambient.userData.fromGraphPage = true;
      scene.add(ambient);

      // Brighter point light
      const pointLight = new THREE.PointLight(0xffffff, 1.2);
      pointLight.position.set(100, 100, 200);
      pointLight.userData.fromGraphPage = true;
      scene.add(pointLight);
    }
  }, [graphData]);

  // Helper to create text sprite
  const createTextSprite = (text, color = "#ffffff", fontSize = 60) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = `${fontSize}px Sans-Serif`;
    const textWidth = context.measureText(text).width;
    canvas.width = textWidth;
    canvas.height = fontSize * 1.4;
    context.font = `${fontSize}px Sans-Serif`;
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);
    return sprite;
  };

  return (
    <div className="w-full h-screen bg-black">
      <h1 className="absolute top-4 left-4 text-xl font-bold text-white z-10">
        📌 Notes Graph
      </h1>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="tags"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => navigate(`/notes?noteId=${node.id}`)}
        nodeThreeObject={(node) => {
          // Shiny sphere
          const geometry = new THREE.SphereGeometry(8, 32, 32);
          const material = new THREE.MeshPhongMaterial({
            color: node.color || "#4a90e2",
            shininess: 100,
            specular: 0xffffff,
          });
          const sphere = new THREE.Mesh(geometry, material);

          // Add label sprite
          if (node.title) {
            const sprite = createTextSprite(node.title, "#ffffff", 80);
            sprite.position.set(0, 15, 0); // above sphere
            sphere.add(sprite);
          }

          // Rotation animation
          const speed = 0.01 + Math.random() * 0.02;
          sphere.tick = () => {
            sphere.rotation.y += speed;
            sphere.rotation.x += speed / 2;
          };

          return sphere;
        }}
        linkThreeObject={(link) => {
          if (!link.label) return null;
          const sprite = createTextSprite(link.label, "#00ffcc", 60);
          return sprite;
        }}
        linkPositionUpdate={(sprite, { start, end }) => {
          if (!sprite) return;
          const middlePos = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2,
            z: (start.z + end.z) / 2,
          };
          Object.assign(sprite.position, middlePos);
        }}
      />
    </div>
  );
}

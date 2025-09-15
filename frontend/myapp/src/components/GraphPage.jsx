// GraphPage.jsx — static rows, neon nodes + neon links + blue-hover glow + link labels
import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL + "/api/graph/all";

/* ---------- helper: arrange nodes in rows ---------- */
function rowLayout(nodes, perRow = 5, dx = 260, dy = 170) {
  return nodes.map((n, i) => {
    const x = (i % perRow) * dx;
    const y = Math.floor(i / perRow) * dy;
    return { ...n, x, y, fx: x, fy: y }; // lock position
  });
}

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [hoverNode, setHoverNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [hoverLink, setHoverLink] = useState(null);
  const fgRef = useRef();

  /* ---------- fetch + layout ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((raw) =>
        setGraphData({ nodes: rowLayout(raw.nodes), links: raw.links })
      )
      .catch((err) => console.error("Graph fetch failed:", err));
  }, []);

  /* ---------- node painter ---------- */
  const drawNode = (node, ctx, scale) => {
    const isHover = node === hoverNode;

    const font = 14 / scale;
    const pad = 10 / scale;
    ctx.font = `bold ${font}px Sans-Serif`;

    const title = node.title ?? "";
    const tags = node.tags?.length ? node.tags.join(", ") : "";

    const textW = Math.max(
      ctx.measureText(title).width,
      ctx.measureText(tags).width
    );
    const w = textW + pad * 2;
    const h = font * (tags ? 2 : 1) + pad * 2 + (tags ? font * 0.6 : 0);
    const x = node.x - w / 2;
    const y = node.y - h / 2;
    const r = h / 2; // pill radius

    /* neon glow (green or blue on hover) */
    ctx.shadowBlur = 12 / scale;
    ctx.shadowColor = isHover ? "#00b3ff" : "#00ff9d";
    ctx.fillStyle = "#001b11";
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    /* bright outline */
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3 / scale;
    ctx.strokeStyle = isHover ? "#00b3ff" : "#00ff9d";
    ctx.stroke();

    /* text */
    ctx.fillStyle = isHover ? "#bfefff" : "#e0ffe9";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, node.x, node.y - (tags ? font * 0.4 : 0));
    // if (tags) {
    //   ctx.font = `${font * 0.8}px Sans-Serif`;
    //   ctx.fillText(tags, node.x, node.y + font * 0.8);
    // }

    node.__dims = { w, h }; // hit area
  };

  /* ---------- link painter with label ---------- */
  const drawLink = (link, ctx, scale) => {
    const { x: sx, y: sy } = link.source;
    const { x: tx, y: ty } = link.target;

    /* halo (blue) */
    ctx.lineWidth = 6 / scale;
    ctx.strokeStyle = "rgba(0, 200, 255, 0.6)";
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    /* core (white) */
    ctx.lineWidth = 2.2 / scale;
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    /* label in the middle */
    // if (link.label) {
    //   const midX = (sx + tx) / 2;
    //   const midY = (sy + ty) / 2;

    //   ctx.font = `${12 / scale}px Sans-Serif`;
    //   ctx.fillStyle = "#00e0ff";
    //   ctx.textAlign = "center";
    //   ctx.textBaseline = "middle";
    //   ctx.fillText(link.label, midX, midY - 6 / scale);
    // }
  };

  const drawNodeArea = (node, color, ctx) => {
    const d = node.__dims;
    if (!d) return;
    ctx.fillStyle = color;
    ctx.fillRect(node.x - d.w / 2, node.y - d.h / 2, d.w, d.h);
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <h1 className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-white z-10">
  📌 Notes MAP
</h1>


      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        /* visuals */
        backgroundColor="#000"
        nodeRelSize={0}
        linkCanvasObjectMode={() => "after"}
  linkCanvasObject={(link, ctx, scale) => {
    drawLink(link, ctx, scale);

    if (hoverLink === link && link.label) {
      const midX = (link.source.x + link.target.x) / 2;
      const midY = (link.source.y + link.target.y) / 2;

      ctx.save();
      ctx.font = `${14 / scale}px Sans-Serif`;
      ctx.fillStyle = "#00b3ff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(link.label.replace(/^ →\s*/, ""), midX, midY - 8 / scale);
      ctx.restore();
    }
  }}
  onLinkHover={setHoverLink}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={drawNodeArea}
        /* interactivity */
        onNodeHover={(node) => setHoverNode(node || null)}
        onNodeClick={(n) => navigate(`/dashboard?noteId=${n.id}`)}
        onMouseMove={(ev) => setMousePos({ x: ev.clientX, y: ev.clientY })}
        zoomPan={true}
        minZoom={0.5}
        maxZoom={1.5}
        /* disable physics */
        d3Force={() => ({})}
        warmupTicks={0}
        d3AlphaDecay={0}
      />

      {/* Tooltip */}
      {hoverNode && (
        <div
          className="absolute bg-gray-900 text-white text-sm p-3 rounded shadow-lg max-w-xs pointer-events-none z-20"
          style={{
            top: mousePos.y + 15,
            left: mousePos.x + 15,
          }}
        >
          <p className="font-bold">{hoverNode.title || "Untitled Note"}</p>

          {hoverNode.tags?.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Tags: {hoverNode.tags.join(", ")}
            </p>
          )}

          {hoverNode.sharedWith?.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-xs text-green-400">
                Shared With:
              </p>
              <ul className="list-disc ml-4">
                {hoverNode.sharedWith.map((u, i) => (
                  <li key={i} className="text-xs">
                    {u.username} ({u.accessLevel})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* polyfill for ctx.roundRect (older browsers) */
CanvasRenderingContext2D.prototype.roundRect ??= function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

import { useState } from "react";

type NodeType =
  | "Farmer"
  | "Farm"
  | "Crop"
  | "Production"
  | "Sales"
  | "Weather"
  | "Soil"
  | "CreditScore"
  | "Lender"
  | "Loan";

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  rel: string;
}

const NODE_COLORS: Record<NodeType, string> = {
  Farmer: "var(--color-primary)",
  Farm: "var(--color-primary-glow)",
  Crop: "oklch(0.65 0.18 130)",
  Production: "oklch(0.6 0.15 100)",
  Sales: "var(--color-gold)",
  Weather: "oklch(0.65 0.12 240)",
  Soil: "oklch(0.5 0.1 60)",
  CreditScore: "oklch(0.55 0.2 25)",
  Lender: "oklch(0.35 0.08 260)",
  Loan: "oklch(0.55 0.18 300)",
};

const nodes: GraphNode[] = [
  { id: "farmer", label: "Jean Claude", type: "Farmer", x: 400, y: 260 },
  { id: "farm", label: "Musanze Farm", type: "Farm", x: 250, y: 160 },
  { id: "maize", label: "Maize", type: "Crop", x: 120, y: 80 },
  { id: "beans", label: "Beans", type: "Crop", x: 80, y: 220 },
  { id: "prod", label: "Season A Yield", type: "Production", x: 130, y: 360 },
  { id: "sales", label: "Sales $430", type: "Sales", x: 300, y: 420 },
  { id: "weather", label: "Weather Signals", type: "Weather", x: 540, y: 420 },
  { id: "soil", label: "Soil Profile", type: "Soil", x: 560, y: 100 },
  { id: "score", label: "Score 78", type: "CreditScore", x: 680, y: 260 },
  { id: "lender", label: "SACCO Lender", type: "Lender", x: 820, y: 160 },
  { id: "loan", label: "Loan $500", type: "Loan", x: 820, y: 360 },
];

const edges: GraphEdge[] = [
  { from: "farmer", to: "farm", rel: "OWNS" },
  { from: "farm", to: "maize", rel: "PRODUCES" },
  { from: "farm", to: "beans", rel: "PRODUCES" },
  { from: "maize", to: "prod", rel: "GENERATED" },
  { from: "prod", to: "sales", rel: "GENERATED" },
  { from: "farm", to: "weather", rel: "AFFECTED_BY" },
  { from: "farm", to: "soil", rel: "AFFECTED_BY" },
  { from: "farmer", to: "score", rel: "ASSESSED_BY" },
  { from: "score", to: "lender", rel: "QUALIFIES_FOR" },
  { from: "farmer", to: "loan", rel: "APPLIED_FOR" },
  { from: "lender", to: "loan", rel: "QUALIFIES_FOR" },
];

export function KnowledgeGraph() {
  const [hover, setHover] = useState<string | null>(null);
  const nodeById = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/30 p-2 sm:p-4 shadow-[var(--shadow-soft)]">
      <svg viewBox="0 0 920 500" className="w-full h-auto">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-muted-foreground)" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = nodeById(e.from);
          const b = nodeById(e.to);
          const active = hover === e.from || hover === e.to;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <g key={i} opacity={hover && !active ? 0.25 : 1} className="transition-opacity">
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? "var(--color-primary)" : "var(--color-border)"}
                strokeWidth={active ? 2 : 1.5}
                markerEnd="url(#arrow)"
              />
              <text x={mx} y={my - 4} fontSize="10" textAnchor="middle" fill="var(--color-muted-foreground)" className="select-none pointer-events-none font-medium">
                {e.rel}
              </text>
            </g>
          );
        })}
        {nodes.map((n) => {
          const active = hover === n.id;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x},${n.y})`}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              className="cursor-pointer"
            >
              <circle r={active ? 34 : 30} fill={NODE_COLORS[n.type]} opacity={0.95} stroke="white" strokeWidth={3} />
              <text textAnchor="middle" y={4} fontSize="10" fill="white" className="font-semibold select-none pointer-events-none">
                {n.type}
              </text>
              <text textAnchor="middle" y={50} fontSize="11" fill="var(--color-foreground)" className="font-medium select-none pointer-events-none">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
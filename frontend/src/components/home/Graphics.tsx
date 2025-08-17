export function LanternAlleyGraphic() {
  return (
    <svg
      role="img"
      aria-label="Lantern garlands over a stitched, glowing map"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#0b0b24]"
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7b1" stopOpacity="1" />
          <stop offset="70%" stopColor="#ffd54d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffbc00" stopOpacity="0" />
        </radialGradient>
        <pattern id="stitch" width="8" height="8" patternUnits="userSpaceOnUse">
          <path
            d="M0 4 H8"
            stroke="#000"
            strokeWidth="2"
            strokeDasharray="2 4"
          />
        </pattern>
      </defs>

      {/* Lantern string */}
      <path
        d="M16 36 C120 12, 200 60, 304 24"
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Glowing lantern clusters */}
      {[
        { x: 60, y: 30 },
        { x: 150, y: 42 },
        { x: 235, y: 28 },
      ].map((p, i) => (
        <g key={i}>
          {[-16, 0, 16].map((dx, j) => (
            <g
              key={j}
              transform={`translate(${p.x + dx}, ${p.y + (j === 1 ? 8 : 0)})`}
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="14"
                stroke="#fff"
                strokeWidth="2"
              />
              <circle
                cx="0"
                cy="26"
                r="10"
                fill="#ffef99"
                stroke="#000"
                strokeWidth="2"
              />
              <circle cx="0" cy="26" r="20" fill="url(#glow)" />
            </g>
          ))}
        </g>
      ))}

      {/* Map with stitched border and glow */}
      <g transform="translate(40,70)">
        <rect
          x="0"
          y="0"
          width="240"
          height="110"
          fill="#234b4e"
          stroke="#000"
          strokeWidth="3"
          rx="8"
        />
        <rect
          x="3"
          y="3"
          width="234"
          height="104"
          fill="url(#stitch)"
          opacity="0.25"
          rx="6"
        />
        <rect
          x="10"
          y="10"
          width="220"
          height="90"
          fill="url(#glow)"
          opacity="0.8"
          rx="6"
        />
        {/* Treasure path */}
        <path
          d="M16 84 C 60 70, 100 60, 120 40 S 190 34, 208 22"
          stroke="#ffe082"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="208"
          cy="22"
          r="6"
          fill="#ffca28"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function KeepersClueGraphic() {
  return (
    <svg
      role="img"
      aria-label="Two gauze curtains with equal glow behind, different layouts"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#0b0b24]"
    >
      <defs>
        <radialGradient id="blob" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b3e5fc" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#b3e5fc" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b3e5fc" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Curtain rail */}
      <rect
        x="12"
        y="18"
        width="296"
        height="8"
        fill="#e0e0e0"
        stroke="#000"
        strokeWidth="2"
        rx="4"
      />

      {/* Gauze curtains */}
      <g>
        <rect
          x="20"
          y="26"
          width="130"
          height="150"
          fill="#e6f3ff"
          opacity="0.65"
          stroke="#000"
          strokeWidth="3"
          rx="6"
        />
        <rect
          x="170"
          y="26"
          width="130"
          height="150"
          fill="#e6f3ff"
          opacity="0.65"
          stroke="#000"
          strokeWidth="3"
          rx="6"
        />
      </g>

      {/* Equal glow, different patterns */}
      <g clipPath="url(#left)">
        <g transform="translate(20,26)">
          <GlowCluster variant="cluster" />
        </g>
      </g>
      <g clipPath="url(#right)">
        <g transform="translate(170,26)">
          <GlowCluster />
        </g>
      </g>

      <clipPath id="left">
        <rect x="20" y="26" width="130" height="150" rx="6" />
      </clipPath>
      <clipPath id="right">
        <rect x="170" y="26" width="130" height="150" rx="6" />
      </clipPath>

      {/* Keeper silhouette */}
      <g transform="translate(140,140)">
        <path
          d="M0 0 c20-8 20-32 0-40 c-20 8-20 32 0 40z"
          fill="#1a1a1a"
          opacity="0.5"
        />
      </g>

      {/* CSS blend mode helper */}
      <style>{`.eq-total { mix-blend-mode: screen; }`}</style>
    </svg>
  );
}

function GlowCluster({ variant = "cluster" as const }) {
  const parts =
    variant === "cluster"
      ? [
          { x: 26, y: 38, r: 30 },
          { x: 76, y: 72, r: 26 },
          { x: 54, y: 112, r: 22 },
        ]
      : [
          { x: 64, y: 50, r: 18 },
          { x: 92, y: 78, r: 18 },
          { x: 64, y: 106, r: 18 },
          { x: 36, y: 78, r: 18 },
        ];
  return (
    <g className="eq-total">
      {parts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.r} fill="url(#blob)" />
          <circle
            cx={p.x}
            cy={p.y}
            r={Math.max(6, p.r * 0.18)}
            fill="#e1f5fe"
            stroke="#000"
            strokeWidth="2"
          />
        </g>
      ))}
    </g>
  );
}

export function GateOfJarsGraphic() {
  return (
    <svg
      role="img"
      aria-label="Tent flap ajar with glowing firefly jars and a faint trail rune"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#0b0b24]"
    >
      <defs>
        <radialGradient id="jarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" />
          <stop offset="70%" stopColor="#fff59d" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fff176" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tent body */}
      <path
        d="M16 184 L160 24 L304 184 Z"
        fill="#2e3a59"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Tent opening flap */}
      <path d="M160 24 L168 184 L152 184 Z" fill="#000" opacity="0.7" />

      {/* Firefly jars */}
      <g transform="translate(96,120)">
        <Jar x={0} />
        <Jar x={56} />
        <Jar x={112} />
      </g>

      {/* Trail marker rune */}
      <g transform="translate(24,160)" opacity="0.85">
        <path
          d="M0 0 C 28 -10, 56 -6, 84 -14"
          stroke="#ffe082"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M84 -14 l -8 6 l 10 2 z"
          fill="#ffe082"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function Jar({ x = 0 }) {
  return (
    <g transform={`translate(${x},0)`}>
      {/* Jar lid */}
      <rect
        x="-12"
        y="-4"
        width="40"
        height="6"
        rx="2"
        fill="#cfd8dc"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Jar body */}
      <rect
        x="-16"
        y="2"
        width="48"
        height="58"
        rx="10"
        fill="#e3f2fd"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Fireflies */}
      {[
        { cx: 0, cy: 20 },
        { cx: 10, cy: 34 },
        { cx: -8, cy: 42 },
      ].map((f, i) => (
        <g key={i}>
          <circle
            cx={f.cx}
            cy={f.cy}
            r={3}
            fill="#fff59d"
            stroke="#000"
            strokeWidth="1.5"
          />
          <circle cx={f.cx} cy={f.cy} r={12} fill="url(#jarGlow)" />
        </g>
      ))}
    </g>
  );
}

export function BlueprintBenchGraphic() {
  return (
    <svg
      role="img"
      aria-label="Blueprint card on a timber bench with tray outline and bowl of counters"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#faf3dd]"
    >
      {/* Wood slats */}
      {[0, 40, 80, 120, 160].map((y, i) => (
        <rect
          key={i}
          x="0"
          y={y}
          width="320"
          height="32"
          fill={i % 2 ? "#d7b38c" : "#e0be98"}
        />
      ))}

      {/* Blueprint card */}
      <g transform="translate(20,20)">
        <rect
          x="0"
          y="0"
          width="140"
          height="100"
          rx="10"
          fill="#1e3a8a"
          stroke="#000"
          strokeWidth="3"
        />
        <rect
          x="10"
          y="10"
          width="120"
          height="80"
          rx="6"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        {/* Pattern outline */}
        <path
          d="M24 54 c18-22 38-22 56 0 c-18 10-38 10-56 0z"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Build tray template */}
      <g transform="translate(180,24)" opacity="0.5">
        <rect
          x="0"
          y="0"
          width="120"
          height="80"
          rx="8"
          fill="none"
          stroke="#000"
          strokeWidth="3"
        />
        {[0, 24, 48, 72, 96].map((x, i) => (
          <rect
            key={i}
            x={8 + x}
            y={8}
            width="16"
            height="28"
            rx="3"
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
        ))}
        {[0, 24, 48, 72, 96].map((x, i) => (
          <rect
            key={`b-${i}`}
            x={8 + x}
            y={44}
            width="16"
            height="28"
            rx="3"
            fill="#fff"
            stroke="#000"
            strokeWidth="2"
          />
        ))}
      </g>

      {/* Counter bowl */}
      <g transform="translate(220,140)">
        <ellipse
          cx="0"
          cy="0"
          rx="44"
          ry="14"
          fill="#b08968"
          stroke="#000"
          strokeWidth="3"
        />
        <ellipse
          cx="0"
          cy="-8"
          rx="44"
          ry="14"
          fill="#d4a373"
          stroke="#000"
          strokeWidth="3"
        />
        {[
          [-12, -10],
          [0, -12],
          [12, -10],
          [-6, -6],
          [6, -6],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={6}
            fill="#111"
            stroke="#000"
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}

export function WobblyBridgeCartGraphic() {
  return (
    <svg
      role="img"
      aria-label="Geary cart with a tilting balance plank and shifting crates"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#eef7ff]"
    >
      {/* Cart base */}
      <rect
        x="36"
        y="120"
        width="248"
        height="24"
        rx="6"
        fill="#cfd8dc"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Cart wheels */}
      <circle
        cx="88"
        cy="156"
        r="16"
        fill="#90a4ae"
        stroke="#000"
        strokeWidth="3"
      />
      <circle
        cx="232"
        cy="156"
        r="16"
        fill="#90a4ae"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Mechanical gears */}
      <Gear cx={160} cy={132} r={10} teeth={8} />

      {/* Balance pivot */}
      <rect
        x="154"
        y="86"
        width="12"
        height="36"
        fill="#6d4c41"
        stroke="#000"
        strokeWidth="3"
        rx="3"
      />

      {/* Tilted plank with crates */}
      <g transform="translate(160,96) rotate(-12)">
        <rect
          x="-100"
          y="-10"
          width="200"
          height="20"
          fill="#a1887f"
          stroke="#000"
          strokeWidth="3"
          rx="6"
        />
        {/* Heavy crates (left side) */}
        <rect
          x="-72"
          y="-20"
          width="28"
          height="20"
          fill="#8d6e63"
          stroke="#000"
          strokeWidth="3"
        />
        <rect
          x="-38"
          y="-24"
          width="28"
          height="24"
          fill="#8d6e63"
          stroke="#000"
          strokeWidth="3"
        />
        {/* Light crate (right side) */}
        <rect
          x="40"
          y="-14"
          width="28"
          height="14"
          fill="#8d6e63"
          stroke="#000"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

export function Gear({
  cx,
  cy,
  r,
  teeth = 8,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth?: number;
}) {
  const toothAngle = (2 * Math.PI) / teeth;
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = i * toothAngle;
    const a2 = a1 + toothAngle / 2;
    const outer = r + 6;
    const inner = r;
    points.push(`${cx + inner * Math.cos(a1)},${cy + inner * Math.sin(a1)}`);
    points.push(`${cx + outer * Math.cos(a2)},${cy + outer * Math.sin(a2)}`);
  }
  return (
    <g>
      <polygon
        points={points.join(" ")}
        fill="#b0bec5"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r - 2}
        fill="#eceff1"
        stroke="#000"
        strokeWidth="2"
      />
    </g>
  );
}

export function SplitDecisionGraphic() {
  return (
    <svg
      role="img"
      aria-label="Two soft bags flanking a glowing supply chest"
      viewBox="0 0 320 200"
      className="w-full h-56 rounded-xl border-4 border-black shadow-[6px_6px_0_#000] bg-[#f3f7fb]"
    >
      <defs>
        <radialGradient id="pileGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3cd" />
          <stop offset="70%" stopColor="#ffe8a1" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffefc1" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Supply bags */}
      <BagSack x={56} />
      <BagSack x={264} flip />

      {/* Treasure chest */}
      <g transform="translate(160,116)">
        <rect
          x="-36"
          y="-16"
          width="72"
          height="32"
          rx="6"
          fill="#8d6e63"
          stroke="#000"
          strokeWidth="3"
        />
        <rect
          x="-42"
          y="-22"
          width="84"
          height="16"
          rx="6"
          fill="#a1887f"
          stroke="#000"
          strokeWidth="3"
        />
        <circle cx="0" cy="-4" r="46" fill="url(#pileGlow)" />
      </g>

      {/* Cart handle */}
      <g transform="translate(270,170)">
        <rect
          x="0"
          y="-4"
          width="36"
          height="8"
          rx="4"
          fill="#616161"
          stroke="#000"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function BagSack({ x, flip = false }: { x: number; flip?: boolean }) {
  const scale = flip ? -1 : 1;
  return (
    <g transform={`translate(${x},136) scale(${scale},1)`}>
      <path
        d="M0 0 c-18-10 -18-22 0-32 c18 10 18 22 0 32z"
        fill="#795548"
        stroke="#000"
        strokeWidth="3"
      />
      <path
        d="M0 0 c-26 6 -42 18 -42 36 c0 18 16 32 42 32 c26 0 42-14 42-32 c0-18 -16-30 -42-36z"
        fill="#a1887f"
        stroke="#000"
        strokeWidth="3"
      />
      <line x1="-10" y1="16" x2="10" y2="16" stroke="#000" strokeWidth="3" />
    </g>
  );
}

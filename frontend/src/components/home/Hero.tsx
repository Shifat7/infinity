import { Parallax } from "react-parallax";
import { motion, useReducedMotion } from "framer-motion";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <Parallax strength={240} className="w-full">
      <section className="relative w-full h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Soft palette background splashes */}
        <div
          className="absolute inset-0 -z-10 pointer-events-none opacity-70"
          style={{
            background: `
              radial-gradient(600px 300px at 12% 18%, var(--squish-me-purple) 0%, transparent 60%),
              radial-gradient(520px 260px at 88% 20%, var(--playful-pink) 0%, transparent 60%),
              radial-gradient(720px 320px at 50% 92%, var(--container-blue) 0%, transparent 65%)
            `,
          }}
        />

        {/* Background layers */}
        <div className="halftone-wash opacity-40 mix-blend-multiply" />
        <div className="speed-lines opacity-50 mix-blend-multiply" />

        {/* Foreground title stack */}
        <div className="relative z-10 flex flex-col items-center text-center select-none">
          <motion.h1
            initial={{ y: 12, scale: 0.98, rotate: -0.5 }}
            animate={{ y: 0, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            whileHover={{ rotate: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inked inked-outline palette-loop text-[10rem]"
            style={
              {
                ["--ink-x" as any]: "12px",
                ["--ink-y" as any]: "12px",
                ["--palette-dur" as any]: "10s",
              } as React.CSSProperties
            }
          >
            SuperNova
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="inked mt-8 palette-loop text-[8rem]"
            style={
              {
                ["--ink-x" as any]: "9px",
                ["--ink-y" as any]: "9px",
                ["--palette-dur" as any]: "12s",
              } as React.CSSProperties
            }
          >
            Adventures
          </motion.h2>
        </div>

        {/* Comic bang stickers (more variety + sizes) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-left: POW! (largest) */}
          <StickerBurst
            text="POW!"
            size={160}
            colors={["var(--puffy-yellow)", "var(--playful-pink)"]}
            style={{ top: 64, left: 64 }}
            rotate={-6}
            idleBob={!reduce}
          />
          {/* Top-right: BAM! (medium) */}
          <StickerBurst
            text="BAM!"
            size={120}
            colors={["var(--squish-me-purple)", "var(--container-blue)"]}
            style={{ top: 36, right: 72 }}
            rotate={4}
            spikes={11}
            idleBob={!reduce}
          />
          {/* Bottom-right: ZAP! (medium-small) */}
          <StickerBurst
            text="ZAP!"
            size={110}
            colors={["var(--soft-green)", "var(--puffy-yellow)"]}
            style={{ bottom: 54, right: 36 }}
            rotate={8}
            spikes={10}
            idleBob={!reduce}
          />
          {/* Bottom-left: WHAM! (small) */}
          <StickerBurst
            text="WHAM!"
            size={100}
            colors={["var(--playful-pink)", "var(--squish-me-purple)"]}
            style={{ bottom: 40, left: 120 }}
            rotate={-10}
            spikes={12}
            idleBob={!reduce}
          />
        </div>
      </section>
    </Parallax>
  );
}

// StickerBurst: comic-style jagged sticker with halo + wiggle effects
function StickerBurst({
  text,
  size = 120,
  colors = ["var(--puffy-yellow)", "white"],
  spikes = 12,
  rotate = 0,
  idleBob = true,
  style,
}: {
  text: string;
  size?: number;
  colors?: [string, string] | string[];
  spikes?: number;
  rotate?: number;
  idleBob?: boolean;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const s = Math.max(80, size);
  const cx = s / 2;
  const cy = s / 2;
  const outer = s * 0.48;
  const inner = s * 0.3;

  const points = starPoints(cx, cy, spikes, outer, inner);

  return (
    <motion.div
      className="absolute pointer-events-auto select-none"
      style={style}
      initial={reduce ? false : { y: -2, rotate }}
      animate={
        reduce || !idleBob
          ? { rotate }
          : {
              y: [-2, 2, -2],
              rotate: [rotate, rotate + 1.5, rotate],
              transition: {
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
      }
      whileHover={{ scale: 1.06, rotate: rotate + (rotate > 0 ? 2 : -2) }}
      whileTap={{ scale: 0.96 }}
      aria-hidden
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <defs>
          <linearGradient
            id={`${text}-grad`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1] ?? colors[0]} />
          </linearGradient>
        </defs>

        {/* Main burst */}
        <polygon
          points={points}
          fill={`url(#${text}-grad)`}
          stroke="#000"
          strokeWidth={Math.max(4, s * 0.06)}
          strokeLinejoin="round"
        />

        {/* Comic text with outline */}
        <text
          x={cx}
          y={cy + s * 0.06}
          textAnchor="middle"
          fontSize={s * 0.25}
          fontWeight={900}
          stroke="#000"
          strokeWidth={Math.max(3, s * 0.05)}
          strokeLinejoin="round"
          fill="none"
          style={{ letterSpacing: "1px" }}
        >
          {text}
        </text>
        <text
          x={cx}
          y={cy + s * 0.06}
          textAnchor="middle"
          fontSize={s * 0.25}
          fontWeight={900}
          fill="#fff"
          style={{ letterSpacing: "1px" }}
        >
          {text}
        </text>
      </svg>
    </motion.div>
  );
}

// Utilities
function fmt(n: number, dp = 3): string {
  // Format number with fixed decimal places, removing trailing zeros
  const v = Math.abs(n) < 1e-10 ? 0 : n;
  let s = v.toFixed(dp);
  s = s.replace(/\.?0+$/, "");
  if (s === "-0") s = "0";
  return s;
}

function starPoints(
  cx: number,
  cy: number,
  spikes: number,
  outer: number,
  inner: number,
  dp = 3
): string {
  const step = Math.PI / spikes;
  let rot = -Math.PI / 2;
  const pts: string[] = [];
  for (let i = 0; i < spikes; i++) {
    // outer
    pts.push(
      `${fmt(cx + Math.cos(rot) * outer, dp)},${fmt(
        cy + Math.sin(rot) * outer,
        dp
      )}`
    );
    rot += step;
    // inner
    pts.push(
      `${fmt(cx + Math.cos(rot) * inner, dp)},${fmt(
        cy + Math.sin(rot) * inner,
        dp
      )}`
    );
    rot += step;
  }
  return pts.join(" ");
}

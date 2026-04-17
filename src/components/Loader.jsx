import { useState, useEffect, useRef, useMemo } from “react”;
import { motion, AnimatePresence } from “framer-motion”;

/*
SOON Production — Loading Screen v2

What’s new vs the original:

- Ambient floating dust particles (like dust in a record store)
- Vinyl reflection/sheen that shifts as it spins
- Tonearm drops more realistically with a bounce
- Progress ring has a red glow trail
- Crate messages are more cinematic with staggered letter reveals
- Exit: vinyl flies toward camera (scale up) and dissolves into the page
- “Skip” option in bottom corner for returning visitors
- Scanline effect across the whole screen
- The whole thing feels like a film projector warming up
  */

const CRATE_MESSAGES = [
“Digging through the crates…”,
“Chopping samples…”,
“Dusting off the vinyl…”,
“Tuning the MPC…”,
“Setting the needle…”,
“Something out of nothing…”,
];

// ── DUST PARTICLES ───────────────────────────────────────────────────
const DustParticles = ({ count = 30 }) => {
const particles = useMemo(() =>
Array.from({ length: count }, (_, i) => ({
id: i,
x: Math.random() * 100,
y: Math.random() * 100,
size: 1 + Math.random() * 2,
duration: 8 + Math.random() * 12,
delay: Math.random() * 5,
opacity: 0.03 + Math.random() * 0.08,
})), [count]
);

return (
<div style={{ position: “absolute”, inset: 0, overflow: “hidden”, pointerEvents: “none” }}>
{particles.map(p => (
<motion.div
key={p.id}
initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
animate={{
x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 20}vw`],
y: [`${p.y}vh`, `${p.y - 30 - Math.random() * 20}vh`],
opacity: [0, p.opacity, p.opacity, 0],
}}
transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: “linear” }}
style={{
position: “absolute”, width: p.size, height: p.size,
borderRadius: “50%”, background: “rgba(221,216,204,0.6)”,
}}
/>
))}
</div>
);
};

// ── GLITCH TEXT ───────────────────────────────────────────────────────
const GlitchText = ({ text, active }) => {
const [display, setDisplay] = useState(text);
const chars = “ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$”;
const intervalRef = useRef(null);

useEffect(() => {
if (!active) { setDisplay(text); return; }
let iteration = 0;
clearInterval(intervalRef.current);
intervalRef.current = setInterval(() => {
setDisplay(
text.split(””).map((char, i) => {
if (char === “ “) return “ “;
if (i < iteration) return text[i];
return chars[Math.floor(Math.random() * chars.length)];
}).join(””)
);
iteration += 0.5;
if (iteration >= text.length) clearInterval(intervalRef.current);
}, 35);
return () => clearInterval(intervalRef.current);
}, [text, active]);

return (
<span style={{ fontFamily: “‘Bebas Neue’,sans-serif”, letterSpacing: “0.3em” }}>
{display}
</span>
);
};

// ── VINYL SVG (White Label Test Press) ───────────────────────────────
const VinylSVG = ({ progress, spinning, discRef }) => {
const r = 118;
const circ = 2 * Math.PI * r;

return (
<svg width=“260” height=“260” viewBox=“0 0 260 260” style={{ overflow: “visible” }}>
<defs>
<radialGradient id="vinylSheen" cx="40%" cy="35%" r="62%">
<stop offset="0%" stopColor="#1a1a1a" />
<stop offset="60%" stopColor="#0a0a0a" />
<stop offset="100%" stopColor="#050505" />
</radialGradient>
<radialGradient id="sheenHighlight" cx="38%" cy="32%" r="35%" fx="35%" fy="28%">
<stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
<stop offset="40%" stopColor="rgba(255,255,255,0.03)" />
<stop offset="100%" stopColor="rgba(255,255,255,0)" />
</radialGradient>
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur stdDeviation="4" result="blur" />
<feMerge>
<feMergeNode in="blur" />
<feMergeNode in="SourceGraphic" />
</feMerge>
</filter>
<filter id="vinylShadow">
<feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(0,0,0,0.5)" />
</filter>
</defs>

```
  {/* Vinyl disc group — spins via discRef */}
  <g ref={discRef} filter="url(#vinylShadow)">
    {/* Main disc */}
    <circle cx="130" cy="130" r={r} fill="url(#vinylSheen)" />

    {/* Grooves — minimal */}
    {[98, 78].map((gr, i) => (
      <circle key={i} cx="130" cy="130" r={gr} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.4" />
    ))}

    {/* White label */}
    <circle cx="130" cy="130" r="46" fill="#d8d0c0" />
    <circle cx="130" cy="130" r="46" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />

    {/* Handwritten-style text */}
    <text x="130" y="116" textAnchor="middle" dominantBaseline="middle"
      style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 7, fill: "rgba(30,25,20,0.5)", letterSpacing: "0.05em" }}>
      test press — not for sale
    </text>
    <line x1="106" y1="121" x2="154" y2="121" stroke="rgba(0,0,0,0.06)" strokeWidth="0.3" />
    <text x="130" y="132" textAnchor="middle" dominantBaseline="middle"
      style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 17, fill: "rgba(30,25,20,0.8)", letterSpacing: "0.05em" }}>
      SOON
    </text>
    <text x="130" y="145" textAnchor="middle" dominantBaseline="middle"
      style={{ fontFamily: "'Courier Prime',monospace", fontSize: 5, fill: "rgba(30,25,20,0.35)", letterSpacing: "0.1em" }}>
      BK, NY · 001
    </text>

    {/* Red dot — hand-marked identifier */}
    <circle cx="154" cy="112" r="2.5" fill="var(--red)" opacity="0.7" />

    {/* Center hole */}
    <circle cx="130" cy="130" r="6" fill="var(--black)" />
  </g>

  {/* Sheen reflection — fixed in upper-left, vinyl spins underneath */}
  <ellipse cx="110" cy="108" rx="55" ry="45" fill="url(#sheenHighlight)" />

  {/* Progress ring (static, over spinning vinyl) */}
  <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(221,216,204,0.04)" strokeWidth={3} transform="rotate(-90 130 130)" />
  <circle cx="130" cy="130" r={r} fill="none" stroke="var(--red)" strokeWidth={3}
    strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
    strokeLinecap="round" transform="rotate(-90 130 130)"
    filter="url(#glow)" style={{ transition: "stroke-dashoffset 0.12s linear" }}
  />

  {/* Tonearm */}
  <motion.g
    initial={{ rotate: -25, opacity: 0 }}
    animate={{
      rotate: progress > 0.05 ? -2 + progress * 10 : -25,
      opacity: progress > 0.05 ? 1 : 0,
    }}
    transition={{
      rotate: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.6 },
    }}
    style={{ transformOrigin: "228px 32px" }}
  >
    {/* Pivot base */}
    <circle cx="228" cy="32" r="8" fill="#1a1a1a" stroke="rgba(221,216,204,0.1)" strokeWidth={0.8} />
    <circle cx="228" cy="32" r="3" fill="var(--red)" />
    {/* Arm */}
    <line x1="228" y1="32" x2="172" y2="140" stroke="rgba(221,216,204,0.5)" strokeWidth={2.2} strokeLinecap="round" />
    {/* Headshell */}
    <line x1="172" y1="140" x2="158" y2="158" stroke="rgba(221,216,204,0.4)" strokeWidth={1.8} strokeLinecap="round" />
    {/* Cartridge */}
    <rect x="153" y="156" width="8" height="5" rx="1" fill="rgba(221,216,204,0.3)" transform="rotate(38 157 158)" />
    {/* Stylus tip */}
    <circle cx="155" cy="162" r="1.2" fill="var(--red)" />
  </motion.g>
</svg>
```

);
};

// ══════════════════════════════════════════════════════════════════════
// LOADER
// ══════════════════════════════════════════════════════════════════════
export default function Loader({ onDone }) => {
const [progress, setProgress] = useState(0);
const [msgIndex, setMsgIndex] = useState(0);
const [glitching, setGlitching] = useState(false);
const [phase, setPhase] = useState(“loading”); // loading | glitch | exit
const rotation = useRef(0);
const animRef = useRef(null);
const lastTime = useRef(null);
const vinylRef = useRef(null);

// Progress ticker
useEffect(() => {
const t = setInterval(() => {
setProgress(p => {
const next = p + (Math.random() * 0.011 + 0.005);
if (next >= 1) {
clearInterval(t);
setTimeout(() => {
setPhase(“glitch”);
setGlitching(true);
setTimeout(() => {
setPhase(“exit”);
}, 800);
}, 500);
return 1;
}
return next;
});
}, 80);
return () => clearInterval(t);
}, []);

// Cycle messages
useEffect(() => {
const idx = Math.min(Math.floor(progress / (1 / CRATE_MESSAGES.length)), CRATE_MESSAGES.length - 1);
setMsgIndex(idx);
}, [progress]);

// Spin vinyl via rAF (smooth, not tied to React renders)
useEffect(() => {
if (progress < 0.08) return;
const animate = (time) => {
if (lastTime.current) {
const delta = time - lastTime.current;
const rpm = 18 + progress * 15;
rotation.current = (rotation.current + (rpm / 60) * (delta / 1000) * 360) % 360;
if (vinylRef.current) {
vinylRef.current.setAttribute(“transform”, `rotate(${rotation.current} 130 130)`);
}
}
lastTime.current = time;
animRef.current = requestAnimationFrame(animate);
};
animRef.current = requestAnimationFrame(animate);
return () => cancelAnimationFrame(animRef.current);
}, [progress > 0.08, progress]);

const pct = Math.round(Math.min(progress * 100, 100));

return (
<motion.div
initial={{ opacity: 1 }}
animate={phase === “exit” ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1 }}
transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
onAnimationComplete={() => { if (phase === “exit”) onDone(); }}
style={{
position: “fixed”, inset: 0, background: “var(–black)”, zIndex: 9999,
display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”,
animation: “flicker 4s ease-in-out infinite”,
}}
>
{/* Scanlines */}
<div style={{
position: “absolute”, inset: 0, pointerEvents: “none”,
background: “repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)”,
zIndex: 2,
}} />

```
  {/* Moving scanline */}
  <div style={{
    position: "absolute", left: 0, right: 0, height: 1,
    background: "linear-gradient(to right, transparent, rgba(176,42,26,0.1), transparent)",
    animation: "scanline 6s linear infinite",
    zIndex: 3, pointerEvents: "none",
  }} />

  {/* Dust particles */}
  <DustParticles count={25} />

  {/* Vinyl */}
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={phase === "exit"
      ? { scale: 2.5, opacity: 0, y: -40 }
      : { scale: 1, opacity: 1, y: 0 }
    }
    transition={phase === "exit"
      ? { duration: 1, ease: [0.16, 1, 0.3, 1] }
      : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
    style={{ marginBottom: 36, position: "relative", zIndex: 4 }}
  >
    <div>
      <VinylSVG progress={progress} spinning={progress > 0.08} discRef={vinylRef} />
    </div>
  </motion.div>

  {/* Title + tagline */}
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={phase === "exit"
      ? { opacity: 0, y: -20 }
      : { opacity: 1, y: 0 }
    }
    transition={{ delay: phase === "exit" ? 0 : 0.3, duration: 0.8 }}
    style={{ textAlign: "center", marginBottom: 24, position: "relative", zIndex: 4 }}
  >
    <div style={{ fontSize: "clamp(32px,7vw,56px)", lineHeight: 1, marginBottom: 8 }}>
      <GlitchText text="SOON PRODUCTION" active={glitching} />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      style={{
        fontFamily: "'IM Fell English',serif", fontStyle: "italic",
        fontSize: "clamp(12px,2vw,16px)", color: "var(--dust)",
        letterSpacing: "0.12em",
      }}
    >
      Something Out of Nothing
    </motion.div>
  </motion.div>

  {/* Rotating crate message */}
  <div style={{ height: 20, marginBottom: 24, overflow: "hidden", position: "relative", zIndex: 4 }}>
    <AnimatePresence mode="wait">
      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: "clamp(10px,1.4vw,12px)", letterSpacing: "0.25em",
          textTransform: "uppercase", color: "rgba(122,112,96,0.45)", textAlign: "center",
        }}
      >
        {CRATE_MESSAGES[msgIndex]}
      </motion.p>
    </AnimatePresence>
  </div>

  {/* Progress bar */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    style={{ display: "flex", alignItems: "center", gap: 16, width: "min(220px,65vw)", position: "relative", zIndex: 4 }}
  >
    <div style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.08)", position: "relative", borderRadius: 1 }}>
      <motion.div
        style={{ position: "absolute", top: 0, left: 0, height: "100%", background: "var(--red)", borderRadius: 1 }}
        animate={{ width: `${pct}%` }}
        transition={{ ease: "linear", duration: 0.1 }}
      />
      {/* Glow dot at end of progress */}
      <motion.div
        style={{
          position: "absolute", top: -2, height: 5, width: 5, borderRadius: "50%",
          background: "var(--red)", boxShadow: "0 0 8px rgba(176,42,26,0.6)",
        }}
        animate={{ left: `${pct}%` }}
        transition={{ ease: "linear", duration: 0.1 }}
      />
    </div>
    <span style={{
      fontSize: "clamp(10px,1.3vw,12px)", letterSpacing: "0.2em",
      color: "rgba(122,112,96,0.4)", fontVariantNumeric: "tabular-nums",
      minWidth: 32, textAlign: "right",
    }}>
      {pct}%
    </span>
  </motion.div>

  {/* Skip button */}
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: progress > 0.3 ? 1 : 0 }}
    onClick={onDone}
    style={{
      position: "absolute", bottom: 32, right: 32,
      background: "none", border: "none",
      fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase",
      color: "rgba(122,112,96,0.2)", zIndex: 5,
      transition: "color 0.3s",
    }}
    onMouseEnter={e => e.currentTarget.style.color = "rgba(122,112,96,0.5)"}
    onMouseLeave={e => e.currentTarget.style.color = "rgba(122,112,96,0.2)"}
  >
    Skip →
  </motion.button>

  {/* Year stamp */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.15 }}
    transition={{ delay: 1 }}
    style={{
      position: "absolute", bottom: 32, left: 32,
      fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase",
      color: "var(--dust)", zIndex: 4,
    }}
  >
    Est. 2025 · Brooklyn, NY
  </motion.div>
</motion.div>
```

);
}
import { useState, useEffect, useRef, useCallback } from “react”;
import { motion, AnimatePresence, useInView } from “framer-motion”;

/*
SOON Production — Sound Kits & Sample Packs

Store page for selling drum kits, sample chops, and loop packs.

- Hero with featured pack
- Pack cards with audio preview of individual sounds
- Contents breakdown (what’s inside: kicks, snares, hats, etc.)
- Waveform mini-player for previewing one-shots
- “What’s in the crate” expandable sections
- Free pack as email list lead magnet
- Pack detail modal with full contents list
  */

// ── DATA ──────────────────────────────────────────────────────────────
const PACKS = [
{
id: “sk001”,
title: “Crate Dust Vol. 1”,
subtitle: “The Foundation Kit”,
type: “Drum Kit”,
price: 15,
originalPrice: null,
description: “50 one-shots built from scratch on the MPC Live 3. Dusty kicks, cracked snares, chopped hats, and vinyl textures. The drums behind the first 12 beats in the catalogue.”,
featured: true,
free: false,
colors: [”#1a1008”, “#2e1c10”, “#0e0c06”],
contents: [
{ category: “Kicks”, count: 12, description: “Vinyl-bodied, low-end heavy” },
{ category: “Snares”, count: 10, description: “Cracked, layered, MPC-processed” },
{ category: “Hi-Hats”, count: 8, description: “Chopped from vinyl, open & closed” },
{ category: “Percs”, count: 8, description: “Shakers, rims, finger snaps” },
{ category: “Textures”, count: 6, description: “Vinyl crackle, tape hiss, room tone” },
{ category: “FX”, count: 6, description: “Transitions, sweeps, hits” },
],
totalSounds: 50,
format: “WAV 24-bit”,
compatible: “Any DAW / MPC / SP-404”,
tags: [“Soul”, “Boom Bap”, “Lo-Fi”],
},
{
id: “sk002”,
title: “Sunday Chops”,
subtitle: “Sample Loop Pack”,
type: “Loop Pack”,
price: 20,
originalPrice: null,
description: “15 original melodic loops chopped and arranged on the MPC. Soul, jazz, and lo-fi textures. Each loop comes with stem separations and BPM/key labels.”,
featured: false,
free: false,
colors: [”#0e1018”, “#1a1c28”, “#08090e”],
contents: [
{ category: “Soul Loops”, count: 5, description: “Warm, vinyl-sourced chord progressions” },
{ category: “Jazz Loops”, count: 4, description: “Rhodes, keys, muted guitar lines” },
{ category: “Lo-Fi Loops”, count: 3, description: “Degraded, filtered, tape-warped” },
{ category: “Bass Loops”, count: 3, description: “Sub lines and walking bass phrases” },
],
totalSounds: 15,
format: “WAV 24-bit”,
compatible: “Any DAW / MPC / SP-404”,
tags: [“Soul”, “Jazz”, “Lo-Fi”],
},
{
id: “sk003”,
title: “First Listen Pack”,
subtitle: “Free Starter Kit”,
type: “Drum Kit”,
price: 0,
originalPrice: null,
description: “10 free one-shots from the SOON Production vault. A taste of the sound — kicks, snares, and textures. Yours free when you join the email list.”,
featured: false,
free: true,
colors: [”#181410”, “#241e14”, “#0e0c08”],
contents: [
{ category: “Kicks”, count: 3, description: “From the Crate Dust sessions” },
{ category: “Snares”, count: 3, description: “Cracked and layered” },
{ category: “Textures”, count: 4, description: “Vinyl, tape, room ambience” },
],
totalSounds: 10,
format: “WAV 24-bit”,
compatible: “Any DAW / MPC / SP-404”,
tags: [“Free”, “Starter”],
},
{
id: “sk004”,
title: “MPC Breaks Vol. 1”,
subtitle: “Drum Break Chops”,
type: “Drum Kit”,
price: 12,
originalPrice: null,
description: “25 drum break chops — classic breaks re-chopped and re-sequenced through the MPC. Ready to flip into your own patterns.”,
featured: false,
free: false,
colors: [”#141010”, “#201818”, “#0c0808”],
contents: [
{ category: “Break Chops”, count: 15, description: “Sliced from classic breaks” },
{ category: “Full Loops”, count: 5, description: “2-4 bar patterns, tempo-labeled” },
{ category: “One-Shots”, count: 5, description: “Isolated hits from the breaks” },
],
totalSounds: 25,
format: “WAV 24-bit”,
compatible: “Any DAW / MPC / SP-404”,
tags: [“Boom Bap”, “Breaks”],
},
];

// ── SOUND PREVIEW BAR (simulated) ────────────────────────────────────
const SoundPreview = ({ name, index }) => {
const [playing, setPlaying] = useState(false);
const [heights] = useState(() => Array.from({ length: 16 }, () => 4 + Math.random() * 14));

return (
<div
onClick={() => setPlaying(p => !p)}
style={{
display: “flex”, alignItems: “center”, gap: 10, padding: “8px 10px”,
borderRadius: 6, border: `1px solid ${playing ? "rgba(176,42,26,0.3)" : "rgba(221,216,204,0.04)"}`,
background: playing ? “rgba(176,42,26,0.04)” : “transparent”,
cursor: “pointer”, transition: “all 0.2s”,
}}
>
{/* Play/stop */}
<div style={{
width: 22, height: 22, borderRadius: “50%”, flexShrink: 0,
border: `1px solid ${playing ? "var(--red)" : "rgba(221,216,204,0.12)"}`,
background: playing ? “var(–red)” : “transparent”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
transition: “all 0.2s”,
}}>
{playing
? <span style={{ width: 6, height: 6, borderRadius: 1, background: “white” }} />
: <svg width="6" height="8" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="var(--offwhite)" /></svg>
}
</div>
{/* Name */}
<span style={{ fontSize: 10, color: playing ? “var(–offwhite)” : “var(–dust)”, letterSpacing: “0.05em”, flex: 1, minWidth: 0, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>{name}</span>
{/* Mini waveform */}
<div style={{ display: “flex”, alignItems: “center”, gap: 1, height: 18, flexShrink: 0 }}>
{heights.map((h, i) => (
<motion.div
key={i}
style={{ width: 1.5, borderRadius: 1, background: playing ? “var(–red)” : “rgba(122,112,96,0.2)” }}
animate={playing ? { height: [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3] } : { height: h }}
transition={playing ? { duration: 0.4 + Math.random() * 0.3, repeat: Infinity, ease: “easeInOut”, delay: i * 0.02 } : { duration: 0.2 }}
/>
))}
</div>
</div>
);
};

// ── PACK CARD ────────────────────────────────────────────────────────
const PackCard = ({ pack, onOpen }) => {
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: “-40px” });
const [hovered, setHovered] = useState(false);

const sampleNames = pack.contents.flatMap(c =>
Array.from({ length: Math.min(c.count, 2) }, (_, i) => `${c.category.replace(/s$/, "")}_${String(i + 1).padStart(2, "0")}`)
).slice(0, 4);

return (
<motion.div
ref={ref}
initial={{ opacity: 0, y: 24 }}
animate={inView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
style={{
border: `1px solid ${hovered ? "rgba(176,42,26,0.2)" : "rgba(221,216,204,0.06)"}`,
borderRadius: 12, overflow: “hidden”,
background: “rgba(221,216,204,0.015)”,
transition: “border-color 0.3s”,
}}
>
{/* Color header */}
<div style={{ position: “relative”, height: 120, overflow: “hidden” }}>
<motion.div
animate={{ scale: hovered ? 1.04 : 1 }}
transition={{ duration: 0.6 }}
style={{ position: “absolute”, inset: 0, background: `linear-gradient(135deg,${pack.colors[0]},${pack.colors[1]},${pack.colors[2]})` }}
/>
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to top, rgba(8,8,6,0.85) 0%, transparent 60%)” }} />

```
    {/* Badges */}
    <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
      <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, border: "1px solid rgba(221,216,204,0.1)", color: "var(--dust)", background: "rgba(8,8,6,0.5)", backdropFilter: "blur(4px)" }}>{pack.type}</span>
      {pack.free && (
        <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "rgba(176,42,26,0.2)", border: "1px solid rgba(176,42,26,0.35)", color: "var(--red)" }}>Free</span>
      )}
    </div>

    {/* Sound count */}
    <div style={{ position: "absolute", top: 12, right: 12, fontSize: 8, letterSpacing: "0.15em", color: "rgba(221,216,204,0.3)" }}>{pack.totalSounds} sounds</div>

    {/* Title */}
    <div style={{ position: "absolute", bottom: 12, left: 14 }}>
      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(16px,2.5vw,20px)", lineHeight: 1.1, marginBottom: 2 }}>{pack.title}</div>
      <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--dust)" }}>{pack.subtitle}</div>
    </div>
  </div>

  <div style={{ padding: "16px 16px 18px" }}>
    {/* Description */}
    <p style={{ fontSize: 11, color: "var(--dust)", lineHeight: 1.8, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{pack.description}</p>

    {/* Contents preview */}
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
      {pack.contents.map(c => (
        <span key={c.category} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, border: "1px solid rgba(221,216,204,0.06)", color: "var(--dust)" }}>
          {c.count} {c.category}
        </span>
      ))}
    </div>

    {/* Sound previews */}
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
      {sampleNames.map((name, i) => (
        <SoundPreview key={name} name={name} index={i} />
      ))}
    </div>

    {/* Footer */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        {pack.free ? (
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "var(--red)", lineHeight: 1 }}>FREE</div>
        ) : (
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, lineHeight: 1 }}>${pack.price}</div>
        )}
        <div style={{ fontSize: 9, letterSpacing: "0.12em", color: "var(--dust)" }}>{pack.format}</div>
      </div>
      <button
        onClick={() => onOpen(pack)}
        style={{
          padding: "10px 20px",
          background: pack.free ? "transparent" : "var(--red)",
          border: pack.free ? "1px solid var(--red)" : "none",
          borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 13, letterSpacing: "0.15em",
          color: "var(--offwhite)", transition: "opacity 0.2s",
        }}
      >
        {pack.free ? "Get Free" : "View Pack"}
      </button>
    </div>
  </div>
</motion.div>
```

);
};

// ── PACK DETAIL MODAL ────────────────────────────────────────────────
const PackModal = ({ pack, onClose }) => {
const [email, setEmail] = useState(””);
const [emailStatus, setEmailStatus] = useState(“idle”);

useEffect(() => { document.body.style.overflow = “hidden”; return () => { document.body.style.overflow = “”; }; }, []);
useEffect(() => {
const h = e => { if (e.key === “Escape”) onClose(); };
window.addEventListener(“keydown”, h);
return () => window.removeEventListener(“keydown”, h);
}, [onClose]);

const sampleNames = pack.contents.flatMap(c =>
Array.from({ length: c.count }, (_, i) => ({ category: c.category, name: `${c.category.replace(/s$/, "")}_${String(i + 1).padStart(2, "0")}` }))
);

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onClick={onClose}
style={{ position: “fixed”, inset: 0, zIndex: 800, background: “rgba(5,4,3,0.95)”, backdropFilter: “blur(6px)”, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: 16 }}
>
<motion.div
initial={{ y: 24, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
exit={{ y: 24, opacity: 0 }}
onClick={e => e.stopPropagation()}
style={{ width: “min(640px,100%)”, maxHeight: “90vh”, overflowY: “auto”, background: “#0c0a08”, border: “1px solid rgba(221,216,204,0.08)”, borderRadius: 14, position: “relative” }}
>
{/* Header */}
<div style={{ position: “relative”, height: 160, overflow: “hidden” }}>
<div style={{ position: “absolute”, inset: 0, background: `linear-gradient(135deg,${pack.colors[0]},${pack.colors[1]},${pack.colors[2]})` }} />
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to top, #0c0a08 0%, transparent 60%)” }} />
<button onClick={onClose} style={{ position: “absolute”, top: 16, right: 16, background: “none”, border: “none”, fontSize: 11, letterSpacing: “0.25em”, textTransform: “uppercase”, color: “var(–dust)” }}>✕ Close</button>
<div style={{ position: “absolute”, bottom: 20, left: 24 }}>
<div style={{ display: “flex”, gap: 6, marginBottom: 8 }}>
<span style={{ fontSize: 8, letterSpacing: “0.2em”, textTransform: “uppercase”, padding: “3px 10px”, borderRadius: 20, border: “1px solid rgba(221,216,204,0.1)”, color: “var(–dust)” }}>{pack.type}</span>
{pack.free && <span style={{ fontSize: 8, letterSpacing: “0.2em”, textTransform: “uppercase”, padding: “3px 10px”, borderRadius: 20, background: “rgba(176,42,26,0.2)”, border: “1px solid rgba(176,42,26,0.35)”, color: “var(–red)” }}>Free</span>}
</div>
<h2 style={{ fontFamily: “‘IM Fell English’,serif”, fontStyle: “italic”, fontSize: 28, lineHeight: 1.05 }}>{pack.title}</h2>
</div>
</div>

```
    <div style={{ padding: "24px 24px 28px" }}>
      <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 2, marginBottom: 24 }}>{pack.description}</p>

      {/* Specs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(221,216,204,0.04)", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
        {[["Sounds", pack.totalSounds], ["Format", pack.format], ["Compatible", pack.compatible]].map(([l, v]) => (
          <div key={l} style={{ padding: "12px", background: "rgba(8,8,6,0.6)", textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 3 }}>{l}</div>
            <div style={{ fontSize: 12, color: "var(--offwhite)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* What's inside */}
      <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
        What's in the crate <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
      </div>

      <div className="contents-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 24 }}>
        {pack.contents.map(c => (
          <div key={c.category} style={{ padding: "14px 12px", border: "1px solid rgba(221,216,204,0.05)", borderRadius: 8, background: "rgba(221,216,204,0.015)" }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "var(--offwhite)", lineHeight: 1, marginBottom: 2 }}>{c.count}</div>
            <div style={{ fontSize: 10, color: "var(--offwhite)", letterSpacing: "0.05em", marginBottom: 4 }}>{c.category}</div>
            <div style={{ fontSize: 9, color: "rgba(122,112,96,0.5)", lineHeight: 1.6 }}>{c.description}</div>
          </div>
        ))}
      </div>

      {/* Sound list with previews */}
      <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        Preview Sounds <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginBottom: 24, maxHeight: 200, overflowY: "auto" }}>
        {sampleNames.slice(0, 12).map((s, i) => (
          <SoundPreview key={s.name} name={s.name} index={i} />
        ))}
      </div>
      {sampleNames.length > 12 && (
        <p style={{ fontSize: 10, color: "rgba(122,112,96,0.35)", textAlign: "center", marginBottom: 24 }}>+ {sampleNames.length - 12} more sounds in the full pack</p>
      )}

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {pack.tags.map(t => (
          <span key={t} style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.06)", color: "var(--dust)" }}>{t}</span>
        ))}
      </div>

      {/* Purchase / Free download */}
      {pack.free ? (
        <div style={{ border: "1px solid rgba(176,42,26,0.2)", borderRadius: 10, padding: "20px", background: "rgba(176,42,26,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--red)" }}>Free with email signup</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--dust)", lineHeight: 1.8, marginBottom: 14 }}>Join the First Listen list and get this pack free. New beats drop to your inbox 48 hours early.</p>
          {emailStatus === "success" ? (
            <div style={{ textAlign: "center", padding: 12 }}>
              <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 16, marginBottom: 4 }}>Check your inbox.</div>
              <p style={{ fontSize: 10, color: "var(--dust)" }}>Download link sent.</p>
            </div>
          ) : (
            <div className="email-row" style={{ display: "flex", gap: 8 }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ flex: 1, background: "rgba(221,216,204,0.03)", border: "1px solid rgba(221,216,204,0.08)", borderRadius: 6, padding: "10px 12px", fontSize: 12, color: "var(--offwhite)", outline: "none" }}
              />
              <button
                onClick={() => { if (email.includes("@")) setEmailStatus("success"); }}
                style={{ padding: "10px 20px", background: "var(--red)", border: "none", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "var(--offwhite)", whiteSpace: "nowrap" }}
              >Get Free Pack</button>
            </div>
          )}
        </div>
      ) : (
        <button style={{
          width: "100%", padding: 16, background: "var(--red)", border: "none", borderRadius: 8,
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, letterSpacing: "0.15em", color: "var(--offwhite)",
        }}>
          Buy Pack — ${pack.price}
        </button>
      )}
    </div>
  </motion.div>
</motion.div>
```

);
};

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function SoundKitsPage() {
const [openPack, setOpenPack] = useState(null);
const [filter, setFilter] = useState(“All”);
const filters = [“All”, “Drum Kit”, “Loop Pack”, “Free”];

const featured = PACKS.find(p => p.featured);
const filtered = filter === “All” ? PACKS.filter(p => !p.featured) :
filter === “Free” ? PACKS.filter(p => p.free) :
PACKS.filter(p => p.type === filter && !p.featured);

return (
<>

```
  <main style={{ paddingTop: 40 }}>
    {/* ── HEADER ── */}
    <div style={{ padding: "60px 32px 0" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 10 }}>005 / Sound Kits</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,8vw,96px)", lineHeight: 0.9 }}>
            The <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.8em", color: "var(--dust)" }}>crate.</em>
          </h1>
          <p style={{ fontSize: 12, color: "var(--dust)", maxWidth: 300, lineHeight: 2, textAlign: "right" }}>
            Drums, loops, and textures built on the MPC Live 3. Same sounds behind the catalogue. Your turn.
          </p>
        </div>
        <div style={{ height: 1, background: "linear-gradient(to right,rgba(176,42,26,0.5),rgba(221,216,204,0.06),transparent)", marginBottom: 40 }} />
      </motion.div>
    </div>

    {/* ── FEATURED PACK ── */}
    {featured && (
      <div style={{ padding: "0 32px 48px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="hero-pack"
          onClick={() => setOpenPack(featured)}
          style={{
            display: "flex", border: "1px solid rgba(176,42,26,0.15)", borderRadius: 14, overflow: "hidden",
            background: "rgba(221,216,204,0.02)", cursor: "pointer",
          }}
        >
          {/* Visual side */}
          <div style={{ width: "40%", minHeight: 280, position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${featured.colors[0]},${featured.colors[1]},${featured.colors[2]})` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Crate icon */}
              <div style={{ width: 80, height: 80, border: "2px solid rgba(221,216,204,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 40, height: 2, background: "rgba(221,216,204,0.08)", borderRadius: 1 }} />
                ))}
                <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(221,216,204,0.2)", marginTop: 4 }}>50 SOUNDS</div>
              </div>
            </div>
          </div>

          {/* Info side */}
          <div className="hero-pack-info" style={{ flex: 1, padding: "28px 32px" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: "rgba(176,42,26,0.15)", border: "1px solid rgba(176,42,26,0.3)", color: "var(--red)" }}>Featured</span>
              <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.08)", color: "var(--dust)" }}>{featured.type}</span>
            </div>
            <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(22px,3.5vw,32px)", lineHeight: 1.05, marginBottom: 4 }}>{featured.title}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--dust)", marginBottom: 16 }}>{featured.subtitle}</div>
            <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 1.9, marginBottom: 20 }}>{featured.description}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {featured.contents.map(c => (
                <span key={c.category} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, border: "1px solid rgba(221,216,204,0.06)", color: "var(--dust)" }}>{c.count} {c.category}</span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, lineHeight: 1 }}>${featured.price}</div>
              <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--red)" }}>View Pack →</span>
            </div>
          </div>
        </motion.div>
      </div>
    )}

    {/* ── FILTERS ── */}
    <div style={{ padding: "0 32px 32px" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map(f => {
          const count = f === "All" ? PACKS.filter(p => !p.featured).length : f === "Free" ? PACKS.filter(p => p.free).length : PACKS.filter(p => p.type === f && !p.featured).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, border: `1px solid ${filter === f ? "var(--red)" : "rgba(221,216,204,0.08)"}`, background: filter === f ? "rgba(176,42,26,0.1)" : "transparent", color: filter === f ? "var(--offwhite)" : "var(--dust)", transition: "all 0.25s" }}>
              {f}<span style={{ marginLeft: 6, fontSize: 8, opacity: 0.5 }}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* ── PACK GRID ── */}
    <div style={{ padding: "0 32px 56px" }}>
      <div className="packs-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map(pack => (
            <PackCard key={pack.id} pack={pack} onOpen={setOpenPack} />
          ))}
        </AnimatePresence>
      </div>
    </div>

    {/* ── HOW IT WORKS ── */}
    <div style={{ padding: "0 32px 56px", borderTop: "1px solid rgba(221,216,204,0.06)" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ paddingTop: 48 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          How it works <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { num: "01", title: "Buy or download", desc: "Pick a pack. Paid kits are instant download. Free kit requires email signup." },
            { num: "02", title: "Load into your setup", desc: "WAV 24-bit files work in any DAW, MPC, SP-404, or sampler. Drag and drop." },
            { num: "03", title: "Make it yours", desc: "Royalty-free for commercial use. No clearance needed. Flip them however you want." },
          ].map((step, i) => (
            <motion.div key={step.num} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ padding: "20px", border: "1px solid rgba(221,216,204,0.05)", borderRadius: 10, background: "rgba(221,216,204,0.015)" }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "var(--red)", lineHeight: 1, marginBottom: 8 }}>{step.num}</div>
              <div style={{ fontSize: 13, color: "var(--offwhite)", marginBottom: 6, letterSpacing: "0.02em" }}>{step.title}</div>
              <div style={{ fontSize: 11, color: "var(--dust)", lineHeight: 1.8 }}>{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* ── CTA ── */}
    <div style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "64px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "28vw", color: "transparent", WebkitTextStroke: "1px rgba(221,216,204,0.02)", left: "50%", top: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}>SOON</div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,5vw,64px)", lineHeight: 0.95, marginBottom: 16 }}>
            Need the full <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--red)" }}>beat?</em>
          </div>
          <p style={{ fontSize: 12, color: "var(--dust)", marginBottom: 32, lineHeight: 2 }}>These are the building blocks. For finished beats, visit the catalogue.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" style={{ padding: "13px 32px", border: "1px solid rgba(221,216,204,0.12)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Browse Beats</a>
            <a href="#" style={{ padding: "13px 32px", background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Get in Touch</a>
          </div>
        </motion.div>
      </div>
    </div>
  </main>

  {/* ── MODAL ── */}
  <AnimatePresence>
    {openPack && <PackModal pack={openPack} onClose={() => setOpenPack(null)} />}
  </AnimatePresence>
</>
```

);
}
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/*
  SOON Production — Placements & Credits Redesign
  
  Concept: "Liner Notes"
  Feels like reading the credits in an album sleeve.
  - Animated stat counters that count up on scroll
  - Release cards styled like vinyl sleeve inserts
  - Discography timeline with status indicators
  - Credits section that reads like real liner notes
  - "Get on the credits" CTA
  
  Designed to look intentional with 2-5 entries, and scale to 50+.
*/

// ── DATA ──────────────────────────────────────────────────────────────
const PLACEMENTS = [
  { id:"pl001", type:"placement", status:"released", title:"Gravel & Gold", artist:"Solo Release", role:"Producer, Composer", beat:"006", beatTitle:"Gravel & Gold", genre:"Soul", date:"April 2025", platform:"SoundCloud", platformUrl:"#", description:"First official release under SOON Production. Soul-driven, fully original composition.", colors:["#1a1008","#2a1c0e","#0e0c06"], highlight:true },
  { id:"pl002", type:"placement", status:"released", title:"Sunday Smoke", artist:"Solo Release", role:"Producer, Composer", beat:"003", beatTitle:"Sunday Smoke", genre:"Lo-Fi Soul", date:"March 2025", platform:"SoundCloud", platformUrl:"#", description:"Lo-fi soul instrumental. Written late on a Sunday. The mood was already in the room.", colors:["#0e1008","#141a0e","#080c06"], highlight:false },
  { id:"pl003", type:"project", status:"in-progress", title:"First Tape", artist:"SOON Production", role:"Producer, A&R, Creative Director", beat:null, genre:"Soul / Boom Bap", date:"Summer 2025", platform:null, platformUrl:null, description:"5–7 beats, fully produced. No features yet. A document of where the sound is right now.", colors:["#181010","#241818","#0e0c0c"], highlight:true },
  { id:"pl004", type:"project", status:"in-progress", title:"Photo + Sound Series", artist:"SOON Production", role:"Producer, Photographer, Director", beat:null, genre:"Visual / Audio", date:"2025", platform:null, platformUrl:null, description:"Each release is a single image and a single track. Sound and image as one thing.", colors:["#0c1018","#141820","#08090e"], highlight:false },
  { id:"pl005", type:"placement", status:"upcoming", title:"Untitled Collab", artist:"TBA", role:"Producer", beat:null, genre:"Soul", date:"2025", platform:null, platformUrl:null, description:"Studio session with a Brooklyn artist. Beat from the catalogue. Details TBA.", colors:["#141010","#201818","#0c0808"], highlight:false },
];

const CREDITS = [
  { role: "Production", detail: "All beats produced by SOON Production on the MPC Live 3" },
  { role: "Engineering", detail: "Mix & recording sessions at Marco's Studio, Queens, NY" },
  { role: "Photography", detail: "All photography shot on Sony A7III + 24-70mm GM II" },
  { role: "Creative Direction", detail: "Visual identity, rollout, and art direction by SOON Production" },
];

const STATS = [
  { target: 12, label: "Beats in catalogue" },
  { target: 2, label: "Solo releases" },
  { target: 2, label: "Projects in progress" },
  { target: 2025, label: "Year founded", isYear: true },
];

// ── ANIMATED COUNTER ─────────────────────────────────────────────────
const AnimatedStat = ({ target, label, isYear = false, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = isYear ? 1200 : 800;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, isYear]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: "24px 20px", border: "1px solid rgba(221,216,204,0.06)", borderRadius: 10, background: "rgba(221,216,204,0.015)", textAlign: "center" }}
    >
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,5vw,48px)", lineHeight: 1, color: "var(--offwhite)", marginBottom: 6 }}>{count}</div>
      <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--dust)" }}>{label}</div>
    </motion.div>
  );
};

// ── STATUS CONFIG ────────────────────────────────────────────────────
const STATUS_CONFIG = {
  released: { label: "Released", color: "#6aaa6a", bg: "rgba(60,120,60,0.1)", border: "rgba(60,160,60,0.3)", dot: "#6aaa6a" },
  upcoming: { label: "Upcoming", color: "#c8a840", bg: "rgba(160,120,30,0.1)", border: "rgba(200,160,40,0.3)", dot: "#c8a840" },
  "in-progress": { label: "In Progress", color: "#6090c8", bg: "rgba(60,90,150,0.1)", border: "rgba(80,120,180,0.3)", dot: "#6090c8" },
};

// ── RELEASE CARD (vinyl sleeve insert style) ─────────────────────────
const ReleaseCard = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.upcoming;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "rgba(176,42,26,0.2)" : "rgba(221,216,204,0.06)"}`,
        borderRadius: 12, overflow: "hidden",
        background: "rgba(221,216,204,0.015)",
        transition: "border-color 0.3s",
      }}
    >
      {/* Color header with status */}
      <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
        <motion.div
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${item.colors[0]},${item.colors[1]},${item.colors[2]})` }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,6,0.85) 0%, transparent 60%)" }} />

        {/* Status + type badges */}
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
          <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot }} />
            {sc.label}
          </span>
          <span style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.08)", color: "var(--dust)" }}>
            {item.type === "placement" ? "Placement" : "Project"}
          </span>
        </div>

        {/* Genre */}
        <div style={{ position: "absolute", top: 14, right: 14, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(221,216,204,0.3)", border: "1px solid rgba(221,216,204,0.08)", padding: "3px 10px", borderRadius: 20 }}>{item.genre}</div>

        {/* Title overlay */}
        <div style={{ position: "absolute", bottom: 14, left: 18, right: 18 }}>
          <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(18px,3vw,24px)", lineHeight: 1.1, marginBottom: 4 }}>{item.title}</div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(221,216,204,0.45)" }}>{item.artist}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px" }}>
        <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 1.9, marginBottom: 18 }}>{item.description}</p>

        {/* Credits-style meta */}
        <div style={{ borderTop: "1px solid rgba(221,216,204,0.05)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[["Role", item.role], ["Date", item.date], item.beat && ["Beat", item.beatTitle]].filter(Boolean).map(([l, v]) => (
            <div key={l} style={{ display: "flex", gap: 8, fontSize: 11 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", minWidth: 50 }}>{l}</span>
              <span style={{ color: "var(--offwhite)" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {item.beat && (
            <a href="#" style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid rgba(176,42,26,0.35)", padding: "6px 14px", borderRadius: 20, color: "var(--red)", transition: "background 0.2s" }}>
              Hear the Beat →
            </a>
          )}
          {item.platformUrl && item.status === "released" && (
            <a href={item.platformUrl} style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 20, background: "rgba(221,216,204,0.05)", border: "1px solid rgba(221,216,204,0.1)", color: "var(--offwhite)" }}>
              {item.platform} ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── DISCOGRAPHY ROW (non-highlighted) ────────────────────────────────
const DiscographyRow = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [hovered, setHovered] = useState(false);
  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.upcoming;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", gap: 16, padding: "18px 0", borderTop: "1px solid rgba(221,216,204,0.04)", alignItems: "center" }}
    >
      {/* Status dot */}
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.dot, flexShrink: 0, opacity: 0.7 }} />

      {/* Swatch */}
      <div style={{ width: 48, height: 48, borderRadius: 6, flexShrink: 0, overflow: "hidden", position: "relative" }}>
        <motion.div animate={{ scale: hovered ? 1.1 : 1 }} transition={{ duration: 0.4 }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${item.colors[0]},${item.colors[1]},${item.colors[2]})` }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(13px,2vw,16px)", color: hovered ? "var(--offwhite)" : "rgba(221,216,204,0.75)", transition: "color 0.2s", marginBottom: 2 }}>{item.title}</div>
        <div style={{ fontSize: 10, color: "var(--dust)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span>{item.artist}</span>
          <span style={{ color: "rgba(122,112,96,0.25)" }}>·</span>
          <span>{item.genre}</span>
          <span style={{ color: "rgba(122,112,96,0.25)" }}>·</span>
          <span>{item.date}</span>
        </div>
      </div>

      {/* Status */}
      <span style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: sc.dot }} />
        {sc.label}
      </span>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function PlacementsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Released", "In Progress", "Upcoming"];

  const filtered = activeFilter === "All"
    ? PLACEMENTS
    : PLACEMENTS.filter(p => {
        if (activeFilter === "Released") return p.status === "released";
        if (activeFilter === "In Progress") return p.status === "in-progress";
        if (activeFilter === "Upcoming") return p.status === "upcoming";
        return true;
      });

  const highlighted = filtered.filter(p => p.highlight);
  const rest = filtered.filter(p => !p.highlight);

  return (
    <>
      

      <main style={{ paddingTop: 40 }}>

        {/* ── HEADER ── */}
        <div style={{ padding: "60px 32px 0" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 10 }}>004 / Placements & Credits</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,8vw,96px)", lineHeight: 0.9 }}>
                The <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.8em", color: "var(--dust)" }}>work.</em>
              </h1>
              <p style={{ fontSize: 12, color: "var(--dust)", maxWidth: 300, lineHeight: 2, textAlign: "right" }}>
                Everything made under the SOON Production name. Solo releases, collaborations, and projects in motion.
              </p>
            </div>
            <div style={{ height: 1, background: "linear-gradient(to right,rgba(176,42,26,0.5),rgba(221,216,204,0.06),transparent)", marginBottom: 40 }} />
          </motion.div>
        </div>

        {/* ── STATS ── */}
        <div style={{ padding: "0 32px 48px" }}>
          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {STATS.map((s, i) => (
              <AnimatedStat key={s.label} target={s.target} label={s.label} isYear={s.isYear} index={i} />
            ))}
          </div>
        </div>

        {/* ── PRODUCER CARD ── */}
        <div style={{ padding: "0 32px 48px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ border: "1px solid rgba(221,216,204,0.07)", borderRadius: 12, overflow: "hidden", background: "rgba(221,216,204,0.02)", display: "flex" }}>
              {/* Red accent stripe */}
              <div style={{ width: 5, background: "linear-gradient(to bottom, var(--red), rgba(176,42,26,0.15))", flexShrink: 0 }} />
              <div className="producer-card-inner" style={{ padding: "24px 28px", display: "flex", gap: 24, alignItems: "center", flex: 1, flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#1a0e08,#2a1c10)", border: "1px solid rgba(221,216,204,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: "0.15em", color: "rgba(221,216,204,0.25)" }}>S</div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--red)", marginBottom: 4 }}>Producer · Photographer · Creative Director</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(18px,3vw,24px)", letterSpacing: "0.1em", marginBottom: 4 }}>SOON PRODUCTION</div>
                  <div style={{ fontSize: 11, color: "var(--dust)", lineHeight: 1.8 }}>Brooklyn, NY · Est. 2025 · MPC Live 3 · Sony A7III</div>
                </div>
                {/* CTAs */}
                <div className="producer-actions" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href="#" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 20px", border: "1px solid rgba(221,216,204,0.12)", borderRadius: 6, color: "var(--offwhite)", textAlign: "center", transition: "border-color 0.2s" }}>Browse Beats</a>
                  <a href="#" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "8px 20px", background: "var(--red)", borderRadius: 6, color: "var(--offwhite)", textAlign: "center" }}>Work Together</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── FILTERS ── */}
        <div style={{ padding: "0 32px 32px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filters.map(f => {
              const count = f === "All" ? PLACEMENTS.length : PLACEMENTS.filter(p =>
                f === "Released" ? p.status === "released" : f === "In Progress" ? p.status === "in-progress" : p.status === "upcoming"
              ).length;
              return (
                <button key={f} onClick={() => setActiveFilter(f)}
                  style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "6px 16px", borderRadius: 20, border: `1px solid ${activeFilter === f ? "var(--red)" : "rgba(221,216,204,0.08)"}`, background: activeFilter === f ? "rgba(176,42,26,0.1)" : "transparent", color: activeFilter === f ? "var(--offwhite)" : "var(--dust)", transition: "all 0.25s" }}
                >
                  {f}<span style={{ marginLeft: 6, fontSize: 8, opacity: 0.5 }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── FEATURED RELEASES ── */}
        {highlighted.length > 0 && (
          <div style={{ padding: "0 32px 40px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.35)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              Featured Work <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.05)" }} />
            </div>
            <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: highlighted.length > 1 ? "1fr 1fr" : "1fr", gap: 14 }}>
              {highlighted.map((item, i) => <ReleaseCard key={item.id} item={item} index={i} />)}
            </div>
          </div>
        )}

        {/* ── DISCOGRAPHY LIST ── */}
        {rest.length > 0 && (
          <div style={{ padding: "0 32px 48px" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.35)", marginBottom: 0, display: "flex", alignItems: "center", gap: 12 }}>
              Discography <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.05)" }} /> <span style={{ fontSize: 8 }}>{rest.length} entries</span>
            </div>
            {rest.map((item, i) => <DiscographyRow key={item.id} item={item} index={i} />)}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 24, color: "rgba(221,216,204,0.3)", marginBottom: 12 }}>Nothing here yet.</div>
            <button onClick={() => setActiveFilter("All")} style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", background: "none", border: "1px solid rgba(221,216,204,0.1)", color: "var(--dust)", padding: "10px 24px", borderRadius: 6 }}>Show everything</button>
          </div>
        )}

        {/* ── CREDITS (liner notes style) ── */}
        <div style={{ padding: "0 32px 56px", borderTop: "1px solid rgba(221,216,204,0.06)" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ paddingTop: 48 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
              Liner Notes <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
            </div>

            {/* Credits read like album liner notes — prose style */}
            <div style={{ maxWidth: 680, marginBottom: 32 }}>
              <p style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(16px,2.5vw,20px)", lineHeight: 1.8, color: "rgba(221,216,204,0.6)", marginBottom: 24 }}>
                All music produced, composed, and arranged by SOON Production on the Akai MPC Live 3. Recorded and mixed at Marco's Studio, Queens, NY. All photography shot on Sony A7III with the 24-70mm GM II. Visual identity, art direction, and creative direction by SOON Production.
              </p>
              <p style={{ fontSize: 12, color: "rgba(122,112,96,0.4)", lineHeight: 2 }}>
                Something Out of Nothing · Brooklyn, NY · Est. 2025
              </p>
            </div>

            {/* Structured credits grid */}
            <div className="credits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(221,216,204,0.04)", borderRadius: 10, overflow: "hidden" }}>
              {CREDITS.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
                  style={{ padding: "20px 22px", background: "rgba(8,8,6,0.5)" }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>{c.role}</div>
                  <div style={{ fontSize: 12, color: "rgba(221,216,204,0.6)", lineHeight: 1.8 }}>{c.detail}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CTA ── */}
        <div style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "64px 32px", position: "relative", overflow: "hidden" }}>
          {/* Ghost SOON */}
          <div aria-hidden="true" style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "28vw", color: "transparent", WebkitTextStroke: "1px rgba(221,216,204,0.02)", left: "50%", top: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}>SOON</div>

          <div className="cta-grid" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", maxWidth: 900, margin: "0 auto" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,5vw,64px)", lineHeight: 0.95, marginBottom: 12 }}>
                Want your name<br />on the <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--red)" }}>credits?</em>
              </div>
              <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 2 }}>Beat placement · Custom production · Creative direction · Photography</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" style={{ display: "block", textAlign: "center", padding: 14, border: "1px solid rgba(221,216,204,0.12)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Browse Beats</a>
              <a href="#" style={{ display: "block", textAlign: "center", padding: 14, background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Get in Touch</a>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

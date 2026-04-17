import { useState, useEffect, useRef, useCallback } from “react”;
import { motion, AnimatePresence, useInView, useScroll, useTransform } from “framer-motion”;

/*
SOON Production — Journal (BTS Content Engine)

Redesigned as a visual documentary timeline:

- Timeline view with date markers and type icons
- Immersive full-screen entry reader with parallax hero
- Reading progress bar
- Photo gallery with filmstrip navigation
- Beat connection card with play capability
- “From the archive” related entries
- Scroll-driven animations throughout
  */

// ── DATA ──────────────────────────────────────────────────────────────
const TAGS = [“All”, “Studio”, “MPC”, “Shoot”, “On Location”, “Session”, “Process”];

const ENTRIES = [
{
id:“bts001”, type:“studio”,
title:“The Flip That Became ‘Distant Summer’”,
date:“March 14, 2025”, location:“Home Studio, Brooklyn”,
tags:[“MPC”,“Process”],
excerpt:“Found a Terry Callier record at a spot in Flatbush. Took it home, dropped the needle, and knew within 30 seconds.”,
body:“Found a Terry Callier record at a spot in Flatbush — $3, slightly warped, perfect. Took it home, dropped the needle, and knew within 30 seconds there was something in the strings.\n\nThe challenge with Callier is the timing is so human. His band breathes differently than a click track. Chopping it on the MPC meant finding the pocket in the imperfection, not fighting it.\n\nThree hours in, I had something. Not the beat — just the sample chopped right. The beat came after midnight. Sometimes that’s how it works.”,
beat:“001”, beatTitle:“Distant Summer”,
photos:[
{ colors:[”#1a1008”,”#2a1c0e”,”#0e0c06”], caption:“Terry Callier, 1974. $3 at a spot in Flatbush.” },
{ colors:[”#0e1008”,”#141a0e”,”#080c06”], caption:“MPC Live 3. Where everything starts.” },
{ colors:[”#181008”,”#24180e”,”#0e0c06”], caption:“3AM. The beat came together here.” },
],
featured:true, colors:[”#1a1008”,”#2a1c0e”,”#0e0c06”],
},
{
id:“bts002”, type:“shoot”,
title:“Press Shoot: The Stare”,
date:“March 22, 2025”, location:“SOON Studio, Brooklyn”,
tags:[“Shoot”,“Session”],
excerpt:“Told him to forget the camera was there. It took about 20 minutes. Then he stopped performing and started just being.”,
body:“Press shoots are uncomfortable by default. You’re asking someone to be themselves while pointing a lens at them — it doesn’t make sense.\n\nThe trick I’ve found is patience. Set up, do a few frames early to let them get it out of their system, then put the camera down and just talk. Let 20 minutes pass. Then pick it back up.\n\nHe didn’t even notice I was shooting again. That’s the frame that ended up being the one.\n\nShot on the A7III, 24-70 GM II, window light only. f/2.0, 1/200s, ISO 800.”,
beat:null, beatTitle:null,
photos:[
{ colors:[”#141010”,”#201818”,”#0c0808”], caption:“Window light. No setup. No reflectors.” },
{ colors:[”#180e0e”,”#2a1414”,”#100808”], caption:“Between setups. This was the real one.” },
],
featured:false, colors:[”#141010”,”#201818”,”#0c0808”],
},
{
id:“bts003”, type:“studio”,
title:“Studio Session with Marco — Red Clay Road”,
date:“March 8, 2025”, location:“Marco’s Studio, Queens”,
tags:[“Studio”,“Session”,“Process”],
excerpt:“First time recording at Marco’s spot. Tracked the session from setup to final mix.”,
body:“Marco’s been engineering for 12 years. Walking into his space is like walking into someone’s brain — every piece of gear placed for a reason, every cable managed like it matters.\n\nWe started with ‘Red Clay Road’ because the Herbie Hancock chop needed space in the low end. Marco heard it immediately. Made three adjustments I wouldn’t have thought of. That’s what a real engineer does.\n\nSix hours. Tracked the bass, did two vocal reference passes with a feature artist who came through, then spent the last hour just on the mix. Walked out with something finished.\n\nBrought the A7III. Shot everything.”,
beat:“002”, beatTitle:“Red Clay Road”,
photos:[
{ colors:[”#0c1018”,”#141820”,”#08090e”], caption:“Marco’s board. 12 years of sessions in that room.” },
{ colors:[”#181210”,”#2a1e14”,”#100c08”], caption:“Tracking the bass. 11PM.” },
{ colors:[”#0e0c10”,”#18141c”,”#080608”], caption:“Playback.” },
{ colors:[”#101818”,”#182424”,”#080e0e”], caption:“Reference vocal pass.” },
],
featured:true, colors:[”#0c1018”,”#141820”,”#08090e”],
},
{
id:“bts004”, type:“location”,
title:“Flatbush Crate Dig”,
date:“February 28, 2025”, location:“Flatbush, Brooklyn”,
tags:[“On Location”,“Process”],
excerpt:“Three hours. Four spots. Spent $31. Came back with six records. Two of them became beats.”,
body:“There’s a spot on Church Ave that doesn’t look like anything. Half the records are water damaged. The owner doesn’t care if you’re there or not. That’s the kind of place you find things.\n\nPulled six records total across four spots that day. The Terry Callier that became ‘Distant Summer.’ A Weldon Irvine I’m still sitting on. A CTI compilation that had one usable break. Three others I’m not ready to talk about yet.\n\nThe dig is the research. The MPC is the lab. The beat is the result. You can’t skip the first step.”,
beat:null, beatTitle:null,
photos:[
{ colors:[”#181410”,”#241e14”,”#0e0c08”], caption:“Church Ave. Doesn’t look like anything.” },
{ colors:[”#0e0c08”,”#181410”,”#080806”], caption:”$31 total. Six records.” },
{ colors:[”#161210”,”#221c16”,”#0c0a08”], caption:“The Weldon Irvine.” },
],
featured:false, colors:[”#181410”,”#241e14”,”#0e0c08”],
},
{
id:“bts005”, type:“shoot”,
title:“Underground Show — Bushwick”,
date:“April 5, 2025”, location:“Bushwick, Brooklyn”,
tags:[“Shoot”,“On Location”,“Session”],
excerpt:“200 people in a space built for 80. No stage lighting worth talking about. Shot at ISO 3200.”,
body:“The best shows are the ones that shouldn’t work on paper.\n\nNo proper stage. Lights that were basically just colored bulbs someone strung up that afternoon. Sound system that kept cutting out between acts. And the energy was better than anything I’ve shot at a proper venue.\n\nShot the whole thing at ISO 3200-6400. Grain everywhere. Motion blur on half the frames. But there’s something in those images that a clean, well-lit show can’t give you — the actual feeling of being in the room.\n\nThat’s what I’m always chasing. Not the perfect image. The right one.”,
beat:null, beatTitle:null,
photos:[
{ colors:[”#100814”,”#1c1020”,”#08060c”], caption:“200 people. Space built for 80.” },
{ colors:[”#200808”,”#3a1010”,”#100404”], caption:“ISO 6400. The grain is part of it.” },
{ colors:[”#0e1018”,”#141820”,”#08090e”], caption:“Between sets.” },
{ colors:[”#141010”,”#201818”,”#0c0808”], caption:“Last act.” },
],
featured:false, colors:[”#100814”,”#1c1020”,”#08060c”],
},
{
id:“bts006”, type:“process”,
title:“MPC Bible — Week 3 Notes”,
date:“April 10, 2025”, location:“Home Studio, Brooklyn”,
tags:[“MPC”,“Process”],
excerpt:“Sampling is harder than it looks. The chop is easy. Finding the pocket — that’s the work.”,
body:“Three weeks into the MPC Bible. The chapters on timestretch changed how I hear samples. Before, I was fighting the timing. Now I’m using it.\n\nThe thing nobody tells you about sampling is that the imperfection is the point. When J Dilla played things slightly off the grid, it wasn’t an accident and it wasn’t a mistake — it was a choice. The MPC lets you make that choice deliberately.\n\nThis week: worked on ‘Honest Work’ (the Stylistics chop), spent two days on a Rhodes interpolation I can’t get right yet, and figured out something about layering kicks that I’m not ready to explain but can hear clearly.\n\nStill learning. That’s the whole point.”,
beat:“011”, beatTitle:“Honest Work”,
photos:[
{ colors:[”#0e0c08”,”#181410”,”#080806”], caption:“MPC Bible. Week 3.” },
{ colors:[”#141008”,”#201a0e”,”#0c0a06”], caption:“The Stylistics. 1972.” },
],
featured:false, colors:[”#0e0c08”,”#181410”,”#080806”],
},
];

// ── HELPERS ──────────────────────────────────────────────────────────
const Photo = ({ data, style: s = {}, onClick }) => (

  <div onClick={onClick} style={{
    position: "relative", overflow: "hidden",
    background: `linear-gradient(135deg,${data.colors[0]},${data.colors[1]},${data.colors[2]})`,
    cursor: onClick ? "pointer" : "default", ...s,
  }}>
    <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(221,216,204,0.12)", pointerEvents: "none" }}>[ A7III ]</div>
    {data.caption && (
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 14px 10px", background: "linear-gradient(to top,rgba(8,8,6,0.85),transparent)" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.08em", color: "rgba(221,216,204,0.5)", fontStyle: "italic" }}>{data.caption}</p>
      </div>
    )}
  </div>
);

const TYPE_CONFIG = {
studio:   { label: “Studio”, icon: “🎛”, color: “#8a6030” },
shoot:    { label: “Shoot”, icon: “📷”, color: “#4a6890” },
location: { label: “Location”, icon: “📍”, color: “#4a7a4a” },
process:  { label: “Process”, icon: “📓”, color: “#6a4a8a” },
};

const TypeIcon = ({ type, size = 32 }) => {
const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.process;
return (
<div style={{
width: size, height: size, borderRadius: “50%”,
background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
display: “flex”, alignItems: “center”, justifyContent: “center”,
fontSize: size * 0.45, flexShrink: 0,
}}>
{cfg.icon}
</div>
);
};

const TypeBadge = ({ type }) => {
const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.process;
return (
<span style={{
fontSize: 9, letterSpacing: “0.2em”, textTransform: “uppercase”,
padding: “3px 10px”, borderRadius: 20,
background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`,
color: cfg.color,
}}>{cfg.label}</span>
);
};

// ── TIMELINE ENTRY CARD ──────────────────────────────────────────────
const TimelineEntry = ({ entry, onOpen, index }) => {
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: “-60px” });
const [hovered, setHovered] = useState(false);

return (
<motion.div
ref={ref}
initial={{ opacity: 0, x: -20 }}
animate={inView ? { opacity: 1, x: 0 } : {}}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
style={{ display: “flex”, gap: 20, paddingLeft: 48, position: “relative”, marginBottom: 8 }}
>
{/* Timeline dot */}
<motion.div
animate={{ scale: hovered ? 1.3 : 1 }}
style={{
position: “absolute”, left: 19, top: 22,
width: 11, height: 11, borderRadius: “50%”,
background: hovered ? “var(–red)” : “rgba(122,112,96,0.3)”,
border: “2px solid var(–black)”,
transition: “background 0.3s”, zIndex: 2,
}}
/>

```
  {/* Card */}
  <div
    onClick={() => onOpen(entry)}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    style={{
      flex: 1, display: "flex", gap: 16, padding: "18px 20px",
      border: `1px solid ${hovered ? "rgba(176,42,26,0.2)" : "rgba(221,216,204,0.05)"}`,
      borderRadius: 10, cursor: "pointer",
      background: hovered ? "rgba(221,216,204,0.02)" : "transparent",
      transition: "all 0.3s",
    }}
  >
    {/* Thumbnail */}
    <div style={{
      width: 72, height: 72, borderRadius: 6, flexShrink: 0, overflow: "hidden",
      position: "relative",
    }}>
      <motion.div
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]},${entry.colors[2]})`,
        }}
      />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypeIcon type={entry.type} size={28} />
      </div>
    </div>

    {/* Content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)" }}>{entry.date}</span>
        <span style={{ fontSize: 9, color: "rgba(122,112,96,0.2)" }}>·</span>
        <span style={{ fontSize: 9, letterSpacing: "0.15em", color: "rgba(122,112,96,0.35)" }}>{entry.location}</span>
      </div>
      <h3 style={{
        fontFamily: "'IM Fell English',serif", fontStyle: "italic",
        fontSize: "clamp(14px,2.2vw,17px)", lineHeight: 1.25, marginBottom: 6,
        color: hovered ? "var(--offwhite)" : "rgba(221,216,204,0.8)",
        transition: "color 0.2s",
      }}>{entry.title}</h3>
      <p style={{
        fontSize: 11, color: "var(--dust)", lineHeight: 1.7,
        overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
      }}>{entry.excerpt}</p>

      {/* Tags + beat */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center", flexWrap: "wrap" }}>
        {entry.tags.slice(0, 3).map(t => (
          <span key={t} style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(221,216,204,0.06)", color: "var(--dust)" }}>{t}</span>
        ))}
        {entry.beat && (
          <span style={{ fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 12, border: "1px solid rgba(176,42,26,0.25)", color: "var(--red)" }}>♫ {entry.beatTitle}</span>
        )}
        <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(122,112,96,0.25)" }}>{entry.photos.length} photos</span>
      </div>
    </div>

    {/* Arrow */}
    <motion.div
      animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -8 }}
      style={{ display: "flex", alignItems: "center", fontSize: 14, color: "var(--dust)", flexShrink: 0 }}
    >→</motion.div>
  </div>
</motion.div>
```

);
};

// ── FEATURED HERO CARD ───────────────────────────────────────────────
const FeaturedCard = ({ entry, onOpen }) => {
const [hovered, setHovered] = useState(false);
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: “-40px” });

return (
<motion.div
ref={ref}
initial={{ opacity: 0, y: 24 }}
animate={inView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
onClick={() => onOpen(entry)}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
style={{
border: `1px solid ${hovered ? "rgba(176,42,26,0.2)" : "rgba(221,216,204,0.06)"}`,
borderRadius: 12, overflow: “hidden”, cursor: “pointer”,
transition: “border-color 0.3s”, background: “rgba(221,216,204,0.02)”,
}}
>
{/* Image */}
<div style={{ position: “relative”, aspectRatio: “16/9”, overflow: “hidden” }}>
<motion.div
animate={{ scale: hovered ? 1.04 : 1 }}
transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
style={{
position: “absolute”, inset: 0,
background: `linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]},${entry.colors[2]})`,
}}
/>
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to top,rgba(8,8,6,0.75) 0%,transparent 60%)” }} />
<div style={{ position: “absolute”, top: 14, left: 14, display: “flex”, gap: 8 }}>
<TypeBadge type={entry.type} />
<span style={{ fontSize: 8, letterSpacing: “0.2em”, textTransform: “uppercase”, padding: “3px 10px”, borderRadius: 20, background: “rgba(176,42,26,0.2)”, border: “1px solid rgba(176,42,26,0.35)”, color: “var(–red)” }}>Featured</span>
</div>
{/* Read indicator */}
<motion.div
animate={{ opacity: hovered ? 1 : 0 }}
style={{
position: “absolute”, bottom: 16, right: 16,
fontSize: 10, letterSpacing: “0.2em”, textTransform: “uppercase”,
color: “var(–offwhite)”, display: “flex”, alignItems: “center”, gap: 6,
}}
>
Read Entry →
</motion.div>
</div>
{/* Content */}
<div style={{ padding: “18px 20px 20px” }}>
<div style={{ fontSize: 9, letterSpacing: “0.25em”, textTransform: “uppercase”, color: “var(–dust)”, marginBottom: 8 }}>
{entry.date} · {entry.location}
</div>
<h2 style={{ fontFamily: “‘IM Fell English’,serif”, fontStyle: “italic”, fontSize: “clamp(18px,3vw,22px)”, lineHeight: 1.15, marginBottom: 10 }}>{entry.title}</h2>
<p style={{ fontSize: 12, color: “var(–dust)”, lineHeight: 1.9, letterSpacing: “0.04em” }}>{entry.excerpt}</p>
</div>
</motion.div>
);
};

// ── ENTRY READER (full immersive) ────────────────────────────────────
const EntryReader = ({ entry, entries, onClose, onNavigate }) => {
const [lightbox, setLightbox] = useState(null);
const scrollRef = useRef(null);
const { scrollYProgress } = useScroll({ container: scrollRef });
const progressWidth = useTransform(scrollYProgress, [0, 1], [“0%”, “100%”]);

useEffect(() => {
const h = e => { if (e.key === “Escape”) lightbox !== null ? setLightbox(null) : onClose(); };
window.addEventListener(“keydown”, h);
return () => window.removeEventListener(“keydown”, h);
}, [onClose, lightbox]);

useEffect(() => { document.body.style.overflow = “hidden”; return () => { document.body.style.overflow = “”; }; }, []);

const paragraphs = entry.body.split(”\n\n”).filter(Boolean);
const related = entries.filter(e => e.id !== entry.id && e.tags.some(t => entry.tags.includes(t))).slice(0, 3);
const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.process;

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
style={{ position: “fixed”, inset: 0, zIndex: 800, background: “var(–black)” }}
>
{/* Reading progress bar */}
<motion.div style={{
position: “fixed”, top: 0, left: 0, height: 2, background: “var(–red)”,
zIndex: 820, width: progressWidth,
}} />

```
  {/* Top bar */}
  <div style={{
    position: "fixed", top: 2, left: 0, right: 0, zIndex: 810,
    background: "rgba(8,8,6,0.9)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(221,216,204,0.05)",
    padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
  }}>
    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--dust)", display: "flex", alignItems: "center", gap: 8 }}>
      ← Journal
    </button>
    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 14, letterSpacing: "0.2em", color: "rgba(221,216,204,0.25)" }}>SOON / JOURNAL</div>
    <TypeBadge type={entry.type} />
  </div>

  {/* Scrollable content */}
  <div ref={scrollRef} style={{ position: "absolute", inset: 0, overflowY: "auto", paddingTop: 48 }}>

    {/* Parallax hero */}
    <div style={{ position: "relative", height: "50vh", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: -20,
        background: `linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]},${entry.colors[2]})`,
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--black) 0%, rgba(8,8,6,0.4) 40%, transparent 100%)" }} />
      <div style={{
        position: "absolute", bottom: 40, left: 32, right: 32, zIndex: 2,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <TypeBadge type={entry.type} />
          {entry.featured && <span style={{ fontSize: 8, padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(176,42,26,0.3)", color: "var(--red)" }}>Featured</span>}
        </div>
        <h1 style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(28px,5vw,52px)", lineHeight: 1.08, marginBottom: 12, maxWidth: 640 }}>{entry.title}</h1>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--dust)" }}>
          {entry.date} · {entry.location} · {entry.photos.length} photos
        </div>
      </div>
    </div>

    {/* Body */}
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 32px 100px" }}>
      <div className="entry-layout" style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 56, alignItems: "start" }}>

        {/* Main column */}
        <div>
          {/* Drop-cap body text */}
          <div className="reader-body" style={{ marginBottom: 40 }}>
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {/* Photo filmstrip */}
          {entry.photos.length > 0 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                From the session <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
                <span>{entry.photos.length} frames</span>
              </div>
              <div className="filmstrip">
                {entry.photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    className="filmstrip-item"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setLightbox(i)}
                    style={{ cursor: "pointer" }}
                  >
                    <Photo data={photo} style={{
                      width: 220, height: 160, borderRadius: 6,
                      border: "1px solid rgba(221,216,204,0.05)",
                    }} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ paddingTop: 32, borderTop: "1px solid rgba(221,216,204,0.06)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.3)" }}>Tags:</span>
            {entry.tags.map(t => (
              <span key={t} style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.07)", color: "var(--dust)" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="entry-sidebar" style={{ position: "sticky", top: 80, paddingLeft: 28, borderLeft: "1px solid rgba(221,216,204,0.06)" }}>

          {/* Beat connection */}
          {entry.beat && (
            <div style={{ padding: 16, borderRadius: 10, border: "1px solid rgba(176,42,26,0.2)", background: "rgba(176,42,26,0.04)", marginBottom: 24 }}>
              <div style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--red)", marginBottom: 8 }}>Beat from this session</div>
              <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 17, marginBottom: 4 }}>{entry.beatTitle}</div>
              <div style={{ fontSize: 10, color: "var(--dust)", marginBottom: 12 }}>From the catalogue</div>
              <a href="/beats" style={{ display: "block", textAlign: "center", padding: 10, background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "var(--offwhite)" }}>Listen & License →</a>
            </div>
          )}

          {/* Session info */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 14 }}>Session Info</div>
            {[["Date", entry.date], ["Location", entry.location], ["Type", cfg.label], ["Photos", `${entry.photos.length} frames`]].map(([l, v]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.3)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12, color: "var(--offwhite)" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <div style={{ fontSize: 8, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 14 }}>From the Archive</div>
              {related.map(e => (
                <button key={e.id} onClick={() => onNavigate(e)} style={{
                  display: "flex", gap: 10, alignItems: "center",
                  background: "none", border: "none", width: "100%", textAlign: "left",
                  padding: "8px 0", borderBottom: "1px solid rgba(221,216,204,0.04)",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, flexShrink: 0, background: `linear-gradient(135deg,${e.colors[0]},${e.colors[1]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TypeIcon type={e.type} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "rgba(221,216,204,0.7)", lineHeight: 1.2 }}>{e.title}</div>
                    <div style={{ fontSize: 9, color: "var(--dust)", marginTop: 2 }}>{e.date}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Lightbox */}
  <AnimatePresence>
    {lightbox !== null && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setLightbox(null)}
        style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(5,4,3,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          style={{ width: "min(800px,90vw)", position: "relative" }}
        >
          <Photo data={entry.photos[lightbox]} style={{ width: "100%", aspectRatio: "4/3", borderRadius: 8 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <button
              onClick={() => setLightbox(i => (i - 1 + entry.photos.length) % entry.photos.length)}
              style={{ background: "none", border: "none", color: "var(--dust)", fontSize: 14 }}
            >← Prev</button>
            <span style={{ fontSize: 10, color: "rgba(122,112,96,0.4)" }}>{lightbox + 1} / {entry.photos.length}</span>
            <button
              onClick={() => setLightbox(i => (i + 1) % entry.photos.length)}
              style={{ background: "none", border: "none", color: "var(--dust)", fontSize: 14 }}
            >Next →</button>
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: -36, right: 0, background: "none", border: "none", fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--dust)" }}>✕ Close</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
```

);
};

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function JournalPage() {
const [activeTag, setActiveTag] = useState(“All”);
const [openEntry, setOpenEntry] = useState(null);

const filtered = activeTag === “All” ? ENTRIES : ENTRIES.filter(e => e.tags.includes(activeTag));
const featured = filtered.filter(e => e.featured);
const timeline = filtered.filter(e => !e.featured);

const handleNavigate = useCallback((entry) => {
setOpenEntry(null);
setTimeout(() => setOpenEntry(entry), 100);
}, []);

return (
<>

```
  {/* ── PAGE HEADER ── */}
  <header style={{ padding: "100px 32px 0" }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 10 }}>003 / Journal</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,8vw,96px)", lineHeight: 0.9 }}>
          Behind the <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.8em", color: "var(--dust)" }}>work.</em>
        </h1>
        <p style={{ fontSize: 12, color: "var(--dust)", maxWidth: 280, lineHeight: 2, textAlign: "right" }}>
          Studio sessions. Crate digs. Shoots. Process notes. The stuff that doesn't make it to the final release.
        </p>
      </div>

      <div style={{ height: 1, background: "linear-gradient(to right,rgba(176,42,26,0.5),rgba(221,216,204,0.06),transparent)", marginBottom: 32 }} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
        {TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            style={{
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "6px 16px", borderRadius: 20,
              border: `1px solid ${activeTag === tag ? "var(--red)" : "rgba(221,216,204,0.08)"}`,
              background: activeTag === tag ? "rgba(176,42,26,0.1)" : "transparent",
              color: activeTag === tag ? "var(--offwhite)" : "var(--dust)",
              transition: "all 0.25s",
            }}
          >
            {tag}
            <span style={{ marginLeft: 6, fontSize: 8, opacity: 0.5 }}>
              {tag === "All" ? ENTRIES.length : ENTRIES.filter(e => e.tags.includes(tag)).length}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  </header>

  <main>
    {/* ── FEATURED ── */}
    {featured.length > 0 && (
      <section style={{ padding: "0 32px 48px" }}>
        <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: featured.length > 1 ? "1fr 1fr" : "1fr", gap: 16 }}>
          {featured.map(entry => (
            <FeaturedCard key={entry.id} entry={entry} onOpen={setOpenEntry} />
          ))}
        </div>
      </section>
    )}

    {/* ── TIMELINE ── */}
    {timeline.length > 0 && (
      <section style={{ padding: "0 32px 60px", position: "relative" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.35)", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, paddingLeft: 48 }}>
          Timeline
          <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.05)" }} />
          <span style={{ fontSize: 8 }}>{timeline.length} entries</span>
        </div>

        <div style={{ position: "relative" }}>
          <div className="timeline-line" />
          {timeline.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} onOpen={setOpenEntry} index={i} />
          ))}
        </div>
      </section>
    )}

    {/* Empty state */}
    {filtered.length === 0 && (
      <div style={{ textAlign: "center", padding: "80px 32px" }}>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 24, color: "rgba(221,216,204,0.3)", marginBottom: 12 }}>Nothing here yet.</div>
        <button onClick={() => setActiveTag("All")} style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", background: "none", border: "1px solid rgba(221,216,204,0.1)", color: "var(--dust)", padding: "10px 24px", borderRadius: 6 }}>Show all</button>
      </div>
    )}

    {/* ── BOTTOM CTA ── */}
    <section className="cta-grid" style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "64px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
      <div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.95, marginBottom: 12 }}>
          Want to work<br />with <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--red)" }}>SOON?</em>
        </div>
        <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 2 }}>Beats, photography, creative direction. Let's build something together.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <a href="#" style={{ display: "block", textAlign: "center", padding: 13, border: "1px solid rgba(221,216,204,0.12)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Browse Beats</a>
        <a href="#" style={{ display: "block", textAlign: "center", padding: 13, background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Get in Touch</a>
      </div>
    </section>
  </main>

  {/* ── ENTRY READER ── */}
  <AnimatePresence>
    {openEntry && (
      <EntryReader
        key={openEntry.id}
        entry={openEntry}
        entries={ENTRIES}
        onClose={() => setOpenEntry(null)}
        onNavigate={handleNavigate}
      />
    )}
  </AnimatePresence>
</>
```

);
}
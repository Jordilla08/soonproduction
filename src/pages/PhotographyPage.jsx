import { useState, useEffect, useRef, useCallback } from “react”;
import { motion, AnimatePresence, useInView } from “framer-motion”;

/*
SOON Production — Photography Page Redesign

Editorial gallery approach:

- Full-bleed hero with featured photo
- Staggered masonry grid with hover EXIF overlay
- Full-screen immersive lightbox with EXIF data panel
- Keyboard navigation (←/→/Esc)
- Category filters with counts
- “Book a Session” CTA
- Photo counter in corner
  */

const CATEGORIES = [“All”, “Portrait”, “Street”, “Artist”, “Event”, “Editorial”];

const PHOTOS = [
{ id:“p001”, title:“Still Burning”, category:“Portrait”, aperture:“f/1.8”, shutter:“1/200s”, iso:“400”, date:“March 2025”, location:“Brooklyn, NY”, featured:true, colors:[”#1a0e08”,”#2e1a10”,”#0e0806”], aspect:“portrait”, description:“Available light portrait session. Late afternoon, brick wall, no reflectors.” },
{ id:“p002”, title:“Corner Store”, category:“Street”, aperture:“f/5.6”, shutter:“1/500s”, iso:“800”, date:“February 2025”, location:“Flatbush, Brooklyn”, featured:false, colors:[”#0e1018”,”#1a2030”,”#080c12”], aspect:“landscape”, description:“Midday street. Caught between the neon and the pavement.” },
{ id:“p003”, title:“Before the Set”, category:“Artist”, aperture:“f/2.0”, shutter:“1/160s”, iso:“1600”, date:“April 2025”, location:“Studio Session, Queens”, featured:false, colors:[”#180e0e”,”#2a1414”,”#100808”], aspect:“portrait”, description:“Green room, 20 minutes before showtime.” },
{ id:“p004”, title:“Red Light District”, category:“Street”, aperture:“f/2.8”, shutter:“1/60s”, iso:“3200”, date:“January 2025”, location:“Manhattan, NY”, featured:false, colors:[”#200808”,”#3a1010”,”#100404”], aspect:“portrait”, description:“Night walk. The city doesn’t sleep and neither does the light.” },
{ id:“p005”, title:“Sound Check”, category:“Event”, aperture:“f/4.0”, shutter:“1/250s”, iso:“2000”, date:“March 2025”, location:“Prospect Park, Brooklyn”, featured:false, colors:[”#0e1810”,”#162814”,”#080e08”], aspect:“landscape”, description:“Two hours before the crowd arrived. The calm before.” },
{ id:“p006”, title:“Window Light”, category:“Portrait”, aperture:“f/1.8”, shutter:“1/320s”, iso:“200”, date:“February 2025”, location:“Home Studio, Brooklyn”, featured:false, colors:[”#181410”,”#2a2018”,”#100e08”], aspect:“square”, description:“Single window. No setup. Just the light doing what it does.” },
{ id:“p007”, title:“Overflow”, category:“Event”, aperture:“f/3.5”, shutter:“1/320s”, iso:“1600”, date:“April 2025”, location:“Bushwick, Brooklyn”, featured:false, colors:[”#100814”,”#1c1020”,”#08060c”], aspect:“landscape”, description:“Underground showcase. 200 people in a space built for 80.” },
{ id:“p008”, title:“The Stare”, category:“Artist”, aperture:“f/2.0”, shutter:“1/200s”, iso:“800”, date:“March 2025”, location:“SOON Studio, Brooklyn”, featured:false, colors:[”#141010”,”#201814”,”#0c0808”], aspect:“portrait”, description:“Press shoot. Told him to forget the camera was there.” },
{ id:“p009”, title:“Rain on Glass”, category:“Editorial”, aperture:“f/2.8”, shutter:“1/100s”, iso:“1250”, date:“January 2025”, location:“Crown Heights, Brooklyn”, featured:false, colors:[”#0c1018”,”#141820”,”#08090e”], aspect:“landscape”, description:“Shot through a taxi window in the rain. Didn’t plan it.” },
{ id:“p010”, title:“Back to the Wall”, category:“Portrait”, aperture:“f/2.2”, shutter:“1/250s”, iso:“640”, date:“April 2025”, location:“Red Hook, Brooklyn”, featured:false, colors:[”#181010”,”#2a1818”,”#100c0c”], aspect:“portrait”, description:“Graffiti wall. Afternoon sun. She brought the energy.” },
{ id:“p011”, title:“After Hours”, category:“Street”, aperture:“f/2.8”, shutter:“1/40s”, iso:“4000”, date:“February 2025”, location:“Bed-Stuy, Brooklyn”, featured:false, colors:[”#0e0c10”,”#18141c”,”#080608”], aspect:“landscape”, description:“2AM. Corner store still open. Bodega cat watching everything.” },
{ id:“p012”, title:“First Row”, category:“Event”, aperture:“f/2.8”, shutter:“1/400s”, iso:“3200”, date:“March 2025”, location:“The Knitting Factory, Brooklyn”, featured:false, colors:[”#180c08”,”#281410”,”#100808”], aspect:“landscape”, description:“Live set. Front row energy. You can feel it in the blur.” },
];

const ASPECT_RATIOS = { portrait: “3/4”, landscape: “4/3”, square: “1/1” };

// ── Photo placeholder ────────────────────────────────────────────────
const PhotoImage = ({ photo, style: s = {} }) => (

  <div style={{
    background: `linear-gradient(135deg, ${photo.colors[0]}, ${photo.colors[1]}, ${photo.colors[2]})`,
    position: "relative", overflow: "hidden", ...s,
  }}>
    <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(221,216,204,0.1)", pointerEvents: "none" }}>[ A7III ]</div>
  </div>
);

// ── EXIF badge ───────────────────────────────────────────────────────
const ExifBadge = ({ label, value }) => (

  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 2 }}>{label}</div>
    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: "var(--offwhite)", lineHeight: 1 }}>{value}</div>
  </div>
);

// ── Featured hero ────────────────────────────────────────────────────
const FeaturedHero = ({ photo, onOpen }) => {
const [hovered, setHovered] = useState(false);
return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 1 }}
onClick={() => onOpen(photo)}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
style={{ position: “relative”, height: “70vh”, cursor: “pointer”, overflow: “hidden” }}
>
<motion.div
animate={{ scale: hovered ? 1.03 : 1 }}
transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
style={{ position: “absolute”, inset: 0 }}
>
<PhotoImage photo={photo} style={{ width: “100%”, height: “100%” }} />
</motion.div>
{/* Vignette */}
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to top, var(–black) 0%, rgba(8,8,6,0.3) 40%, transparent 70%)” }} />
<div style={{ position: “absolute”, inset: 0, background: “linear-gradient(to right, rgba(8,8,6,0.4) 0%, transparent 30%)” }} />

```
  {/* Content overlay */}
  <div className="hero-content" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 40px" }}>
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, background: "rgba(176,42,26,0.2)", border: "1px solid rgba(176,42,26,0.35)", color: "var(--red)" }}>Featured</span>
        <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.1)", color: "var(--dust)" }}>{photo.category}</span>
      </div>
      <h2 style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(28px,5vw,48px)", lineHeight: 1.05, marginBottom: 8, maxWidth: 500 }}>{photo.title}</h2>
      <p style={{ fontSize: 12, color: "rgba(221,216,204,0.6)", letterSpacing: "0.04em", lineHeight: 1.8, maxWidth: 400, marginBottom: 16 }}>{photo.description}</p>
      <div style={{ display: "flex", gap: 20 }}>
        {[["Aperture", photo.aperture], ["Shutter", photo.shutter], ["ISO", photo.iso]].map(([l, v]) => (
          <ExifBadge key={l} label={l} value={v} />
        ))}
      </div>
    </motion.div>
  </div>

  {/* View prompt */}
  <motion.div
    animate={{ opacity: hovered ? 1 : 0 }}
    style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--offwhite)", display: "flex", alignItems: "center", gap: 8 }}
  >
    <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(221,216,204,0.3)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,8,6,0.5)", backdropFilter: "blur(4px)" }}>↗</div>
  </motion.div>
</motion.div>
```

);
};

// ── Masonry item ─────────────────────────────────────────────────────
const MasonryItem = ({ photo, onOpen, index }) => {
const ref = useRef(null);
const inView = useInView(ref, { once: true, margin: “-40px” });
const [hovered, setHovered] = useState(false);

return (
<motion.div
ref={ref}
className=“masonry-item”
initial={{ opacity: 0, y: 20 }}
animate={inView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
onClick={() => onOpen(photo)}
onMouseEnter={() => setHovered(true)}
onMouseLeave={() => setHovered(false)}
style={{ cursor: “pointer”, position: “relative”, borderRadius: 4, overflow: “hidden” }}
>
<motion.div animate={{ scale: hovered ? 1.03 : 1 }} transition={{ duration: 0.5 }}>
<PhotoImage photo={photo} style={{ width: “100%”, aspectRatio: ASPECT_RATIOS[photo.aspect] || “4/3”, borderRadius: 4 }} />
</motion.div>

```
  {/* Hover overlay with EXIF */}
  <motion.div
    animate={{ opacity: hovered ? 1 : 0 }}
    transition={{ duration: 0.25 }}
    style={{
      position: "absolute", inset: 0, borderRadius: 4,
      background: "linear-gradient(to top, rgba(8,8,6,0.85) 0%, rgba(8,8,6,0.2) 50%, transparent 100%)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 14,
    }}
  >
    <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(14px,2vw,17px)", marginBottom: 4 }}>{photo.title}</div>
    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "var(--dust)", marginBottom: 10 }}>{photo.location} · {photo.date}</div>
    <div style={{ display: "flex", gap: 12 }}>
      {[photo.aperture, photo.shutter, `ISO ${photo.iso}`].map(v => (
        <span key={v} style={{ fontSize: 9, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: 10, border: "1px solid rgba(221,216,204,0.12)", color: "rgba(221,216,204,0.6)" }}>{v}</span>
      ))}
    </div>
  </motion.div>

  {/* Category tag */}
  <div style={{ position: "absolute", top: 10, left: 10, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 10, background: "rgba(8,8,6,0.6)", color: "var(--dust)", backdropFilter: "blur(4px)" }}>{photo.category}</div>
</motion.div>
```

);
};

// ── Full-screen lightbox ─────────────────────────────────────────────
const Lightbox = ({ photo, photos, onClose, onNavigate }) => {
const currentIndex = photos.findIndex(p => p.id === photo.id);
const [showInfo, setShowInfo] = useState(true);

const goPrev = useCallback(() => {
const prev = (currentIndex - 1 + photos.length) % photos.length;
onNavigate(prev);
}, [currentIndex, photos.length, onNavigate]);

const goNext = useCallback(() => {
const next = (currentIndex + 1) % photos.length;
onNavigate(next);
}, [currentIndex, photos.length, onNavigate]);

useEffect(() => {
const h = (e) => {
if (e.key === “ArrowLeft”) goPrev();
if (e.key === “ArrowRight”) goNext();
if (e.key === “Escape”) onClose();
if (e.key === “i”) setShowInfo(s => !s);
};
window.addEventListener(“keydown”, h);
return () => window.removeEventListener(“keydown”, h);
}, [goPrev, goNext, onClose]);

useEffect(() => {
document.body.style.overflow = “hidden”;
return () => { document.body.style.overflow = “”; };
}, []);

return (
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
style={{ position: “fixed”, inset: 0, zIndex: 800, background: “rgba(5,4,3,0.98)”, display: “flex”, flexDirection: “column” }}
>
{/* Top bar */}
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, padding: “14px 24px”, borderBottom: “1px solid rgba(221,216,204,0.05)”, flexShrink: 0 }}>
<button onClick={onClose} style={{ background: “none”, border: “none”, fontSize: 11, letterSpacing: “0.25em”, textTransform: “uppercase”, color: “var(–dust)” }}>← Gallery</button>
<div style={{ fontSize: 10, letterSpacing: “0.2em”, color: “rgba(122,112,96,0.4)”, fontVariantNumeric: “tabular-nums” }}>{currentIndex + 1} / {photos.length}</div>
<button onClick={() => setShowInfo(s => !s)} style={{ background: “none”, border: “none”, fontSize: 11, letterSpacing: “0.25em”, textTransform: “uppercase”, color: showInfo ? “var(–red)” : “var(–dust)” }}>
{showInfo ? “Hide” : “Show”} Info
</button>
</div>

```
  {/* Main content */}
  <div className="lightbox-layout" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
    {/* Image area */}
    <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Prev/Next */}
      <button onClick={goPrev} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 20, color: "var(--dust)", zIndex: 5, padding: 12 }}>←</button>
      <button onClick={goNext} style={{ position: "absolute", right: showInfo ? 16 : 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 20, color: "var(--dust)", zIndex: 5, padding: 12 }}>→</button>

      <AnimatePresence mode="wait">
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="lightbox-image"
          style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "75vh" }}
        >
          <PhotoImage photo={photo} style={{ width: "100%", height: "100%", borderRadius: 6, aspectRatio: ASPECT_RATIOS[photo.aspect] }} />
        </motion.div>
      </AnimatePresence>
    </div>

    {/* Info panel */}
    <AnimatePresence>
      {showInfo && (
        <motion.div
          className="lightbox-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderLeft: "1px solid rgba(221,216,204,0.06)", overflowY: "auto", overflowX: "hidden", flexShrink: 0 }}
        >
          <div style={{ padding: "28px 24px", minWidth: 280 }}>
            {/* Title */}
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.08)", color: "var(--dust)", display: "inline-block", marginBottom: 16 }}>{photo.category}</div>
            <h2 style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: 22, lineHeight: 1.15, marginBottom: 8 }}>{photo.title}</h2>
            <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 1.9, marginBottom: 24 }}>{photo.description}</p>

            {/* Details */}
            <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 12 }}>Details</div>
            {[["Date", photo.date], ["Location", photo.location]].map(([l, v]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(122,112,96,0.35)", marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: 12, color: "var(--offwhite)" }}>{v}</div>
              </div>
            ))}

            {/* EXIF */}
            <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 12, marginTop: 20 }}>Camera</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(221,216,204,0.04)", borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
              {[["Camera", "Sony A7III"], ["Lens", "24-70 GM II"], ["Aperture", photo.aperture], ["Shutter", photo.shutter], ["ISO", photo.iso]].map(([l, v]) => (
                <div key={l} style={{ padding: "10px", background: "rgba(8,8,6,0.6)" }}>
                  <div style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(122,112,96,0.35)", marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, color: "var(--offwhite)" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Related */}
            <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 12 }}>More {photo.category}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {photos.filter(p => p.category === photo.category && p.id !== photo.id).slice(0, 3).map(p => (
                <button key={p.id} onClick={() => onNavigate(photos.findIndex(x => x.id === p.id))}
                  style={{ display: "flex", gap: 10, alignItems: "center", background: "none", border: "1px solid rgba(221,216,204,0.05)", borderRadius: 6, padding: "8px 10px", textAlign: "left", transition: "border-color 0.2s" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, flexShrink: 0, background: `linear-gradient(135deg,${p.colors[0]},${p.colors[1]})` }} />
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "rgba(221,216,204,0.7)" }}>{p.title}</div>
                    <div style={{ fontSize: 9, color: "var(--dust)", marginTop: 2 }}>{p.aperture} · {p.shutter}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Book CTA */}
            <div style={{ marginTop: 28, padding: "16px", border: "1px solid rgba(221,216,204,0.06)", borderRadius: 8, background: "rgba(221,216,204,0.02)" }}>
              <p style={{ fontSize: 10, color: "var(--dust)", lineHeight: 1.8, marginBottom: 10 }}>Want photos like this?</p>
              <a href="#" style={{ display: "block", textAlign: "center", padding: 10, background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 13, letterSpacing: "0.15em", color: "var(--offwhite)" }}>Book a Session</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>

  {/* Bottom filmstrip */}
  <div style={{ borderTop: "1px solid rgba(221,216,204,0.05)", padding: "10px 24px", display: "flex", gap: 6, overflowX: "auto", flexShrink: 0 }}>
    {photos.map((p, i) => (
      <div
        key={p.id}
        onClick={() => onNavigate(i)}
        style={{
          width: 48, height: 36, borderRadius: 3, flexShrink: 0, cursor: "pointer",
          background: `linear-gradient(135deg,${p.colors[0]},${p.colors[1]})`,
          border: p.id === photo.id ? "2px solid var(--red)" : "2px solid transparent",
          opacity: p.id === photo.id ? 1 : 0.4,
          transition: "all 0.2s",
        }}
      />
    ))}
  </div>
</motion.div>
```

);
};

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function PhotographyPage() {
const [activeCategory, setActiveCategory] = useState(“All”);
const [lightboxPhoto, setLightboxPhoto] = useState(null);
const [visibleCount, setVisibleCount] = useState(12);

const featured = PHOTOS.find(p => p.featured);
const gridPhotos = PHOTOS.filter(p => !p.featured);
const filtered = activeCategory === “All” ? gridPhotos : gridPhotos.filter(p => p.category === activeCategory);
const shown = filtered.slice(0, visibleCount);
const allFiltered = activeCategory === “All” ? PHOTOS : PHOTOS.filter(p => p.category === activeCategory);

const handleOpen = useCallback(photo => setLightboxPhoto(photo), []);
const handleClose = useCallback(() => setLightboxPhoto(null), []);
const handleNav = useCallback(idx => setLightboxPhoto(allFiltered[idx]), [allFiltered]);

return (
<>

```
  {/* ── FEATURED HERO ── */}
  {featured && (activeCategory === "All" || activeCategory === featured.category) && (
    <FeaturedHero photo={featured} onOpen={handleOpen} />
  )}

  {/* ── HEADER + FILTERS ── */}
  <div style={{ padding: "48px 32px 32px" }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 8 }}>002 / Visual Work</div>
          <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(40px,6vw,72px)", lineHeight: 0.9 }}>
            The <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.85em", color: "var(--dust)" }}>eye.</em>
          </h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 12, color: "var(--dust)", lineHeight: 2 }}>Sony A7III · 24-70mm GM II</p>
          <p style={{ fontSize: 10, color: "rgba(122,112,96,0.4)" }}>{filtered.length + (featured && (activeCategory === "All" || activeCategory === featured.category) ? 1 : 0)} photos</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => {
          const count = cat === "All" ? PHOTOS.length : PHOTOS.filter(p => p.category === cat).length;
          return (
            <button key={cat} onClick={() => { setActiveCategory(cat); setVisibleCount(12); }}
              style={{
                fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
                padding: "6px 16px", borderRadius: 20,
                border: `1px solid ${activeCategory === cat ? "var(--red)" : "rgba(221,216,204,0.08)"}`,
                background: activeCategory === cat ? "rgba(176,42,26,0.1)" : "transparent",
                color: activeCategory === cat ? "var(--offwhite)" : "var(--dust)",
                transition: "all 0.25s",
              }}
            >
              {cat}<span style={{ marginLeft: 6, fontSize: 8, opacity: 0.5 }}>{count}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  </div>

  {/* ── MASONRY GRID ── */}
  <div className="masonry">
    <AnimatePresence mode="popLayout">
      {shown.map((photo, i) => (
        <MasonryItem key={photo.id} photo={photo} onOpen={handleOpen} index={i} />
      ))}
    </AnimatePresence>
  </div>

  {/* Load more */}
  {visibleCount < filtered.length && (
    <div style={{ textAlign: "center", padding: "40px 32px" }}>
      <button onClick={() => setVisibleCount(v => v + 8)}
        style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", background: "none", border: "1px solid rgba(221,216,204,0.1)", color: "var(--dust)", padding: "12px 32px", borderRadius: 6, transition: "all 0.25s" }}>
        Load More — {filtered.length - visibleCount} remaining
      </button>
    </div>
  )}

  {/* ── BOOK CTA ── */}
  <div style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "64px 32px", textAlign: "center" }}>
    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(32px,5vw,64px)", lineHeight: 0.95, marginBottom: 16 }}>
      Need a <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--red)" }}>shoot?</em>
    </div>
    <p style={{ fontSize: 12, color: "var(--dust)", letterSpacing: "0.08em", marginBottom: 32, lineHeight: 2 }}>
      Portraits · Events · Artist sessions · Editorial
    </p>
    <a href="#" style={{ display: "inline-block", padding: "14px 40px", background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: "0.2em", color: "var(--offwhite)" }}>Book a Session</a>
  </div>

  {/* ── LIGHTBOX ── */}
  <AnimatePresence>
    {lightboxPhoto && (
      <Lightbox
        photo={lightboxPhoto}
        photos={allFiltered}
        onClose={handleClose}
        onNavigate={handleNav}
      />
    )}
  </AnimatePresence>
</>
```

);
}

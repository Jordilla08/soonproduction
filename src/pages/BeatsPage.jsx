import { useState, useEffect, useRef, useCallback } from “react”;
import { motion, AnimatePresence, useInView } from “framer-motion”;

/*
SOON Production — Beats Page Redesign

- Sidebar filters (genre, mood, BPM range, sort)
- Vinyl sleeve beat cards (drag or tap to reveal license tiers)
- Real HTML5 Audio player with waveform seek
- Persistent player bar at the bottom
- Beat detail modal with license/sample tabs
- Active filter pills
- Mobile responsive
  */

// ── DATA ──────────────────────────────────────────────────────────────
const BEATS = [
{ num:“001”, title:“Distant Summer”, genre:“Soul”, subgenre:“Boom Bap”, bpm:87, key:“F Min”, mood:“Nostalgic”, duration:“3:14”, price:35, tags:[“Soul”,“Boom Bap”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3”, sample:{ original:“Trying to Hold On”, artist:“Terry Callier”, year:1974, label:“Cadet”, elements:[“Vocal chop”,“String loop”], clearance:“uncleared” }},
{ num:“002”, title:“Red Clay Road”, genre:“Jazz”, subgenre:“Jazz Soul”, bpm:74, key:“Bb Maj”, mood:“Soulful”, duration:“2:58”, price:35, tags:[“Soul”,“Jazz”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3”, sample:{ original:“Maiden Voyage”, artist:“Herbie Hancock”, year:1965, label:“Blue Note”, elements:[“Piano chop”], clearance:“uncleared” }},
{ num:“003”, title:“Sunday Smoke”, genre:“Lo-Fi”, subgenre:“Soul”, bpm:82, key:“G Min”, mood:“Chill”, duration:“3:32”, price:35, tags:[“Soul”,“Lo-Fi”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3”, sample:null },
{ num:“004”, title:“Crates at Midnight”, genre:“Boom Bap”, subgenre:“Classic”, bpm:91, key:“D Min”, mood:“Dark”, duration:“2:44”, price:35, tags:[“Boom Bap”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3”, sample:{ original:“Original Drums”, artist:“SOON Production”, year:2025, label:“SOON”, elements:[“Original drums”], clearance:“cleared” }},
{ num:“005”, title:“Felt That”, genre:“Trap”, subgenre:“Soul Trap”, bpm:78, key:“A Min”, mood:“Emotional”, duration:“3:08”, price:35, tags:[“Soul”,“Trap”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3”, sample:{ original:“For the Love of You”, artist:“The Isley Brothers”, year:1975, label:“T-Neck”, elements:[“Guitar interpolation”], clearance:“interpolated” }},
{ num:“006”, title:“Gravel & Gold”, genre:“Soul”, subgenre:“Soulful”, bpm:84, key:“E Min”, mood:“Warm”, duration:“3:22”, price:35, tags:[“Soul”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3”, sample:null },
{ num:“007”, title:“Last Light”, genre:“Jazz”, subgenre:“Jazz Soul”, bpm:72, key:“C Maj”, mood:“Melancholic”, duration:“4:01”, price:35, tags:[“Soul”,“Jazz”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3”, sample:null },
{ num:“008”, title:“Worn Leather”, genre:“Boom Bap”, subgenre:“Gritty”, bpm:88, key:“F# Min”, mood:“Gritty”, duration:“2:51”, price:35, tags:[“Boom Bap”], src:“https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3”, sample:null },
];

const TIERS = [
{ name:“Lease”, price:”$35”, perks:[“MP3”,“100k streams”,“Non-exclusive”,“1 music video”] },
{ name:“Premium”, price:”$75”, perks:[“WAV + MP3”,“500k streams”,“Non-exclusive”,“Unlimited videos”] },
{ name:“Exclusive”, price:”$200+”, perks:[“WAV + Stems”,“Unlimited”,“Full ownership”,“Removed from store”] },
];

const GENRES = [“All”,“Soul”,“Boom Bap”,“Jazz”,“Lo-Fi”,“Trap”];
const MOODS = [“All”,“Nostalgic”,“Soulful”,“Chill”,“Dark”,“Emotional”,“Warm”,“Melancholic”,“Gritty”];
const SORT_OPT = [“Newest”,“Oldest”,“BPM ↑”,“BPM ↓”];

// ── AUDIO HOOK ───────────────────────────────────────────────────────
const useAudio = () => {
const ref = useRef(null);
const [current, setCurrent] = useState(null);
const [playing, setPlaying] = useState(false);
const [progress, setProgress] = useState(0);
const [duration, setDuration] = useState(0);
const raf = useRef(null);

useEffect(() => {
ref.current = new Audio();
ref.current.volume = 0.7;
ref.current.addEventListener(“loadedmetadata”, () => setDuration(ref.current.duration));
ref.current.addEventListener(“ended”, () => { setPlaying(false); setProgress(0); });
return () => { ref.current?.pause(); cancelAnimationFrame(raf.current); };
}, []);

const tick = useCallback(() => {
if (ref.current?.duration) setProgress(ref.current.currentTime / ref.current.duration);
raf.current = requestAnimationFrame(tick);
}, []);

const play = useCallback((beat) => {
if (current?.num === beat.num) {
if (playing) { ref.current.pause(); setPlaying(false); cancelAnimationFrame(raf.current); }
else { ref.current.play().catch(()=>{}); setPlaying(true); raf.current = requestAnimationFrame(tick); }
return;
}
ref.current.pause(); cancelAnimationFrame(raf.current);
ref.current.src = beat.src; ref.current.load();
ref.current.play().catch(()=>{});
setCurrent(beat); setPlaying(true); setProgress(0);
raf.current = requestAnimationFrame(tick);
}, [current, playing, tick]);

const seek = useCallback((pct) => {
if (ref.current?.duration) { ref.current.currentTime = pct * ref.current.duration; setProgress(pct); }
}, []);

const stop = useCallback(() => {
ref.current?.pause(); setPlaying(false); setCurrent(null); setProgress(0); cancelAnimationFrame(raf.current);
}, []);

const fmt = (s) => !s || isNaN(s) ? “0:00” : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

return { current, playing, progress, duration, play, seek, stop, fmt };
};

// ── WAVEFORM ─────────────────────────────────────────────────────────
const Waveform = ({ playing=false, progress=0, bars=28, height=28, onClick }) => {
const [heights] = useState(() => Array.from({length:bars}, () => 6+Math.random()*20));
return (
<div onClick={onClick} style={{ display:“flex”, alignItems:“center”, gap:2, height, overflow:“hidden”, flex:1, cursor:onClick?“pointer”:“default” }}>
{heights.map((h,i) => (
<motion.div key={i}
style={{ width:2, borderRadius:1, flexShrink:0, background: i/bars < progress ? “var(–red)” : playing ? “rgba(176,42,26,0.5)” : “rgba(122,112,96,0.2)” }}
animate={playing ? { height:[h*.4,h,h*.6,h*.9,h*.4] } : { height:h }}
transition={playing ? { duration:.5+Math.random()*.4, repeat:Infinity, ease:“easeInOut”, delay:i*.02 } : { duration:.3 }}
/>
))}
</div>
);
};

// ── VINYL DISC (small, for beat cards) ───────────────────────────────
const MiniVinyl = ({ size=100 }) => (
<svg width={size} height={size} viewBox="0 0 120 120">
<defs>
<radialGradient id="mv-d" cx="40%" cy="35%" r="62%">
<stop offset="0%" stopColor="#1a1a1a" /><stop offset="60%" stopColor="#0a0a0a" /><stop offset="100%" stopColor="#050505" />
</radialGradient>
</defs>
<circle cx="60" cy="60" r="56" fill="url(#mv-d)" />
{[48, 38].map((r,i) => <circle key={i} cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.4" />)}
<circle cx="60" cy="60" r="22" fill="#d8d0c0" />
<text x=“60” y=“58” textAnchor=“middle” dominantBaseline=“middle” style={{ fontFamily:”‘IM Fell English’,serif”, fontStyle:“italic”, fontSize:8, fill:“rgba(30,25,20,0.6)” }}>SOON</text>
<text x=“60” y=“67” textAnchor=“middle” dominantBaseline=“middle” style={{ fontFamily:”‘Courier Prime’,monospace”, fontSize:3.5, fill:“rgba(30,25,20,0.3)” }}>001</text>
<circle cx="60" cy="60" r="4" fill="var(--black)" />
</svg>
);

// ── VINYL SLEEVE BEAT CARD ───────────────────────────────────────────
const BeatCard = ({ beat, audio, onOpenModal }) => {
const [open, setOpen] = useState(false);
const [selectedTier, setSelectedTier] = useState(“Lease”);
const [dragX, setDragX] = useState(0);
const ref = useRef(null);
const inView = useInView(ref, { once:true, margin:”-30px” });
const isPlaying = audio.current?.num === beat.num && audio.playing;
const beatProgress = audio.current?.num === beat.num ? audio.progress : 0;

return (
<motion.div ref={ref} initial={{ opacity:0, y:20 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ duration:.7, ease:[0.16,1,0.3,1] }}>
<div style={{
borderRadius:14, overflow:“hidden”, background:”#0c0a08”,
border:`1px solid ${open ? "rgba(176,42,26,0.2)" : isPlaying ? "rgba(176,42,26,0.3)" : "rgba(221,216,204,0.06)"}`,
transition:“border-color 0.3s”,
}}>
<div style={{ height:3, background:“linear-gradient(to right, var(–red), transparent)” }} />

```
    {/* Beat info — always visible */}
    <div style={{ padding:"14px 16px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:9, letterSpacing:"0.3em", color:"rgba(122,112,96,0.3)" }}>{beat.num}</span>
          {beat.sample ? (
            <span style={{ fontSize:7, letterSpacing:"0.15em", textTransform:"uppercase", padding:"2px 6px", borderRadius:10,
              border:`1px solid ${beat.sample.clearance==="cleared"?"rgba(60,160,60,0.25)":beat.sample.clearance==="interpolated"?"rgba(200,160,40,0.25)":"rgba(176,42,26,0.25)"}`,
              color:beat.sample.clearance==="cleared"?"#6aaa6a":beat.sample.clearance==="interpolated"?"#c8a840":"rgba(176,100,80,0.7)",
            }}>{beat.sample.clearance==="cleared"?"Cleared":beat.sample.clearance==="interpolated"?"Interp.":"Sample"}</span>
          ) : (
            <span style={{ fontSize:7, letterSpacing:"0.15em", textTransform:"uppercase", padding:"2px 6px", borderRadius:10, border:"1px solid rgba(60,160,60,0.2)", color:"#6aaa6a" }}>Original</span>
          )}
        </div>
        <span style={{ fontSize:9, letterSpacing:"0.12em", color:"var(--dust)" }}>{beat.key}</span>
      </div>
      <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:18, lineHeight:1.1, marginBottom:3, cursor:"pointer" }} onClick={() => onOpenModal(beat)}>{beat.title}</div>
      <div style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--dust)", marginBottom:12 }}>{beat.genre} · {beat.subgenre} · {beat.bpm} BPM</div>

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:"rgba(221,216,204,0.04)", borderRadius:6, overflow:"hidden", marginBottom:12 }}>
        {[["BPM",beat.bpm],["KEY",beat.key],["TIME",beat.duration]].map(([l,v]) => (
          <div key={l} style={{ padding:"6px", background:"rgba(8,8,6,0.5)", textAlign:"center" }}>
            <div style={{ fontSize:7, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.35)", marginBottom:1 }}>{l}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:"var(--offwhite)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Waveform — playable */}
      <div style={{ marginBottom:12 }}>
        <Waveform playing={isPlaying} progress={beatProgress} bars={30} height={24}
          onClick={(e) => {
            if (isPlaying) {
              const rect = e.currentTarget.getBoundingClientRect();
              audio.seek((e.clientX - rect.left) / rect.width);
            } else { audio.play(beat); }
          }}
        />
      </div>
    </div>

    {/* Vinyl / License swap area */}
    <div style={{ padding:"0 16px", marginBottom:14, minHeight:110, overflow:"hidden" }}>
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div key="vinyl" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:80 }}
            transition={{ type:"spring", damping:20, stiffness:180 }}
            style={{ position:"relative", height:110 }}
          >
            <motion.div
              drag="x" dragConstraints={{ left:0, right:120 }} dragElastic={0.06}
              onDrag={(_,info) => setDragX(info.offset.x)}
              onDragEnd={(_,info) => { if(info.offset.x > 60) setOpen(true); setDragX(0); }}
              style={{ position:"absolute", left:"50%", top:"50%", marginLeft:-50, marginTop:-50, zIndex:3, cursor:"grab", touchAction:"pan-y" }}
              whileDrag={{ cursor:"grabbing", scale:1.06 }}
              whileTap={{ scale:0.97 }}
              onClick={() => setOpen(true)}
            >
              <motion.div style={{ rotate: dragX * 2.5 }}>
                <MiniVinyl size={100} />
              </motion.div>
            </motion.div>
            <motion.div animate={{ x:[0,8,0], opacity: dragX > 15 ? 0 : 1 }}
              transition={{ x:{ repeat:Infinity, duration:1.8, ease:"easeInOut" }, opacity:{ duration:0.2 } }}
              style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.2)", zIndex:1 }}>
              Pull →
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="tiers" initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
            transition={{ type:"spring", damping:22, stiffness:200 }}>
            <div style={{ fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--red)", marginBottom:8 }}>License Options</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {TIERS.map(t => (
                <button key={t.name} onClick={() => setSelectedTier(t.name)}
                  style={{ textAlign:"left", padding:"7px 10px", borderRadius:6,
                    border:`1px solid ${selectedTier===t.name?"rgba(176,42,26,0.4)":"rgba(221,216,204,0.05)"}`,
                    background:selectedTier===t.name?"rgba(176,42,26,0.06)":"rgba(221,216,204,0.01)", transition:"all 0.2s",
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--offwhite)" }}>{t.name}</span>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, color:"var(--red)" }}>{t.price}</span>
                  </div>
                  <div style={{ fontSize:8, color:"rgba(122,112,96,0.5)", marginTop:1 }}>{t.perks.join(" · ")}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* License CTA when open */}
    <AnimatePresence>
      {open && (
        <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
          transition={{ duration:0.3, ease:[0.16,1,0.3,1] }} style={{ overflow:"hidden" }}>
          <div style={{ padding:"0 16px 14px" }}>
            <button style={{ width:"100%", padding:11, background:"var(--red)", border:"none", borderRadius:6, fontFamily:"'Bebas Neue',sans-serif", fontSize:14, letterSpacing:"0.15em", color:"var(--offwhite)" }}>
              License — {TIERS.find(t => t.name === selectedTier)?.price}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Bottom bar */}
    <div style={{ padding:"0 16px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, lineHeight:1 }}>${beat.price}</div>
        <div style={{ fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--dust)" }}>from / lease</div>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        <button onClick={() => audio.play(beat)} aria-label={isPlaying?"Pause":"Play"}
          style={{ width:32, height:32, borderRadius:"50%", border:`1px solid ${isPlaying?"var(--red)":"rgba(221,216,204,0.12)"}`, background:isPlaying?"var(--red)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.25s" }}>
          {isPlaying
            ? <span style={{ display:"flex", gap:2 }}><span style={{ width:2, height:8, background:"white", borderRadius:1 }}/><span style={{ width:2, height:8, background:"white", borderRadius:1 }}/></span>
            : <svg width="7" height="9" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="var(--offwhite)"/></svg>
          }
        </button>
        <button onClick={() => setOpen(o => !o)} aria-label={open?"Close tiers":"Show tiers"}
          style={{ width:32, height:32, borderRadius:"50%", border:`1px solid ${open?"var(--red)":"rgba(221,216,204,0.12)"}`, background:open?"rgba(176,42,26,0.12)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:open?"var(--red)":"var(--dust)", transition:"all 0.25s" }}>
          {open ? "↩" : "$"}
        </button>
        <button onClick={() => onOpenModal(beat)} aria-label="View details"
          style={{ width:32, height:32, borderRadius:"50%", border:"1px solid rgba(221,216,204,0.12)", background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"var(--dust)", transition:"all 0.25s" }}>
          ↗
        </button>
      </div>
    </div>

    {/* Floating vinyl when open */}
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1, rotate:360 }} exit={{ opacity:0, scale:0.8 }}
          transition={{ type:"spring", damping:18, stiffness:140 }}
          onClick={() => setOpen(false)}
          style={{ position:"absolute", top:180, right:-24, cursor:"pointer", filter:"drop-shadow(4px 4px 12px rgba(0,0,0,0.5))", zIndex:10 }}>
          <MiniVinyl size={60} />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</motion.div>
```

);
};

// ── SIDEBAR ──────────────────────────────────────────────────────────
const Sidebar = ({ filters, setFilters, counts }) => {
const set = (k,v) => setFilters(f => ({…f,[k]:v}));
const FilterSection = ({ title, children }) => (
<div style={{ marginBottom:28 }}>
<div style={{ fontSize:9, letterSpacing:“0.35em”, textTransform:“uppercase”, color:“rgba(122,112,96,0.4)”, marginBottom:12, display:“flex”, alignItems:“center”, gap:8 }}>
{title}<span style={{ flex:1, height:1, background:“rgba(221,216,204,0.06)” }}/>
</div>
{children}
</div>
);
const Pill = ({ label, active, onClick }) => (
<button onClick={onClick} style={{ fontSize:9, letterSpacing:“0.15em”, textTransform:“uppercase”, padding:“4px 10px”, borderRadius:14, border:`1px solid ${active?"var(--red)":"rgba(221,216,204,0.06)"}`, background:active?“rgba(176,42,26,0.08)”:“transparent”, color:active?“var(–offwhite)”:“var(–dust)”, transition:“all 0.2s” }}>{label}</button>
);

return (
<aside className=“sidebar” style={{ position:“sticky”, top:0, height:“100vh”, overflowY:“auto”, borderRight:“1px solid rgba(221,216,204,0.06)”, padding:“28px 20px” }}>
<a href=”#” style={{ fontFamily:”‘Bebas Neue’,sans-serif”, fontSize:16, letterSpacing:“0.25em”, display:“block”, marginBottom:4 }}>Soon</a>
<div style={{ fontSize:9, letterSpacing:“0.2em”, color:“var(–dust)”, marginBottom:32 }}>← Back to site</div>

```
  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:"0.05em", marginBottom:4 }}>Catalogue</div>
  <div style={{ fontSize:9, letterSpacing:"0.15em", color:"var(--dust)", marginBottom:28 }}>{counts.total} beats · {counts.filtered} shown</div>

  <FilterSection title="Search">
    <input value={filters.search} onChange={e => set("search", e.target.value)} placeholder="Search beats..."
      style={{ width:"100%", background:"rgba(221,216,204,0.03)", border:"1px solid rgba(221,216,204,0.08)", borderRadius:6, padding:"8px 12px", fontSize:11, color:"var(--offwhite)", outline:"none" }} />
  </FilterSection>

  <FilterSection title="Genre">
    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
      {GENRES.map(g => <Pill key={g} label={g} active={filters.genre===g} onClick={() => set("genre",g)} />)}
    </div>
  </FilterSection>

  <FilterSection title="Mood">
    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
      {MOODS.map(m => <Pill key={m} label={m} active={filters.mood===m} onClick={() => set("mood",m)} />)}
    </div>
  </FilterSection>

  <FilterSection title={`BPM: ${filters.bpmMin}–${filters.bpmMax}`}>
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div><div style={{ fontSize:8, color:"var(--dust)", marginBottom:4 }}>Min: {filters.bpmMin}</div>
        <input type="range" min={60} max={140} value={filters.bpmMin} onChange={e => set("bpmMin", Math.min(+e.target.value, filters.bpmMax-5))} /></div>
      <div><div style={{ fontSize:8, color:"var(--dust)", marginBottom:4 }}>Max: {filters.bpmMax}</div>
        <input type="range" min={60} max={160} value={filters.bpmMax} onChange={e => set("bpmMax", Math.max(+e.target.value, filters.bpmMin+5))} /></div>
    </div>
  </FilterSection>

  <FilterSection title="Sort">
    <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
      {SORT_OPT.map(s => <Pill key={s} label={s} active={filters.sort===s} onClick={() => set("sort",s)} />)}
    </div>
  </FilterSection>

  {(filters.genre!=="All"||filters.mood!=="All"||filters.search||filters.bpmMin!==60||filters.bpmMax!==160) && (
    <button onClick={() => setFilters({ genre:"All", mood:"All", search:"", bpmMin:60, bpmMax:160, sort:"Newest" })}
      style={{ width:"100%", padding:8, background:"none", border:"1px solid rgba(176,42,26,0.3)", borderRadius:6, fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--red)", marginTop:8, transition:"background 0.2s" }}>
      Clear All Filters
    </button>
  )}
</aside>
```

);
};

// ── PLAYER BAR ───────────────────────────────────────────────────────
const PlayerBar = ({ audio }) => (
<motion.div initial={{ y:80 }} animate={{ y:0 }} exit={{ y:80 }} transition={{ type:“spring”, damping:24, stiffness:200 }}
style={{ position:“fixed”, bottom:0, left:0, right:0, zIndex:600, background:“rgba(10,9,7,0.96)”, borderTop:“1px solid rgba(221,216,204,0.08)”, backdropFilter:“blur(12px)”, padding:“10px 20px”, display:“flex”, alignItems:“center”, gap:14 }}>
<div style={{ minWidth:0, flex:“0 0 auto” }}>
<div style={{ fontFamily:”‘IM Fell English’,serif”, fontStyle:“italic”, fontSize:14, whiteSpace:“nowrap”, overflow:“hidden”, textOverflow:“ellipsis”, maxWidth:140 }}>{audio.current.title}</div>
<div style={{ fontSize:9, letterSpacing:“0.12em”, color:“var(–dust)”, marginTop:1 }}>{audio.current.genre} · {audio.current.bpm} BPM</div>
</div>
<button onClick={() => audio.play(audio.current)} style={{ width:32, height:32, borderRadius:“50%”, background:“var(–red)”, border:“none”, display:“flex”, alignItems:“center”, justifyContent:“center”, flexShrink:0 }}>
{audio.playing
? <span style={{ display:“flex”, gap:2 }}><span style={{ width:2,height:10,background:“white”,borderRadius:1 }}/><span style={{ width:2,height:10,background:“white”,borderRadius:1 }}/></span>
: <svg width="9" height="11" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="white"/></svg>
}
</button>
<div style={{ flex:1, minWidth:0 }} onClick={e => { const r=e.currentTarget.getBoundingClientRect(); audio.seek((e.clientX-r.left)/r.width); }}>
<Waveform playing={audio.playing} progress={audio.progress} bars={50} height={24} />
</div>
<div style={{ fontSize:9, color:“rgba(122,112,96,0.4)”, fontVariantNumeric:“tabular-nums”, flexShrink:0 }}>{audio.fmt(audio.progress*audio.duration)} / {audio.fmt(audio.duration)}</div>
<button onClick={audio.stop} style={{ background:“none”, border:“none”, color:“var(–dust)”, fontSize:14 }}>×</button>
</motion.div>
);

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function BeatsPage() {
const audio = useAudio();
const [filters, setFilters] = useState({ genre:“All”, mood:“All”, search:””, bpmMin:60, bpmMax:160, sort:“Newest” });
const [visible, setVisible] = useState(12);

const filtered = BEATS
.filter(b => {
if (filters.genre!==“All” && !b.tags.includes(filters.genre)) return false;
if (filters.mood!==“All” && b.mood!==filters.mood) return false;
if (filters.search && !b.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
if (b.bpm < filters.bpmMin || b.bpm > filters.bpmMax) return false;
return true;
})
.sort((a,b) => {
if (filters.sort===“Newest”) return b.num.localeCompare(a.num);
if (filters.sort===“Oldest”) return a.num.localeCompare(b.num);
if (filters.sort===“BPM ↑”) return a.bpm-b.bpm;
if (filters.sort===“BPM ↓”) return b.bpm-a.bpm;
return 0;
});

const shown = filtered.slice(0, visible);

return (
<>

```
  <div className="page-layout">
    <Sidebar filters={filters} setFilters={setFilters} counts={{ total:BEATS.length, filtered:filtered.length }} />

    <main style={{ padding:"32px 24px", paddingBottom:audio.current ? 100 : 40 }}>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:6 }}>001 / Catalogue</div>
        <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(36px,5vw,64px)", lineHeight:.9, marginBottom:6 }}>
          The <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>catalogue.</em>
        </h1>
        <p style={{ fontSize:11, color:"var(--dust)", letterSpacing:"0.06em" }}>{filtered.length} beat{filtered.length!==1?"s":""} · Drag the vinyl or tap $ to license · ▶ to play</p>
      </div>

      {/* Grid */}
      <div className="beat-grid">
        <AnimatePresence mode="popLayout">
          {shown.length > 0 ? shown.map(beat => (
            <BeatCard key={beat.num} beat={beat} audio={audio} onOpenModal={() => {}} />
          )) : (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ gridColumn:"1/-1", textAlign:"center", padding:"80px 20px" }}>
              <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:22, color:"rgba(221,216,204,0.3)", marginBottom:12 }}>No beats found.</div>
              <button onClick={() => setFilters({ genre:"All", mood:"All", search:"", bpmMin:60, bpmMax:160, sort:"Newest" })}
                style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", background:"none", border:"1px solid rgba(221,216,204,0.1)", color:"var(--dust)", padding:"10px 24px", borderRadius:6 }}>Clear Filters</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {visible < filtered.length && (
        <div style={{ textAlign:"center", marginTop:40 }}>
          <button onClick={() => setVisible(v => v+8)}
            style={{ fontSize:10, letterSpacing:"0.3em", textTransform:"uppercase", background:"none", border:"1px solid rgba(221,216,204,0.1)", color:"var(--dust)", padding:"12px 32px", borderRadius:6 }}>
            Load More — {filtered.length - visible} remaining
          </button>
        </div>
      )}
    </main>
  </div>

  {/* Player bar */}
  <AnimatePresence>
    {audio.current && <PlayerBar key="player" audio={audio} />}
  </AnimatePresence>
</>
```

);
}
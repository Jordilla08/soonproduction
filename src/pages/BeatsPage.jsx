import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import { Waveform, Tag } from "../components/UI.jsx"
import Nav from '../components/Nav.jsx'

// ── DATA ──────────────────────────────────────────────────────────────
const BEATS = [
  { num:"001", title:"Distant Summer",     genre:"Soul",      subgenre:"Boom Bap",  bpm:87,  key:"F Min",  mood:"Nostalgic",   duration:"3:14", price:35,  tags:["Soul","Boom Bap"],
    sample:{ original:"Trying to Hold On", artist:"Terry Callier", year:1974, label:"Cadet", elements:["Vocal chop","String loop"], clearance:"uncleared", note:"Contains uncleared sample. Artist assumes all clearance responsibility upon licensing." }},
  { num:"002", title:"Red Clay Road",      genre:"Jazz",      subgenre:"Jazz Soul", bpm:74,  key:"Bb Maj", mood:"Soulful",     duration:"2:58", price:35,  tags:["Soul","Jazz"],
    sample:{ original:"Maiden Voyage", artist:"Herbie Hancock", year:1965, label:"Blue Note", elements:["Piano chop","Re-harmonized melody"], clearance:"uncleared", note:"Contains uncleared sample. Artist assumes all clearance responsibility upon licensing." }},
  { num:"003", title:"Sunday Smoke",       genre:"Lo-Fi",     subgenre:"Soul",      bpm:82,  key:"G Min",  mood:"Chill",       duration:"3:32", price:35,  tags:["Soul","Lo-Fi"],
    sample:null },
  { num:"004", title:"Crates at Midnight", genre:"Boom Bap",  subgenre:"Classic",   bpm:91,  key:"D Min",  mood:"Dark",        duration:"2:44", price:35,  tags:["Boom Bap"],
    sample:{ original:"N/A — Original Drums", artist:"Original composition", year:2025, label:"SOON Production", elements:["Original drum pattern","Chopped synth stabs"], clearance:"cleared", note:"Fully original. No clearance required." }},
  { num:"005", title:"Felt That",          genre:"Trap",      subgenre:"Soul Trap", bpm:78,  key:"A Min",  mood:"Emotional",   duration:"3:08", price:35,  tags:["Soul","Trap"],
    sample:{ original:"For the Love of You", artist:"The Isley Brothers", year:1975, label:"T-Neck", elements:["Guitar interpolation","Bass line reference"], clearance:"interpolated", note:"Interpolated — melody re-recorded, not a direct sample. Still recommended to clear." }},
  { num:"006", title:"Gravel & Gold",      genre:"Soul",      subgenre:"Soulful",   bpm:84,  key:"E Min",  mood:"Warm",        duration:"3:22", price:35,  tags:["Soul"],
    sample:null },
  { num:"007", title:"Last Light",         genre:"Jazz",      subgenre:"Jazz Soul", bpm:72,  key:"C Maj",  mood:"Melancholic", duration:"4:01", price:35,  tags:["Soul","Jazz"],
    sample:{ original:"A Flower Is a Lovesome Thing", artist:"Billy Strayhorn", year:1956, label:"Felsted", elements:["Piano chop","Reversed horn texture"], clearance:"uncleared", note:"Contains uncleared sample. Artist assumes all clearance responsibility upon licensing." }},
  { num:"008", title:"Worn Leather",       genre:"Boom Bap",  subgenre:"Gritty",    bpm:88,  key:"F# Min", mood:"Gritty",      duration:"2:51", price:35,  tags:["Boom Bap"],
    sample:null },
  { num:"009", title:"3AM Diner",          genre:"Lo-Fi",     subgenre:"Lo-Fi",     bpm:76,  key:"Ab Maj", mood:"Late Night",  duration:"3:45", price:50,  tags:["Lo-Fi"],
    sample:{ original:"Loneliness", artist:"Ahmad Jamal", year:1970, label:"Impulse!", elements:["Bass chop","Atmosphere loop"], clearance:"uncleared", note:"Contains uncleared sample. Artist assumes all clearance responsibility upon licensing." }},
  { num:"010", title:"Smoke & Mirrors",    genre:"Trap",      subgenre:"Dark Trap", bpm:140, key:"C Min",  mood:"Aggressive",  duration:"2:38", price:50,  tags:["Trap"],
    sample:null },
  { num:"011", title:"Honest Work",        genre:"Soul",      subgenre:"Boom Bap",  bpm:90,  key:"D Maj",  mood:"Uplifting",   duration:"3:17", price:35,  tags:["Soul","Boom Bap"],
    sample:{ original:"People Make the World Go Round", artist:"The Stylistics", year:1972, label:"Avco", elements:["Horn stab chop","Rhythm loop"], clearance:"uncleared", note:"Contains uncleared sample. Artist assumes all clearance responsibility upon licensing." }},
  { num:"012", title:"River Stones",       genre:"Jazz",      subgenre:"Smooth",    bpm:68,  key:"G Maj",  mood:"Smooth",      duration:"3:55", price:50,  tags:["Jazz"],
    sample:null },
]

const TIERS = [
  { name:"Lease",     price:"$35",   perks:["MP3","100k streams","Non-exclusive","1 music video"] },
  { name:"Premium",   price:"$75",   perks:["WAV + MP3","500k streams","Non-exclusive","Unlimited videos"] },
  { name:"Exclusive", price:"$200+", perks:["WAV + Stems","Unlimited","Full ownership","Removed from store"] },
]

const GENRES   = ["All","Soul","Boom Bap","Jazz","Lo-Fi","Trap"]
const MOODS    = ["All","Nostalgic","Soulful","Chill","Dark","Emotional","Warm","Melancholic","Gritty","Late Night","Aggressive","Uplifting","Smooth"]
const SORT_OPT = ["Newest","Oldest","BPM ↑","BPM ↓","Price ↑","Price ↓"]

// Waveform and Tag imported from components/UI.jsx

// ── SIDEBAR ───────────────────────────────────────────────────────────
const Sidebar = ({ filters, setFilters, counts }) => {
  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  const Section = ({ title, children }) => (
    <div style={{ marginBottom:32 }}>
      <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
        {title}<span style={{ flex:1, height:1, background:"rgba(221,216,204,0.06)" }}/>
      </div>
      {children}
    </div>
  )

  return (
    <aside className="sidebar" style={{ position:"sticky", top:0, height:"100vh", overflowY:"auto", borderRight:"1px solid rgba(221,216,204,0.06)", padding:"32px 24px" }}>
      {/* logo back link */}
      <div style={{ marginBottom:40 }}>
        <Link to="/" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.25em", display:"block" }}>Soon</Link>
        <Link to="/" style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--dust)" }}>← Back to site</Link>
      </div>

      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", letterSpacing:"0.05em", marginBottom:4 }}>Catalogue</div>
      <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.2em", color:"var(--dust)", marginBottom:32 }}>{counts.total} beats · {counts.filtered} shown</div>

      {/* search */}
      <Section title="Search">
        <div style={{ position:"relative" }}>
          <input value={filters.search} onChange={e=>set("search",e.target.value)}
            placeholder="Search beats..."
            style={{ width:"100%", background:"rgba(221,216,204,0.03)", border:"1px solid rgba(221,216,204,0.08)", borderRadius:6, padding:"10px 14px 10px 34px", fontSize:"clamp(12px, 1.6vw, 14px)", color:"var(--offwhite)", outline:"none" }}
            onFocus={e=>e.target.style.borderColor="rgba(176,42,26,0.4)"}
            onBlur={e=>e.target.style.borderColor="rgba(221,216,204,0.08)"}
          />
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:"clamp(14px, 1.8vw, 16px)", color:"var(--dust)", pointerEvents:"none" }}>⌕</span>
        </div>
      </Section>

      {/* genre */}
      <Section title="Genre">
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {GENRES.map(g => (
            <Tag key={g} label={g} active={filters.genre===g} onClick={()=>set("genre",g)}/>
          ))}
        </div>
      </Section>

      {/* mood */}
      <Section title="Mood">
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {MOODS.map(m => (
            <Tag key={m} label={m} active={filters.mood===m} onClick={()=>set("mood",m)} color="#7a5040"/>
          ))}
        </div>
      </Section>

      {/* BPM */}
      <Section title={`BPM Range: ${filters.bpmMin}–${filters.bpmMax}`}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", color:"var(--dust)", marginBottom:6 }}>Min: {filters.bpmMin}</div>
            <input type="range" min={60} max={140} value={filters.bpmMin}
              onChange={e=>set("bpmMin",Math.min(Number(e.target.value),filters.bpmMax-5))}/>
          </div>
          <div>
            <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", color:"var(--dust)", marginBottom:6 }}>Max: {filters.bpmMax}</div>
            <input type="range" min={60} max={160} value={filters.bpmMax}
              onChange={e=>set("bpmMax",Math.max(Number(e.target.value),filters.bpmMin+5))}/>
          </div>
        </div>
      </Section>

      {/* price tier */}
      <Section title="License">
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {["All","Lease ($35)","Premium ($75)","Exclusive ($200+)"].map(p => (
            <button key={p} onClick={()=>set("priceTier",p)}
              style={{ textAlign:"left", background:"none", border:`1px solid ${filters.priceTier===p?"rgba(176,42,26,0.4)":"rgba(221,216,204,0.06)"}`, borderRadius:6, padding:"8px 12px", fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.15em", color:filters.priceTier===p?"var(--offwhite)":"var(--dust)", transition:"all .2s" }}
            >{p}</button>
          ))}
        </div>
      </Section>

      {/* sort */}
      <Section title="Sort">
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {SORT_OPT.map(s => (
            <Tag key={s} label={s} active={filters.sort===s} onClick={()=>set("sort",s)} color="#4a6070"/>
          ))}
        </div>
      </Section>

      {/* clear */}
      {(filters.genre!=="All"||filters.mood!=="All"||filters.search||filters.priceTier!=="All"||filters.bpmMin!==60||filters.bpmMax!==160) && (
        <button onClick={()=>setFilters({ genre:"All", mood:"All", search:"", priceTier:"All", bpmMin:60, bpmMax:160, sort:"Newest" })}
          style={{ width:"100%", padding:"10px", background:"none", border:"1px solid rgba(176,42,26,0.3)", borderRadius:6, fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--red)", transition:"all .2s", marginTop:8 }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(176,42,26,0.08)"}}
          onMouseLeave={e=>{e.currentTarget.style.background="none"}}
        >Clear All Filters</button>
      )}
    </aside>
  )
}

// ── BEAT CARD (unique expanded style) ─────────────────────────────────
const BeatCard = ({ beat, onOpenModal, onPlay, isPlaying, index }) => {
  const [flipped, setFlipped]   = useState(false)
  const [hovered, setHovered]   = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:"-40px" })

  // Mood color map
  const moodColors = {
    Nostalgic:"#8a6040", Soulful:"#7a4a30", Chill:"#3a6050",
    Dark:"#3a3050", Emotional:"#7a3040", Warm:"#8a5030",
    Melancholic:"#404870", Gritty:"#504040", "Late Night":"#304860",
    Aggressive:"#7a2020", Uplifting:"#4a7040", Smooth:"#405860",
  }
  const moodColor = moodColors[beat.mood] || "#5a5040"

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:.7, ease:[0.16,1,0.3,1], delay: index*0.04 }}
      style={{ perspective:1200, height:320 }}
    >
      <motion.div
        style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration:.55, ease:[0.4,0.2,0.2,1] }}
      >

        {/* ── FRONT ── */}
        <div
          onMouseEnter={()=>setHovered(true)}
          onMouseLeave={()=>setHovered(false)}
          style={{
            position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
            borderRadius:12, overflow:"hidden",
            border:`1px solid ${isPlaying?"rgba(176,42,26,0.5)":hovered?"rgba(221,216,204,0.12)":"rgba(221,216,204,0.06)"}`,
            background: isPlaying ? "rgba(176,42,26,0.05)" : "var(--card)",
            display:"flex", flexDirection:"column",
            transition:"border-color .3s, background .3s",
          }}
        >
          {/* color bar top — mood color */}
          <div style={{ height:3, background:`linear-gradient(to right, ${moodColor}, transparent)`, flexShrink:0 }}/>

          {/* top row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"16px 18px 0" }}>
            <span style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.3em", color:"rgba(122,112,96,0.3)" }}>{beat.num}</span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              {beat.sample && (
                <span style={{
                  fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.15em", textTransform:"uppercase",
                  padding:"2px 7px", borderRadius:20,
                  border: beat.sample.clearance==="cleared" ? "1px solid rgba(60,160,60,0.3)" : beat.sample.clearance==="interpolated" ? "1px solid rgba(200,160,40,0.25)" : "1px solid rgba(176,42,26,0.3)",
                  color: beat.sample.clearance==="cleared" ? "#6aaa6a" : beat.sample.clearance==="interpolated" ? "#c8a840" : "rgba(176,100,80,0.8)",
                  background: beat.sample.clearance==="cleared" ? "rgba(60,120,60,0.08)" : beat.sample.clearance==="interpolated" ? "rgba(160,120,30,0.08)" : "rgba(176,42,26,0.08)",
                }}>
                  {beat.sample.clearance==="cleared" ? "Cleared" : beat.sample.clearance==="interpolated" ? "Interp." : "Sample"}
                </span>
              )}
              {!beat.sample && (
                <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",textTransform:"uppercase",padding:"2px 7px",borderRadius:20,border:"1px solid rgba(60,160,60,0.25)",color:"#6aaa6a",background:"rgba(60,120,60,0.06)" }}>Original</span>
              )}
              <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.15em", textTransform:"uppercase", color:moodColor, border:`1px solid ${moodColor}40`, padding:"2px 8px", borderRadius:20 }}>{beat.mood}</span>
            </div>
          </div>

          {/* title */}
          <div style={{ padding:"10px 18px 0", flex:1 }}>
            <div onClick={()=>onOpenModal(beat)} style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1.2rem", color:"rgba(221,216,204,0.9)", lineHeight:1.1, marginBottom:4, cursor:"crosshair" }}>{beat.title}</div>
            <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--dust)" }}>{beat.genre} · {beat.subgenre}</div>
          </div>

          {/* info grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, margin:"14px 18px", background:"rgba(221,216,204,0.04)", borderRadius:8, overflow:"hidden" }}>
            {[["BPM", beat.bpm], ["KEY", beat.key], ["TIME", beat.duration]].map(([label, val]) => (
              <div key={label} style={{ padding:"8px 10px", background:"rgba(8,8,6,0.4)", textAlign:"center" }}>
                <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:2 }}>{label}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.85rem", letterSpacing:"0.05em", color:"var(--offwhite)", lineHeight:1 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* waveform */}
          <div style={{ padding:"0 18px", marginBottom:12 }}>
            <Waveform playing={isPlaying} bars={28} height={30}/>
          </div>

          {/* footer */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px 16px", flexShrink:0 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", color:"var(--offwhite)", lineHeight:1 }}>${beat.price}</div>
              <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--dust)" }}>Lease</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {/* play */}
              <button onClick={()=>onPlay(beat)} style={{
                width:32, height:32, borderRadius:"50%",
                border:`1px solid ${isPlaying?"var(--red)":"rgba(221,216,204,0.12)"}`,
                background:isPlaying?"var(--red)":"transparent",
                display:"flex", alignItems:"center", justifyContent:"center", transition:"all .25s",
              }}>
                {isPlaying
                  ? <span style={{ display:"flex", gap:2 }}><span style={{ width:2,height:8,background:"white",borderRadius:1 }}/><span style={{ width:2,height:8,background:"white",borderRadius:1 }}/></span>
                  : <svg width="7" height="9" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="var(--offwhite)"/></svg>
                }
              </button>
              {/* license flip */}
              <button onClick={()=>setFlipped(true)} style={{
                width:32, height:32, borderRadius:"50%",
                border:"1px solid rgba(221,216,204,0.12)", background:"transparent",
                fontSize:"clamp(12px, 1.5vw, 14px)", color:"var(--dust)", transition:"all .25s",
              }}
                onMouseEnter={e=>{e.target.style.borderColor="var(--red)";e.target.style.color="var(--red)"}}
                onMouseLeave={e=>{e.target.style.borderColor="rgba(221,216,204,0.12)";e.target.style.color="var(--dust)"}}
              >$</button>
              {/* expand modal */}
              <button onClick={()=>onOpenModal(beat)} style={{
                width:32, height:32, borderRadius:"50%",
                border:"1px solid rgba(221,216,204,0.12)", background:"transparent",
                fontSize:"clamp(14px, 1.8vw, 16px)", color:"var(--dust)", transition:"all .25s",
              }}
                onMouseEnter={e=>{e.target.style.borderColor="var(--offwhite)";e.target.style.color="var(--offwhite)"}}
                onMouseLeave={e=>{e.target.style.borderColor="rgba(221,216,204,0.12)";e.target.style.color="var(--dust)"}}
              >↗</button>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          transform:"rotateY(180deg)", borderRadius:12,
          border:"1px solid rgba(176,42,26,0.25)", background:"#0c0a08",
          padding:"18px 18px", display:"flex", flexDirection:"column",
        }}>
          <div style={{ height:3, background:`linear-gradient(to right, var(--red), transparent)`, flexShrink:0, marginBottom:14, borderRadius:2 }}/>
          <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.9rem", color:"rgba(221,216,204,0.5)", marginBottom:14 }}>{beat.title} — License Options</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, flex:1, justifyContent:"center" }}>
            {TIERS.map(tier => (
              <div key={tier.name} onClick={()=>onOpenModal(beat, tier.name)}
                style={{ padding:"10px 12px", borderRadius:8, border:"1px solid rgba(221,216,204,0.05)", background:"rgba(221,216,204,0.02)", cursor:"crosshair", transition:"all .2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(176,42,26,0.4)";e.currentTarget.style.background="rgba(176,42,26,0.06)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.05)";e.currentTarget.style.background="rgba(221,216,204,0.02)"}}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--offwhite)" }}>{tier.name}</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", color:"var(--red)", fontWeight:"normal" }}>{tier.price}</span>
                </div>
                <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)", color:"rgba(122,112,96,0.55)", letterSpacing:"0.05em" }}>{tier.perks.join(" · ")}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>setFlipped(false)} style={{ background:"none", border:"none", fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(122,112,96,0.35)", marginTop:12, transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="rgba(122,112,96,0.35)"}
          >↩ Back</button>
        </div>

      </motion.div>
    </motion.div>
  )
}

// ── BEAT MODAL ────────────────────────────────────────────────────────
const SampleBadge = ({ clearance }) => {
  const config = {
    cleared:      { label:"Cleared",       bg:"rgba(60,120,60,0.15)",  border:"rgba(60,160,60,0.3)",  color:"#6aaa6a" },
    uncleared:    { label:"Uncleared",     bg:"rgba(176,42,26,0.12)",  border:"rgba(176,42,26,0.35)", color:"var(--red)" },
    interpolated: { label:"Interpolated",  bg:"rgba(160,120,30,0.12)", border:"rgba(200,160,40,0.35)",color:"#c8a840" },
  }
  const c = config[clearance] || config.uncleared
  return (
    <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", textTransform:"uppercase", padding:"3px 10px", borderRadius:20, border:`1px solid ${c.border}`, background:c.bg, color:c.color }}>
      {c.label}
    </span>
  )
}

const BeatModal = ({ beat, initialTier, onClose }) => {
  const [tier, setTier]             = useState(initialTier||"Lease")
  const [playing, setPlaying]       = useState(false)
  const [progress, setProgress]     = useState(0)
  const [sampleOpen, setSampleOpen] = useState(false)
  const [tab, setTab]               = useState("license") // license | sample

  useEffect(()=>{
    if(!playing) return
    const t = setInterval(()=>setProgress(p=>{if(p>=1){setPlaying(false);return 0}return p+.004}),100)
    return()=>clearInterval(t)
  },[playing])

  // reset on beat change
  useEffect(()=>{ setTab("license"); setSampleOpen(false); setPlaying(false); setProgress(0) },[beat])

  const moodColors = { Nostalgic:"#8a6040",Soulful:"#7a4a30",Chill:"#3a6050",Dark:"#3a3050",Emotional:"#7a3040",Warm:"#8a5030",Melancholic:"#404870",Gritty:"#504040","Late Night":"#304860",Aggressive:"#7a2020",Uplifting:"#4a7040",Smooth:"#405860" }
  const moodColor = moodColors[beat.mood]||"#5a5040"
  const hasSample = !!beat.sample

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}
      style={{ position:"fixed",inset:0,background:"rgba(8,8,6,0.93)",zIndex:800,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",padding:16 }}>
      <motion.div initial={{y:24,opacity:0}} animate={{y:0,opacity:1}} exit={{y:24,opacity:0}}
        transition={{duration:.35,ease:[0.16,1,0.3,1]}}
        onClick={e=>e.stopPropagation()}
        className="modal-inner"
        style={{ width:"min(640px,100%)",background:"#0c0a08",border:"1px solid rgba(221,216,204,0.08)",borderRadius:14,padding:"36px 32px 28px",position:"relative",maxHeight:"92vh",overflowY:"auto" }}>

        <button onClick={onClose} style={{ position:"absolute",top:20,right:20,background:"none",border:"none",fontSize:"clamp(11px, 1.4vw, 12px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--dust)",transition:"color .2s" }}
          onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
        >✕ Close</button>

        {/* mood strip */}
        <div style={{ height:3,background:`linear-gradient(to right,${moodColor},transparent)`,borderRadius:2,marginBottom:24 }}/>

        {/* header */}
        <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:6 }}>{beat.num}</p>
        <h2 style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"2.2rem",lineHeight:1,marginBottom:6 }}>{beat.title}</h2>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:24,flexWrap:"wrap" }}>
          <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--dust)" }}>{beat.genre} · {beat.subgenre}</p>
          {hasSample && beat.sample.clearance && <SampleBadge clearance={beat.sample.clearance}/>}
          {!hasSample && <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.18em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,border:"1px solid rgba(60,160,60,0.3)",background:"rgba(60,120,60,0.12)",color:"#6aaa6a" }}>Original</span>}
        </div>

        {/* stat strip */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"rgba(221,216,204,0.04)",borderRadius:8,overflow:"hidden",marginBottom:20 }}>
          {[["BPM",beat.bpm],["KEY",beat.key],["TIME",beat.duration],["MOOD",beat.mood]].map(([l,v])=>(
            <div key={l} style={{ padding:"10px",background:"rgba(8,8,6,0.5)",textAlign:"center" }}>
              <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:3 }}>{l}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",color:"var(--offwhite)",lineHeight:1 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* waveform preview */}
        <div onClick={()=>setPlaying(p=>!p)} style={{ marginBottom:6,cursor:"crosshair" }}>
          <Waveform playing={playing} bars={60} height={48} progress={progress}/>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:24 }}>
          <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.3)" }}>{playing?"▐▐  Pause":"▶  Click to preview"}</p>
          <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)",color:"rgba(122,112,96,0.3)",fontVariantNumeric:"tabular-nums" }}>
            {String(Math.floor(progress*180/60)).padStart(2,"0")}:{String(Math.floor(progress*180%60)).padStart(2,"0")} / {beat.duration}
          </p>
        </div>

        {/* tab switcher */}
        <div style={{ display:"flex",gap:2,marginBottom:20,borderBottom:"1px solid rgba(221,216,204,0.06)",paddingBottom:0 }}>
          {["license","sample"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ background:"none",border:"none",fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.25em",textTransform:"uppercase",padding:"8px 16px",color:tab===t?"var(--offwhite)":"var(--dust)",borderBottom:`2px solid ${tab===t?"var(--red)":"transparent"}`,transition:"all .2s",marginBottom:-1 }}
            >{t==="sample" ? `Sample Info${!hasSample?" (Original)":""}` : "License"}</button>
          ))}
        </div>

        {/* ── LICENSE TAB ── */}
        <AnimatePresence mode="wait">
          {tab==="license" && (
            <motion.div key="license" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
              <div className="modal-tiers" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20 }}>
                {TIERS.map(t=>(
                  <div key={t.name} onClick={()=>setTier(t.name)}
                    style={{ border:`1px solid ${tier===t.name?"var(--red)":"rgba(221,216,204,0.07)"}`,borderRadius:10,padding:"14px 12px",cursor:"crosshair",background:tier===t.name?"rgba(176,42,26,0.06)":"rgba(221,216,204,0.02)",transition:"all .25s" }}>
                    <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--offwhite)",marginBottom:6 }}>{t.name}</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:"var(--red)",fontWeight:"normal",lineHeight:1,marginBottom:6 }}>{t.price}</div>
                    <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",color:"rgba(122,112,96,0.55)",lineHeight:1.8 }}>{t.perks.map(p=><div key={p}>— {p}</div>)}</div>
                  </div>
                ))}
              </div>

              {/* clearance warning if uncleared sample */}
              {hasSample && beat.sample.clearance==="uncleared" && (
                <div style={{ padding:"12px 14px",borderRadius:8,border:"1px solid rgba(176,42,26,0.2)",background:"rgba(176,42,26,0.05)",marginBottom:16 }}>
                  <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.08em",color:"rgba(176,100,80,0.9)",lineHeight:1.8 }}>
                    ⚠ This beat contains an uncleared sample. By licensing, you accept full responsibility for clearing the sample before commercial release. SOON Production assumes no liability.
                  </p>
                </div>
              )}

              <button style={{ width:"100%",padding:14,background:"var(--red)",border:"none",borderRadius:8,fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.05rem",letterSpacing:"0.2em",color:"var(--offwhite)",transition:"opacity .2s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
              >License — {TIERS.find(t=>t.name===tier)?.price}</button>
            </motion.div>
          )}

          {/* ── SAMPLE TAB ── */}
          {tab==="sample" && (
            <motion.div key="sample" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
              {!hasSample ? (
                /* original composition */
                <div style={{ padding:"24px",border:"1px solid rgba(60,160,60,0.15)",borderRadius:10,background:"rgba(60,120,60,0.04)",textAlign:"center" }}>
                  <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.3rem",color:"rgba(221,216,204,0.6)",marginBottom:8 }}>Original Composition</div>
                  <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.1em",color:"var(--dust)",lineHeight:2 }}>No samples used. All elements composed and arranged by SOON Production. No clearance required.</p>
                  <div style={{ marginTop:16,display:"flex",justifyContent:"center" }}>
                    <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"4px 14px",borderRadius:20,border:"1px solid rgba(60,160,60,0.3)",color:"#6aaa6a" }}>✓ Clear to release</span>
                  </div>
                </div>
              ) : (
                /* sample details */
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>

                  {/* source record */}
                  <div style={{ padding:"16px",borderRadius:10,border:"1px solid rgba(221,216,204,0.07)",background:"rgba(221,216,204,0.02)" }}>
                    <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:12 }}>Source Record</div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                      {[
                        ["Original Title", beat.sample.original],
                        ["Artist",         beat.sample.artist],
                        ["Year Released",  beat.sample.year],
                        ["Original Label", beat.sample.label],
                      ].map(([label,val])=>(
                        <div key={label}>
                          <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:3 }}>{label}</div>
                          <div style={{ fontSize:"clamp(12px, 1.6vw, 14px)",color:"var(--offwhite)",letterSpacing:"0.04em" }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* elements used */}
                  <div style={{ padding:"16px",borderRadius:10,border:"1px solid rgba(221,216,204,0.07)",background:"rgba(221,216,204,0.02)" }}>
                    <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:12 }}>Elements Used</div>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                      {beat.sample.elements.map(el=>(
                        <span key={el} style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.15em",padding:"4px 12px",borderRadius:20,border:"1px solid rgba(221,216,204,0.1)",color:"var(--offwhite)",background:"rgba(221,216,204,0.04)" }}>{el}</span>
                      ))}
                    </div>
                  </div>

                  {/* clearance status */}
                  <div style={{ padding:"14px 16px",borderRadius:10,border:`1px solid ${beat.sample.clearance==="cleared"?"rgba(60,160,60,0.2)":beat.sample.clearance==="interpolated"?"rgba(200,160,40,0.2)":"rgba(176,42,26,0.2)"}`, background:beat.sample.clearance==="cleared"?"rgba(60,120,60,0.05)":beat.sample.clearance==="interpolated"?"rgba(160,120,30,0.05)":"rgba(176,42,26,0.05)" }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8 }}>
                      <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)" }}>Clearance Status</div>
                      <SampleBadge clearance={beat.sample.clearance}/>
                    </div>
                    <p style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.06em",lineHeight:1.9,color:"rgba(221,216,204,0.5)" }}>{beat.sample.note}</p>
                  </div>

                  {/* whosampled link style */}
                  <a href={`https://www.whosampled.com/search/tracks/?q=${encodeURIComponent(beat.sample.original+" "+beat.sample.artist)}`}
                    target="_blank" rel="noreferrer"
                    style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--dust)",display:"flex",alignItems:"center",gap:8,transition:"color .2s",paddingTop:4 }}
                    onMouseEnter={e=>e.currentTarget.style.color="var(--offwhite)"}
                    onMouseLeave={e=>e.currentTarget.style.color="var(--dust)"}
                  >Search on WhoSampled ↗</a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ── ACTIVE FILTER PILLS ───────────────────────────────────────────────
const ActiveFilters = ({ filters, setFilters }) => {
  const active = []
  if(filters.genre!=="All")     active.push({ label:`Genre: ${filters.genre}`, clear:()=>setFilters(f=>({...f,genre:"All"})) })
  if(filters.mood!=="All")      active.push({ label:`Mood: ${filters.mood}`,   clear:()=>setFilters(f=>({...f,mood:"All"})) })
  if(filters.search)            active.push({ label:`"${filters.search}"`,     clear:()=>setFilters(f=>({...f,search:""})) })
  if(filters.priceTier!=="All") active.push({ label:filters.priceTier,         clear:()=>setFilters(f=>({...f,priceTier:"All"})) })
  if(filters.bpmMin!==60||filters.bpmMax!==160) active.push({ label:`${filters.bpmMin}–${filters.bpmMax} BPM`, clear:()=>setFilters(f=>({...f,bpmMin:60,bpmMax:160})) })

  if(!active.length) return null
  return (
    <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:24,alignItems:"center" }}>
      <span style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--dust)" }}>Active:</span>
      {active.map((a,i)=>(
        <motion.button key={i} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
          onClick={a.clear}
          style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.15em",padding:"4px 10px",borderRadius:20,border:"1px solid rgba(176,42,26,0.4)",background:"rgba(176,42,26,0.08)",color:"var(--red)",display:"flex",alignItems:"center",gap:6,transition:"all .2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(176,42,26,0.16)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(176,42,26,0.08)"}
        >{a.label} ×</motion.button>
      ))}
    </div>
  )
}

// ── PLAYER BAR ────────────────────────────────────────────────────────
const PlayerBar = ({ beat, onClose }) => {
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    if(!playing) return
    const t = setInterval(()=>setProgress(p=>{if(p>=1){setPlaying(false);return 0}return p+.003}),100)
    return()=>clearInterval(t)
  },[playing])

  return (
    <motion.div initial={{y:80}} animate={{y:0}} exit={{y:80}} transition={{type:"spring",damping:24,stiffness:200}}
      style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:600,background:"rgba(8,7,5,0.97)",borderTop:"1px solid rgba(221,216,204,0.08)",backdropFilter:"blur(12px)",padding:"12px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap" }}>
      <div style={{ minWidth:0,flex:"0 0 auto" }}>
        <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"0.9rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:150 }}>{beat.title}</div>
        <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--dust)",marginTop:1 }}>{beat.genre} · {beat.bpm} BPM · {beat.key}</div>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10,flex:"0 0 auto" }}>
        <button onClick={()=>setProgress(0)} style={{ background:"none",border:"none",color:"var(--dust)",fontSize:"0.65rem" }}>⟨⟨</button>
        <button onClick={()=>setPlaying(p=>!p)} style={{ width:34,height:34,borderRadius:"50%",background:"var(--red)",border:"none",display:"flex",alignItems:"center",justifyContent:"center" }}>
          {playing
            ? <span style={{ display:"flex",gap:2 }}><span style={{ width:2,height:10,background:"white",borderRadius:1 }}/><span style={{ width:2,height:10,background:"white",borderRadius:1 }}/></span>
            : <svg width="9" height="11" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="white"/></svg>
          }
        </button>
        <button onClick={()=>setProgress(0)} style={{ background:"none",border:"none",color:"var(--dust)",fontSize:"0.65rem" }}>⟩⟩</button>
      </div>
      <div style={{ flex:1,minWidth:100,cursor:"crosshair" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress((e.clientX-r.left)/r.width)}}>
        <Waveform playing={playing} bars={50} height={28} progress={progress}/>
      </div>
      <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",color:"var(--dust)",fontVariantNumeric:"tabular-nums",flex:"0 0 auto" }}>
        {String(Math.floor(progress*180/60)).padStart(2,"0")}:{String(Math.floor(progress*180%60)).padStart(2,"0")} / {beat.duration}
      </div>
      <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",border:"1px solid rgba(176,42,26,0.4)",padding:"4px 10px",borderRadius:20,color:"var(--red)",flex:"0 0 auto" }}>${beat.price}</span>
      <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--dust)",fontSize:"1rem",flex:"0 0 auto" }}>×</button>
    </motion.div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────────────────
const EmptyState = ({ onClear }) => (
  <motion.div initial={{opacity:0}} animate={{opacity:1}}
    style={{ gridColumn:"1/-1",textAlign:"center",padding:"80px 20px" }}>
    <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"2rem",color:"rgba(221,216,204,0.3)",marginBottom:16 }}>No beats found.</div>
    <p style={{ fontSize:"clamp(12px, 1.5vw, 13px)",letterSpacing:"0.2em",color:"var(--dust)",marginBottom:32 }}>Try adjusting your filters.</p>
    <button onClick={onClear}
      style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.25em",textTransform:"uppercase",background:"none",border:"1px solid rgba(221,216,204,0.15)",color:"var(--dust)",padding:"10px 24px",borderRadius:6,transition:"all .2s" }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--offwhite)"}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.15)";e.currentTarget.style.color="var(--dust)"}}
    >Clear Filters</button>
  </motion.div>
)

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function BeatsPage() {
  const [filters, setFilters] = useState({
    genre:"All", mood:"All", search:"", priceTier:"All", bpmMin:60, bpmMax:160, sort:"Newest"
  })
  const [modal, setModal]           = useState(null)
  const [currentBeat, setCurrentBeat] = useState(null)
  const [visible, setVisible]       = useState(12)

  const handlePlay = useCallback(beat => {
    setCurrentBeat(prev => prev?.num===beat.num ? null : beat)
  },[])

  const filtered = BEATS
    .filter(b => {
      if(filters.genre!=="All" && !b.tags.includes(filters.genre)) return false
      if(filters.mood!=="All"  && b.mood!==filters.mood) return false
      if(filters.search && !b.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      if(b.bpm < filters.bpmMin || b.bpm > filters.bpmMax) return false
      return true
    })
    .sort((a,b) => {
      if(filters.sort==="Newest")  return b.num.localeCompare(a.num)
      if(filters.sort==="Oldest")  return a.num.localeCompare(b.num)
      if(filters.sort==="BPM ↑")   return a.bpm-b.bpm
      if(filters.sort==="BPM ↓")   return b.bpm-a.bpm
      if(filters.sort==="Price ↑") return a.price-b.price
      if(filters.sort==="Price ↓") return b.price-a.price
      return 0
    })

  const shown = filtered.slice(0, visible)

  return (
    <>
      <Nav />
      <div className="page-layout" style={{ display:"grid", gridTemplateColumns:"260px 1fr", minHeight:"100vh", paddingTop:80 }}>

        {/* SIDEBAR */}
        <Sidebar filters={filters} setFilters={setFilters} counts={{ total:BEATS.length, filtered:filtered.length }}/>

        {/* MAIN */}
        <main className="beats-main" style={{ padding:"40px 32px", paddingBottom:100 }}>

          {/* header */}
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:8 }}>001 / Catalogue</div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,72px)", lineHeight:.9, marginBottom:8 }}>
              The <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>catalogue.</em>
            </h1>
            <p style={{ fontSize:"clamp(12px, 1.5vw, 13px)", color:"var(--dust)", letterSpacing:"0.08em" }}>
              {filtered.length} beat{filtered.length!==1?"s":""} · Click title to preview · $ to license · ▶ to play
            </p>
          </div>

          {/* active filter pills */}
          <ActiveFilters filters={filters} setFilters={setFilters}/>

          {/* sort bar (mobile) */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {SORT_OPT.map(s=>(
              <Tag key={s} label={s} active={filters.sort===s} onClick={()=>setFilters(f=>({...f,sort:s}))} color="#4a6070"/>
            ))}
          </div>

          {/* grid */}
          <motion.div layout className="beat-card-grid"
            style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
            <AnimatePresence mode="popLayout">
              {shown.length > 0
                ? shown.map((beat,i) => (
                    <motion.div key={beat.num} layout
                      initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.96}}
                      transition={{duration:.35,delay:i*.03}}>
                      <BeatCard beat={beat} onOpenModal={(b,tier)=>setModal({beat:b,tier})} onPlay={handlePlay} isPlaying={currentBeat?.num===beat.num} index={i}/>
                    </motion.div>
                  ))
                : <EmptyState onClear={()=>setFilters({genre:"All",mood:"All",search:"",priceTier:"All",bpmMin:60,bpmMax:160,sort:"Newest"})}/>
              }
            </AnimatePresence>
          </motion.div>

          {/* load more */}
          {visible < filtered.length && (
            <div style={{ textAlign:"center", marginTop:48 }}>
              <button onClick={()=>setVisible(v=>v+8)}
                style={{ fontSize:"clamp(11px, 1.4vw, 12px)",letterSpacing:"0.3em",textTransform:"uppercase",background:"none",border:"1px solid rgba(221,216,204,0.1)",color:"var(--dust)",padding:"12px 32px",borderRadius:6,transition:"all .25s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--offwhite)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.1)";e.currentTarget.style.color="var(--dust)"}}
              >Load More — {filtered.length - visible} remaining</button>
            </div>
          )}
        </main>
      </div>

      {/* modal */}
      <AnimatePresence>
        {modal && <BeatModal beat={modal.beat} initialTier={modal.tier} onClose={()=>setModal(null)}/>}
      </AnimatePresence>

      {/* player */}
      <AnimatePresence>
        {currentBeat && <PlayerBar key={currentBeat.num} beat={currentBeat} onClose={()=>setCurrentBeat(null)}/>}
      </AnimatePresence>
    </>
  )
}

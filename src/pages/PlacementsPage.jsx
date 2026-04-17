import { useState, useRef, useEffect } from “react”
import { motion, AnimatePresence, useInView } from “framer-motion”
import Nav from “../components/Nav.jsx”

// ── DATA ──────────────────────────────────────────────────────────────
// Replace with real placements as they come in.
// status: “released” | “upcoming” | “in-progress”
// type: “placement” | “project”

const PLACEMENTS = [
{
id:“pl001”,
type:“placement”,
status:“released”,
title:“Gravel & Gold”,
artist:“Solo Release”,
artistHandle:”@soonproduction”,
role:“Producer, Composer”,
beat:“006”,
beatTitle:“Gravel & Gold”,
genre:“Soul”,
date:“April 2025”,
platform:“SoundCloud”,
platformUrl:”#”,
description:“First official release under SOON Production. Soul-driven, fully original composition. A statement of direction.”,
colors:[”#1a1008”,”#2a1c0e”,”#0e0c06”],
highlight:true,
},
{
id:“pl002”,
type:“placement”,
status:“released”,
title:“Sunday Smoke”,
artist:“Solo Release”,
artistHandle:”@soonproduction”,
role:“Producer, Composer”,
beat:“003”,
beatTitle:“Sunday Smoke”,
genre:“Lo-Fi Soul”,
date:“March 2025”,
platform:“SoundCloud”,
platformUrl:”#”,
description:“Lo-fi soul instrumental. Written late on a Sunday. The mood was already in the room.”,
colors:[”#0e1008”,”#141a0e”,”#080c06”],
highlight:false,
},
{
id:“pl003”,
type:“project”,
status:“in-progress”,
title:“First Tape”,
artist:“SOON Production”,
artistHandle:”@soonproduction”,
role:“Producer, A&R, Creative Director”,
beat:null,
genre:“Soul / Boom Bap”,
date:“Summer 2025”,
platform:null,
platformUrl:null,
description:“A short-form project. 5–7 beats, fully produced. No features yet. A document of where the sound is right now.”,
colors:[”#181010”,”#241818”,”#0e0c0c”],
highlight:true,
},
{
id:“pl004”,
type:“project”,
status:“in-progress”,
title:“Photo + Sound Series”,
artist:“SOON Production”,
artistHandle:”@soonproduction”,
role:“Producer, Photographer, Director”,
beat:null,
genre:“Visual / Audio”,
date:“2025”,
platform:null,
platformUrl:null,
description:“A series pairing original beats with photography. Each release is a single image and a single track. Sound and image as one thing.”,
colors:[”#0c1018”,”#141820”,”#08090e”],
highlight:false,
},
{
id:“pl005”,
type:“placement”,
status:“upcoming”,
title:“Untitled Collab”,
artist:“TBA”,
artistHandle:null,
role:“Producer”,
beat:null,
genre:“Soul”,
date:“2025”,
platform:null,
platformUrl:null,
description:“Studio session with a Brooklyn artist. Beat from the catalogue. Details TBA.”,
colors:[”#141010”,”#201818”,”#0c0808”],
highlight:false,
},
]

const CREDITS = [
{ role:“Production”,         detail:“All beats produced by SOON Production on the MPC Live 3” },
{ role:“Engineering”,        detail:“Mix & recording sessions at Marco’s Studio, Queens, NY” },
{ role:“Photography”,        detail:“All photography shot on Sony A7III + 24-70mm GM II” },
{ role:“Creative Direction”, detail:“Visual identity, rollout, and art direction by SOON Production” },
]

const STATS = [
{ num:“12”,     label:“Beats in catalogue” },
{ num:“2”,      label:“Solo releases” },
{ num:“2”,      label:“Projects in progress” },
{ num:“2025”,   label:“Year founded” },
]

// ── STYLES ────────────────────────────────────────────────────────────
// ── NAV ───────────────────────────────────────────────────────────────

// ── STATUS BADGE ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
const config = {
released:    { label:“Released”,     color:”#6aaa6a”, border:“rgba(60,160,60,0.3)”,  bg:“rgba(60,120,60,0.1)”  },
upcoming:    { label:“Upcoming”,     color:”#c8a840”, border:“rgba(200,160,40,0.3)”, bg:“rgba(160,120,30,0.1)” },
“in-progress”:{ label:“In Progress”, color:”#6090c8”, border:“rgba(80,120,180,0.3)”, bg:“rgba(60,90,150,0.1)”  },
}
const c = config[status]||config.upcoming
return (
<span style={{ fontSize:“clamp(8px, 1vw, 9px)”,letterSpacing:“0.2em”,textTransform:“uppercase”,padding:“3px 10px”,borderRadius:20,border:`1px solid ${c.border}`,background:c.bg,color:c.color }}>
{c.label}
</span>
)
}

// ── TYPE BADGE ────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => (
<span style={{ fontSize:“clamp(8px, 1vw, 9px)”,letterSpacing:“0.2em”,textTransform:“uppercase”,padding:“2px 8px”,borderRadius:20,border:“1px solid rgba(221,216,204,0.08)”,color:“var(–dust)” }}>
{type===“placement” ? “Placement” : “Project”}
</span>
)

// ── FEATURED PLACEMENT CARD ───────────────────────────────────────────
const FeaturedCard = ({ item, index }) => {
const [hovered, setHovered] = useState(false)
const ref = useRef(null)
const inView = useInView(ref, { once:true, margin:”-40px” })

return (
<motion.div ref={ref}
initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{}}
transition={{duration:.8,ease:[0.16,1,0.3,1],delay:index*0.1}}
onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
style={{ border:`1px solid ${hovered?"rgba(176,42,26,0.25)":"rgba(221,216,204,0.06)"}`,borderRadius:12,overflow:“hidden”,background:“rgba(221,216,204,0.02)”,transition:“border-color .3s” }}
>
{/* visual header */}
<div style={{ position:“relative”,height:180,overflow:“hidden” }}>
<motion.div animate={{ scale:hovered?1.04:1 }} transition={{ duration:.6,ease:[0.16,1,0.3,1] }}
style={{ position:“absolute”,inset:0,background:`linear-gradient(135deg,${item.colors[0]},${item.colors[1]},${item.colors[2]})` }}/>
<div style={{ position:“absolute”,inset:0,background:“linear-gradient(to top,rgba(8,8,6,0.8),transparent 60%)” }}/>

```
    {/* badges top left */}
    <div style={{ position:"absolute",top:14,left:14,display:"flex",gap:8,flexWrap:"wrap" }}>
      <StatusBadge status={item.status}/>
      <TypeBadge type={item.type}/>
    </div>

    {/* genre top right */}
    <div style={{ position:"absolute",top:14,right:14,fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(221,216,204,0.35)",border:"1px solid rgba(221,216,204,0.08)",padding:"2px 10px",borderRadius:20 }}>
      {item.genre}
    </div>

    {/* title overlay */}
    <div style={{ position:"absolute",bottom:14,left:18 }}>
      <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.4rem",lineHeight:1.1,marginBottom:4 }}>{item.title}</div>
      <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(221,216,204,0.45)" }}>{item.artist}</div>
    </div>
  </div>

  {/* content */}
  <div style={{ padding:"18px 20px 20px" }}>
    <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)",color:"var(--dust)",lineHeight:1.9,letterSpacing:"0.04em",marginBottom:18 }}>{item.description}</p>

    {/* meta row */}
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10 }}>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        <div>
          <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)" }}>Role — </span>
          <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)",color:"var(--offwhite)",letterSpacing:"0.04em" }}>{item.role}</span>
        </div>
        <div>
          <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)" }}>Date — </span>
          <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)",color:"var(--offwhite)",letterSpacing:"0.04em" }}>{item.date}</span>
        </div>
      </div>

      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
        {item.beat && (
          <a href="/beats" style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.18em",textTransform:"uppercase",border:"1px solid rgba(176,42,26,0.35)",padding:"5px 12px",borderRadius:20,color:"var(--red)",transition:"all .2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(176,42,26,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >Hear the Beat →</a>
        )}
        {item.platformUrl && item.status==="released" && (
          <a href={item.platformUrl} target="_blank" rel="noreferrer"
            style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.18em",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:"rgba(221,216,204,0.06)",border:"1px solid rgba(221,216,204,0.1)",color:"var(--offwhite)",transition:"all .2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(221,216,204,0.1)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(221,216,204,0.06)"}
          >{item.platform} ↗</a>
        )}
      </div>
    </div>
  </div>
</motion.div>
```

)
}

// ── PLACEMENT ROW ─────────────────────────────────────────────────────
const PlacementRow = ({ item, index }) => {
const [hovered, setHovered] = useState(false)
const ref = useRef(null)
const inView = useInView(ref, { once:true, margin:”-20px” })

return (
<motion.div ref={ref}
initial={{opacity:0,x:-12}} animate={inView?{opacity:1,x:0}:{}}
transition={{duration:.65,ease:[0.16,1,0.3,1],delay:index*0.06}}
onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
style={{ display:“flex”,gap:20,padding:“20px 0”,borderTop:“1px solid rgba(221,216,204,0.05)”,alignItems:“flex-start”,transition:“background .2s” }}
>
{/* color swatch */}
<div style={{ width:64,height:64,borderRadius:8,flexShrink:0,overflow:“hidden”,position:“relative” }}>
<motion.div animate={{ scale:hovered?1.08:1 }} transition={{ duration:.4 }}
style={{ position:“absolute”,inset:0,background:`linear-gradient(135deg,${item.colors[0]},${item.colors[1]},${item.colors[2]})` }}/>
</div>

```
  {/* main info */}
  <div style={{ flex:1,minWidth:0 }}>
    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap" }}>
      <StatusBadge status={item.status}/>
      <TypeBadge type={item.type}/>
      <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)" }}>{item.date}</span>
    </div>
    <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.05rem",color:hovered?"var(--offwhite)":"rgba(221,216,204,0.8)",marginBottom:4,transition:"color .2s" }}>{item.title}</div>
    <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.12em",color:"var(--dust)",marginBottom:6 }}>{item.artist} · {item.role}</div>
    <p style={{ fontSize:"clamp(11px, 1.4vw, 12px)",color:"rgba(122,112,96,0.6)",lineHeight:1.8,letterSpacing:"0.03em",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{item.description}</p>
  </div>

  {/* right side */}
  <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8,flexShrink:0 }}>
    <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)",border:"1px solid rgba(221,216,204,0.06)",padding:"2px 8px",borderRadius:20 }}>{item.genre}</span>
    {item.beat && (
      <a href="/beats" style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--red)",transition:"opacity .2s" }}
        onMouseEnter={e=>e.currentTarget.style.opacity=".6"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}
      >Beat →</a>
    )}
    {item.platformUrl && item.status==="released" && (
      <a href={item.platformUrl} target="_blank" rel="noreferrer"
        style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--dust)",transition:"color .2s" }}
        onMouseEnter={e=>e.target.style.color="var(--offwhite)"}
        onMouseLeave={e=>e.target.style.color="var(--dust)"}
      >{item.platform} ↗</a>
    )}
  </div>
</motion.div>
```

)
}

// ── STAT BLOCK ────────────────────────────────────────────────────────
const StatBlock = ({ num, label, index }) => {
const ref = useRef(null)
const inView = useInView(ref, { once:true })
return (
<motion.div ref={ref}
initial={{opacity:0,y:16}} animate={inView?{opacity:1,y:0}:{}}
transition={{duration:.7,ease:[0.16,1,0.3,1],delay:index*0.08}}
style={{ padding:“28px 24px”,border:“1px solid rgba(221,216,204,0.06)”,borderRadius:10,background:“rgba(221,216,204,0.02)” }}
>
<div style={{ fontFamily:”‘Bebas Neue’,sans-serif”,fontSize:“clamp(36px,5vw,60px)”,lineHeight:1,color:“var(–offwhite)”,marginBottom:6 }}>{num}</div>
<div style={{ fontSize:“clamp(10px, 1.3vw, 11px)”,letterSpacing:“0.2em”,textTransform:“uppercase”,color:“var(–dust)” }}>{label}</div>
</motion.div>
)
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────
export default function PlacementsPage() {
const [activeFilter, setActiveFilter] = useState(“All”)

const filters = [“All”,“Released”,“In Progress”,“Upcoming”,“Placements”,“Projects”]

const filtered = PLACEMENTS.filter(p => {
if(activeFilter===“All”)         return true
if(activeFilter===“Released”)    return p.status===“released”
if(activeFilter===“In Progress”) return p.status===“in-progress”
if(activeFilter===“Upcoming”)    return p.status===“upcoming”
if(activeFilter===“Placements”)  return p.type===“placement”
if(activeFilter===“Projects”)    return p.type===“project”
return true
})

const highlighted = filtered.filter(p=>p.highlight)
const rest        = filtered.filter(p=>!p.highlight)

return (
<>

```
  <Nav/>

  <main style={{ paddingTop:80 }}>

    {/* ── HERO ── */}
    <div className="page-pad" style={{ padding:"72px 32px 0" }}>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.9,ease:[0.16,1,0.3,1]}}>

        <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:12 }}>004 / Work</div>

        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(52px,9vw,120px)",lineHeight:.88 }}>
            Placements<br/>
            <em style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"0.7em",color:"var(--dust)" }}>& Projects.</em>
          </h1>
          <div style={{ maxWidth:320,textAlign:"right" }}>
            <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)",color:"var(--dust)",lineHeight:2,letterSpacing:"0.04em",marginBottom:10 }}>
              Everything made under the SOON Production name. Solo releases, collaborations, and projects in motion.
            </p>
            <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)",color:"rgba(122,112,96,0.4)",letterSpacing:"0.08em",fontStyle:"italic" }}>
              Early days. The work speaks.
            </p>
          </div>
        </div>

        {/* red rule */}
        <div style={{ height:1,background:"linear-gradient(to right,rgba(176,42,26,0.6),rgba(221,216,204,0.08),transparent)",marginBottom:40 }}/>
      </motion.div>

      {/* ── STATS ── */}
      <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:56 }}>
        {STATS.map((s,i)=><StatBlock key={s.label} num={s.num} label={s.label} index={i}/>)}
      </div>
    </div>

    {/* ── PRODUCER CARD ── */}
    <div className="page-pad" style={{ padding:"0 32px 56px" }}>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-40px"}} transition={{duration:.8}}>
        <div style={{ border:"1px solid rgba(221,216,204,0.07)",borderRadius:12,overflow:"hidden",background:"rgba(221,216,204,0.02)",display:"flex",gap:0 }}>

          {/* color panel */}
          <div style={{ width:6,background:"linear-gradient(to bottom,var(--red),rgba(176,42,26,0.2))",flexShrink:0 }}/>

          <div style={{ padding:"28px 28px",display:"flex",gap:28,alignItems:"center",flex:1,flexWrap:"wrap" }}>
            {/* avatar placeholder */}
            <div style={{ width:72,height:72,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#1a0e08,#2a1c10)",border:"1px solid rgba(221,216,204,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(12px, 1.5vw, 14px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(221,216,204,0.3)" }}>
              S
            </div>

            <div style={{ flex:1,minWidth:200 }}>
              <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:6 }}>Producer · Photographer · Creative Director</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",letterSpacing:"0.1em",marginBottom:4 }}>SOON PRODUCTION</div>
              <div style={{ fontSize:"clamp(11px, 1.4vw, 12px)",color:"var(--dust)",letterSpacing:"0.06em",lineHeight:1.8 }}>Brooklyn, NY · Est. 2025 · MPC Live 3 · Sony A7III</div>
            </div>

            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <a href="/beats" style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"8px 20px",border:"1px solid rgba(221,216,204,0.12)",borderRadius:6,color:"var(--offwhite)",transition:"all .2s",textAlign:"center" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(221,216,204,0.3)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(221,216,204,0.12)"}
              >Browse Beats</a>
              <a href="/#contact" style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"8px 20px",background:"var(--red)",borderRadius:6,color:"var(--offwhite)",transition:"opacity .2s",textAlign:"center" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}
              >Work Together</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* ── FILTERS ── */}
    <div className="page-pad" style={{ padding:"0 32px 32px" }}>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {filters.map(f=>(
          <button key={f} onClick={()=>setActiveFilter(f)}
            style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"6px 16px",borderRadius:20,border:`1px solid ${activeFilter===f?"var(--red)":"rgba(221,216,204,0.08)"}`,background:activeFilter===f?"rgba(176,42,26,0.1)":"transparent",color:activeFilter===f?"var(--offwhite)":"var(--dust)",transition:"all .25s" }}
          >{f}</button>
        ))}
      </div>
    </div>

    {/* ── HIGHLIGHTED CARDS ── */}
    {highlighted.length > 0 && (
      <div className="page-pad" style={{ padding:"0 32px 40px" }}>
        <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)",marginBottom:20,display:"flex",alignItems:"center",gap:12 }}>
          Featured Work <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.05)" }}/>
        </div>
        <div className="featured-pair" style={{ display:"grid",gridTemplateColumns:highlighted.length>1?"1fr 1fr":"1fr",gap:14 }}>
          {highlighted.map((item,i)=><FeaturedCard key={item.id} item={item} index={i}/>)}
        </div>
      </div>
    )}

    {/* ── ALL PLACEMENTS LIST ── */}
    {rest.length > 0 && (
      <div className="page-pad" style={{ padding:"0 32px 60px" }}>
        <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)",marginBottom:0,display:"flex",alignItems:"center",gap:12 }}>
          All Work
          <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.05)" }}/>
          <span style={{ fontSize:"clamp(8px, 1vw, 9px)" }}>{rest.length} entries</span>
        </div>
        {rest.map((item,i)=><PlacementRow key={item.id} item={item} index={i}/>)}
      </div>
    )}

    {/* empty state */}
    {filtered.length === 0 && (
      <div style={{ textAlign:"center",padding:"80px 32px" }}>
        <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.6rem",color:"rgba(221,216,204,0.3)",marginBottom:12 }}>Nothing here yet.</div>
        <button onClick={()=>setActiveFilter("All")} style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.25em",textTransform:"uppercase",background:"none",border:"1px solid rgba(221,216,204,0.1)",color:"var(--dust)",padding:"10px 24px",borderRadius:6 }}>Show everything</button>
      </div>
    )}

    {/* ── CREDITS ── */}
    <div className="page-pad" style={{ padding:"0 32px 60px",borderTop:"1px solid rgba(221,216,204,0.06)" }}>
      <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8}} style={{ paddingTop:48 }}>
        <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:28,display:"flex",alignItems:"center",gap:12 }}>
          Credits <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.06)" }}/>
        </div>
        <div className="credits-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,background:"rgba(221,216,204,0.04)",borderRadius:10,overflow:"hidden" }}>
          {CREDITS.map((c,i)=>(
            <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{delay:i*0.06,duration:.6}}
              style={{ padding:"20px 22px",background:"rgba(8,8,6,0.5)" }}>
              <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--red)",marginBottom:8 }}>{c.role}</div>
              <div style={{ fontSize:"clamp(12px, 1.5vw, 14px)",color:"rgba(221,216,204,0.65)",lineHeight:1.8,letterSpacing:"0.04em" }}>{c.detail}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* ── BOTTOM CTA ── */}
    <div style={{ borderTop:"1px solid rgba(221,216,204,0.06)",padding:"64px 32px",textAlign:"center",position:"relative",overflow:"hidden" }}>
      {/* ghost text */}
      <div style={{ position:"absolute",fontFamily:"'Bebas Neue',sans-serif",fontSize:"28vw",color:"transparent",WebkitTextStroke:"1px rgba(221,216,204,0.025)",left:"50%",top:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",lineHeight:1,whiteSpace:"nowrap",userSelect:"none" }}>SOON</div>

      <div style={{ position:"relative",zIndex:2 }}>
        <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.8}}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(32px,5vw,64px)",lineHeight:.95,marginBottom:16 }}>
            Want your name<br/>on the <em style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"var(--red)" }}>credits?</em>
          </div>
          <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)",color:"var(--dust)",letterSpacing:"0.08em",marginBottom:36,lineHeight:2 }}>
            Beat placement · Custom production · Creative direction
          </p>
          <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
            <a href="/beats" style={{ padding:"13px 32px",border:"1px solid rgba(221,216,204,0.12)",borderRadius:6,fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",letterSpacing:"0.2em",color:"var(--offwhite)",transition:"all .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(221,216,204,0.3)"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(221,216,204,0.12)"}
            >Browse Beats</a>
            <a href="/#contact" style={{ padding:"13px 32px",background:"var(--red)",borderRadius:6,fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",letterSpacing:"0.2em",color:"var(--offwhite)",transition:"opacity .2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >Get in Touch</a>
          </div>
        </motion.div>
      </div>
    </div>
  </main>
</>
```

)
}
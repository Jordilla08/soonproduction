import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import Nav from "../components/Nav.jsx"

// ── DATA ──────────────────────────────────────────────────────────────
const TAGS = ["All", "Studio", "MPC", "Shoot", "On Location", "Session", "Process"]

const ENTRIES = [
  {
    id:"bts001",
    type:"studio",
    title:"The Flip That Became 'Distant Summer'",
    date:"March 14, 2025",
    location:"Home Studio, Brooklyn",
    tags:["MPC","Process"],
    excerpt:"Found a Terry Callier record at a spot in Flatbush. Took it home, dropped the needle, and knew within 30 seconds. Spent three hours on the chop before it felt right.",
    body:`Found a Terry Callier record at a spot in Flatbush — $3, slightly warped, perfect. Took it home, dropped the needle, and knew within 30 seconds there was something in the strings.

The challenge with Callier is the timing is so human. His band breathes differently than a click track. Chopping it on the MPC meant finding the pocket in the imperfection, not fighting it.

Three hours in, I had something. Not the beat — just the sample chopped right. The beat came after midnight. Sometimes that's how it works.`,
    beat:"001",
    beatTitle:"Distant Summer",
    photos:[
      { colors:["#1a1008","#2a1c0e","#0e0c06"], caption:"Terry Callier, 1974. $3 at a spot in Flatbush." },
      { colors:["#0e1008","#141a0e","#080c06"], caption:"MPC Live 3. Where everything starts." },
      { colors:["#181008","#24180e","#0e0c06"], caption:"3AM. The beat came together here." },
    ],
    featured:true,
    colors:["#1a1008","#2a1c0e","#0e0c06"],
  },
  {
    id:"bts002",
    type:"shoot",
    title:"Press Shoot: The Stare",
    date:"March 22, 2025",
    location:"SOON Studio, Brooklyn",
    tags:["Shoot","Session"],
    excerpt:"Told him to forget the camera was there. It took about 20 minutes. Then he stopped performing and started just being. That's the shot.",
    body:`Press shoots are uncomfortable by default. You're asking someone to be themselves while pointing a lens at them — it doesn't make sense.

The trick I've found is patience. Set up, do a few frames early to let them get it out of their system, then put the camera down and just talk. Let 20 minutes pass. Then pick it back up.

He didn't even notice I was shooting again. That's the frame that ended up being the one.

Shot on the A7III, 24-70 GM II, window light only. f/2.0, 1/200s, ISO 800.`,
    beat:null,
    photos:[
      { colors:["#141010","#201818","#0c0808"], caption:"Window light. No setup. No reflectors." },
      { colors:["#180e0e","#2a1414","#100808"], caption:"Between setups. This was the real one." },
    ],
    featured:false,
    colors:["#141010","#201818","#0c0808"],
  },
  {
    id:"bts003",
    type:"studio",
    title:"Studio Session with Marco — Red Clay Road",
    date:"March 8, 2025",
    location:"Marco's Studio, Queens",
    tags:["Studio","Session","Process"],
    excerpt:"First time recording at Marco's spot. Tracked the session from setup to final mix. This is what it looks like when two people who trust each other just work.",
    body:`Marco's been engineering for 12 years. Walking into his space is like walking into someone's brain — every piece of gear placed for a reason, every cable managed like it matters.

We started with 'Red Clay Road' because the Herbie Hancock chop needed space in the low end. Marco heard it immediately. Made three adjustments I wouldn't have thought of. That's what a real engineer does.

Six hours. Tracked the bass, did two vocal reference passes with a feature artist who came through, then spent the last hour just on the mix. Walked out with something finished.

Brought the A7III. Shot everything.`,
    beat:"002",
    beatTitle:"Red Clay Road",
    photos:[
      { colors:["#0c1018","#141820","#08090e"], caption:"Marco's board. 12 years of sessions in that room." },
      { colors:["#181210","#2a1e14","#100c08"], caption:"Tracking the bass. 11PM." },
      { colors:["#0e0c10","#18141c","#080608"], caption:"Playback. This is where you hear what you actually made." },
      { colors:["#101818","#182424","#080e0e"], caption:"Reference vocal pass. The room changes when the mic is hot." },
    ],
    featured:true,
    colors:["#0c1018","#141820","#08090e"],
  },
  {
    id:"bts004",
    type:"location",
    title:"Flatbush Crate Dig",
    date:"February 28, 2025",
    location:"Flatbush, Brooklyn",
    tags:["On Location","Process"],
    excerpt:"Three hours. Four spots. Spent $31. Came back with six records. Two of them became beats. That's a good ratio.",
    body:`There's a spot on Church Ave that doesn't look like anything. Half the records are water damaged. The owner doesn't care if you're there or not. That's the kind of place you find things.

Pulled six records total across four spots that day. The Terry Callier that became 'Distant Summer.' A Weldon Irvine I'm still sitting on. A CTI compilation that had one usable break. Three others I'm not ready to talk about yet.

The dig is the research. The MPC is the lab. The beat is the result. You can't skip the first step.`,
    beat:null,
    photos:[
      { colors:["#181410","#241e14","#0e0c08"], caption:"Church Ave spot. Doesn't look like anything. That's the point." },
      { colors:["#0e0c08","#181410","#080806"], caption:"$31 total. Six records. Two became beats." },
      { colors:["#161210","#221c16","#0c0a08"], caption:"The Weldon Irvine. Still sitting on this one." },
    ],
    featured:false,
    colors:["#181410","#241e14","#0e0c08"],
  },
  {
    id:"bts005",
    type:"shoot",
    title:"Underground Show — Bushwick",
    date:"April 5, 2025",
    location:"Bushwick, Brooklyn",
    tags:["Shoot","On Location","Session"],
    excerpt:"200 people in a space built for 80. No stage lighting worth talking about. Shot at ISO 3200 and stopped caring about noise halfway through the first set.",
    body:`The best shows are the ones that shouldn't work on paper.

No proper stage. Lights that were basically just colored bulbs someone strung up that afternoon. Sound system that kept cutting out between acts. And the energy was better than anything I've shot at a proper venue.

Shot the whole thing at ISO 3200-6400. Grain everywhere. Motion blur on half the frames. But there's something in those images that a clean, well-lit show can't give you — the actual feeling of being in the room.

That's what I'm always chasing. Not the perfect image. The right one.`,
    beat:null,
    photos:[
      { colors:["#100814","#1c1020","#08060c"], caption:"200 people. Space built for 80. Perfect." },
      { colors:["#200808","#3a1010","#100404"], caption:"ISO 6400. The grain is part of it." },
      { colors:["#0e1018","#141820","#08090e"], caption:"Between sets. The room breathing." },
      { colors:["#141010","#201818","#0c0808"], caption:"Last act. Everyone knew something was happening." },
    ],
    featured:false,
    colors:["#100814","#1c1020","#08060c"],
  },
  {
    id:"bts006",
    type:"process",
    title:"MPC Bible — Week 3 Notes",
    date:"April 10, 2025",
    location:"Home Studio, Brooklyn",
    tags:["MPC","Process"],
    excerpt:"Sampling is harder than it looks. The chop is easy. Finding where the pocket lives in someone else's music — that's the work.",
    body:`Three weeks into the MPC Bible. The chapters on timestretch changed how I hear samples. Before, I was fighting the timing. Now I'm using it.

The thing nobody tells you about sampling is that the imperfection is the point. When J Dilla played things slightly off the grid, it wasn't an accident and it wasn't a mistake — it was a choice. The MPC lets you make that choice deliberately.

This week: worked on 'Honest Work' (the Stylistics chop), spent two days on a Rhodes interpolation I can't get right yet, and figured out something about layering kicks that I'm not ready to explain but can hear clearly.

Still learning. That's the whole point.`,
    beat:"011",
    beatTitle:"Honest Work",
    photos:[
      { colors:["#0e0c08","#181410","#080806"], caption:"MPC Bible. Week 3. Pages 84-112." },
      { colors:["#141008","#201a0e","#0c0a06"], caption:"The Stylistics. 1972. T-Neck Records." },
    ],
    featured:false,
    colors:["#0e0c08","#181410","#080806"],
  },
  {
    id:"bts007",
    type:"shoot",
    title:"Window Light Series — Portrait Sessions",
    date:"April 12, 2025",
    location:"Home Studio, Brooklyn",
    tags:["Shoot","Process"],
    excerpt:"No strobes. No reflectors. One window, afternoon light, and whatever the subject brings to the room. Simple is the hardest thing to do.",
    body:`I've been doing a series of portrait sessions using only available light — specifically the west-facing window in the studio between 3PM and 5PM. The light is warm, directional, and unforgiving. If the subject isn't present, you'll see it immediately.

f/1.8 means almost everything except the eyes is soft. That puts all the weight on expression. There's nowhere to hide.

Done three sessions so far. Planning six more before I put together anything formal. Learning more about how people occupy space than I expected to.`,
    beat:null,
    photos:[
      { colors:["#181410","#24200e","#0e0c08"], caption:"3PM light. West window. That's the whole setup." },
      { colors:["#1a1210","#281c18","#0e0a0c"], caption:"f/1.8. The eyes have to carry everything." },
      { colors:["#141210","#1e1a16","#0c0a0c"], caption:"Session three. Something is clicking." },
    ],
    featured:true,
    colors:["#181410","#24200e","#0e0c08"],
  },
]

// ── STYLES ────────────────────────────────────────────────────────────
// ── NAV ───────────────────────────────────────────────────────────────

// ── PHOTO PLACEHOLDER ─────────────────────────────────────────────────
const Photo = ({ data, style={}, onClick }) => (
  <div onClick={onClick} style={{ position:"relative",overflow:"hidden",background:`linear-gradient(135deg,${data.colors[0]},${data.colors[1]},${data.colors[2]})`,cursor:onClick?"crosshair":"default",...style }}>
    <div style={{ position:"absolute",bottom:8,left:10,fontSize:"0.28rem",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(221,216,204,0.14)",pointerEvents:"none" }}>[ Add A7III photo ]</div>
    {data.caption && (
      <div style={{ position:"absolute",bottom:0,left:0,right:0,padding:"20px 14px 10px",background:"linear-gradient(to top,rgba(8,8,6,0.8),transparent)" }}>
        <p style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.1em",color:"rgba(221,216,204,0.45)",fontStyle:"italic" }}>{data.caption}</p>
      </div>
    )}
  </div>
)

// ── TYPE BADGE ────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  const config = {
    studio:   { label:"Studio Session", color:"rgba(120,80,40,0.8)",  border:"rgba(160,110,60,0.3)"  },
    shoot:    { label:"Photo Shoot",    color:"rgba(60,80,120,0.8)",  border:"rgba(80,110,160,0.3)"  },
    location: { label:"On Location",   color:"rgba(60,100,60,0.8)",  border:"rgba(80,140,80,0.3)"   },
    process:  { label:"Process Notes", color:"rgba(80,60,120,0.8)",  border:"rgba(110,80,160,0.3)"  },
  }
  const c = config[type]||config.process
  return (
    <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,background:c.color,border:`1px solid ${c.border}`,color:"rgba(221,216,204,0.85)" }}>
      {c.label}
    </span>
  )
}

// ── FEATURED ENTRY CARD ───────────────────────────────────────────────
const FeaturedCard = ({ entry, onOpen }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:"-40px" })
  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.8,ease:[0.16,1,0.3,1]}}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={()=>onOpen(entry)}
      style={{ border:`1px solid ${hovered?"rgba(176,42,26,0.2)":"rgba(221,216,204,0.06)"}`,borderRadius:10,overflow:"hidden",cursor:"crosshair",transition:"border-color .3s",background:"rgba(221,216,204,0.02)" }}
    >
      {/* photo */}
      <div style={{ position:"relative",aspectRatio:"16/9",overflow:"hidden" }}>
        <motion.div animate={{ scale:hovered?1.04:1 }} transition={{ duration:.6,ease:[0.16,1,0.3,1] }}
          style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]},${entry.colors[2]})` }}/>
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to top,rgba(8,8,6,0.7) 0%,transparent 60%)" }}/>
        <div style={{ position:"absolute",top:14,left:14,display:"flex",gap:8,alignItems:"center" }}>
          <TypeBadge type={entry.type}/>
          {entry.featured && <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,background:"rgba(176,42,26,0.3)",border:"1px solid rgba(176,42,26,0.4)",color:"var(--red)" }}>Featured</span>}
        </div>
        <motion.div animate={{ opacity:hovered?1:0 }}
          style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:48,height:48,borderRadius:"50%",background:"rgba(8,8,6,0.7)",border:"1px solid rgba(221,216,204,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem" }}>
          ↗
        </motion.div>
      </div>
      {/* content */}
      <div style={{ padding:"20px 22px 22px" }}>
        <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--dust)",marginBottom:8 }}>
          {entry.date} · {entry.location}
        </div>
        <h2 style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.3rem",lineHeight:1.15,marginBottom:10,color:"rgba(221,216,204,0.9)" }}>{entry.title}</h2>
        <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)",color:"var(--dust)",lineHeight:1.9,letterSpacing:"0.04em",marginBottom:16 }}>{entry.excerpt}</p>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {entry.tags.map(t=>(
              <span key={t} style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.18em",textTransform:"uppercase",padding:"2px 8px",borderRadius:20,border:"1px solid rgba(221,216,204,0.08)",color:"var(--dust)" }}>{t}</span>
            ))}
          </div>
          {entry.beat && (
            <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",textTransform:"uppercase",color:"var(--red)",border:"1px solid rgba(176,42,26,0.3)",padding:"2px 10px",borderRadius:20 }}>
              Beat: {entry.beatTitle}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── ENTRY ROW (non-featured) ──────────────────────────────────────────
const EntryRow = ({ entry, onOpen, index }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:"-30px" })
  return (
    <motion.div ref={ref}
      initial={{opacity:0,x:-16}} animate={inView?{opacity:1,x:0}:{}}
      transition={{duration:.7,ease:[0.16,1,0.3,1],delay:index*0.05}}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={()=>onOpen(entry)}
      style={{ display:"flex",gap:20,padding:"20px 0",borderTop:"1px solid rgba(221,216,204,0.05)",cursor:"crosshair",transition:"all .3s",alignItems:"flex-start" }}
    >
      {/* thumb */}
      <div style={{ width:80,height:80,borderRadius:6,flexShrink:0,overflow:"hidden",position:"relative" }}>
        <motion.div animate={{ scale:hovered?1.08:1 }} transition={{ duration:.5 }}
          style={{ position:"absolute",inset:0,background:`linear-gradient(135deg,${entry.colors[0]},${entry.colors[1]},${entry.colors[2]})` }}/>
      </div>
      {/* text */}
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap" }}>
          <TypeBadge type={entry.type}/>
          <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)" }}>{entry.date}</span>
        </div>
        <h3 style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.05rem",lineHeight:1.2,marginBottom:6,color:hovered?"var(--offwhite)":"rgba(221,216,204,0.8)",transition:"color .2s" }}>{entry.title}</h3>
        <p style={{ fontSize:"clamp(11px, 1.4vw, 12px)",color:"var(--dust)",lineHeight:1.8,letterSpacing:"0.03em",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{entry.excerpt}</p>
      </div>
      {/* arrow */}
      <motion.div animate={{ opacity:hovered?1:0,x:hovered?0:8 }} transition={{ duration:.25 }}
        style={{ fontSize:"0.8rem",color:"var(--dust)",flexShrink:0,paddingTop:4 }}>→</motion.div>
    </motion.div>
  )
}

// ── ENTRY READER (full open) ──────────────────────────────────────────
const EntryReader = ({ entry, onClose }) => {
  const [lightboxPhoto, setLightboxPhoto] = useState(null)

  useEffect(()=>{
    const h = e => { if(e.key==="Escape") lightboxPhoto ? setLightboxPhoto(null) : onClose() }
    window.addEventListener("keydown",h)
    return()=>window.removeEventListener("keydown",h)
  },[onClose,lightboxPhoto])

  // Lock body scroll
  useEffect(()=>{ document.body.style.overflow="hidden"; return()=>{ document.body.style.overflow="" } },[])

  const paragraphs = entry.body.split("\n\n").filter(Boolean)

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,zIndex:800,background:"rgba(5,4,3,0.98)",overflowY:"auto",backdropFilter:"blur(4px)" }}>

      {/* reader nav */}
      <div style={{ position:"sticky",top:0,zIndex:10,background:"rgba(8,8,6,0.95)",borderBottom:"1px solid rgba(221,216,204,0.06)",padding:"14px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",backdropFilter:"blur(10px)" }}>
        <button onClick={onClose} style={{ background:"none",border:"none",fontSize:"clamp(11px, 1.4vw, 12px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--dust)",display:"flex",alignItems:"center",gap:8,transition:"color .2s" }}
          onMouseEnter={e=>e.currentTarget.style.color="var(--offwhite)"} onMouseLeave={e=>e.currentTarget.style.color="var(--dust)"}
        >← Journal</button>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.85rem",letterSpacing:"0.2em",color:"rgba(221,216,204,0.3)" }}>SOON / JOURNAL</div>
        <div style={{ display:"flex",gap:8,alignItems:"center" }}>
          <TypeBadge type={entry.type}/>
        </div>
      </div>

      <div style={{ maxWidth:880,margin:"0 auto",padding:"60px 32px 100px" }}>
        <div className="entry-layout" style={{ display:"grid",gridTemplateColumns:"1fr 280px",gap:60,alignItems:"start" }}>

          {/* main content */}
          <div>
            {/* hero photo */}
            <Photo data={entry.photos[0]} style={{ width:"100%",aspectRatio:"16/9",borderRadius:8,marginBottom:32 }}/>

            {/* header */}
            <div style={{ marginBottom:32 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12,flexWrap:"wrap" }}>
                <TypeBadge type={entry.type}/>
                {entry.featured && <span style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"3px 10px",borderRadius:20,border:"1px solid rgba(176,42,26,0.4)",color:"var(--red)" }}>Featured</span>}
              </div>
              <h1 style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"clamp(28px,4vw,48px)",lineHeight:1.1,marginBottom:12 }}>{entry.title}</h1>
              <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--dust)" }}>
                {entry.date} · {entry.location}
              </div>
            </div>

            {/* divider */}
            <div style={{ height:1,background:"linear-gradient(to right,rgba(176,42,26,0.4),transparent)",marginBottom:32 }}/>

            {/* body text */}
            <div className="entry-body">
              {paragraphs.map((p,i)=>(
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* photo strip */}
            {entry.photos.length > 1 && (
              <div style={{ marginTop:40 }}>
                <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:16,display:"flex",alignItems:"center",gap:12 }}>
                  From the session <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.06)" }}/>
                </div>
                <div className="photo-strip" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6 }}>
                  {entry.photos.slice(1).map((photo,i)=>(
                    <motion.div key={i} whileHover={{ scale:1.02 }} transition={{ duration:.3 }}
                      onClick={()=>setLightboxPhoto(photo)}
                      style={{ cursor:"crosshair" }}>
                      <Photo data={photo} style={{ aspectRatio:"4/3",borderRadius:6 }}/>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* tags */}
            <div style={{ marginTop:40,paddingTop:32,borderTop:"1px solid rgba(221,216,204,0.06)",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center" }}>
              <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)" }}>Tags:</span>
              {entry.tags.map(t=>(
                <span key={t} style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.18em",textTransform:"uppercase",padding:"4px 12px",borderRadius:20,border:"1px solid rgba(221,216,204,0.08)",color:"var(--dust)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* sidebar */}
          <div className="entry-sidebar" style={{ position:"sticky",top:80,borderLeft:"1px solid rgba(221,216,204,0.06)",paddingLeft:32 }}>

            {/* beat link */}
            {entry.beat && (
              <div style={{ padding:"18px",borderRadius:10,border:"1px solid rgba(176,42,26,0.2)",background:"rgba(176,42,26,0.04)",marginBottom:24 }}>
                <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"var(--red)",marginBottom:8 }}>Beat from this session</div>
                <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.1rem",color:"var(--offwhite)",marginBottom:10 }}>{entry.beatTitle}</div>
                <Link to="/beats" style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--red)",display:"flex",alignItems:"center",gap:6,transition:"opacity .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                >Listen & License →</Link>
              </div>
            )}

            {/* session details */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
                Session Info <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.06)" }}/>
              </div>
              {[["Date",entry.date],["Location",entry.location],["Photos",`${entry.photos.length} shot${entry.photos.length>1?"s":""}`]].map(([l,v])=>(
                <div key={l} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)",marginBottom:2 }}>{l}</div>
                  <div style={{ fontSize:"clamp(12px, 1.5vw, 13px)",color:"var(--offwhite)",letterSpacing:"0.04em" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* photo count thumbnails */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
                Photos <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.06)" }}/>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4 }}>
                {entry.photos.map((p,i)=>(
                  <div key={i} onClick={()=>setLightboxPhoto(p)}
                    style={{ aspectRatio:"1",borderRadius:4,background:`linear-gradient(135deg,${p.colors[0]},${p.colors[1]})`,cursor:"crosshair",transition:"opacity .2s" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity=".7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                  />
                ))}
              </div>
            </div>

            {/* related entries */}
            <div>
              <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
                Related <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.06)" }}/>
              </div>
              {ENTRIES.filter(e=>e.id!==entry.id && e.tags.some(t=>entry.tags.includes(t))).slice(0,3).map(e=>(
                <button key={e.id} onClick={()=>onClose()}
                  style={{ display:"flex",gap:10,alignItems:"center",background:"none",border:"none",width:"100%",textAlign:"left",padding:"8px 0",borderBottom:"1px solid rgba(221,216,204,0.04)",cursor:"crosshair" }}>
                  <div style={{ width:40,height:40,borderRadius:4,flexShrink:0,background:`linear-gradient(135deg,${e.colors[0]},${e.colors[1]})` }}/>
                  <div>
                    <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)",fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"rgba(221,216,204,0.7)",lineHeight:1.2 }}>{e.title}</div>
                    <div style={{ fontSize:"clamp(8px, 1vw, 9px)",letterSpacing:"0.15em",color:"var(--dust)",marginTop:2 }}>{e.date}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* photo lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setLightboxPhoto(null)}
            style={{ position:"fixed",inset:0,zIndex:900,background:"rgba(5,4,3,0.97)",display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
            <motion.div initial={{scale:.95}} animate={{scale:1}} exit={{scale:.95}}
              onClick={e=>e.stopPropagation()}
              style={{ width:"min(800px,90vw)",position:"relative" }}>
              <Photo data={lightboxPhoto} style={{ width:"100%",aspectRatio:"4/3",borderRadius:8 }}/>
              <button onClick={()=>setLightboxPhoto(null)} style={{ position:"absolute",top:-40,right:0,background:"none",border:"none",fontSize:"clamp(11px, 1.4vw, 12px)",letterSpacing:"0.25em",textTransform:"uppercase",color:"var(--dust)" }}>✕ Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────
export default function JournalPage() {
  const [activeTag, setActiveTag]     = useState("All")
  const [openEntry, setOpenEntry]     = useState(null)
  const [visibleCount, setVisible]    = useState(10)

  const filtered = activeTag==="All"
    ? ENTRIES
    : ENTRIES.filter(e=>e.tags.includes(activeTag))

  const featuredEntries = filtered.filter(e=>e.featured)
  const regularEntries  = filtered.filter(e=>!e.featured)

  return (
    <>
      
      <Nav/>

      <main style={{ paddingTop:80 }}>

        {/* page header */}
        <div className="page-pad" style={{ padding:"60px 32px 0" }}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
            <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.4)",marginBottom:10 }}>003 / Journal</div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginBottom:20 }}>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(48px,8vw,96px)",lineHeight:.9 }}>
                Behind the <em style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"0.8em",color:"var(--dust)" }}>work.</em>
              </h1>
              <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)",color:"var(--dust)",maxWidth:300,lineHeight:2,letterSpacing:"0.04em",textAlign:"right" }}>
                Studio sessions. Crate digs. Shoots. Process notes. The stuff that doesn't make it to the final release.
              </p>
            </div>

            {/* divider */}
            <div style={{ height:1,background:"linear-gradient(to right,rgba(176,42,26,0.5),rgba(221,216,204,0.06),transparent)",marginBottom:32 }}/>

            {/* tag filters */}
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:48 }}>
              {TAGS.map(tag=>(
                <button key={tag} onClick={()=>{ setActiveTag(tag); setVisible(10) }}
                  style={{ fontSize:"clamp(10px, 1.2vw, 11px)",letterSpacing:"0.2em",textTransform:"uppercase",padding:"6px 16px",borderRadius:20,border:`1px solid ${activeTag===tag?"var(--red)":"rgba(221,216,204,0.08)"}`,background:activeTag===tag?"rgba(176,42,26,0.1)":"transparent",color:activeTag===tag?"var(--offwhite)":"var(--dust)",transition:"all .25s" }}
                >{tag}</button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* featured entries grid */}
        {featuredEntries.length > 0 && (
          <div className="page-pad" style={{ padding:"0 32px 48px" }}>
            <div className="featured-grid" style={{ display:"grid",gridTemplateColumns:featuredEntries.length>1?"1fr 1fr":"1fr",gap:16 }}>
              {featuredEntries.map(entry=>(
                <FeaturedCard key={entry.id} entry={entry} onOpen={setOpenEntry}/>
              ))}
            </div>
          </div>
        )}

        {/* all entries list */}
        {regularEntries.length > 0 && (
          <div className="page-pad" style={{ padding:"0 32px 60px" }}>
            <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)",letterSpacing:"0.35em",textTransform:"uppercase",color:"rgba(122,112,96,0.35)",marginBottom:0,display:"flex",alignItems:"center",gap:14 }}>
              All Entries
              <span style={{ flex:1,height:1,background:"rgba(221,216,204,0.05)" }}/>
              <span style={{ fontSize:"clamp(8px, 1vw, 9px)" }}>{regularEntries.length} entries</span>
            </div>
            {regularEntries.slice(0,visibleCount).map((entry,i)=>(
              <EntryRow key={entry.id} entry={entry} onOpen={setOpenEntry} index={i}/>
            ))}
            {visibleCount < regularEntries.length && (
              <div style={{ textAlign:"center",marginTop:32 }}>
                <button onClick={()=>setVisible(v=>v+5)}
                  style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.3em",textTransform:"uppercase",background:"none",border:"1px solid rgba(221,216,204,0.08)",color:"var(--dust)",padding:"10px 28px",borderRadius:6,transition:"all .25s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--offwhite)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.08)";e.currentTarget.style.color="var(--dust)"}}
                >Load More</button>
              </div>
            )}
          </div>
        )}

        {/* empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center",padding:"80px 32px" }}>
            <div style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:"1.6rem",color:"rgba(221,216,204,0.3)",marginBottom:12 }}>Nothing here yet.</div>
            <button onClick={()=>setActiveTag("All")} style={{ fontSize:"clamp(10px, 1.3vw, 11px)",letterSpacing:"0.25em",textTransform:"uppercase",background:"none",border:"1px solid rgba(221,216,204,0.1)",color:"var(--dust)",padding:"10px 24px",borderRadius:6 }}>Show all entries</button>
          </div>
        )}

        {/* bottom CTA */}
        <div style={{ borderTop:"1px solid rgba(221,216,204,0.06)",padding:"64px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(28px,4vw,52px)",lineHeight:.95,marginBottom:12 }}>
              Want to work<br/>with <em style={{ fontFamily:"'IM Fell English',serif",fontStyle:"italic",color:"var(--red)" }}>SOON?</em>
            </div>
            <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)",color:"var(--dust)",lineHeight:2,letterSpacing:"0.04em" }}>Beats, photography, creative direction. Let's build something together.</p>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            <Link to="/beats" style={{ display:"block",textAlign:"center",padding:"13px",border:"1px solid rgba(221,216,204,0.12)",borderRadius:6,fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",letterSpacing:"0.2em",color:"var(--offwhite)",transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.3)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.12)"}}
            >Browse Beats</Link>
            <Link to="/#contact" style={{ display:"block",textAlign:"center",padding:"13px",background:"var(--red)",borderRadius:6,fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",letterSpacing:"0.2em",color:"var(--offwhite)",transition:"opacity .2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >Get in Touch</Link>
          </div>
        </div>
      </main>

      {/* entry reader */}
      <AnimatePresence>
        {openEntry && <EntryReader key={openEntry.id} entry={openEntry} onClose={()=>setOpenEntry(null)}/>}
      </AnimatePresence>
    </>
  )
}

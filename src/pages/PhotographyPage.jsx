import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Link } from "react-router-dom"
import Nav from "../components/Nav.jsx"

// ── DATA ──────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Portrait", "Street", "Artist", "Event", "Editorial"]

const PHOTOS = [
  {
    id:"p001", title:"Still Burning",       category:"Portrait",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/1.8", shutter:"1/200s", iso:"400",
    date:"March 2025", location:"Brooklyn, NY", featured:true,
    colors:["#1a0e08","#2e1a10","#0e0806"],
    aspect:"portrait", description:"Available light portrait session. Late afternoon, brick wall, no reflectors.",
  },
  {
    id:"p002", title:"Corner Store",        category:"Street",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/5.6", shutter:"1/500s", iso:"800",
    date:"February 2025", location:"Flatbush, Brooklyn", featured:false,
    colors:["#0e1018","#1a2030","#080c12"],
    aspect:"landscape", description:"Midday street. Caught between the neon and the pavement.",
  },
  {
    id:"p003", title:"Before the Set",      category:"Artist",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.0", shutter:"1/160s", iso:"1600",
    date:"April 2025", location:"Studio Session, Queens", featured:false,
    colors:["#180e0e","#2a1414","#100808"],
    aspect:"portrait", description:"Green room, 20 minutes before showtime. Caught something real.",
  },
  {
    id:"p004", title:"Red Light District",  category:"Street",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.8", shutter:"1/60s", iso:"3200",
    date:"January 2025", location:"Manhattan, NY", featured:false,
    colors:["#200808","#3a1010","#100404"],
    aspect:"portrait", description:"Night walk. The city doesn't sleep and neither does the light.",
  },
  {
    id:"p005", title:"Sound Check",         category:"Event",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/4.0", shutter:"1/250s", iso:"2000",
    date:"March 2025", location:"Prospect Park, Brooklyn", featured:false,
    colors:["#0e1810","#162814","#080e08"],
    aspect:"landscape", description:"Two hours before the crowd arrived. The calm before.",
  },
  {
    id:"p006", title:"Window Light",        category:"Portrait",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/1.8", shutter:"1/320s", iso:"200",
    date:"February 2025", location:"Home Studio, Brooklyn", featured:false,
    colors:["#181410","#2a2018","#100e08"],
    aspect:"square", description:"Single window. No setup. Just the light doing what it does.",
  },
  {
    id:"p007", title:"Overflow",            category:"Event",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/3.5", shutter:"1/320s", iso:"1600",
    date:"April 2025", location:"Bushwick, Brooklyn", featured:false,
    colors:["#100814","#1c1020","#08060c"],
    aspect:"landscape", description:"Underground showcase. 200 people in a space built for 80.",
  },
  {
    id:"p008", title:"The Stare",           category:"Artist",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.0", shutter:"1/200s", iso:"800",
    date:"March 2025", location:"SOON Studio, Brooklyn", featured:false,
    colors:["#141010","#201814","#0c0808"],
    aspect:"portrait", description:"Press shoot. Told him to forget the camera was there. He did.",
  },
  {
    id:"p009", title:"Rain on Glass",       category:"Editorial",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.8", shutter:"1/100s", iso:"1250",
    date:"January 2025", location:"Crown Heights, Brooklyn", featured:false,
    colors:["#0c1018","#141820","#08090e"],
    aspect:"landscape", description:"Shot through a taxi window in the rain. Didn't plan it.",
  },
  {
    id:"p010", title:"Back to the Wall",    category:"Portrait",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.2", shutter:"1/250s", iso:"640",
    date:"April 2025", location:"Red Hook, Brooklyn", featured:false,
    colors:["#181010","#2a1818","#100c0c"],
    aspect:"portrait", description:"Grafitti wall. Afternoon sun. She brought the energy.",
  },
  {
    id:"p011", title:"After Hours",         category:"Street",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.8", shutter:"1/40s", iso:"4000",
    date:"February 2025", location:"Bed-Stuy, Brooklyn", featured:false,
    colors:["#0e0c10","#18141c","#080608"],
    aspect:"landscape", description:"2AM. Corner store still open. Bodega cat watching everything.",
  },
  {
    id:"p012", title:"First Row",           category:"Event",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.8", shutter:"1/400s", iso:"3200",
    date:"March 2025", location:"The Knitting Factory, Brooklyn", featured:false,
    colors:["#180c08","#281410","#100808"],
    aspect:"landscape", description:"Live set. Front row energy. You can feel it in the blur.",
  },
  {
    id:"p013", title:"Between Takes",       category:"Artist",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/1.8", shutter:"1/125s", iso:"1000",
    date:"April 2025", location:"Recording Studio, Queens", featured:false,
    colors:["#141010","#1e1818","#0c0c0c"],
    aspect:"square", description:"Studio session. Between takes. Nobody was performing anymore.",
  },
  {
    id:"p014", title:"Grain & Light",       category:"Editorial",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/4.0", shutter:"1/60s", iso:"6400",
    date:"January 2025", location:"Fort Greene, Brooklyn", featured:false,
    colors:["#181814","#242018","#100e0c"],
    aspect:"portrait", description:"Pushed the ISO until it broke. Then shot anyway.",
  },
  {
    id:"p015", title:"Stage Left",          category:"Event",
    camera:"Sony A7III", lens:"24-70mm GM II", aperture:"f/2.8", shutter:"1/500s", iso:"2500",
    date:"April 2025", location:"Elsewhere, Brooklyn", featured:false,
    colors:["#0c1018","#10182a","#080810"],
    aspect:"landscape", description:"Shot from the wings. The performer had no idea.",
  },
]

// ── STYLES ────────────────────────────────────────────────────────────
// ── NAV ───────────────────────────────────────────────────────────────

// ── PHOTO PLACEHOLDER ─────────────────────────────────────────────────
// In production: replace with <img src={photo.src} />
const PhotoBg = ({ photo, style={}, children }) => (
  <div style={{
    position:"relative", overflow:"hidden",
    background:`linear-gradient(135deg, ${photo.colors[0]} 0%, ${photo.colors[1]} 50%, ${photo.colors[2]} 100%)`,
    ...style
  }}>
    <div style={{ position:"absolute", bottom:10, left:12, fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(221,216,204,0.15)", pointerEvents:"none" }}>
      [ {photo.title} — Add A7III photo here ]
    </div>
    {children}
  </div>
)

// ── FEATURED HERO ─────────────────────────────────────────────────────
const FeaturedHero = ({ photo, onOpen }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="hero-featured"
      initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={()=>onOpen(photo)}
      style={{ position:"relative", height:"75vh", overflow:"hidden", cursor:"crosshair", marginBottom:8 }}
    >
      <PhotoBg photo={photo} style={{ width:"100%", height:"100%" }}>
        {/* vignette */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,8,6,0.85) 0%, rgba(8,8,6,0.1) 50%, transparent 100%)", pointerEvents:"none" }}/>

        {/* zoom on hover */}
        <motion.div animate={{ scale: hovered ? 1.03 : 1 }} transition={{ duration:.6, ease:[0.16,1,0.3,1] }}
          style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${photo.colors[0]}, ${photo.colors[1]}, ${photo.colors[2]})` }}/>

        {/* featured badge */}
        <div style={{ position:"absolute", top:24, left:24, fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.3em", textTransform:"uppercase", border:"1px solid rgba(176,42,26,0.5)", color:"var(--red)", padding:"4px 12px", borderRadius:20, background:"rgba(8,8,6,0.6)" }}>
          Featured
        </div>

        {/* info overlay */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"32px 32px 28px" }}>
          <motion.div animate={{ y: hovered ? -4 : 0 }} transition={{ duration:.4 }}>
            <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(221,216,204,0.4)", marginBottom:8 }}>
              {photo.category} · {photo.date} · {photo.location}
            </div>
            <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"clamp(28px,4vw,52px)", lineHeight:1, marginBottom:8 }}>{photo.title}</div>
            <p style={{ fontSize:"clamp(12px, 1.5vw, 13px)", color:"rgba(221,216,204,0.5)", maxWidth:500, lineHeight:1.8, letterSpacing:"0.04em" }}>{photo.description}</p>
          </motion.div>
        </div>

        {/* expand icon */}
        <motion.div animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }} transition={{ duration:.3 }}
          style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:56, height:56, borderRadius:"50%", background:"rgba(8,8,6,0.6)", border:"1px solid rgba(221,216,204,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem" }}>
          ↗
        </motion.div>
      </PhotoBg>
    </motion.div>
  )
}

// ── MASONRY ITEM ──────────────────────────────────────────────────────
const MasonryItem = ({ photo, onOpen, index }) => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once:true, margin:"-40px" })

  const aspectMap = { portrait:"3/4", landscape:"4/3", square:"1/1" }

  return (
    <motion.div ref={ref} className="masonry-item"
      initial={{ opacity:0, y:20 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:.7, ease:[0.16,1,0.3,1], delay:(index%3)*0.08 }}
    >
      <PhotoBg photo={photo}
        style={{ aspectRatio:aspectMap[photo.aspect]||"4/3", cursor:"crosshair", borderRadius:4 }}
      >
        <motion.div animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration:.5, ease:[0.16,1,0.3,1] }}
          style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${photo.colors[0]}, ${photo.colors[1]}, ${photo.colors[2]})` }}
          onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
          onClick={()=>onOpen(photo)}
        />

        {/* hover overlay */}
        <motion.div animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration:.3 }}
          onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
          onClick={()=>onOpen(photo)}
          style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,8,6,0.9) 0%, rgba(8,8,6,0.2) 60%, transparent 100%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"16px 14px" }}>
          <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(221,216,204,0.4)", marginBottom:4 }}>{photo.category}</div>
          <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1rem", lineHeight:1.1, marginBottom:4 }}>{photo.title}</div>
          <div style={{ fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.15em", color:"rgba(221,216,204,0.3)" }}>{photo.date} · {photo.location}</div>
        </motion.div>

        {/* expand button */}
        <motion.div animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          onMouseEnter={()=>setHovered(true)}
          style={{ position:"absolute", top:10, right:10, width:30, height:30, borderRadius:"50%", background:"rgba(8,8,6,0.7)", border:"1px solid rgba(221,216,204,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem" }}>
          ↗
        </motion.div>
      </PhotoBg>
    </motion.div>
  )
}

// ── LIGHTBOX ──────────────────────────────────────────────────────────
const Lightbox = ({ photo, photos, onClose, onNavigate }) => {
  const idx = photos.findIndex(p=>p.id===photo.id)

  useEffect(()=>{
    const h = e => {
      if(e.key==="Escape")      onClose()
      if(e.key==="ArrowRight")  onNavigate((idx+1)%photos.length)
      if(e.key==="ArrowLeft")   onNavigate((idx-1+photos.length)%photos.length)
    }
    window.addEventListener("keydown",h)
    return()=>window.removeEventListener("keydown",h)
  },[idx,photos.length,onClose,onNavigate])

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(5,4,3,0.97)", display:"flex", flexDirection:"column" }}>

      {/* top bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 24px", borderBottom:"1px solid rgba(221,216,204,0.06)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--dust)", transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
          >← Back</button>
          <span style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", color:"rgba(122,112,96,0.4)" }}>{idx+1} / {photos.length}</span>
        </div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.9rem", letterSpacing:"0.2em", color:"rgba(221,216,204,0.3)" }}>SOON PRODUCTION</div>
        <Link to="/#contact" style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", padding:"7px 18px", border:"1px solid rgba(176,42,26,0.4)", borderRadius:4, color:"var(--red)", transition:"all .2s" }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(176,42,26,0.1)"}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}
        >Book a Shoot</Link>
      </div>

      {/* main area */}
      <div className="lightbox-inner" style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* image area */}
        <div className="lightbox-img" style={{ flex:1, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={photo.id}
              initial={{opacity:0, scale:.97}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:.97}}
              transition={{duration:.35, ease:[0.16,1,0.3,1]}}
              style={{ width:"100%", height:"100%", position:"relative" }}>
              <PhotoBg photo={photo} style={{ width:"100%", height:"100%" }}/>
            </motion.div>
          </AnimatePresence>

          {/* prev/next arrows */}
          <button onClick={()=>onNavigate((idx-1+photos.length)%photos.length)}
            style={{ position:"absolute", left:20, top:"50%", transform:"translateY(-50%)", background:"rgba(8,8,6,0.6)", border:"1px solid rgba(221,216,204,0.1)", borderRadius:"50%", width:44, height:44, fontSize:"1rem", color:"var(--offwhite)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(176,42,26,0.3)";e.currentTarget.style.borderColor="rgba(176,42,26,0.5)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(8,8,6,0.6)";e.currentTarget.style.borderColor="rgba(221,216,204,0.1)"}}
          >←</button>
          <button onClick={()=>onNavigate((idx+1)%photos.length)}
            style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", background:"rgba(8,8,6,0.6)", border:"1px solid rgba(221,216,204,0.1)", borderRadius:"50%", width:44, height:44, fontSize:"1rem", color:"var(--offwhite)", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(176,42,26,0.3)";e.currentTarget.style.borderColor="rgba(176,42,26,0.5)"}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(8,8,6,0.6)";e.currentTarget.style.borderColor="rgba(221,216,204,0.1)"}}
          >→</button>

          {/* dot nav */}
          <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
            {photos.map((_,i)=>(
              <button key={i} onClick={()=>onNavigate(i)}
                style={{ width:i===idx?20:5, height:3, borderRadius:2, background:i===idx?"var(--red)":"rgba(221,216,204,0.2)", border:"none", transition:"all .3s" }}/>
            ))}
          </div>
        </div>

        {/* details panel */}
        <motion.div className="lightbox-panel"
          initial={{x:40, opacity:0}} animate={{x:0, opacity:1}} transition={{duration:.4, delay:.1}}
          style={{ width:300, borderLeft:"1px solid rgba(221,216,204,0.07)", background:"rgba(10,9,7,0.98)", overflowY:"auto", display:"flex", flexDirection:"column" }}>

          <div style={{ padding:"28px 24px", flex:1 }}>
            {/* title */}
            <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--red)", marginBottom:8 }}>{photo.category}</div>
            <AnimatePresence mode="wait">
              <motion.div key={photo.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.3}}>
                <h2 style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1.6rem", lineHeight:1.1, marginBottom:8 }}>{photo.title}</h2>
                <p style={{ fontSize:"clamp(11px, 1.4vw, 12px)", color:"var(--dust)", lineHeight:2, letterSpacing:"0.04em", marginBottom:24 }}>{photo.description}</p>

                {/* metadata */}
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                    Details <span style={{ flex:1, height:1, background:"rgba(221,216,204,0.06)" }}/>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {[
                      ["Date",     photo.date],
                      ["Location", photo.location],
                    ].map(([l,v])=>(
                      <div key={l}>
                        <div style={{ fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:2 }}>{l}</div>
                        <div style={{ fontSize:"clamp(12px, 1.5vw, 13px)", color:"var(--offwhite)", letterSpacing:"0.04em" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* camera settings */}
                <div style={{ marginBottom:28 }}>
                  <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                    Camera Info <span style={{ flex:1, height:1, background:"rgba(221,216,204,0.06)" }}/>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"rgba(221,216,204,0.04)", borderRadius:8, overflow:"hidden" }}>
                    {[
                      ["Camera",   photo.camera],
                      ["Lens",     photo.lens],
                      ["Aperture", photo.aperture],
                      ["Shutter",  photo.shutter],
                      ["ISO",      photo.iso],
                    ].map(([l,v])=>(
                      <div key={l} style={{ padding:"10px 12px", background:"rgba(8,8,6,0.5)" }}>
                        <div style={{ fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:3 }}>{l}</div>
                        <div style={{ fontSize:"clamp(11px, 1.4vw, 12px)", color:"var(--offwhite)", letterSpacing:"0.03em" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* related in same category */}
                <div>
                  <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
                    More {photo.category} <span style={{ flex:1, height:1, background:"rgba(221,216,204,0.06)" }}/>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {PHOTOS.filter(p=>p.category===photo.category && p.id!==photo.id).slice(0,3).map(p=>(
                      <button key={p.id} onClick={()=>onNavigate(PHOTOS.findIndex(x=>x.id===p.id))}
                        style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"1px solid rgba(221,216,204,0.05)", borderRadius:6, padding:"8px 10px", textAlign:"left", transition:"all .2s", cursor:"crosshair" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(176,42,26,0.25)";e.currentTarget.style.background="rgba(176,42,26,0.04)"}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.05)";e.currentTarget.style.background="none"}}
                      >
                        <div style={{ width:36, height:36, borderRadius:4, flexShrink:0, background:`linear-gradient(135deg,${p.colors[0]},${p.colors[1]})` }}/>
                        <div>
                          <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)", color:"var(--offwhite)", fontFamily:"'IM Fell English',serif", fontStyle:"italic", lineHeight:1.2 }}>{p.title}</div>
                          <div style={{ fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:"0.15em", color:"var(--dust)", marginTop:2 }}>{p.date}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* book CTA */}
          <div style={{ padding:"20px 24px", borderTop:"1px solid rgba(221,216,204,0.06)", flexShrink:0 }}>
            <p style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.08em", color:"var(--dust)", lineHeight:1.8, marginBottom:12 }}>Like what you see? Book a photography session.</p>
            <Link to="/#contact" style={{ display:"block", textAlign:"center", padding:"12px", background:"var(--red)", borderRadius:6, fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.9rem", letterSpacing:"0.2em", color:"var(--offwhite)", transition:"opacity .2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
            >Book a Session</Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────
export default function PhotographyPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightboxPhoto, setLightboxPhoto]   = useState(null)
  const [visibleCount, setVisibleCount]     = useState(12)

  const featured = PHOTOS.find(p=>p.featured)
  const gridPhotos = PHOTOS.filter(p=>!p.featured)

  const filtered = activeCategory==="All"
    ? gridPhotos
    : gridPhotos.filter(p=>p.category===activeCategory)

  const shown = filtered.slice(0, visibleCount)

  // photos for lightbox nav — includes featured
  const allFiltered = activeCategory==="All"
    ? PHOTOS
    : PHOTOS.filter(p=>p.category===activeCategory)

  const handleOpen  = useCallback(photo => setLightboxPhoto(photo), [])
  const handleClose = useCallback(()    => setLightboxPhoto(null), [])
  const handleNav   = useCallback(idx  => setLightboxPhoto(allFiltered[idx]), [allFiltered])

  return (
    <>
      
      <Nav/>

      <main style={{ paddingTop:80 }}>

        {/* featured hero */}
        {featured && (activeCategory==="All" || activeCategory===featured.category) && (
          <FeaturedHero photo={featured} onOpen={handleOpen}/>
        )}

        {/* page header */}
        <div className="page-pad" style={{ padding:"48px 32px 32px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginBottom:32 }}>
            <div>
              <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.35em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", marginBottom:8 }}>002 / Visual Work</div>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,72px)", lineHeight:.9 }}>
                The <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>eye.</em>
              </h1>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontSize:"clamp(11px, 1.4vw, 12px)", color:"var(--dust)", lineHeight:2, maxWidth:240 }}>Sony A7III · 24-70mm GM II</p>
              <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)", color:"rgba(122,112,96,0.5)", letterSpacing:"0.08em" }}>{filtered.length} photos</p>
            </div>
          </div>

          {/* category filter */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={()=>{ setActiveCategory(cat); setVisibleCount(12) }}
                style={{
                  fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase",
                  padding:"6px 16px", borderRadius:20,
                  border:`1px solid ${activeCategory===cat?"var(--red)":"rgba(221,216,204,0.08)"}`,
                  background:activeCategory===cat?"rgba(176,42,26,0.1)":"transparent",
                  color:activeCategory===cat?"var(--offwhite)":"var(--dust)",
                  transition:"all .25s",
                }}
              >
                {cat}
                <span style={{ marginLeft:6, fontSize:"clamp(8px, 1vw, 9px)", opacity:.5 }}>
                  {cat==="All" ? PHOTOS.length : PHOTOS.filter(p=>p.category===cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* masonry grid */}
        <div className="page-pad masonry" style={{ padding:"0 32px" }}>
          <AnimatePresence mode="popLayout">
            {shown.map((photo,i)=>(
              <MasonryItem key={photo.id} photo={photo} onOpen={handleOpen} index={i}/>
            ))}
          </AnimatePresence>
        </div>

        {/* load more */}
        {visibleCount < filtered.length && (
          <div style={{ textAlign:"center", padding:"40px 32px" }}>
            <button onClick={()=>setVisibleCount(v=>v+8)}
              style={{ fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.3em", textTransform:"uppercase", background:"none", border:"1px solid rgba(221,216,204,0.1)", color:"var(--dust)", padding:"12px 32px", borderRadius:6, transition:"all .25s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--offwhite)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.1)";e.currentTarget.style.color="var(--dust)"}}
            >Load More — {filtered.length-visibleCount} remaining</button>
          </div>
        )}

        {/* book CTA strip */}
        <div style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"64px 32px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(32px,5vw,64px)", lineHeight:.95, marginBottom:16 }}>
            Need a <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", color:"var(--red)" }}>shoot?</em>
          </div>
          <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)", color:"var(--dust)", letterSpacing:"0.08em", marginBottom:32, lineHeight:2 }}>
            Portraits · Events · Artist sessions · Editorial
          </p>
          <Link to="/#contact" style={{ display:"inline-block", padding:"14px 40px", background:"var(--red)", borderRadius:6, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.2em", color:"var(--offwhite)", transition:"opacity .2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
          >Book a Session</Link>
        </div>
      </main>

      {/* lightbox */}
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
  )
}

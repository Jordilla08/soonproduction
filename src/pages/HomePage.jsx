import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"
import { Reveal, SectionLabel, Waveform } from "../components/UI.jsx"
import Nav from "../components/Nav.jsx"

// ── DATA ──────────────────────────────────────────────────────────────
const BEATS = [
  { num:"001", title:"Distant Summer",     meta:"Soul / Boom Bap", bpm:"87 BPM", price:"$35", tags:["Soul","Boom Bap"] },
  { num:"002", title:"Red Clay Road",      meta:"Jazz Soul",       bpm:"74 BPM", price:"$35", tags:["Soul","Jazz"] },
  { num:"003", title:"Sunday Smoke",       meta:"Lo-Fi Soul",      bpm:"82 BPM", price:"$35", tags:["Soul","Lo-Fi"] },
  { num:"004", title:"Crates at Midnight", meta:"Boom Bap",        bpm:"91 BPM", price:"$35", tags:["Boom Bap"] },
  { num:"005", title:"Felt That",          meta:"Soul Trap",       bpm:"78 BPM", price:"$35", tags:["Soul","Trap"] },
  { num:"006", title:"Gravel & Gold",      meta:"Soul",            bpm:"84 BPM", price:"$35", tags:["Soul"] },
  { num:"007", title:"Last Light",         meta:"Jazz Soul",       bpm:"72 BPM", price:"$35", tags:["Soul","Jazz"] },
  { num:"008", title:"Worn Leather",       meta:"Boom Bap",        bpm:"88 BPM", price:"$35", tags:["Boom Bap"] },
]

const TIERS = [
  { name:"Lease",     price:"$35",   perks:["MP3 file","100k streams","Non-exclusive","1 music video"] },
  { name:"Premium",   price:"$75",   perks:["WAV + MP3","500k streams","Non-exclusive","Unlimited videos"] },
  { name:"Exclusive", price:"$200+", perks:["WAV + Stems","Unlimited","Full ownership","Beat removed from store"] },
]

const SERVICES = [
  {
    num:"01", icon:"🎛", title:"Beat Production",
    desc:"Original instrumentals built from the ground up on the MPC Live. Soul-driven, sample-influenced, made to move.",
    items:["Custom beat commissions","Lease & exclusive licensing","Studio session production","Mixing & engineering access","Stems available"],
    cta:"Browse Catalogue", href:"#beats",
  },
  {
    num:"02", icon:"📷", title:"Photography",
    desc:"Portraits, street, events, artist promo. Shot on the Sony A7III. Every frame intentional — raw and real.",
    items:["Artist & press photography","Portrait sessions","Event coverage","Street & editorial","Cover art & promo content"],
    cta:"Book a Session", href:"#contact",
  },
  {
    num:"03", icon:"🎬", title:"Creative Direction",
    desc:"Full visual and sonic identity for artists. From the sound of the record to the look of the rollout.",
    items:["Artist brand identity","Visual rollout strategy","Cover art direction","Music video concepts","Sound + image packages"],
    cta:"Start a Project", href:"#contact",
  },
]

const GENRE_TAGS = ["All","Soul","Boom Bap","Jazz","Lo-Fi","Trap"]

const PHOTOS = [
  { tag:"Portrait", size:"large",  colors:["#1a0e0a","#2a1510","#0e0806"] },
  { tag:"Street",   size:"small",  colors:["#0e1218","#1a2030","#080c14"] },
  { tag:"Studio",   size:"small",  colors:["#181210","#2a1e14","#100c08"] },
  { tag:"Event",    size:"small",  colors:["#0e1410","#162018","#080e0a"] },
  { tag:"Artist",   size:"small",  colors:["#141014","#201828","#0c0810"] },
]

// ── HELPERS (Reveal, SectionLabel, Waveform imported from components/UI.jsx) ──

// ── LOADER DATA ───────────────────────────────────────────────────────
const CRATE_MESSAGES = [
  "Digging through the crates...",
  "Chopping samples...",
  "Dusting off the vinyl...",
  "Tuning the MPC...",
  "Setting the needle...",
  "Something out of nothing...",
]

// ── GLITCH TEXT ───────────────────────────────────────────────────────
const GlitchText = ({ text, active }) => {
  const [glitched, setGlitched] = useState(text)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$"
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!active) { setGlitched(text); return }
    let iteration = 0
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setGlitched(
        text.split("").map((char, i) => {
          if (char === " ") return " "
          if (i < iteration) return text[i]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      )
      iteration += 0.5
      if (iteration >= text.length) clearInterval(intervalRef.current)
    }, 40)
    return () => clearInterval(intervalRef.current)
  }, [text, active])

  return (
    <span style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.3em" }}>
      {glitched}
    </span>
  )
}

// ── LOADING SCREEN ────────────────────────────────────────────────────
const Loader = ({ onDone }) => {
  const [progress, setProgress]   = useState(0)
  const [msgIndex, setMsgIndex]   = useState(0)
  const [spinning, setSpinning]   = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [exiting, setExiting]     = useState(false)
  const rotation = useRef(0)
  const animRef  = useRef(null)
  const lastTime = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        const next = p + (Math.random() * 0.012 + 0.006)
        if (next >= 1) {
          clearInterval(t)
          setTimeout(() => {
            setGlitching(true)
            setTimeout(() => {
              setExiting(true)
              setTimeout(onDone, 900)
            }, 700)
          }, 400)
          return 1
        }
        return next
      })
    }, 80)
    return () => clearInterval(t)
  }, [onDone])

  useEffect(() => {
    const idx = Math.min(Math.floor(progress / (1 / CRATE_MESSAGES.length)), CRATE_MESSAGES.length - 1)
    setMsgIndex(idx)
  }, [progress])

  useEffect(() => {
    if (progress > 0.1 && !spinning) setSpinning(true)
  }, [progress, spinning])

  useEffect(() => {
    if (!spinning) return
    const el = document.getElementById("vinyl-spin-group")
    if (!el) return
    const animate = (time) => {
      if (lastTime.current) {
        const delta = time - lastTime.current
        const rpm = 20 + progress * 13
        rotation.current = (rotation.current + (rpm / 60) * (delta / 1000) * 360) % 360
        el.setAttribute("transform", `rotate(${rotation.current} 130 130)`)
      }
      lastTime.current = time
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [spinning, progress])

  const pct = Math.round(Math.min(progress * 100, 100))

  if (exiting) return null

  return (
    <motion.div
      exit={{ opacity:0, scale:0.97 }}
      transition={{ duration:.9, ease:[0.16,1,0.3,1] }}
      style={{ position:"fixed", inset:0, background:"var(--black)", zIndex:9999, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
    >
      {/* vinyl */}
      <div className="loader-vinyl" style={{ position:"relative", marginBottom:36 }}>
        <svg width="260" height="260" viewBox="0 0 260 260" style={{ overflow:"visible" }}>
          <defs>
            <radialGradient id="vinylSheen" cx="40%" cy="35%" r="65%">
              <stop offset="0%"  stopColor="#2a2a2a"/>
              <stop offset="60%" stopColor="#111"/>
              <stop offset="100%" stopColor="#0a0a0a"/>
            </radialGradient>
            <radialGradient id="labelGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%"  stopColor="#c0392b"/>
              <stop offset="100%" stopColor="#7a1a10"/>
            </radialGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <g id="vinyl-spin-group">
            <circle cx="130" cy="130" r="118" fill="url(#vinylSheen)"/>
            {[104,90,76,62].map((r,i) => (
              <circle key={i} cx="130" cy="130" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={i%2===0?1:0.5}/>
            ))}
            {Array.from({length:48},(_,i) => {
              const a = (i/48)*2*Math.PI
              return <line key={i}
                x1={130+50*Math.cos(a)} y1={130+50*Math.sin(a)}
                x2={130+116*Math.cos(a)} y2={130+116*Math.sin(a)}
                stroke="rgba(255,255,255,0.012)" strokeWidth="0.5"/>
            })}
            <g opacity={progress > 0.3 ? 1 : 0} style={{ transition:"opacity .6s" }}>
              <circle cx="130" cy="130" r="48" fill="url(#labelGrad)"/>
              <line x1="108" y1="124" x2="152" y2="124" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8"/>
              <line x1="108" y1="128" x2="152" y2="128" stroke="rgba(0,0,0,0.2)"  strokeWidth="0.8"/>
              <line x1="108" y1="132" x2="152" y2="132" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8"/>
              <line x1="108" y1="136" x2="152" y2="136" stroke="rgba(0,0,0,0.2)"  strokeWidth="0.8"/>
              <text x="130" y="131" textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:11, fill:"rgba(240,230,210,0.9)", letterSpacing:"0.25em" }}>
                SOON
              </text>
            </g>
            <circle cx="130" cy="130" r="8" fill="var(--black)"/>
          </g>

          {/* progress ring — static, drawn over spinning vinyl */}
          {(() => {
            const r = 118, circ = 2 * Math.PI * r
            return <>
              <circle cx="130" cy="130" r={r} fill="none" stroke="rgba(221,216,204,0.05)" strokeWidth={3} transform="rotate(-90 130 130)"/>
              <circle cx="130" cy="130" r={r} fill="none" stroke="var(--red)" strokeWidth={3}
                strokeDasharray={circ} strokeDashoffset={circ*(1-progress)}
                strokeLinecap="round" transform="rotate(-90 130 130)"
                filter="url(#glow)" style={{ transition:"stroke-dashoffset .12s linear" }}/>
            </>
          })()}

          {/* tonearm */}
          <motion.g
            initial={{ rotate:-20, opacity:0 }}
            animate={{ rotate: progress > 0.05 ? (progress * 8) : -20, opacity: progress > 0.05 ? 1 : 0 }}
            transition={{ duration:1.4, ease:[0.16,1,0.3,1] }}
            style={{ transformOrigin:"228px 36px" }}
          >
            <circle cx="228" cy="36" r="5" fill="#2a2a2a" stroke="rgba(221,216,204,0.2)" strokeWidth={1}/>
            <circle cx="228" cy="36" r="2" fill="var(--red)"/>
            <line x1="228" y1="36" x2="168" y2="148" stroke="rgba(221,216,204,0.45)" strokeWidth={2} strokeLinecap="round"/>
            <line x1="168" y1="148" x2="155" y2="162" stroke="rgba(221,216,204,0.35)" strokeWidth={1.5} strokeLinecap="round"/>
            <circle cx="155" cy="163" r="1.5" fill="var(--red)"/>
          </motion.g>
        </svg>
      </div>

      {/* title with glitch */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.3, duration:.8 }}
        style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:"clamp(36px,7vw,64px)", lineHeight:1, marginBottom:6 }}>
          <GlitchText text="SOON PRODUCTION" active={glitching}/>
        </div>
        <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.45em", textTransform:"uppercase", color:"var(--dust)" }}>
          Something Out of Nothing
        </div>
      </motion.div>

      {/* rotating message */}
      <div style={{ height:20, marginBottom:20, overflow:"hidden" }}>
        <AnimatePresence mode="wait">
          <motion.p key={msgIndex}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            transition={{ duration:.4 }}
            style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(122,112,96,0.5)", textAlign:"center" }}
          >{CRATE_MESSAGES[msgIndex]}</motion.p>
        </AnimatePresence>
      </div>

      {/* progress bar */}
      <div style={{ display:"flex", alignItems:"center", gap:16, width:"min(240px,70vw)" }}>
        <div style={{ flex:1, height:1, background:"rgba(221,216,204,0.08)", position:"relative", borderRadius:1 }}>
          <motion.div style={{ position:"absolute", top:0, left:0, height:"100%", background:"var(--red)", borderRadius:1 }}
            animate={{ width:`${pct}%` }} transition={{ ease:"linear", duration:.1 }}/>
        </div>
        <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", color:"rgba(122,112,96,0.4)", fontVariantNumeric:"tabular-nums", minWidth:28, textAlign:"right" }}>{pct}%</span>
      </div>
    </motion.div>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────
const Hero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:["start start","end start"] })
  const y = useTransform(scrollYProgress, [0,1], ["0%","30%"])
  const opacity = useTransform(scrollYProgress, [0,.8], [1,0])

  return (
    <section ref={ref} id="hero" style={{ position:"relative", height:"100vh", display:"flex", alignItems:"flex-end", overflow:"hidden" }}>
      <motion.div style={{ position:"absolute", inset:0, y }}>
        <div style={{
          position:"absolute", inset:0,
          background:"radial-gradient(ellipse 70% 80% at 55% 40%, rgba(140,20,10,0.75) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 20% 70%, rgba(90,10,5,0.4) 0%, transparent 55%), linear-gradient(160deg,#1a0505 0%,#2e0a08 35%,#120303 100%)",
        }}/>
        <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)", opacity:.5 }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.3em", color:"rgba(255,255,255,0.05)", textTransform:"uppercase", whiteSpace:"nowrap", pointerEvents:"none" }}>[ YOUR A7III FOOTAGE PLAYS HERE ]</div>
      </motion.div>

      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 100% 100% at 50% 50%,transparent 30%,rgba(8,8,6,0.7) 100%),linear-gradient(to top,rgba(8,8,6,1) 0%,rgba(8,8,6,0.3) 35%,transparent 65%)", pointerEvents:"none" }}/>

      <motion.div style={{ position:"relative", zIndex:10, padding:"0 20px 40px", width:"100%", opacity }}>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4, duration:1 }}
          style={{ fontSize:"clamp(12px, 1.5vw, 13px)", letterSpacing:"0.4em", textTransform:"uppercase", color:"var(--red)", marginBottom:14 }}>
          Soon Production · Est. 2025
        </motion.p>
        <motion.h1 className="hero-title" initial={{ opacity:0, y:48 }} animate={{ opacity:1, y:0 }} transition={{ delay:.1, duration:1.3, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(60px,16vw,200px)", lineHeight:.88, letterSpacing:"-0.01em" }}>
          Sound<br/>
          made{" "}<em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.75em" }}>from</em><br/>
          nothing.
        </motion.h1>
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.8, duration:1 }}
          className="hero-bottom" style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:16 }}>
          <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--dust)", lineHeight:1.9 }}>
            Original beats.<br/>Soul-driven production.<br/>Built on the MPC.
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:10, fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--dust)" }}>
            <motion.div animate={{ height:["20px","32px","20px"] }} transition={{ repeat:Infinity, duration:2, ease:"easeInOut" }} style={{ width:1, background:"var(--dust)" }}/>
            Scroll
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ── TICKER ────────────────────────────────────────────────────────────
const Ticker = () => {
  const items = ["Beats","✦","Soul","✦","MPC Live","✦","Something Out of Nothing","✦","Sample-Driven","✦","Custom Production","✦","Photography","✦","Creative Direction","✦","Est. 2025","✦"]
  const doubled = [...items,...items]
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid rgba(221,216,204,0.07)", borderBottom:"1px solid rgba(221,216,204,0.07)", padding:"11px 0", position:"relative" }}>
      <div style={{ position:"absolute", top:0, bottom:0, left:0, width:80, background:"linear-gradient(to right,var(--black),transparent)", zIndex:2 }}/>
      <div style={{ position:"absolute", top:0, bottom:0, right:0, width:80, background:"linear-gradient(to left,var(--black),transparent)", zIndex:2 }}/>
      <motion.div style={{ display:"flex", gap:48, whiteSpace:"nowrap" }}
        animate={{ x:["0%","-50%"] }} transition={{ duration:22, ease:"linear", repeat:Infinity }}>
        {doubled.map((item,i) => (
          <span key={i} style={{ fontSize:"clamp(12px, 1.5vw, 13px)", letterSpacing:"0.35em", textTransform:"uppercase", color:item==="✦"?"var(--red)":"var(--dust)", flexShrink:0 }}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}

// Waveform imported from components/UI.jsx

// ── AUDIO PLAYER BAR ──────────────────────────────────────────────────
const PlayerBar = ({ beat, onClose }) => {
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setProgress(p => { if(p>=1){setPlaying(false);return 0} return p+.003 }), 100)
    return () => clearInterval(t)
  }, [playing])

  return (
    <motion.div initial={{ y:80 }} animate={{ y:0 }} exit={{ y:80 }} transition={{ type:"spring", damping:24, stiffness:200 }}
      className="player-bar" style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:600, background:"rgba(10,9,7,0.96)", borderTop:"1px solid rgba(221,216,204,0.08)", backdropFilter:"blur(12px)", padding:"12px 32px", display:"flex", alignItems:"center", gap:20 }}>
      {/* beat info */}
      <div style={{ minWidth:0, flex:"0 0 auto" }}>
        <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.9rem", color:"var(--offwhite)", lineHeight:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:160 }}>{beat.title}</div>
        <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--dust)", marginTop:2 }}>{beat.meta} · {beat.bpm}</div>
      </div>

      {/* controls */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flex:"0 0 auto" }}>
        <button onClick={()=>setProgress(0)} style={{ background:"none", border:"none", color:"var(--dust)", fontSize:"0.7rem", transition:"color .2s" }}
          onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
        >⟨⟨</button>
        <button onClick={()=>setPlaying(p=>!p)} style={{ width:36, height:36, borderRadius:"50%", background:"var(--red)", border:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {playing
            ? <span style={{ display:"flex", gap:3 }}><span style={{ width:3, height:12, background:"var(--offwhite)", borderRadius:1 }}/><span style={{ width:3, height:12, background:"var(--offwhite)", borderRadius:1 }}/></span>
            : <svg width="10" height="12" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="white"/></svg>
          }
        </button>
        <button onClick={()=>setProgress(0)} style={{ background:"none", border:"none", color:"var(--dust)", fontSize:"0.7rem", transition:"color .2s" }}
          onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
        >⟩⟩</button>
      </div>

      {/* waveform progress */}
      <div className="player-waveform" style={{ flex:1, cursor:"crosshair", minWidth:0 }} onClick={e=>{
        const rect = e.currentTarget.getBoundingClientRect()
        setProgress((e.clientX-rect.left)/rect.width)
      }}>
        <Waveform playing={playing} bars={40} height={32} progress={progress}/>
      </div>

      {/* time */}
      <div className="player-time" style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.15em", color:"var(--dust)", flex:"0 0 auto", fontVariantNumeric:"tabular-nums" }}>
        {String(Math.floor(progress*180/60)).padStart(2,"0")}:{String(Math.floor(progress*180%60)).padStart(2,"0")} / 3:00
      </div>

      {/* tier badge */}
      <Link to="#beats" className="player-license" style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", border:"1px solid rgba(176,42,26,0.4)", padding:"4px 10px", borderRadius:20, color:"var(--red)", flex:"0 0 auto", whiteSpace:"nowrap" }}>License $35</Link>

      <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--dust)", fontSize:"0.9rem", flex:"0 0 auto", transition:"color .2s" }}
        onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
      >×</button>
    </motion.div>
  )
}

// ── BEAT CARD ─────────────────────────────────────────────────────────
const BeatCard = ({ beat, onOpenModal, onPlay, isPlaying }) => {
  const [flipped, setFlipped] = useState(false)

  return (
    <div style={{ perspective:1000, height:295 }}>
      <motion.div style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d" }}
        animate={{ rotateY:flipped?180:0 }} transition={{ duration:.6, ease:[0.4,0.2,0.2,1] }}>

        {/* FRONT */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", borderRadius:10, border:`1px solid ${isPlaying?"rgba(176,42,26,0.4)":"var(--border)"}`, background: isPlaying?"rgba(176,42,26,0.04)":"var(--card-bg)", padding:"20px 16px 18px", display:"flex", flexDirection:"column", transition:"all .3s" }}>
          <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.3em", color:"rgba(122,112,96,0.3)", marginBottom:10 }}>{beat.num}</span>
          <div onClick={()=>onOpenModal(beat)} style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1.1rem", color:"rgba(221,216,204,0.85)", lineHeight:1.1, marginBottom:4, cursor:"crosshair" }}>{beat.title}</div>
          <div style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.15em", textTransform:"uppercase", color:"var(--dust)", marginBottom:10 }}>{beat.meta} · {beat.bpm}</div>
          <Waveform playing={isPlaying} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:14, flexShrink:0 }}>
            <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)", color:"var(--dust)", letterSpacing:"0.1em" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", color:"var(--offwhite)", lineHeight:1 }}>{beat.price}</div>
              Lease
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>onPlay(beat)} style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${isPlaying?"var(--red)":"rgba(221,216,204,0.12)"}`, background:isPlaying?"var(--red)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s" }}>
                {isPlaying
                  ? <div style={{ display:"flex", gap:2 }}><div style={{ width:2, height:8, background:"white", borderRadius:1 }}/><div style={{ width:2, height:8, background:"white", borderRadius:1 }}/></div>
                  : <svg width="7" height="9" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="var(--offwhite)"/></svg>
                }
              </button>
              <button onClick={()=>setFlipped(true)} style={{ width:28, height:28, borderRadius:"50%", border:"1px solid rgba(221,216,204,0.12)", background:"transparent", fontSize:"clamp(13px, 1.6vw, 15px)", color:"var(--dust)", transition:"all .3s" }}
                onMouseEnter={e=>{e.target.style.borderColor="var(--offwhite)";e.target.style.color="var(--offwhite)"}}
                onMouseLeave={e=>{e.target.style.borderColor="rgba(221,216,204,0.12)";e.target.style.color="var(--dust)"}}
              >$</button>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", transform:"rotateY(180deg)", borderRadius:10, border:"1px solid rgba(176,42,26,0.2)", background:"#0e0b09", padding:"18px 16px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.82rem", color:"rgba(221,216,204,0.5)", borderBottom:"1px solid rgba(221,216,204,0.06)", paddingBottom:8, marginBottom:10 }}>{beat.title}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7, flex:1, justifyContent:"center" }}>
            {TIERS.map(tier => (
              <div key={tier.name} onClick={()=>onOpenModal(beat,tier.name)}
                style={{ padding:"8px 10px", borderRadius:6, border:"1px solid rgba(221,216,204,0.05)", background:"rgba(221,216,204,0.02)", cursor:"crosshair", transition:"all .25s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(176,42,26,0.35)";e.currentTarget.style.background="rgba(176,42,26,0.05)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(221,216,204,0.05)";e.currentTarget.style.background="rgba(221,216,204,0.02)"}}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--offwhite)" }}>{tier.name}</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.9rem", color:"var(--red)", fontWeight:"normal" }}>{tier.price}</span>
                </div>
                <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)", color:"rgba(122,112,96,0.6)", marginTop:2, letterSpacing:"0.05em" }}>{tier.perks.join(" · ")}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>setFlipped(false)} style={{ background:"none", border:"none", fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)", paddingTop:8, transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="rgba(122,112,96,0.4)"}
          >↩ Back</button>
        </div>
      </motion.div>
    </div>
  )
}

// ── BEAT MODAL ────────────────────────────────────────────────────────
const BeatModal = ({ beat, initialTier, onClose }) => {
  const [selectedTier, setSelectedTier] = useState(initialTier||"Lease")
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(()=>{
    if(!playing) return
    const t = setInterval(()=>setProgress(p=>{if(p>=1){setPlaying(false);return 0}return p+.004}),100)
    return ()=>clearInterval(t)
  },[playing])

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(8,8,6,0.92)", zIndex:800, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)", padding:16 }}>
      <motion.div initial={{ y:24, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:24, opacity:0 }}
        transition={{ duration:.35, ease:[0.16,1,0.3,1] }}
        onClick={e=>e.stopPropagation()}
        style={{ width:"min(560px,100%)", background:"#0e0b09", border:"1px solid rgba(221,216,204,0.08)", borderRadius:12, padding:"36px 32px 28px", position:"relative", maxHeight:"90vh", overflowY:"auto" }}
        className="modal-inner">

        <button onClick={onClose} style={{ position:"absolute", top:20, right:20, background:"none", border:"none", fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--dust)", transition:"color .2s" }}
          onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
        >✕ Close</button>

        <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--red)", marginBottom:8 }}>{beat.num}</p>
        <h2 style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"2rem", lineHeight:1, marginBottom:4 }}>{beat.title}</h2>
        <p style={{ fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--dust)", marginBottom:24 }}>{beat.meta} · {beat.bpm}</p>

        <div onClick={()=>setPlaying(p=>!p)} style={{ marginBottom:8, cursor:"crosshair" }}>
          <Waveform playing={playing} bars={60} height={56} progress={progress}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:28 }}>
          <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(122,112,96,0.35)" }}>{playing?"▐▐  Pause":"▶  Preview"}</p>
          <p style={{ fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.1em", color:"rgba(122,112,96,0.35)", fontVariantNumeric:"tabular-nums" }}>
            {String(Math.floor(progress*180/60)).padStart(2,"0")}:{String(Math.floor(progress*180%60)).padStart(2,"0")} / 3:00
          </p>
        </div>

        <div className="modal-tiers" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
          {TIERS.map(tier => (
            <div key={tier.name} onClick={()=>setSelectedTier(tier.name)}
              style={{ border:`1px solid ${selectedTier===tier.name?"var(--red)":"rgba(221,216,204,0.07)"}`, borderRadius:8, padding:"14px 12px", cursor:"crosshair", background:selectedTier===tier.name?"rgba(176,42,26,0.06)":"rgba(221,216,204,0.02)", transition:"all .25s" }}>
              <div style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--offwhite)", marginBottom:6 }}>{tier.name}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", color:"var(--red)", fontWeight:"normal", lineHeight:1, marginBottom:6 }}>{tier.price}</div>
              <div style={{ fontSize:"clamp(9px, 1.1vw, 10px)", color:"rgba(122,112,96,0.6)", lineHeight:1.8 }}>{tier.perks.map(p=><div key={p}>— {p}</div>)}</div>
            </div>
          ))}
        </div>

        <button style={{ width:"100%", padding:14, background:"var(--red)", border:"none", borderRadius:8, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.2em", color:"var(--offwhite)", transition:"opacity .2s" }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >License This Beat — {TIERS.find(t=>t.name===selectedTier)?.price}</button>
      </motion.div>
    </motion.div>
  )
}

// ── BEATS SECTION ─────────────────────────────────────────────────────
const Beats = ({ onPlay, currentBeat }) => {
  const [modal, setModal] = useState(null)
  const [activeTag, setActiveTag] = useState("All")

  const filtered = activeTag==="All" ? BEATS : BEATS.filter(b=>b.tags.includes(activeTag))

  return (
    <section id="beats" className="section-pad" style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"100px 32px" }}>
      <Reveal>
        <SectionLabel index="001" label="Catalogue"/>
        <div className="beats-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32, gap:20 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,80px)", lineHeight:.92 }}>
            The <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>catalogue.</em>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
            <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)", color:"var(--dust)", textAlign:"right", maxWidth:240, lineHeight:1.9 }}>Every beat starts with a feeling.</p>
            <Link to="#contact" style={{ fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.25em", textTransform:"uppercase", borderBottom:"1px solid rgba(221,216,204,0.2)", paddingBottom:2 }}>Full catalogue →</Link>
          </div>
        </div>

        {/* genre filter */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:40 }}>
          {GENRE_TAGS.map(tag => (
            <button key={tag} onClick={()=>setActiveTag(tag)}
              style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", padding:"6px 16px", borderRadius:20, border:`1px solid ${activeTag===tag?"var(--red)":"rgba(221,216,204,0.08)"}`, background:activeTag===tag?"rgba(176,42,26,0.1)":"transparent", color:activeTag===tag?"var(--offwhite)":"var(--dust)", transition:"all .25s" }}
            >{tag}</button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="beats-grid-wrap" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((beat,i) => (
            <motion.div key={beat.num} layout
              initial={{ opacity:0, scale:.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.95 }}
              transition={{ duration:.4, delay:i*.05 }}>
              <BeatCard beat={beat} onOpenModal={(b,tier)=>setModal({beat:b,tier})} onPlay={onPlay} isPlaying={currentBeat?.num===beat.num}/>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {modal && <BeatModal beat={modal.beat} initialTier={modal.tier} onClose={()=>setModal(null)}/>}
      </AnimatePresence>
    </section>
  )
}

// ── VISUAL / LIGHTBOX ─────────────────────────────────────────────────
const Lightbox = ({ photos, index, onClose }) => {
  const [current, setCurrent] = useState(index)
  useEffect(()=>{
    const h = e => { if(e.key==="ArrowRight") setCurrent(c=>(c+1)%photos.length); if(e.key==="ArrowLeft") setCurrent(c=>(c-1+photos.length)%photos.length); if(e.key==="Escape") onClose() }
    window.addEventListener("keydown",h)
    return ()=>window.removeEventListener("keydown",h)
  },[onClose,photos.length])

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(5,5,4,0.97)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <button onClick={onClose} style={{ position:"absolute", top:24, right:32, background:"none", border:"none", fontSize:"clamp(12px, 1.5vw, 13px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--dust)", zIndex:10, transition:"color .2s" }}
        onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
      >✕ Close</button>

      <button onClick={e=>{e.stopPropagation();setCurrent(c=>(c-1+photos.length)%photos.length)}}
        style={{ position:"absolute", left:24, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:"1.5rem", color:"var(--dust)", zIndex:10, transition:"color .2s" }}
        onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
      >←</button>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.97 }}
          transition={{ duration:.3 }} onClick={e=>e.stopPropagation()}
          style={{ width:"min(800px,90vw)", aspectRatio:"4/3", borderRadius:4, overflow:"hidden", position:"relative",
            background:`linear-gradient(135deg,${photos[current].colors[0]},${photos[current].colors[1]},${photos[current].colors[2]})` }}>
          <div style={{ position:"absolute", bottom:20, left:20, fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(221,216,204,0.2)" }}>[ Add your A7III photo here ]</div>
          <div style={{ position:"absolute", bottom:20, right:20, fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(221,216,204,0.4)", border:"1px solid rgba(221,216,204,0.15)", padding:"4px 10px", borderRadius:20 }}>{photos[current].tag}</div>
        </motion.div>
      </AnimatePresence>

      <button onClick={e=>{e.stopPropagation();setCurrent(c=>(c+1)%photos.length)}}
        style={{ position:"absolute", right:24, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:"1.5rem", color:"var(--dust)", zIndex:10, transition:"color .2s" }}
        onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="var(--dust)"}
      >→</button>

      <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", gap:8 }}>
        {photos.map((_,i) => (
          <button key={i} onClick={e=>{e.stopPropagation();setCurrent(i)}} style={{ width:i===current?20:6, height:3, borderRadius:2, background:i===current?"var(--red)":"rgba(221,216,204,0.2)", border:"none", transition:"all .3s" }}/>
        ))}
      </div>
    </motion.div>
  )
}

const Visual = () => {
  const [lightbox, setLightbox] = useState(null)
  return (
    <section id="visual" className="section-pad" style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"100px 32px" }}>
      <Reveal>
        <SectionLabel index="002" label="Visual Work"/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48, flexWrap:"wrap", gap:20 }}>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,80px)", lineHeight:.92 }}>
            The <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>eye.</em>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
            <p style={{ fontSize:"clamp(12px, 1.5vw, 14px)", color:"var(--dust)", textAlign:"right", maxWidth:200, lineHeight:1.9 }}>Sound and image, inseparable.</p>
            <Link to="#contact" style={{ fontSize:"clamp(11px, 1.4vw, 12px)", letterSpacing:"0.25em", textTransform:"uppercase", borderBottom:"1px solid rgba(221,216,204,0.2)", paddingBottom:2 }}>Book a shoot →</Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="photo-grid-inner" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"auto auto", gap:6 }}>
          {PHOTOS.map((photo,i) => (
            <motion.div key={i} onClick={()=>setLightbox(i)} whileHover={{ scale:1.01 }} transition={{ duration:.4 }}
              style={{ position:"relative", overflow:"hidden", background:`linear-gradient(135deg,${photo.colors[0]},${photo.colors[1]},${photo.colors[2]})`, border:"1px solid rgba(221,216,204,0.05)", borderRadius:4, cursor:"crosshair",
                ...(i===0 ? { gridRow:"1/3", aspectRatio:"3/4" } : { aspectRatio:"4/3" })
              }}>
              <div style={{ position:"absolute", bottom:12, left:14, fontSize:"clamp(9px, 1.1vw, 10px)", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(221,216,204,0.18)" }}>[ Add photo ]</div>
              <motion.div initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,8,6,0.75),transparent)", display:"flex", alignItems:"flex-end", padding:14 }}>
                <span style={{ fontSize:"clamp(10px, 1.2vw, 11px)", letterSpacing:"0.2em", textTransform:"uppercase", border:"1px solid rgba(221,216,204,0.2)", padding:"4px 10px", borderRadius:20 }}>{photo.tag}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {lightbox!==null && <Lightbox photos={PHOTOS} index={lightbox} onClose={()=>setLightbox(null)}/>}
      </AnimatePresence>
    </section>
  )
}

// ── SERVICE CARD (extracted to fix hooks-in-map violation) ────────────
const ServiceCard = ({ service: s, index: i }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <Reveal key={s.num} delay={i * 0.12}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ border: "1px solid rgba(221,216,204,0.06)", padding: "40px 32px 36px", position: "relative", overflow: "hidden", background: "rgba(221,216,204,0.02)", transition: "border-color .3s", borderColor: hovered ? "rgba(176,42,26,0.2)" : "rgba(221,216,204,0.06)", height: "100%" }}
      >
        <motion.div animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--red)", transformOrigin: "left" }} />
        <span style={{ fontSize: "clamp(10px, 1.3vw, 11px)", letterSpacing: "0.3em", color: "rgba(122,112,96,0.3)", marginBottom: 28, display: "block" }}>{s.num}</span>
        <span style={{ fontSize: "1.6rem", marginBottom: 20, display: "block", filter: hovered ? "none" : "grayscale(1)", transition: "filter .3s" }}>{s.icon}</span>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em", marginBottom: 14, lineHeight: 1 }}>{s.title}</div>
        <p style={{ fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 2.1, color: "var(--dust)", marginBottom: 28 }}>{s.desc}</p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          {s.items.map(item => (
            <li key={item} style={{ fontSize: "clamp(11px, 1.4vw, 12px)", letterSpacing: "0.1em", color: "rgba(122,112,96,0.6)", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 16, height: 1, background: "var(--red)", opacity: 0.5, flexShrink: 0, display: "block" }} />
              {item}
            </li>
          ))}
        </ul>
        <Link to={s.href} style={{ fontSize: "clamp(11px, 1.4vw, 12px)", letterSpacing: "0.25em", textTransform: "uppercase", borderBottom: "1px solid rgba(221,216,204,0.15)", paddingBottom: 2, transition: "all .3s", color: hovered ? "var(--red)" : "var(--offwhite)", borderBottomColor: hovered ? "var(--red)" : "rgba(221,216,204,0.15)" }}>{s.cta} →</Link>
      </div>
    </Reveal>
  )
}

// ── SERVICES ──────────────────────────────────────────────────────────
const Services = () => (
  <section id="services" className="section-pad" style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"100px 32px" }}>
    <Reveal>
      <SectionLabel index="003" label="Services"/>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(40px,6vw,80px)", lineHeight:.92, marginBottom:56 }}>
        What we <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.85em", color:"var(--dust)" }}>build.</em>
      </h2>
    </Reveal>
    <div className="grid-services" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
      {SERVICES.map((s, i) => (
        <ServiceCard key={s.num} service={s} index={i} />
      ))}
    </div>
  </section>
)

// ── ABOUT ─────────────────────────────────────────────────────────────
const About = () => (
  <section id="about" className="grid-about section-pad" style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"100px 32px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
    <Reveal>
      <SectionLabel index="004" label="About"/>
      <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(48px,7vw,96px)", lineHeight:.9, marginBottom:32 }}>
        The{" "}<em style={{ display:"block", fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"0.75em", color:"var(--dust)" }}>sound.</em>
      </h2>
      <div className="about-record-box" style={{ width:"100%", aspectRatio:"1", border:"1px solid rgba(221,216,204,0.07)", background:"#0e0c09", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:12, border:"1px solid rgba(176,42,26,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8 }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:8, ease:"linear", repeat:Infinity }}
            style={{ width:"65%", aspectRatio:"1", borderRadius:"50%", background:"#111", border:"1px solid rgba(221,216,204,0.06)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", boxShadow:"0 0 0 9px rgba(221,216,204,0.02),0 0 0 18px rgba(221,216,204,0.015),0 0 0 27px rgba(221,216,204,0.01)" }}>
            <div style={{ width:"32%", aspectRatio:"1", borderRadius:"50%", background:"var(--red)", display:"flex", alignItems:"center", justifyContent:"center", position:"absolute", zIndex:2 }}>
              <div style={{ width:"18%", aspectRatio:"1", borderRadius:"50%", background:"#0e0c09" }}/>
            </div>
          </motion.div>
          <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(122,112,96,0.4)" }}>Soon Production · 2025</p>
        </div>
      </div>
    </Reveal>
    <div style={{ paddingTop:24 }}>
      <Reveal delay={0.1}><p style={{ fontSize:"clamp(15px, 1.9vw, 17px)", lineHeight:2.3, color:"var(--dust)", marginBottom:28 }}><strong style={{ color:"var(--offwhite)", fontWeight:"normal" }}>Soon Production</strong> is a music production and creative services company built from the ground up. Beats, photography, and creative direction — all under one roof.</p></Reveal>
      <Reveal delay={0.2}><blockquote style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1.5rem", lineHeight:1.4, borderLeft:"2px solid var(--red)", paddingLeft:20, margin:"40px 0", color:"var(--offwhite)" }}>"Something out of nothing" isn't just a tagline — it's the whole process.</blockquote></Reveal>
      <Reveal delay={0.3}><p style={{ fontSize:"clamp(15px, 1.9vw, 17px)", lineHeight:2.3, color:"var(--dust)", marginBottom:20 }}>Influenced by <strong style={{ color:"var(--offwhite)", fontWeight:"normal" }}>J Dilla</strong>, early <strong style={{ color:"var(--offwhite)", fontWeight:"normal" }}>Kanye West</strong>, and the producers who made you feel something before a single word was spoken.</p></Reveal>
      <Reveal delay={0.4}><p style={{ fontSize:"clamp(15px, 1.9vw, 17px)", lineHeight:2.3, color:"var(--dust)" }}>Custom production, beat licensing, photography, and full creative direction available. If you're an artist looking for something <strong style={{ color:"var(--offwhite)", fontWeight:"normal" }}>real</strong> — this is the place.</p></Reveal>
    </div>
  </section>
)

// ── CONTACT ───────────────────────────────────────────────────────────
const Contact = () => {
  const [form, setForm] = useState({ name:"", email:"", service:"", message:"" })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const services = ["Beat Licensing","Custom Production","Photography","Creative Direction","Other"]

  const validate = () => {
    const e = {}
    if(!form.name.trim()) e.name = "Required"
    if(!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"
    if(!form.message.trim()) e.message = "Required"
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    setErrors(e)
    if(!Object.keys(e).length) setSubmitted(true)
  }

  const inputStyle = (field) => ({
    width:"100%", background:"rgba(221,216,204,0.03)", border:`1px solid ${errors[field]?"rgba(176,42,26,0.5)":"rgba(221,216,204,0.08)"}`,
    borderRadius:6, padding:"12px 14px", fontSize:"clamp(14px, 1.7vw, 15px)", color:"var(--offwhite)", outline:"none", cursor:"crosshair",
  })

  return (
    <section id="contact" className="section-pad" style={{ borderTop:"1px solid rgba(221,216,204,0.06)", padding:"100px 32px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", fontFamily:"'Bebas Neue',sans-serif", fontSize:"40vw", color:"transparent", WebkitTextStroke:"1px rgba(221,216,204,0.03)", left:"50%", top:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none", lineHeight:1, whiteSpace:"nowrap", userSelect:"none" }}>SOON</div>
      <div style={{ position:"relative", zIndex:2, maxWidth:640 }}>
        <Reveal>
          <SectionLabel index="005" label="Contact"/>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,9vw,130px)", lineHeight:.9, marginBottom:32 }}>
            Let's build<br/>something <em style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", color:"var(--red)", fontSize:"0.8em" }}>real.</em>
          </h2>
          <a href="mailto:contact@soonproduction.com" style={{ fontSize:"clamp(13px,1.6vw,16px)", letterSpacing:"0.05em", borderBottom:"1px solid rgba(221,216,204,0.15)", paddingBottom:3, display:"inline-block", marginBottom:48, transition:"color .3s,border-color .3s" }}
            onMouseEnter={e=>{e.target.style.color="var(--red)";e.target.style.borderBottomColor="var(--red)"}}
            onMouseLeave={e=>{e.target.style.color="var(--offwhite)";e.target.style.borderBottomColor="rgba(221,216,204,0.15)"}}
          >contact@soonproduction.com</a>
        </Reveal>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="thanks" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              style={{ padding:32, border:"1px solid rgba(176,42,26,0.3)", borderRadius:8, textAlign:"center" }}>
              <p style={{ fontFamily:"'IM Fell English',serif", fontStyle:"italic", fontSize:"1.6rem", marginBottom:8 }}>Message sent.</p>
              <p style={{ fontSize:"clamp(12px, 1.6vw, 14px)", letterSpacing:"0.15em", color:"var(--dust)" }}>We'll be in touch soon.</p>
            </motion.div>
          ) : (
            <motion.div key="form" style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <Reveal delay={0.1}>
                <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[["name","Name"],["email","Email"]].map(([field,label])=>(
                    <div key={field}>
                      <label style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:errors[field]?"rgba(176,42,26,0.8)":"var(--dust)", display:"block", marginBottom:6 }}>{errors[field]||label}</label>
                      <input value={form[field]} onChange={e=>{ setForm(f=>({...f,[field]:e.target.value})); setErrors(er=>({...er,[field]:""})) }}
                        style={inputStyle(field)}
                        onFocus={e=>e.target.style.borderColor="rgba(176,42,26,0.4)"}
                        onBlur={e=>e.target.style.borderColor=errors[field]?"rgba(176,42,26,0.5)":"rgba(221,216,204,0.08)"}
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <label style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"var(--dust)", display:"block", marginBottom:6 }}>Service</label>
                <div className="contact-pills" style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {services.map(s=>(
                    <button key={s} onClick={()=>setForm(f=>({...f,service:s}))}
                      style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.18em", textTransform:"uppercase", padding:"6px 14px", borderRadius:20, border:`1px solid ${form.service===s?"var(--red)":"rgba(221,216,204,0.08)"}`, background:form.service===s?"rgba(176,42,26,0.1)":"transparent", color:form.service===s?"var(--offwhite)":"var(--dust)", transition:"all .25s" }}
                    >{s}</button>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <label style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:errors.message?"rgba(176,42,26,0.8)":"var(--dust)", display:"block", marginBottom:6 }}>{errors.message||"Message"}</label>
                <textarea value={form.message} onChange={e=>{ setForm(f=>({...f,message:e.target.value})); setErrors(er=>({...er,message:""})) }} rows={5}
                  style={{ ...inputStyle("message"), resize:"vertical" }}
                  onFocus={e=>e.target.style.borderColor="rgba(176,42,26,0.4)"}
                  onBlur={e=>e.target.style.borderColor=errors.message?"rgba(176,42,26,0.5)":"rgba(221,216,204,0.08)"}
                />
              </Reveal>
              <Reveal delay={0.25}>
                <button onClick={handleSubmit} style={{ width:"100%", padding:16, background:"var(--red)", border:"none", borderRadius:8, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:"0.2em", color:"var(--offwhite)", transition:"opacity .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                >Send Message</button>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── FOOTER ────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ padding:"28px 32px", borderTop:"1px solid rgba(221,216,204,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
    <p style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(122,112,96,0.3)" }}>© 2025 Soon Production. All rights reserved.</p>
    <div style={{ display:"flex", gap:24 }}>
      {["Instagram","SoundCloud","BeatStars"].map(s=>(
        <Link key={s} to="#" style={{ fontSize:"clamp(10px, 1.3vw, 11px)", letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(122,112,96,0.3)", transition:"color .3s" }}
          onMouseEnter={e=>e.target.style.color="var(--offwhite)"} onMouseLeave={e=>e.target.style.color="rgba(122,112,96,0.3)"}
        >{s}</Link>
      ))}
    </div>
  </footer>
)

// ── APP ───────────────────────────────────────────────────────────────
export default function HomePage({ loaded, onDone }) {
  const [currentBeat, setCurrentBeat] = useState(null)

  const handlePlay = useCallback((beat) => {
    setCurrentBeat(prev => prev?.num===beat.num ? null : beat)
  }, [])

  return (
    <>
      
      <AnimatePresence>
        {!loaded && <Loader key="loader" onDone={onDone}/>}
      </AnimatePresence>
      {loaded && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.6 }}>
          <Nav playerActive={!!currentBeat}/>
          <Hero/>
          <Ticker/>
          <Beats onPlay={handlePlay} currentBeat={currentBeat}/>
          <Visual/>
          <Services/>
          <About/>
          <Contact/>
          <Footer/>
          <AnimatePresence>
            {currentBeat && (
              <PlayerBar key={currentBeat.num} beat={currentBeat} onClose={()=>setCurrentBeat(null)}/>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  )
}

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../hooks/useAudio.js"
import Loader from "../components/Loader.jsx"

/* ═══════════════════════════════════════════════════════════════════════
   SOON Production — Redesigned Homepage Preview
   
   What's new:
   1. Homepage trimmed: hero → 3 featured beats → photo strip → email signup → contact
   2. Working audio player with HTML5 Audio API
   3. "First Listen" email signup component
   4. "Latest Drop" card on homepage
   5. Beats/photos/journal are teasers that push to dedicated pages
   ═══════════════════════════════════════════════════════════════════════ */

// ── SAMPLE BEATS (replace src with real audio URLs) ──────────────────
const BEATS = [
  { num: "001", title: "Distant Summer", meta: "Soul / Boom Bap", bpm: "87 BPM", key: "F Min", price: "$35", duration: "3:14", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", isNew: true },
  { num: "002", title: "Red Clay Road", meta: "Jazz Soul", bpm: "74 BPM", key: "Bb Maj", price: "$35", duration: "2:58", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", isNew: false },
  { num: "003", title: "Sunday Smoke", meta: "Lo-Fi Soul", bpm: "82 BPM", key: "G Min", price: "$35", duration: "3:32", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", isNew: false },
];

const PHOTOS = [
  { tag: "Portrait", colors: ["#1a0e0a", "#2e1a10", "#0e0806"] },
  { tag: "Street", colors: ["#0e1218", "#1a2030", "#080c14"] },
  { tag: "Studio", colors: ["#181210", "#2a1e14", "#100c08"] },
  { tag: "Event", colors: ["#0e1410", "#162018", "#080e0a"] },
  { tag: "Artist", colors: ["#141014", "#201828", "#0c0810"] },
];

// ── CSS ──────────────────────────────────────────────────────────────
// ── REVEAL ───────────────────────────────────────────────────────────
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
  >
    {children}
  </motion.div>
);

// ── WAVEFORM (real, tied to audio progress) ──────────────────────────
const Waveform = ({ playing, progress = 0, bars = 28, height = 32, onClick }) => {
  const [heights] = useState(() =>
    Array.from({ length: bars }, () => 6 + Math.random() * 22)
  );
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 2, height, overflow: "hidden", flex: 1, cursor: "pointer" }}
      role="slider"
      aria-label="Audio seek"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      {heights.map((h, i) => {
        const pct = i / bars;
        const isPlayed = pct < progress;
        return (
          <motion.div
            key={i}
            style={{
              width: 2, borderRadius: 1, flexShrink: 0,
              background: isPlayed ? "var(--red)" : playing ? "rgba(176,42,26,0.5)" : "rgba(122,112,96,0.2)",
            }}
            animate={playing ? { height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4] } : { height: h }}
            transition={playing ? { duration: 0.5 + Math.random() * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 } : { duration: 0.3 }}
          />
        );
      })}
    </div>
  );
};

// ── LATEST DROP BADGE ────────────────────────────────────────────────
const LatestDrop = ({ beat, onPlay, isPlaying }) => (
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    style={{
      position: "fixed", top: 100, right: 20, zIndex: 400,
      background: "rgba(10,9,7,0.92)", border: "1px solid rgba(176,42,26,0.25)",
      borderRadius: 10, padding: "14px 16px", width: 200,
      backdropFilter: "blur(12px)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", animation: "pulse 2s infinite" }} />
      <span style={{ fontSize: "clamp(9px,1.1vw,10px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--red)" }}>New Drop</span>
    </div>
    <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.2, marginBottom: 4 }}>{beat.title}</div>
    <div style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.15em", color: "var(--dust)", marginBottom: 10 }}>{beat.meta} · {beat.bpm}</div>
    <button
      onClick={() => onPlay(beat)}
      style={{
        width: "100%", padding: "8px", background: isPlaying ? "rgba(176,42,26,0.15)" : "var(--red)",
        border: "none", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif",
        fontSize: "clamp(12px,1.5vw,14px)", letterSpacing: "0.2em", color: "var(--offwhite)",
        transition: "opacity 0.2s",
      }}
    >
      {isPlaying ? "⏸ Playing" : "▶ Listen Now"}
    </button>
  </motion.div>
);

// ── BEAT PREVIEW CARD ────────────────────────────────────────────────
const BeatPreviewCard = ({ beat, onPlay, isPlaying, progress, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={index * 0.1}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${isPlaying ? "rgba(176,42,26,0.4)" : hovered ? "rgba(221,216,204,0.12)" : "rgba(221,216,204,0.06)"}`,
          borderRadius: 12, overflow: "hidden", background: isPlaying ? "rgba(176,42,26,0.04)" : "#0d0b09",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        {/* Color bar */}
        <div style={{ height: 3, background: "linear-gradient(to right, var(--red), transparent)" }} />

        <div style={{ padding: "18px 20px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.3em", color: "rgba(122,112,96,0.3)" }}>{beat.num}</span>
              {beat.isNew && (
                <span style={{
                  marginLeft: 8, fontSize: "clamp(8px,1vw,9px)", letterSpacing: "0.2em", textTransform: "uppercase",
                  padding: "2px 8px", borderRadius: 20, background: "rgba(176,42,26,0.15)", border: "1px solid rgba(176,42,26,0.3)", color: "var(--red)",
                }}>New</span>
              )}
            </div>
            <span style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.15em", color: "var(--dust)" }}>{beat.key}</span>
          </div>

          {/* Title */}
          <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(18px,3vw,22px)", lineHeight: 1.1, marginBottom: 4 }}>{beat.title}</div>
          <div style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--dust)", marginBottom: 16 }}>{beat.meta} · {beat.bpm}</div>

          {/* Waveform */}
          <div style={{ marginBottom: 12 }}>
            <Waveform
              playing={isPlaying}
              progress={isPlaying ? progress : 0}
              bars={32}
              height={28}
              onClick={(e) => {
                if (isPlaying) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  // seek handled by parent
                }
                onPlay(beat);
              }}
            />
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(16px,2.5vw,20px)", lineHeight: 1 }}>{beat.price}</div>
              <div style={{ fontSize: "clamp(9px,1.1vw,10px)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--dust)" }}>Lease</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onPlay(beat); }}
              aria-label={isPlaying ? `Pause ${beat.title}` : `Play ${beat.title}`}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                border: `1px solid ${isPlaying ? "var(--red)" : "rgba(221,216,204,0.12)"}`,
                background: isPlaying ? "var(--red)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s",
              }}
            >
              {isPlaying
                ? <span style={{ display: "flex", gap: 2 }}><span style={{ width: 2, height: 10, background: "white", borderRadius: 1 }} /><span style={{ width: 2, height: 10, background: "white", borderRadius: 1 }} /></span>
                : <svg width="8" height="10" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="var(--offwhite)" /></svg>
              }
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

// ── PLAYER BAR (real audio controls) ─────────────────────────────────
const PlayerBar = ({ beat, playing, progress, duration, onPlayPause, onSeek, onClose, formatTime }) => (
  <motion.div
    initial={{ y: 80 }}
    animate={{ y: 0 }}
    exit={{ y: 80 }}
    transition={{ type: "spring", damping: 24, stiffness: 200 }}
    style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 600,
      background: "rgba(10,9,7,0.96)", borderTop: "1px solid rgba(221,216,204,0.08)",
      backdropFilter: "blur(12px)", padding: "12px 24px",
      display: "flex", alignItems: "center", gap: 16,
    }}
  >
    {/* Info */}
    <div style={{ minWidth: 0, flex: "0 0 auto" }}>
      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{beat.title}</div>
      <div style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--dust)", marginTop: 2 }}>{beat.meta} · {beat.bpm}</div>
    </div>

    {/* Play/pause */}
    <button
      onClick={onPlayPause}
      aria-label={playing ? "Pause" : "Play"}
      style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--red)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
    >
      {playing
        ? <span style={{ display: "flex", gap: 3 }}><span style={{ width: 3, height: 12, background: "var(--offwhite)", borderRadius: 1 }} /><span style={{ width: 3, height: 12, background: "var(--offwhite)", borderRadius: 1 }} /></span>
        : <svg width="10" height="12" viewBox="0 0 8 10"><path d="M0 0L8 5L0 10Z" fill="white" /></svg>
      }
    </button>

    {/* Waveform + seek */}
    <div style={{ flex: 1, minWidth: 0 }} onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onSeek((e.clientX - rect.left) / rect.width);
    }}>
      <Waveform playing={playing} progress={progress} bars={50} height={28} />
    </div>

    {/* Time */}
    <div style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.1em", color: "rgba(122,112,96,0.5)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
      {formatTime(progress * duration)} / {formatTime(duration)}
    </div>

    {/* Close */}
    <button onClick={onClose} aria-label="Close player" style={{ background: "none", border: "none", color: "var(--dust)", fontSize: "1rem" }}>×</button>
  </motion.div>
);

// ── EMAIL SIGNUP ("First Listen" drop list) ──────────────────────────
const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      return;
    }
    // In production: connect to Mailchimp/Buttondown/ConvertKit API
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: "28px 24px", border: "1px solid rgba(176,42,26,0.25)", borderRadius: 10, textAlign: "center", background: "rgba(176,42,26,0.04)" }}
      >
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "clamp(18px,3vw,22px)", marginBottom: 6 }}>You're on the list.</div>
        <p style={{ fontSize: "clamp(11px,1.4vw,13px)", color: "var(--dust)", letterSpacing: "0.08em" }}>New beats hit your inbox before anyone else hears them.</p>
      </motion.div>
    );
  }

  return (
    <div style={{ border: "1px solid rgba(221,216,204,0.07)", borderRadius: 12, padding: "32px 28px", background: "rgba(221,216,204,0.02)", position: "relative", overflow: "hidden" }}>
      {/* Decorative accent */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: 2, background: "linear-gradient(to right, var(--red), transparent)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--red)" }}>First Listen</span>
      </div>

      <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(24px,4vw,36px)", lineHeight: 0.95, marginBottom: 8 }}>
        Hear it <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--dust)" }}>first.</em>
      </h3>
      <p style={{ fontSize: "clamp(12px,1.5vw,14px)", color: "var(--dust)", lineHeight: 1.8, letterSpacing: "0.04em", marginBottom: 20, maxWidth: 360 }}>
        New beats drop to the list 48 hours before they hit the store. No spam. Just music.
      </p>

      <div className="email-box" style={{ display: "flex", gap: 8 }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="your@email.com"
          aria-label="Email address for beat drops"
          style={{
            flex: 1, background: "rgba(221,216,204,0.03)",
            border: `1px solid ${status === "error" ? "rgba(176,42,26,0.5)" : focused ? "rgba(176,42,26,0.4)" : "rgba(221,216,204,0.08)"}`,
            borderRadius: 6, padding: "12px 14px",
            fontSize: "clamp(13px,1.6vw,15px)", color: "var(--offwhite)", outline: "none",
            transition: "border-color 0.2s",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px 24px", background: "var(--red)", border: "none", borderRadius: 6,
            fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(14px,1.8vw,16px)",
            letterSpacing: "0.15em", color: "var(--offwhite)", transition: "opacity 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          Join
        </button>
      </div>
      {status === "error" && (
        <p style={{ fontSize: "clamp(10px,1.2vw,11px)", color: "rgba(176,100,80,0.9)", marginTop: 8, letterSpacing: "0.08em" }}>Enter a valid email address.</p>
      )}
    </div>
  );
};

// ── SECTION DIVIDER ──────────────────────────────────────────────────
const SectionLabel = ({ index, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(122,112,96,0.4)", marginBottom: 40 }} aria-hidden="true">
    {index} / {label}
    <span style={{ flex: 1, height: 1, background: "rgba(221,216,204,0.06)" }} />
  </div>
);

// ══════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const audio = useAudio();
  const [showDrop, setShowDrop] = useState(true);
  const newBeat = BEATS.find(b => b.isNew);

    return (
    <>
      <AnimatePresence>
        {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* ── LATEST DROP BADGE ── */}

      <AnimatePresence>
        {showDrop && newBeat && !audio.current && (
          <motion.div key="drop" exit={{ opacity: 0, x: 40 }}>
            <LatestDrop
              beat={newBeat}
              onPlay={(b) => { audio.play(b); setShowDrop(false); }}
              isPlaying={audio.current?.num === newBeat.num && audio.playing}
            />
            <button
              onClick={() => setShowDrop(false)}
              style={{ position: "fixed", top: 104, right: 24, zIndex: 401, background: "none", border: "none", color: "var(--dust)", fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.2em" }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 70% 80% at 55% 40%, rgba(140,20,10,0.75) 0%, transparent 65%), radial-gradient(ellipse 40% 50% at 20% 70%, rgba(90,10,5,0.4) 0%, transparent 55%), linear-gradient(160deg,#1a0505 0%,#2e0a08 35%,#120303 100%)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 100% at 50% 50%,transparent 30%,rgba(8,8,6,0.7) 100%),linear-gradient(to top,rgba(8,8,6,1) 0%,rgba(8,8,6,0.3) 35%,transparent 65%)", pointerEvents: "none" }} />

        {/* Video placeholder */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.3em", color: "rgba(255,255,255,0.05)", textTransform: "uppercase", whiteSpace: "nowrap", pointerEvents: "none" }}>[ YOUR A7III FOOTAGE ]</div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ position: "relative", zIndex: 10, padding: "0 24px 44px", width: "100%" }}
        >
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
            style={{ fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--red)", marginBottom: 14 }}>
            Soon Production · Est. 2025
          </motion.p>
          <motion.h1 className="hero-title" initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(60px,16vw,180px)", lineHeight: 0.88, letterSpacing: "-0.01em" }}>
            Sound<br />made{" "}<em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.75em" }}>from</em><br />nothing.
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
            style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
            <p style={{ fontSize: "clamp(12px,1.5vw,14px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--dust)", lineHeight: 1.9 }}>
              Original beats.<br />Soul-driven production.<br />Built on the MPC.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--dust)" }}>
              <motion.div animate={{ height: ["20px", "32px", "20px"] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} style={{ width: 1, background: "var(--dust)" }} />
              Scroll
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(221,216,204,0.07)", borderBottom: "1px solid rgba(221,216,204,0.07)", padding: "11px 0", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 80, background: "linear-gradient(to right,var(--black),transparent)", zIndex: 2 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 80, background: "linear-gradient(to left,var(--black),transparent)", zIndex: 2 }} />
        <motion.div style={{ display: "flex", gap: 48, whiteSpace: "nowrap" }}
          animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, ease: "linear", repeat: Infinity }}>
          {[...Array(2)].flatMap((_, j) =>
            ["Beats", "✦", "Soul", "✦", "MPC Live", "✦", "Something Out of Nothing", "✦", "Sample-Driven", "✦", "Custom Production", "✦", "Photography", "✦", "Creative Direction", "✦", "Est. 2025", "✦"].map((item, i) => (
              <span key={`${j}-${i}`} style={{ fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "0.35em", textTransform: "uppercase", color: item === "✦" ? "var(--red)" : "var(--dust)", flexShrink: 0 }}>{item}</span>
            ))
          )}
        </motion.div>
      </div>

      {/* ── FEATURED BEATS (3 only, teaser) ── */}
      <section style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "80px 24px" }}>
        <Reveal>
          <SectionLabel index="001" label="Featured Beats" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(36px,6vw,72px)", lineHeight: 0.92 }}>
              The <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.85em", color: "var(--dust)" }}>catalogue.</em>
            </h2>
            <a href="#" style={{ fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "0.25em", textTransform: "uppercase", borderBottom: "1px solid rgba(221,216,204,0.2)", paddingBottom: 2, transition: "color 0.2s" }}>
              View all {BEATS.length}+ beats →
            </a>
          </div>
        </Reveal>

        <div className="beats-preview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {BEATS.map((beat, i) => (
            <BeatPreviewCard
              key={beat.num}
              beat={beat}
              onPlay={audio.play}
              isPlaying={audio.current?.num === beat.num && audio.playing}
              progress={audio.current?.num === beat.num ? audio.progress : 0}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ── PHOTO STRIP (teaser) ── */}
      <section style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "80px 24px" }}>
        <Reveal>
          <SectionLabel index="002" label="Visual Work" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(36px,6vw,72px)", lineHeight: 0.92 }}>
              The <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", fontSize: "0.85em", color: "var(--dust)" }}>eye.</em>
            </h2>
            <a href="#" style={{ fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "0.25em", textTransform: "uppercase", borderBottom: "1px solid rgba(221,216,204,0.2)", paddingBottom: 2 }}>
              Full gallery →
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="photo-strip" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
            {PHOTOS.map((photo, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                style={{
                  aspectRatio: i === 0 ? "3/4" : "4/3",
                  background: `linear-gradient(135deg,${photo.colors[0]},${photo.colors[1]},${photo.colors[2]})`,
                  borderRadius: 4, border: "1px solid rgba(221,216,204,0.05)",
                  position: "relative", overflow: "hidden", cursor: "pointer",
                }}
              >
                <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: "clamp(9px,1vw,10px)", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(221,216,204,0.15)" }}>[ {photo.tag} ]</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p style={{ fontSize: "clamp(11px,1.4vw,13px)", color: "var(--dust)", letterSpacing: "0.08em", marginTop: 20, textAlign: "center" }}>
            Shot on Sony A7III · 24-70mm GM II · Brooklyn, NY
          </p>
        </Reveal>
      </section>

      {/* ── EMAIL SIGNUP ── */}
      <section style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <Reveal>
            <EmailSignup />
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT (condensed) ── */}
      <section style={{ borderTop: "1px solid rgba(221,216,204,0.06)", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
        {/* Ghost text */}
        <div aria-hidden="true" style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "30vw", color: "transparent", WebkitTextStroke: "1px rgba(221,216,204,0.025)", left: "50%", top: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", lineHeight: 1, whiteSpace: "nowrap", userSelect: "none" }}>SOON</div>

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel index="003" label="Contact" />
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(40px,7vw,80px)", lineHeight: 0.9, marginBottom: 16 }}>
              Let's build<br />something <em style={{ fontFamily: "'IM Fell English',serif", fontStyle: "italic", color: "var(--red)", fontSize: "0.8em" }}>real.</em>
            </h2>
            <a href="mailto:contact@soonproduction.com"
              style={{ fontSize: "clamp(13px,1.6vw,16px)", letterSpacing: "0.05em", borderBottom: "1px solid rgba(221,216,204,0.15)", paddingBottom: 3, display: "inline-block", marginBottom: 28, transition: "color 0.3s" }}>
              contact@soonproduction.com
            </a>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
              {["Beat Licensing", "Custom Production", "Photography", "Creative Direction"].map(s => (
                <span key={s} style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.18em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(221,216,204,0.08)", color: "var(--dust)" }}>{s}</span>
              ))}
            </div>
            <div className="cta-row" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <a href="#" style={{ padding: "13px 32px", border: "1px solid rgba(221,216,204,0.12)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(14px,2vw,16px)", letterSpacing: "0.2em", color: "var(--offwhite)", transition: "border-color 0.2s" }}>Browse Beats</a>
              <a href="#" style={{ padding: "13px 32px", background: "var(--red)", borderRadius: 6, fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(14px,2vw,16px)", letterSpacing: "0.2em", color: "var(--offwhite)", transition: "opacity 0.2s" }}>Get in Touch</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "24px", borderTop: "1px solid rgba(221,216,204,0.06)" }}>
        <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(122,112,96,0.3)" }}>© 2025 Soon Production. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Instagram", "SoundCloud", "BeatStars"].map(s => (
              <a key={s} href="#" style={{ fontSize: "clamp(10px,1.2vw,11px)", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(122,112,96,0.3)", transition: "color 0.3s" }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── PLAYER BAR ── */}
      <AnimatePresence>
        {audio.current && (
          <PlayerBar
            beat={audio.current}
            playing={audio.playing}
            progress={audio.progress}
            duration={audio.duration}
            onPlayPause={() => audio.play(audio.current)}
            onSeek={audio.seek}
            onClose={audio.stop}
            formatTime={audio.formatTime}
          />
        )}
      </AnimatePresence>
    </>
  );
}

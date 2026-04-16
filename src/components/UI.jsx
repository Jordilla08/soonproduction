import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ── Scroll-triggered reveal animation ─────────────────────────────
export const Reveal = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Section label with divider line ───────────────────────────────
export const SectionLabel = ({ index, label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontSize: 'clamp(10px, 1.2vw, 11px)',
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      color: 'rgba(122,112,96,0.4)',
      marginBottom: 40,
    }}
    aria-hidden="true"
  >
    {index} / {label}
    <span style={{ flex: 1, height: 1, background: 'rgba(221,216,204,0.06)' }} />
  </div>
)

// ── Animated waveform bars ────────────────────────────────────────
export const Waveform = ({ playing = false, bars = 26, height = 36, progress = 0 }) => {
  const [heights] = useState(() =>
    Array.from({ length: bars }, () => 8 + Math.random() * 22)
  )
  return (
    <div
      role="img"
      aria-label={playing ? 'Playing audio waveform' : 'Audio waveform'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        height,
        overflow: 'hidden',
        flex: 1,
        position: 'relative',
      }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          style={{
            width: 2,
            borderRadius: 1,
            flexShrink: 0,
            background:
              i / bars < progress
                ? 'var(--red)'
                : playing
                  ? 'rgba(176,42,26,0.6)'
                  : 'rgba(122,112,96,0.22)',
          }}
          animate={
            playing
              ? { height: [h * 0.4, h, h * 0.6, h * 0.9, h * 0.4] }
              : { height: h }
          }
          transition={
            playing
              ? { duration: 0.5 + Math.random() * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.02 }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  )
}

// ── Filter tag pill ───────────────────────────────────────────────
export const Tag = ({ label, active, onClick, color }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    style={{
      fontSize: 'clamp(10px, 1.2vw, 11px)',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      padding: '5px 12px',
      borderRadius: 20,
      border: `1px solid ${active ? (color || 'var(--red)') : 'rgba(221,216,204,0.08)'}`,
      background: active ? `${color || 'var(--red)'}18` : 'transparent',
      color: active ? (color || 'var(--offwhite)') : 'var(--dust)',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </button>
)

// ── Photo placeholder (used in Journal, Photography, etc) ─────────
export const PhotoPlaceholder = ({ colors, caption, style: extraStyle = {} }) => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
      border: '1px solid rgba(221,216,204,0.05)',
      borderRadius: 4,
      ...extraStyle,
    }}
  >
    {caption && (
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 14,
          fontSize: 'clamp(9px, 1.1vw, 10px)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(221,216,204,0.18)',
        }}
      >
        {caption}
      </div>
    )}
  </div>
)

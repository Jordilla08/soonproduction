import { useState, useEffect } from ‘react’
import { Link, useLocation } from ‘react-router-dom’
import { motion, AnimatePresence } from ‘framer-motion’

const NAV_LINKS = [
{ to: ‘/beats’, label: ‘Beats’ },
{ to: ‘/visual’, label: ‘Visual’ },
{ to: ‘/journal’, label: ‘Journal’ },
{ to: ‘/placements’, label: ‘Placements’ },
{ to: ‘/kits’, label: ‘Sound Kits’ },
]

export default function Nav({ playerActive = false }) {
const [scrolled, setScrolled] = useState(false)
const [menuOpen, setMenuOpen] = useState(false)
const location = useLocation()

// Close menu on route change
useEffect(() => { setMenuOpen(false) }, [location.pathname])

useEffect(() => {
const onScroll = () => setScrolled(window.scrollY > 60)
window.addEventListener(‘scroll’, onScroll, { passive: true })
return () => window.removeEventListener(‘scroll’, onScroll)
}, [])

return (
<>
<nav
role=“navigation”
aria-label=“Main navigation”
style={{
position: ‘fixed’,
top: 0,
left: 0,
right: 0,
zIndex: 500,
padding: scrolled ? ‘14px 20px’ : ‘20px 20px’,
display: ‘flex’,
justifyContent: ‘space-between’,
alignItems: ‘center’,
transition: ‘padding 0.3s, background 0.3s’,
background: scrolled ? ‘rgba(8,8,6,0.85)’ : ‘transparent’,
backdropFilter: scrolled ? ‘blur(8px)’ : ‘none’,
borderBottom: scrolled ? ‘1px solid rgba(221,216,204,0.05)’ : ‘none’,
}}
>
<Link
to=”/”
aria-label=“SOON Production homepage”
style={{
fontFamily: “‘Bebas Neue’, sans-serif”,
fontSize: ‘1.05rem’,
letterSpacing: ‘0.25em’,
zIndex: 600,
}}
>
Soon
<span
style={{
display: ‘block’,
fontFamily: “‘Courier Prime’, monospace”,
fontSize: ‘clamp(10px, 1.2vw, 11px)’,
letterSpacing: ‘0.35em’,
color: ‘var(–dust)’,
marginTop: 3,
}}
>
Something Out of Nothing
</span>
</Link>

```
    {/* Desktop nav */}
    <div
      className="desktop-nav nav-links"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 5,
      }}
    >
      {NAV_LINKS.map(({ to, label }) => {
        const isActive = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            style={{
              fontSize: 'clamp(11px, 1.4vw, 13px)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--offwhite)' : 'var(--dust)',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </Link>
        )
      })}
    </div>

    {/* Hamburger */}
    <button
      onClick={() => setMenuOpen(m => !m)}
      className="hamburger"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={menuOpen}
      style={{
        display: 'none',
        background: 'none',
        border: 'none',
        padding: 4,
        flexDirection: 'column',
        gap: 5,
        zIndex: 600,
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={{
            display: 'block',
            width: 22,
            height: 1,
            background: 'var(--offwhite)',
          }}
          animate={
            menuOpen
              ? i === 1
                ? { opacity: 0 }
                : i === 0
                  ? { rotate: 45, y: 6 }
                  : { rotate: -45, y: -6 }
              : { opacity: 1, rotate: 0, y: 0 }
          }
        />
      ))}
    </button>
  </nav>

  {/* Mobile menu overlay */}
  <AnimatePresence>
    {menuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        role="dialog"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8,8,6,0.97)',
          zIndex: 490,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
        }}
      >
        {[{ to: '/', label: 'Home' }, ...NAV_LINKS].map(({ to, label }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={to}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(36px, 8vw, 64px)',
                letterSpacing: '0.15em',
                color: 'var(--offwhite)',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</>
```

)
}
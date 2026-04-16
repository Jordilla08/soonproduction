import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
      role="main"
      aria-label="Page not found"
    >
      {/* Ghost 404 background text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '40vw',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(221,216,204,0.03)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        404
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <p
          style={{
            fontSize: 'clamp(10px, 1.5vw, 12px)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(122,112,96,0.4)',
            marginBottom: 16,
          }}
        >
          Error 404
        </p>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.9,
            marginBottom: 16,
          }}
        >
          Page not{' '}
          <em
            style={{
              fontFamily: "'IM Fell English', serif",
              fontStyle: 'italic',
              color: 'var(--red)',
            }}
          >
            found.
          </em>
        </h1>

        <p
          style={{
            fontSize: 'clamp(12px, 1.8vw, 15px)',
            color: 'var(--dust)',
            letterSpacing: '0.08em',
            lineHeight: 2,
            marginBottom: 40,
          }}
        >
          This page doesn't exist. But the music does.
        </p>

        <nav
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
          aria-label="404 navigation"
        >
          <Link
            to="/"
            aria-label="Go to homepage"
            style={{
              padding: '12px 28px',
              border: '1px solid rgba(221,216,204,0.12)',
              borderRadius: 6,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(14px, 2vw, 16px)',
              letterSpacing: '0.2em',
              color: 'var(--offwhite)',
              transition: 'border-color 0.2s',
            }}
          >
            Go Home
          </Link>
          <Link
            to="/beats"
            aria-label="Browse beat catalogue"
            style={{
              padding: '12px 28px',
              background: 'var(--red)',
              borderRadius: 6,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(14px, 2vw, 16px)',
              letterSpacing: '0.2em',
              color: 'var(--offwhite)',
              transition: 'opacity 0.2s',
            }}
          >
            Browse Beats
          </Link>
        </nav>
      </motion.div>
    </main>
  )
}

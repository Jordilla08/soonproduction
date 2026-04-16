import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, lazy, Suspense } from 'react'

// Lazy-load pages — only loads the JS for each page when navigated to
const HomePage        = lazy(() => import('./pages/HomePage.jsx'))
const BeatsPage       = lazy(() => import('./pages/BeatsPage.jsx'))
const PhotographyPage = lazy(() => import('./pages/PhotographyPage.jsx'))
const JournalPage     = lazy(() => import('./pages/JournalPage.jsx'))
const PlacementsPage  = lazy(() => import('./pages/PlacementsPage.jsx'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage.jsx'))

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Minimal loading state that matches the site aesthetic
const PageLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(14px, 2vw, 18px)',
        letterSpacing: '0.3em',
        color: 'rgba(122, 112, 96, 0.5)',
      }}
    >
      SOON
    </div>
  </div>
)

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
}

const PageTransition = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </motion.div>
)

// Animated routes with suspense
const AnimatedRoutes = ({ loaded, onDone }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><HomePage loaded={loaded} onDone={onDone} /></PageTransition>
          </Suspense>
        } />
        <Route path="/beats" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><BeatsPage /></PageTransition>
          </Suspense>
        } />
        <Route path="/visual" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><PhotographyPage /></PageTransition>
          </Suspense>
        } />
        <Route path="/journal" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><JournalPage /></PageTransition>
          </Suspense>
        } />
        <Route path="/placements" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><PlacementsPage /></PageTransition>
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition><NotFoundPage /></PageTransition>
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  )
}

// Root
export default function App() {
  const [loaded, setLoaded] = useState(!!sessionStorage.getItem('soonLoaded'))

  const handleDone = () => {
    sessionStorage.setItem('soonLoaded', 'true')
    setLoaded(true)
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes loaded={loaded} onDone={handleDone} />
    </BrowserRouter>
  )
}

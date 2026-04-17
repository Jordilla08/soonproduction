import { useState, useEffect, useRef, useCallback } from ‘react’

export const useAudio = () => {
const ref = useRef(null)
const [current, setCurrent] = useState(null)
const [playing, setPlaying] = useState(false)
const [progress, setProgress] = useState(0)
const [duration, setDuration] = useState(0)
const rafRef = useRef(null)

useEffect(() => {
ref.current = new Audio()
ref.current.volume = 0.7
ref.current.addEventListener(‘loadedmetadata’, () => setDuration(ref.current.duration))
ref.current.addEventListener(‘ended’, () => { setPlaying(false); setProgress(0) })
return () => {
ref.current?.pause()
ref.current = null
cancelAnimationFrame(rafRef.current)
}
}, [])

const tick = useCallback(() => {
if (ref.current?.duration) setProgress(ref.current.currentTime / ref.current.duration)
rafRef.current = requestAnimationFrame(tick)
}, [])

const play = useCallback((beat) => {
if (!ref.current) return
if (current?.num === beat.num) {
if (playing) { ref.current.pause(); setPlaying(false); cancelAnimationFrame(rafRef.current) }
else { ref.current.play().catch(() => {}); setPlaying(true); rafRef.current = requestAnimationFrame(tick) }
return
}
ref.current.pause()
cancelAnimationFrame(rafRef.current)
ref.current.src = beat.src
ref.current.load()
ref.current.play().catch(() => {})
setCurrent(beat)
setPlaying(true)
setProgress(0)
rafRef.current = requestAnimationFrame(tick)
}, [current, playing, tick])

const seek = useCallback((pct) => {
if (ref.current?.duration) {
ref.current.currentTime = pct * ref.current.duration
setProgress(pct)
}
}, [])

const stop = useCallback(() => {
ref.current?.pause()
setPlaying(false)
setCurrent(null)
setProgress(0)
cancelAnimationFrame(rafRef.current)
}, [])

const fmt = (s) => {
if (!s || isNaN(s)) return ‘0:00’
return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

return { current, playing, progress, duration, play, seek, stop, fmt }
}
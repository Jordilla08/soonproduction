// ─────────────────────────────────────────────────────────────────────
// SOON Production — Contact Form with EmailJS
// File: src/components/ContactForm.jsx
//
// SETUP:
// 1. Go to emailjs.com → create free account
// 2. Add Service → Gmail → connect contact@soonproduction.com
// 3. Create Email Template with variables:
//      {{from_name}}, {{from_email}}, {{service}}, {{message}}
// 4. Replace the three placeholder values below
// ─────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

// ── REPLACE THESE ────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'
// ─────────────────────────────────────────────────────────────────────

const IS_CONFIGURED = !EMAILJS_SERVICE_ID.startsWith('YOUR_')

const SERVICES = [
  'Beat Licensing',
  'Custom Production',
  'Photography',
  'Creative Direction',
  'Other',
]

export default function ContactForm() {
  const [form, setForm]       = useState({ name: '', email: '', service: '', message: '' })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle')
  const [focused, setFocused] = useState(null)

  const validate = useCallback(() => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Message required'
    return e
  }, [form])

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }

    if (!IS_CONFIGURED) {
      setStatus('error')
      return
    }

    setStatus('sending')

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          service:    form.service || 'Not specified',
          message:    form.message,
          to_name:    'SOON Production',
        },
        EMAILJS_PUBLIC_KEY,
      )
      setStatus('success')
      setForm({ name: '', email: '', service: '', message: '' })
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('error')
    }
  }, [form, validate])

  const getInputStyle = (field) => {
    const hasError = !!errors[field]
    const isFocused = focused === field
    let borderColor = 'rgba(221,216,204,0.08)'
    if (hasError) borderColor = 'rgba(176,42,26,0.5)'
    else if (isFocused) borderColor = 'rgba(176,42,26,0.4)'

    return {
      width: '100%',
      background: 'rgba(221,216,204,0.03)',
      border: `1px solid ${borderColor}`,
      borderRadius: 6,
      padding: '12px 14px',
      fontSize: 'clamp(14px, 2vw, 15px)',
      color: 'var(--offwhite)',
      outline: 'none',
      fontFamily: "'Courier Prime', monospace",
      transition: 'border-color 0.2s',
    }
  }

  const getLabelStyle = (field) => ({
    fontSize: 'clamp(10px, 1.5vw, 11px)',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: errors[field] ? 'rgba(176,42,26,0.8)' : 'var(--dust)',
    display: 'block',
    marginBottom: 6,
  })

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        aria-live="polite"
        style={{
          padding: 32,
          border: '1px solid rgba(60,160,60,0.2)',
          borderRadius: 10,
          textAlign: 'center',
          background: 'rgba(60,120,60,0.04)',
        }}
      >
        <div
          style={{
            fontFamily: "'IM Fell English', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 4vw, 26px)',
            marginBottom: 8,
          }}
        >
          Message sent.
        </div>
        <p
          style={{
            fontSize: 'clamp(12px, 1.8vw, 14px)',
            letterSpacing: '0.15em',
            color: 'var(--dust)',
          }}
        >
          We'll be in touch soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            marginTop: 20,
            fontSize: 'clamp(10px, 1.5vw, 11px)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: 'none',
            border: '1px solid rgba(221,216,204,0.1)',
            color: 'var(--dust)',
            padding: '8px 20px',
            borderRadius: 6,
          }}
        >
          Send another
        </button>
      </motion.div>
    )
  }

  return (
    <div role="form" aria-label="Contact SOON Production" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { field: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
          { field: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
        ].map(({ field, label, type, autoComplete }) => (
          <div key={field}>
            <label htmlFor={`contact-${field}`} style={getLabelStyle(field)}>
              {errors[field] || label}
            </label>
            <input
              id={`contact-${field}`}
              name={field}
              type={type}
              autoComplete={autoComplete}
              aria-required="true"
              aria-invalid={!!errors[field]}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
              value={form[field]}
              onChange={e => updateField(field, e.target.value)}
              onFocus={() => setFocused(field)}
              onBlur={() => setFocused(null)}
              style={getInputStyle(field)}
            />
          </div>
        ))}
      </div>

      {/* Service pills */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={getLabelStyle('service')}>Service (optional)</legend>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="radiogroup">
          {SERVICES.map(s => {
            const isActive = form.service === s
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => updateField('service', isActive ? '' : s)}
                style={{
                  fontSize: 'clamp(10px, 1.5vw, 11px)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `1px solid ${isActive ? 'var(--red)' : 'rgba(221,216,204,0.08)'}`,
                  background: isActive ? 'rgba(176,42,26,0.1)' : 'transparent',
                  color: isActive ? 'var(--offwhite)' : 'var(--dust)',
                  transition: 'all 0.2s',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" style={getLabelStyle('message')}>
          {errors.message || 'Message'}
        </label>
        <textarea
          id="contact-message"
          name="message"
          aria-required="true"
          aria-invalid={!!errors.message}
          value={form.message}
          onChange={e => updateField('message', e.target.value)}
          onFocus={() => setFocused('message')}
          onBlur={() => setFocused(null)}
          rows={5}
          style={{ ...getInputStyle('message'), resize: 'vertical' }}
        />
      </div>

      {/* Error notice */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alert"
            style={{
              fontSize: 'clamp(12px, 1.8vw, 13px)',
              color: 'rgba(176,100,80,0.9)',
              letterSpacing: '0.08em',
            }}
          >
            {IS_CONFIGURED
              ? 'Something went wrong. Try emailing us directly at contact@soonproduction.com'
              : 'Contact form is not configured yet. Email us at contact@soonproduction.com'}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === 'sending'}
        aria-label="Send contact message"
        style={{
          width: '100%',
          padding: 14,
          background: status === 'sending' ? 'rgba(176,42,26,0.5)' : 'var(--red)',
          border: 'none',
          borderRadius: 8,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(16px, 2.5vw, 18px)',
          letterSpacing: '0.2em',
          color: 'var(--offwhite)',
          transition: 'opacity 0.2s',
          cursor: status === 'sending' ? 'wait' : undefined,
          opacity: status === 'sending' ? 0.7 : 1,
        }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  )
}

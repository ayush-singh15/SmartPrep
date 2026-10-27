import { useState, useRef, useEffect } from 'react'
import { useApp } from '../hooks/AppContext'
import { getAIResponse } from '../utils/aiEngine'

const QUICK_PROMPTS = [
  'What should I study today?',
  'I missed 3 days, adjust my plan',
  'What comes after DSA?',
  'Give me practice questions',
  'Show my weak areas',
  'How is my progress?',
]

function formatMessage(text) {
  // Bold **text**
  let out = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic *text*
  out = out.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Lines starting with ✅ → green, ⚠️ → yellow, 🔒 → dim, 🔄 → primary
  out = out.replace(/^(✅.+)$/gm, '<span style="color:var(--tertiary)">$1</span>')
  out = out.replace(/^(⚠️.+)$/gm, '<span style="color:var(--warning)">$1</span>')
  out = out.replace(/^(🔒.+)$/gm, '<span style="color:var(--secondary)">$1</span>')
  out = out.replace(/^(🔄.+)$/gm, '<span style="color:var(--primary)">$1</span>')
  out = out.replace(/→/g, '<span style="color:var(--primary)">→</span>')
  out = out.split('\n').map(l => l || '<br/>').join('<br/>')
  return out
}

export default function AIChat() {
  const { progress, profile } = useApp()
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      text: getAIResponse('', progress, profile),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function sendMessage(text) {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = getAIResponse(text, progress, profile)
      setMessages(m => [...m, { id: Date.now() + 1, role: 'assistant', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            gap: 8, alignItems: 'flex-end',
          }} className="sp-fadein">
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#fff' }}>memory</span>
              </div>
            )}
            <div style={{
              maxWidth: '80%',
              backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--surface-mid)',
              color: msg.role === 'user' ? '#fff' : 'var(--on-surface)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '8px 12px',
            }}>
              <div
                style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              />
              <div style={{ fontSize: '0.625rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--on-surface-dim)', marginTop: 4 }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#fff' }}>memory</span>
            </div>
            <div style={{
              backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
              borderRadius: '12px 12px 12px 2px', padding: '10px 14px',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 150, 300].map(d => (
                <div key={d} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  backgroundColor: 'var(--primary)', animationDelay: d + 'ms',
                }} className="sp-pulse" />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 0', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="sp-btn-secondary"
            style={{
              whiteSpace: 'nowrap', padding: '4px 10px', fontSize: '0.75rem',
              borderRadius: 9999, flexShrink: 0,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center',
        borderTop: '1px solid var(--border)', paddingTop: 8,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
          placeholder="Ask SmartPrep AI anything..."
          style={{
            flex: 1, padding: '9px 12px', borderRadius: 6,
            backgroundColor: 'var(--surface-mid)', border: '1px solid var(--border)',
            color: 'var(--on-surface)', fontSize: '0.875rem', outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="sp-btn-primary"
          style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, borderRadius: 6,
            opacity: input.trim() ? 1 : 0.4,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
        </button>
      </div>
    </div>
  )
}

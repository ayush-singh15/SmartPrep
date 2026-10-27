// Lightweight Web Audio API Synthesizer for UI sound effects
// Zero external files, zero lag, works offline.

class SoundFX {
  constructor() {
    this.ctx = null
    this.enabled = true
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggle(enable) {
    this.enabled = enable !== undefined ? enable : !this.enabled
    return this.enabled
  }

  playPop() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(440, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.09)
  }

  playSuccess() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    // Two-tone cheerful chime (E5 -> G#5 -> B5)
    const notes = [659.25, 830.61, 987.77]
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09)

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.09)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.09 + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(this.ctx.currentTime + idx * 0.09)
      osc.stop(this.ctx.currentTime + idx * 0.09 + 0.32)
    })
  }

  playFanfare() {
    if (!this.enabled) return
    this.init()
    if (!this.ctx) return

    // Major triad fanfare for completing a major stage
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      const start = this.ctx.currentTime + idx * 0.12
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.18, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(start)
      osc.stop(start + 0.52)
    })
  }
}

export const sound = new SoundFX()

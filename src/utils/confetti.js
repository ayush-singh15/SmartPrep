// Lightweight zero-dependency Canvas Confetti utility
export function triggerConfetti() {
  if (typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '99999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#2dd4bf', '#38bdf8', '#818cf8', '#fb7185', '#fbbf24', '#34d399', '#f472b6']
  const particles = []
  const count = 75

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.4 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.35,
    })
  }

  let animationId
  const startTime = Date.now()

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let active = false

    particles.forEach(p => {
      p.x += p.vx
      p.vy += p.gravity
      p.y += p.vy
      p.rotation += p.vRotation
      p.opacity -= 0.012

      if (p.opacity > 0) {
        active = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
    })

    if (active && Date.now() - startTime < 3500) {
      animationId = requestAnimationFrame(update)
    } else {
      cancelAnimationFrame(animationId)
      canvas.remove()
    }
  }

  animationId = requestAnimationFrame(update)
}

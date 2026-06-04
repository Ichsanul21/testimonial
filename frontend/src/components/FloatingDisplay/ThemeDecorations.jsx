export function WeddingDecorations() {
  return (
    <>
      <div className="absolute top-0 left-0 pointer-events-none opacity-20">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path d="M0 0C40 20 80 40 100 80C120 40 160 20 200 0" stroke="#D4AF37" strokeWidth="2" fill="none"/>
          <circle cx="100" cy="80" r="3" fill="#D4AF37"/>
          <path d="M40 10C50 30 60 40 80 50" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-20 rotate-180">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path d="M0 0C40 20 80 40 100 80C120 40 160 20 200 0" stroke="#D4AF37" strokeWidth="2" fill="none"/>
          <circle cx="100" cy="80" r="3" fill="#D4AF37"/>
        </svg>
      </div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            background: '#F6E27A',
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animation: `sparkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
            opacity: 0,
          }}
        />
      ))}
    </>
  )
}

export function CorporateDecorations() {
  return (
    <>
      <div className="absolute top-0 left-0 pointer-events-none opacity-10">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
          <rect x="10" y="10" width="30" height="30" stroke="#0D9488" strokeWidth="2" fill="none"/>
          <rect x="50" y="10" width="30" height="30" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.5"/>
          <line x1="10" y1="50" x2="40" y2="50" stroke="#0D9488" strokeWidth="2"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none opacity-10 rotate-180">
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
          <rect x="10" y="10" width="30" height="30" stroke="#0D9488" strokeWidth="2" fill="none"/>
          <rect x="50" y="10" width="30" height="30" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute top-1/2 left-0 w-full h-px pointer-events-none opacity-5"
        style={{ background: 'linear-gradient(90deg, transparent, #0D9488, transparent)' }} />
    </>
  )
}

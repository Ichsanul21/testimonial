export const wedding = {
  name: 'wedding',
  label: 'Wedding',
  background: 'radial-gradient(ellipse at center, #0A0A14 0%, #1A1525 100%)',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(212,175,55,0.2)',
  cardBgClass: 'bg-white/5 backdrop-blur-xl border border-yellow-500/20',
  accent: '#D4AF37',
  accentLight: '#F6E27A',
  textColor: '#F1F1F1',
  fontHeading: 'Playfair Display, serif',
  fontBody: 'Inter, sans-serif',
  photoBorder: '3px solid #D4AF37',
  decor: 'floral',
}

export const corporate = {
  name: 'corporate',
  label: 'Corporate',
  background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  cardBgClass: 'bg-white shadow-2xl border-slate-200',
  accent: '#0D9488',
  accentLight: '#14B8A6',
  textColor: '#1E293B',
  fontHeading: 'Inter, sans-serif',
  fontBody: 'Inter, sans-serif',
  photoBorder: '3px solid #0D9488',
  decor: 'geometric',
}

export function getTheme(name) {
  return name === 'corporate' ? corporate : wedding
}

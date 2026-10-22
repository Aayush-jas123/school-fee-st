/**
 * Centralized Design System & Theme Tokens
 * Proportions:
 * - 50% Jet Black (#0a0a0a / #000000 / #050505)
 * - 30% Hot Pink (#FF1493)
 * - 20% Chartreuse (#7FFF00)
 */

export const PORTAL_THEME = {
  colors: {
    jetBlack: '#0a0a0a',
    pureBlack: '#000000',
    deepBlack: '#050505',
    hotPink: '#FF1493',
    chartreuse: '#7FFF00',
  },
  classes: {
    // Layout & Backgrounds
    pageWrapper: 'min-h-screen bg-[#050505] text-[#7FFF00] flex flex-col justify-center items-center relative overflow-hidden',
    ambientGlowPink: 'bg-[#FF1493]/[0.08]',
    ambientGlowChartreuse: 'bg-[#7FFF00]/[0.05]',

    // Cards & Containers
    card: 'bg-[#0a0a0a] border-2 border-[#FF1493] rounded-3xl p-8 shadow-[0_0_35px_rgba(255,20,147,0.25)]',
    cardHover: 'hover:border-[#7FFF00] hover:shadow-[0_0_55px_rgba(255,20,147,0.45)] transition-all duration-500 cursor-pointer',
    loginCard: 'relative bg-[#0a0a0a] border-2 border-[#FF1493] rounded-2xl p-8 shadow-[0_0_50px_rgba(255,20,147,0.3)]',

    // Badges & Pills
    iconBadge: 'w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FF1493] text-[#0a0a0a] shadow-lg shadow-[#FF1493]/30',
    pillBadge: 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0a0a] border border-[#FF1493] text-xs font-medium shadow-[0_0_20px_rgba(255,20,147,0.25)] backdrop-blur-sm',
    tagBadge: 'px-3 py-1 rounded-full text-xs font-bold bg-[#000000] text-[#7FFF00] border border-[#FF1493]/70',

    // Buttons
    primaryBtn: 'w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-[#FF1493] hover:bg-[#FF1493]/90 text-[#0a0a0a] shadow-[#FF1493]/30 active:scale-[0.99] cursor-pointer disabled:opacity-50',
    courseBtn: 'w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-[#FF1493] hover:bg-[#FF1493]/90 text-[#0a0a0a] shadow-[#FF1493]/30 active:scale-[0.99]',
    secondaryPillBtn: 'inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0a0a0a] hover:bg-[#000000] border-2 border-[#FF1493] hover:border-[#7FFF00] text-[#7FFF00] hover:text-[#FF1493] text-xs font-bold transition-all cursor-pointer shadow-[0_0_25px_rgba(255,20,147,0.2)]',

    // Inputs & Forms
    input: 'login-input w-full pl-10 pr-4 py-3 bg-[#000000] border border-[#FF1493] rounded-xl text-[#7FFF00] placeholder-[#7FFF00]/40 text-sm focus:outline-none focus:border-[#7FFF00] focus:ring-2 focus:ring-[#7FFF00]/30 transition-all selection:bg-[#FF1493] selection:text-[#0a0a0a]',
    inputLabel: 'block text-[11px] font-semibold uppercase tracking-wider text-[#7FFF00] mb-2',
    checkbox: 'w-4 h-4 rounded border border-[#FF1493] bg-[#000000] accent-[#FF1493] cursor-pointer',
    link: 'text-[#7FFF00] hover:text-[#FF1493] font-medium hover:underline flex items-center gap-1 transition-colors cursor-pointer',

    // Typography
    pageTitle: 'font-extrabold tracking-tight text-[#FF1493] drop-shadow-[0_0_25px_rgba(255,20,147,0.25)]',
    cardTitle: 'text-2xl font-extrabold text-[#FF1493] group-hover:text-[#7FFF00] transition-colors duration-300',
    subtitle: 'text-[#7FFF00] font-medium',
    mutedText: 'text-[#7FFF00]/90 font-medium',
  },
} as const;

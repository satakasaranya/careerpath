// src/theme.js - High-Contrast Design System

export const theme = {
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  statuses: ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'],

  dark: {
    bg: {
      app: 'bg-slate-950',
      surface: 'bg-slate-900',
      subtle: 'bg-slate-800',
      muted: 'bg-slate-800/80',
      overlay: 'bg-slate-950/90',
    },
    text: {
      primary: 'text-white font-black',
      secondary: 'text-slate-200 font-extrabold',
      muted: 'text-slate-300 font-bold',
    },
    border: {
      default: 'border-slate-800',
      subtle: 'border-slate-800/80',
      dashed: 'border-dashed border-slate-700',
    },
    buttons: {
      primary: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-lg shadow-sm transition cursor-pointer',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-700 transition cursor-pointer',
    },
    statusBadges: {
      Saved: 'bg-slate-800 text-slate-100 border-slate-700 font-black',
      Applied: 'bg-blue-900 text-blue-100 border-blue-600 font-black',
      Assessment: 'bg-purple-900 text-purple-100 border-purple-600 font-black',
      Interview: 'bg-amber-900 text-amber-100 border-amber-600 font-black',
      Offer: 'bg-emerald-900 text-emerald-100 border-emerald-600 font-black',
      Rejected: 'bg-rose-900 text-rose-100 border-rose-600 font-black',
    },
  },

  light: {
    bg: {
      app: 'bg-slate-100',
      surface: 'bg-white',
      subtle: 'bg-slate-50',
      muted: 'bg-slate-200',
      overlay: 'bg-slate-900/80',
    },
    text: {
      primary: 'text-slate-900 font-black',
      secondary: 'text-slate-800 font-extrabold',
      muted: 'text-slate-600 font-bold',
    },
    border: {
      default: 'border-slate-300',
      subtle: 'border-slate-200',
      dashed: 'border-dashed border-slate-400',
    },
    buttons: {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition cursor-pointer',
      secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs px-4 py-2.5 rounded-lg transition cursor-pointer',
    },
    statusBadges: {
      Saved: 'bg-slate-300 text-slate-900 border-slate-400 font-black',
      Applied: 'bg-blue-200 text-blue-950 border-blue-400 font-black',
      Assessment: 'bg-purple-200 text-purple-950 border-purple-400 font-black',
      Interview: 'bg-amber-200 text-amber-950 border-amber-400 font-black',
      Offer: 'bg-emerald-200 text-emerald-950 border-emerald-400 font-black',
      Rejected: 'bg-rose-200 text-rose-950 border-rose-400 font-black',
    },
  },
};
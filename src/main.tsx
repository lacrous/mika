import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/context/ThemeContext'
import './index.css'
import App from './App.tsx'

// Register PWA service worker
try {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* SW registration optional */ });
    });
  }
} catch { /* Service Worker not supported */ }

createRoot(document.getElementById('root')!).render(
 <StrictMode>
 <TRPCProvider>
 <ThemeProvider>
 <LanguageProvider>
 <HashRouter>
 <App />
 </HashRouter>
 </LanguageProvider>
 </ThemeProvider>
 </TRPCProvider>
 </StrictMode>,
)

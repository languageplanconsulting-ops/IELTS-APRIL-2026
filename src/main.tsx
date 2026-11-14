import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PlacementTestPage from './PlacementTestPage.tsx'
import InstallAppPrompt from './InstallAppPrompt.tsx'

/**
 * The placement test is mounted here rather than inside App because it shares
 * nothing with the logged-in product: no auth, no nav, no course state. A
 * visitor should be able to reach /placement without the app shell loading at
 * all.
 */
const isPlacementRoute = (() => {
  const path = window.location.pathname.replace(/\/+$/, '').toLowerCase()
  if (path.endsWith('/placement')) return true
  return new URLSearchParams(window.location.search).get('placement') === '1'
})()

// Home-screen app support. Production only, so local dev never gets a worker.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Not fatal: the site works the same, it just can't be installed.
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPlacementRoute ? (
      <PlacementTestPage />
    ) : (
      <>
        <App />
        <InstallAppPrompt />
      </>
    )}
  </StrictMode>,
)

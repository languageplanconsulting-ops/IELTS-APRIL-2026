import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PlacementTestPage from './PlacementTestPage.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPlacementRoute ? <PlacementTestPage /> : <App />}
  </StrictMode>,
)

import { useEffect, useState } from 'react'
import './InstallAppPrompt.css'

/**
 * "Add English Plan to your home screen" banner for phones.
 *
 * - Android / Chrome: uses the browser's own install prompt (one tap).
 * - iPhone Safari: Apple has no install button, so we show the steps
 *   (Share → Add to Home Screen).
 * - LINE / Facebook / Instagram in-app browsers can't install anything, so we
 *   tell the student to open the link in Safari/Chrome first. LINE supports
 *   `openExternalBrowser=1`, which does that in one tap.
 *
 * Hidden when already running as the installed app, on desktop, and for two
 * weeks after the student closes it.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Mode = 'android' | 'ios' | 'in-app-line' | 'in-app-other'

const DISMISS_KEY = 'ep-install-prompt-dismissed-at'
const DISMISS_DAYS = 14
const SHOW_DELAY_MS = 4000

const readDismissedAt = (): number => {
  try {
    return Number(window.localStorage.getItem(DISMISS_KEY) || 0)
  } catch {
    return 0
  }
}

const writeDismissedAt = () => {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // Storage blocked or full — the banner just comes back next visit.
  }
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true

const detect = () => {
  const ua = window.navigator.userAgent || ''
  const isIos =
    /iPhone|iPad|iPod/i.test(ua) ||
    // iPadOS reports itself as a Mac; touch support gives it away.
    (/Macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)
  const isLine = /\bLine\//i.test(ua)
  const isOtherInApp = /FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly/i.test(ua)
  return { isIos, isAndroid, isLine, isOtherInApp, isPhone: isIos || isAndroid }
}

const openInExternalBrowser = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('openExternalBrowser', '1')
  window.location.href = url.toString()
}

function ShareIcon() {
  return (
    <svg className="install-app-prompt__share-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3v12M12 3l-4 4M12 3l4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function InstallAppPrompt() {
  const [mode, setMode] = useState<Mode | null>(null)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone()) return
    const dismissedAt = readDismissedAt()
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return

    const env = detect()
    if (!env.isPhone) return

    let timer: number | undefined
    const showLater = (next: Mode) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setMode(next), SHOW_DELAY_MS)
    }

    if (env.isLine) showLater('in-app-line')
    else if (env.isOtherInApp) showLater('in-app-other')
    else if (env.isIos) showLater('ios')

    // Android Chrome fires this when the site is installable. Other Android
    // browsers never fire it, and then we simply don't show anything.
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
      if (!env.isLine && !env.isOtherInApp) showLater('android')
    }
    const onInstalled = () => setMode(null)

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!mode) return null

  const close = () => {
    writeDismissedAt()
    setMode(null)
  }

  const install = async () => {
    if (!installEvent) return
    try {
      await installEvent.prompt()
      const choice = await installEvent.userChoice
      if (choice.outcome === 'dismissed') writeDismissedAt()
    } catch {
      // The prompt can only be used once; nothing else to do.
    }
    setInstallEvent(null)
    setMode(null)
  }

  return (
    <aside className="install-app-prompt" role="dialog" aria-label="ติดตั้งแอป English Plan">
      <img className="install-app-prompt__icon" src="/app-icons/icon-192.png" alt="" />
      <div className="install-app-prompt__body">
        <strong className="install-app-prompt__title">ใช้ English Plan เป็นแอปบนมือถือ</strong>

        {mode === 'android' && <p className="install-app-prompt__text">กดติดตั้ง แล้วแอปจะอยู่บนหน้าจอโฮมให้เปิดได้ทันที</p>}

        {mode === 'ios' && (
          <p className="install-app-prompt__text">
            กดปุ่ม <ShareIcon /> <b>แชร์</b> ด้านล่าง แล้วเลือก <b>“เพิ่มไปยังหน้าจอโฮม”</b>
          </p>
        )}

        {mode === 'in-app-line' && <p className="install-app-prompt__text">เปิดใน Safari หรือ Chrome ก่อน ถึงจะติดตั้งเป็นแอปได้</p>}

        {mode === 'in-app-other' && (
          <p className="install-app-prompt__text">
            กดปุ่ม <b>⋯</b> มุมขวาบน แล้วเลือก <b>“เปิดในเบราว์เซอร์”</b> ก่อน ถึงจะติดตั้งเป็นแอปได้
          </p>
        )}

        {mode === 'android' && (
          <button type="button" className="install-app-prompt__action" onClick={install}>
            ติดตั้งแอป
          </button>
        )}
        {mode === 'in-app-line' && (
          <button type="button" className="install-app-prompt__action" onClick={openInExternalBrowser}>
            เปิดในเบราว์เซอร์
          </button>
        )}
      </div>
      <button type="button" className="install-app-prompt__close" onClick={close} aria-label="ปิด">
        ×
      </button>
    </aside>
  )
}

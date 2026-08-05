import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import './BiteSizePage.css'
import { captureLocalVideoFrame, uploadBiteSizeVideo } from './biteSizeUpload'
import type { BiteSizeUploadTicket } from './biteSizeUpload'

export type BiteSizeCategory = 'writing' | 'speaking' | 'listening' | 'reading'

export type BiteSizePost = {
  id: string
  category: BiteSizeCategory
  title: string
  caption: string
  hashtags: string[]
  videoGuid: string
  libraryId: string
  coverTimeMs: number
  durationSeconds: number
  width: number
  height: number
  encodeStatus: 'processing' | 'ready' | 'failed'
  encodeProgress: number
  status: 'draft' | 'published'
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string | null
  viewerLiked: boolean
  viewerSaved: boolean
  collectionIds: string[]
  playbackUrl: string
  hlsUrl: string
  thumbnailUrl: string
  previewUrl: string
  embedUrl: string
}

export type BiteSizeCollection = {
  id: string
  name: string
  emoji: string
  description: string
  coverPostId: string | null
  coverThumbnailUrl: string
  sortIndex: number
  status: 'draft' | 'published'
  postIds: string[]
  postCount: number
}

type BiteSizeComment = {
  id: string
  authorName: string
  body: string
  createdAt: string
  canDelete: boolean
}

type BiteSizeConfig = {
  bunnyEnabled: boolean
  missingEnv: string[]
  libraryId: string
  cdnHostname: string
}

type FeedTab = 'grid' | 'reels' | 'saved'

type BiteSizePageProps = {
  accessToken?: string
  isAdmin: boolean
  onBackHome: () => void
}

const CATEGORY_META: Array<{
  id: BiteSizeCategory
  label: string
  thaiLabel: string
  emoji: string
  ring: string
}> = [
  { id: 'writing', label: 'Writing', thaiLabel: 'เขียน', emoji: '✍️', ring: 'linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)' },
  { id: 'speaking', label: 'Speaking', thaiLabel: 'พูด', emoji: '🎙️', ring: 'linear-gradient(135deg,#f97794,#623aa2)' },
  { id: 'listening', label: 'Listening', thaiLabel: 'ฟัง', emoji: '🎧', ring: 'linear-gradient(135deg,#43e97b,#38f9d7)' },
  { id: 'reading', label: 'Reading', thaiLabel: 'อ่าน', emoji: '📖', ring: 'linear-gradient(135deg,#4facfe,#00f2fe)' }
]

const CATEGORY_LABEL: Record<BiteSizeCategory, string> = {
  writing: 'Writing',
  speaking: 'Speaking',
  listening: 'Listening',
  reading: 'Reading'
}

const formatCount = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) return '0'
  if (value < 1000) return String(Math.round(value))
  if (value < 1_000_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0).replace(/\.0$/, '')}K`
  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
}

const formatClock = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds))
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const formatRelativeTime = (iso: string | null): string => {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return `${Math.floor(days / 7)}w`
}

/* --------------------------------- icons --------------------------------- */

const IconHeart = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20.7 3.9 12.9a5.1 5.1 0 0 1 0-7.3 5.1 5.1 0 0 1 7.2 0l.9.9.9-.9a5.1 5.1 0 0 1 7.2 0 5.1 5.1 0 0 1 0 7.3z" strokeLinejoin="round" />
  </svg>
)

const IconComment = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-3.8-.9L3 21l2-5.1a8.3 8.3 0 0 1-1-4A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" strokeLinejoin="round" />
  </svg>
)

const IconBookmark = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M19 21 12 16.5 5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5z" strokeLinejoin="round" />
  </svg>
)

const IconShare = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 2 11 13" strokeLinecap="round" />
    <path d="M22 2 15 22l-4-9-9-4z" strokeLinejoin="round" />
  </svg>
)

const IconPlay = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M8 5.2v13.6L19 12z" />
  </svg>
)

const IconSound = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" strokeLinejoin="round" />
    {muted ? (
      <path d="m16 9.5 4 5m0-5-4 5" strokeLinecap="round" />
    ) : (
      <path d="M16 8.7a4.4 4.4 0 0 1 0 6.6M18.5 6.4a7.8 7.8 0 0 1 0 11.2" strokeLinecap="round" />
    )}
  </svg>
)

/* ------------------------------- data layer ------------------------------ */

const readError = async (response: Response, fallback: string): Promise<string> => {
  try {
    const payload = await response.json()
    return payload?.error?.message || payload?.error || fallback
  } catch {
    return fallback
  }
}

export default function BiteSizePage({ accessToken, isAdmin, onBackHome }: BiteSizePageProps) {
  const [posts, setPosts] = useState<BiteSizePost[]>([])
  const [collections, setCollections] = useState<BiteSizeCollection[]>([])
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null)
  const [groupsManagerOpen, setGroupsManagerOpen] = useState(false)
  const [assignFor, setAssignFor] = useState<BiteSizePost | null>(null)
  const [config, setConfig] = useState<BiteSizeConfig | null>(null)
  const [loading, setLoading] = useState(Boolean(accessToken))
  const [error, setError] = useState(accessToken ? '' : 'Sign in again to load Bite Size.')
  const [activeCategory, setActiveCategory] = useState<BiteSizeCategory | 'all'>('all')
  const [tab, setTab] = useState<FeedTab>('grid')
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [composerOpen, setComposerOpen] = useState(false)

  const authHeaders = useMemo(
    () => (accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    [accessToken]
  )

  // Nothing here sets state before the first await: a synchronous setState in
  // the mount effect would cascade an extra render.
  const loadFeed = useCallback(async () => {
    if (!accessToken) return
    try {
      const [feedResponse, collectionsResponse] = await Promise.all([
        fetch('/api/bite-size/feed?category=all', { headers: authHeaders }),
        fetch('/api/bite-size/collections', { headers: authHeaders })
      ])
      if (!feedResponse.ok) throw new Error(await readError(feedResponse, 'Could not load the Bite Size feed.'))
      setError('')
      const payload = await feedResponse.json()
      setPosts(Array.isArray(payload?.posts) ? payload.posts : [])
      if (collectionsResponse.ok) {
        const collectionsPayload = await collectionsResponse.json()
        setCollections(Array.isArray(collectionsPayload?.collections) ? collectionsPayload.collections : [])
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load the Bite Size feed.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, authHeaders])

  useEffect(() => {
    void loadFeed()
  }, [loadFeed])

  useEffect(() => {
    if (!isAdmin || !accessToken) return
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch('/api/bite-size/config', { headers: authHeaders })
        if (!response.ok) return
        const payload = await response.json()
        if (!cancelled) setConfig(payload)
      } catch {
        /* config is advisory only */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [accessToken, authHeaders, isAdmin])

  // Anything still encoding gets re-checked until Bunny reports it ready.
  useEffect(() => {
    if (!isAdmin || !accessToken) return
    const pending = posts.some((post) => post.encodeStatus === 'processing')
    if (!pending) return
    const timer = window.setTimeout(() => {
      void loadFeed()
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [accessToken, isAdmin, loadFeed, posts])

  const visiblePosts = useMemo(() => {
    let list = posts
    if (tab === 'saved') list = list.filter((post) => post.viewerSaved)
    if (activeCategory !== 'all') list = list.filter((post) => post.category === activeCategory)
    if (activeCollectionId) {
      list = list.filter((post) => post.collectionIds.includes(activeCollectionId))
    }
    return list
  }, [activeCategory, activeCollectionId, posts, tab])

  const activeCollection = useMemo(
    () => collections.find((item) => item.id === activeCollectionId) || null,
    [activeCollectionId, collections]
  )

  const patchPost = useCallback((postId: string, patch: Partial<BiteSizePost>) => {
    setPosts((current) => current.map((post) => (post.id === postId ? { ...post, ...patch } : post)))
  }, [])

  const toggleLike = useCallback(
    async (post: BiteSizePost) => {
      const nextLiked = !post.viewerLiked
      patchPost(post.id, {
        viewerLiked: nextLiked,
        likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1))
      })
      try {
        const response = await fetch(`/api/bite-size/posts/${post.id}/like`, {
          method: 'POST',
          headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
          body: JSON.stringify({ liked: nextLiked })
        })
        if (!response.ok) throw new Error('like failed')
        const payload = await response.json()
        patchPost(post.id, { viewerLiked: payload.liked, likeCount: payload.likeCount })
      } catch {
        patchPost(post.id, { viewerLiked: post.viewerLiked, likeCount: post.likeCount })
      }
    },
    [authHeaders, patchPost]
  )

  const toggleSave = useCallback(
    async (post: BiteSizePost) => {
      const nextSaved = !post.viewerSaved
      patchPost(post.id, { viewerSaved: nextSaved })
      try {
        const response = await fetch(`/api/bite-size/posts/${post.id}/save`, {
          method: 'POST',
          headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
          body: JSON.stringify({ saved: nextSaved })
        })
        if (!response.ok) throw new Error('save failed')
      } catch {
        patchPost(post.id, { viewerSaved: post.viewerSaved })
      }
    },
    [authHeaders, patchPost]
  )

  const registerView = useCallback(
    async (post: BiteSizePost) => {
      try {
        const response = await fetch(`/api/bite-size/posts/${post.id}/view`, {
          method: 'POST',
          headers: authHeaders
        })
        if (!response.ok) return
        const payload = await response.json()
        patchPost(post.id, { viewCount: payload.viewCount })
      } catch {
        /* view counting is best-effort */
      }
    },
    [authHeaders, patchPost]
  )

  const deletePost = useCallback(
    async (post: BiteSizePost) => {
      if (!window.confirm(`Delete this ${CATEGORY_LABEL[post.category]} clip? This also removes it from Bunny.`)) {
        return
      }
      try {
        const response = await fetch(`/api/admin/bite-size/posts/${post.id}`, {
          method: 'DELETE',
          headers: authHeaders
        })
        if (!response.ok) throw new Error(await readError(response, 'Could not delete the clip.'))
        setPosts((current) => current.filter((item) => item.id !== post.id))
        setViewerIndex(null)
      } catch (deleteError) {
        window.alert(deleteError instanceof Error ? deleteError.message : 'Could not delete the clip.')
      }
    },
    [authHeaders]
  )

  const togglePublish = useCallback(
    async (post: BiteSizePost) => {
      const nextStatus = post.status === 'published' ? 'draft' : 'published'
      try {
        const response = await fetch(`/api/admin/bite-size/posts/${post.id}`, {
          method: 'PATCH',
          headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        })
        if (!response.ok) throw new Error(await readError(response, 'Could not update the clip.'))
        const payload = await response.json()
        patchPost(post.id, { status: payload.post.status })
      } catch (publishError) {
        window.alert(publishError instanceof Error ? publishError.message : 'Could not update the clip.')
      }
    },
    [authHeaders, patchPost]
  )

  const openViewer = useCallback((index: number) => setViewerIndex(index), [])

  const totalViews = useMemo(() => posts.reduce((sum, post) => sum + post.viewCount, 0), [posts])

  return (
    <section className="bszPage">
      <header className="bszTopBar">
        <button className="bszIconButton" type="button" onClick={onBackHome} aria-label="Back home">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="bszWordmark">
          IELTS <span>Bite Size</span>
        </h1>
        <div className="bszTopActions">
          {isAdmin && (
            <button
              className="bszIconButton bszIconButton--accent"
              type="button"
              onClick={() => setComposerOpen(true)}
              aria-label="Upload a new clip"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </header>

      <div className="bszProfileStrip">
        <div className="bszAvatarRing">
          <div className="bszAvatar">EP</div>
        </div>
        <div className="bszProfileMeta">
          <p className="bszHandle">@englishplan.bitesize</p>
          <ul className="bszStats">
            <li>
              <strong>{formatCount(posts.length)}</strong> clips
            </li>
            <li>
              <strong>{formatCount(totalViews)}</strong> views
            </li>
            <li>
              <strong>4</strong> skills
            </li>
          </ul>
          <p className="bszBio">
            IELTS ย่อยง่าย 30 วินาที · Writing · Speaking · Listening · Reading
          </p>
        </div>
      </div>

      <nav className="bszStoryRow" aria-label="Categories">
        <button
          className={`bszStory ${activeCategory === 'all' ? 'is-active' : ''}`}
          type="button"
          onClick={() => setActiveCategory('all')}
        >
          <span className="bszStoryRing" style={{ background: 'linear-gradient(135deg,#fdfbfb,#c7d2fe)' }}>
            <span className="bszStoryFace">⭐</span>
          </span>
          <span className="bszStoryLabel">All</span>
        </button>
        {CATEGORY_META.map((meta) => (
          <button
            key={meta.id}
            className={`bszStory ${activeCategory === meta.id ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActiveCategory(meta.id)}
          >
            <span className="bszStoryRing" style={{ background: meta.ring }}>
              <span className="bszStoryFace">{meta.emoji}</span>
            </span>
            <span className="bszStoryLabel">{meta.label}</span>
          </button>
        ))}
      </nav>

      {(collections.length > 0 || isAdmin) && (
        <nav className="bszHighlightRow" aria-label="Groups">
          {isAdmin && (
            <button
              className="bszHighlight bszHighlight--new"
              type="button"
              onClick={() => setGroupsManagerOpen(true)}
            >
              <span className="bszHighlightRing">
                <span className="bszHighlightFace">＋</span>
              </span>
              <span className="bszHighlightLabel">New</span>
            </button>
          )}
          {collections.map((collection) => (
            <button
              key={collection.id}
              className={`bszHighlight ${activeCollectionId === collection.id ? 'is-active' : ''}`}
              type="button"
              onClick={() =>
                setActiveCollectionId((current) => (current === collection.id ? null : collection.id))
              }
            >
              <span className="bszHighlightRing">
                <span className="bszHighlightFace">
                  {collection.coverThumbnailUrl ? (
                    <img src={collection.coverThumbnailUrl} alt="" loading="lazy" />
                  ) : (
                    collection.emoji
                  )}
                </span>
              </span>
              <span className="bszHighlightLabel">{collection.name}</span>
              {isAdmin && collection.status === 'draft' && <span className="bszHighlightDraft">draft</span>}
            </button>
          ))}
        </nav>
      )}

      {activeCollection && (
        <div className="bszFilterBar">
          <span>
            {activeCollection.emoji} <strong>{activeCollection.name}</strong> ·{' '}
            {activeCollection.postCount} clips
          </span>
          <button type="button" onClick={() => setActiveCollectionId(null)}>
            Clear
          </button>
        </div>
      )}

      <div className="bszTabs" role="tablist">
        <button
          className={`bszTab ${tab === 'grid' ? 'is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab === 'grid'}
          onClick={() => setTab('grid')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
          </svg>
          Grid
        </button>
        <button
          className={`bszTab ${tab === 'reels' ? 'is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab === 'reels'}
          onClick={() => setTab('reels')}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <path d="m10 8.5 5 3.5-5 3.5z" strokeLinejoin="round" />
          </svg>
          Reels
        </button>
        <button
          className={`bszTab ${tab === 'saved' ? 'is-active' : ''}`}
          type="button"
          role="tab"
          aria-selected={tab === 'saved'}
          onClick={() => setTab('saved')}
        >
          <IconBookmark filled={false} />
          Saved
        </button>
      </div>

      {error && <p className="bszNotice bszNotice--error">{error}</p>}

      {isAdmin && config && !config.bunnyEnabled && (
        <p className="bszNotice">
          Bunny Stream is not connected yet. Set {config.missingEnv.join(', ')} to enable uploads.
        </p>
      )}

      {loading ? (
        <div className="bszGrid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="bszTile bszTile--skeleton" key={`skeleton-${index}`} />
          ))}
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="bszEmpty">
          <p className="bszEmptyGlyph">🍿</p>
          <h3>{tab === 'saved' ? 'Nothing saved yet' : 'No clips here yet'}</h3>
          <p>
            {tab === 'saved'
              ? 'Tap the bookmark on a clip to keep it here.'
              : isAdmin
                ? 'Use the + button to upload the first Bite Size clip.'
                : 'New clips are on the way.'}
          </p>
        </div>
      ) : tab === 'reels' ? (
        <div className="bszInlineReels">
          <BiteSizeReelsViewer
            posts={visiblePosts}
            startIndex={0}
            inline
            isAdmin={isAdmin}
            authHeaders={authHeaders}
            onClose={() => setTab('grid')}
            onToggleLike={toggleLike}
            onToggleSave={toggleSave}
            onRegisterView={registerView}
            onDelete={deletePost}
            onTogglePublish={togglePublish}
            onAssignGroups={setAssignFor}
          />
        </div>
      ) : (
        <div className="bszGrid">
          {visiblePosts.map((post, index) => (
            <button
              className="bszTile"
              type="button"
              key={post.id}
              onClick={() => openViewer(index)}
              aria-label={post.title || `${CATEGORY_LABEL[post.category]} clip`}
            >
              {post.thumbnailUrl ? (
                <img src={post.thumbnailUrl} alt="" loading="lazy" />
              ) : (
                <span className="bszTileFallback">{CATEGORY_LABEL[post.category]}</span>
              )}
              <span className="bszTileShade" />
              <span className={`bszTileCategory bszTileCategory--${post.category}`}>
                {CATEGORY_LABEL[post.category]}
              </span>
              <span className="bszTilePlay">
                <IconPlay />
                {formatCount(post.viewCount)}
              </span>
              {post.durationSeconds > 0 && (
                <span className="bszTileDuration">{formatClock(post.durationSeconds)}</span>
              )}
              {post.encodeStatus === 'processing' && (
                <span className="bszTileBadge">Processing {post.encodeProgress}%</span>
              )}
              {post.encodeStatus === 'failed' && <span className="bszTileBadge bszTileBadge--bad">Failed</span>}
              {isAdmin && post.status === 'draft' && <span className="bszTileDraft">Draft</span>}
            </button>
          ))}
        </div>
      )}

      {viewerIndex !== null && visiblePosts[viewerIndex] && (
        <BiteSizeReelsViewer
          posts={visiblePosts}
          startIndex={viewerIndex}
          isAdmin={isAdmin}
          authHeaders={authHeaders}
          onClose={() => setViewerIndex(null)}
          onToggleLike={toggleLike}
          onToggleSave={toggleSave}
          onRegisterView={registerView}
          onDelete={deletePost}
          onTogglePublish={togglePublish}
          onAssignGroups={setAssignFor}
        />
      )}

      {composerOpen && isAdmin && (
        <BiteSizeComposer
          authHeaders={authHeaders}
          bunnyEnabled={config?.bunnyEnabled !== false}
          missingEnv={config?.missingEnv || []}
          collections={collections}
          onClose={() => setComposerOpen(false)}
          onCreated={() => {
            setComposerOpen(false)
            void loadFeed()
          }}
        />
      )}

      {groupsManagerOpen && isAdmin && (
        <BiteSizeGroupsManager
          authHeaders={authHeaders}
          collections={collections}
          onClose={() => setGroupsManagerOpen(false)}
          onChanged={() => void loadFeed()}
        />
      )}

      {assignFor && isAdmin && (
        <BiteSizeGroupPicker
          post={assignFor}
          collections={collections}
          authHeaders={authHeaders}
          onClose={() => setAssignFor(null)}
          onSaved={(collectionIds) => {
            patchPost(assignFor.id, { collectionIds })
            setAssignFor(null)
            void loadFeed()
          }}
        />
      )}
    </section>
  )
}

/* ------------------------------ reels viewer ----------------------------- */

type ReelsViewerProps = {
  posts: BiteSizePost[]
  startIndex: number
  inline?: boolean
  isAdmin: boolean
  authHeaders?: Record<string, string>
  onClose: () => void
  onToggleLike: (post: BiteSizePost) => void
  onToggleSave: (post: BiteSizePost) => void
  onRegisterView: (post: BiteSizePost) => void
  onDelete: (post: BiteSizePost) => void
  onTogglePublish: (post: BiteSizePost) => void
  onAssignGroups: (post: BiteSizePost) => void
}

function BiteSizeReelsViewer({
  posts,
  startIndex,
  inline = false,
  isAdmin,
  authHeaders,
  onClose,
  onToggleLike,
  onToggleSave,
  onRegisterView,
  onDelete,
  onTogglePublish,
  onAssignGroups
}: ReelsViewerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(startIndex)
  const [muted, setMuted] = useState(true)
  const [commentsFor, setCommentsFor] = useState<BiteSizePost | null>(null)

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const target = scroller.children[startIndex] as HTMLElement | undefined
    if (target) scroller.scrollTo({ top: target.offsetTop, behavior: 'auto' })
  }, [startIndex])

  useEffect(() => {
    if (inline) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.classList.add('bszLockScroll')
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('bszLockScroll')
    }
  }, [inline, onClose])

  return (
    <div className={inline ? 'bszReels bszReels--inline' : 'bszReels bszReels--overlay'}>
      {!inline && (
        <button className="bszReelsClose" type="button" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      )}
      <button
        className="bszSoundToggle"
        type="button"
        onClick={() => setMuted((current) => !current)}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <IconSound muted={muted} />
      </button>

      <div className="bszReelsScroller" ref={scrollerRef}>
        {posts.map((post, index) => (
          <BiteSizeReel
            key={post.id}
            post={post}
            muted={muted}
            isAdmin={isAdmin}
            active={index === activeIndex}
            onActivate={() => setActiveIndex(index)}
            onToggleLike={onToggleLike}
            onToggleSave={onToggleSave}
            onRegisterView={onRegisterView}
            onOpenComments={() => setCommentsFor(post)}
            onDelete={onDelete}
            onTogglePublish={onTogglePublish}
            onAssignGroups={onAssignGroups}
          />
        ))}
      </div>

      {commentsFor && (
        <BiteSizeComments
          post={commentsFor}
          authHeaders={authHeaders}
          onClose={() => setCommentsFor(null)}
        />
      )}
    </div>
  )
}

/* ------------------------------- single reel ----------------------------- */

type ReelProps = {
  post: BiteSizePost
  muted: boolean
  active: boolean
  isAdmin: boolean
  onActivate: () => void
  onToggleLike: (post: BiteSizePost) => void
  onToggleSave: (post: BiteSizePost) => void
  onRegisterView: (post: BiteSizePost) => void
  onOpenComments: () => void
  onDelete: (post: BiteSizePost) => void
  onTogglePublish: (post: BiteSizePost) => void
  onAssignGroups: (post: BiteSizePost) => void
}

function BiteSizeReel({
  post,
  muted,
  active,
  isAdmin,
  onActivate,
  onToggleLike,
  onToggleSave,
  onRegisterView,
  onOpenComments,
  onDelete,
  onTogglePublish,
  onAssignGroups
}: ReelProps) {
  const containerRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastTapRef = useRef(0)
  const viewCountedRef = useRef(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [heartBurst, setHeartBurst] = useState(false)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [useEmbedFallback, setUseEmbedFallback] = useState(false)

  // Autoplay whichever reel is filling the viewport, exactly like the app does.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.6) onActivate()
        })
      },
      { threshold: [0, 0.6, 1] }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [onActivate])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active && !paused) {
      void video.play().catch(() => setPaused(true))
      if (!viewCountedRef.current) {
        viewCountedRef.current = true
        onRegisterView(post)
      }
    } else {
      video.pause()
    }
  }, [active, onRegisterView, paused, post])

  useEffect(() => {
    const video = videoRef.current
    if (video) video.muted = muted
  }, [muted])

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current < 280) {
      lastTapRef.current = 0
      if (!post.viewerLiked) onToggleLike(post)
      setHeartBurst(true)
      window.setTimeout(() => setHeartBurst(false), 700)
      return
    }
    lastTapRef.current = now
    window.setTimeout(() => {
      if (lastTapRef.current === now) {
        lastTapRef.current = 0
        setPaused((current) => !current)
      }
    }, 280)
  }

  const notReady = post.encodeStatus !== 'ready'
  const canPlayInline = Boolean(post.playbackUrl) && !useEmbedFallback

  return (
    <article className="bszReel" ref={containerRef}>
      <div className="bszReelStage" onClick={handleTap} role="presentation">
        {notReady ? (
          <div className="bszReelProcessing">
            {post.thumbnailUrl && <img src={post.thumbnailUrl} alt="" />}
            <div className="bszReelProcessingCard">
              <span className="bszSpinner" />
              <p>
                {post.encodeStatus === 'failed'
                  ? 'Bunny could not encode this clip.'
                  : `Encoding on Bunny · ${post.encodeProgress}%`}
              </p>
            </div>
          </div>
        ) : canPlayInline ? (
          <video
            ref={videoRef}
            className="bszReelVideo"
            src={post.playbackUrl}
            poster={post.thumbnailUrl || undefined}
            playsInline
            loop
            muted={muted}
            preload="metadata"
            onTimeUpdate={(event) => {
              const target = event.currentTarget
              if (target.duration > 0) setProgress((target.currentTime / target.duration) * 100)
            }}
            onError={() => setUseEmbedFallback(true)}
          />
        ) : (
          <iframe
            className="bszReelVideo"
            src={`${post.embedUrl}?autoplay=${active ? 'true' : 'false'}&loop=true&muted=true&preload=true&responsive=true`}
            title={post.title || 'Bite Size clip'}
            allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
            allowFullScreen
          />
        )}

        {paused && !notReady && canPlayInline && (
          <span className="bszReelPausedGlyph">
            <IconPlay />
          </span>
        )}
        {heartBurst && <span className="bszHeartBurst">❤️</span>}
      </div>

      <div className="bszReelProgress">
        <span style={{ width: `${Math.min(100, progress)}%` }} />
      </div>

      <div className="bszReelMeta">
        <div className="bszReelAuthor">
          <span className="bszReelAvatar">EP</span>
          <span className="bszReelHandle">englishplan.bitesize</span>
          <span className={`bszChip bszChip--${post.category}`}>{CATEGORY_LABEL[post.category]}</span>
          {isAdmin && post.status === 'draft' && <span className="bszChip bszChip--draft">Draft</span>}
        </div>
        {post.title && <p className="bszReelTitle">{post.title}</p>}
        {post.caption && (
          <p
            className={`bszReelCaption ${captionExpanded ? 'is-expanded' : ''}`}
            onClick={() => setCaptionExpanded((current) => !current)}
            role="presentation"
          >
            {post.caption}
          </p>
        )}
        {post.hashtags.length > 0 && (
          <p className="bszReelTags">{post.hashtags.map((tag) => `#${tag}`).join(' ')}</p>
        )}
        <p className="bszReelFooter">
          {formatCount(post.viewCount)} views · {formatRelativeTime(post.createdAt)}
        </p>
      </div>

      <div className="bszReelRail">
        <button
          className={`bszRailButton ${post.viewerLiked ? 'is-liked' : ''}`}
          type="button"
          onClick={() => onToggleLike(post)}
          aria-label={post.viewerLiked ? 'Unlike' : 'Like'}
        >
          <IconHeart filled={post.viewerLiked} />
          <span>{formatCount(post.likeCount)}</span>
        </button>
        <button className="bszRailButton" type="button" onClick={onOpenComments} aria-label="Comments">
          <IconComment />
          <span>{formatCount(post.commentCount)}</span>
        </button>
        <button
          className={`bszRailButton ${post.viewerSaved ? 'is-saved' : ''}`}
          type="button"
          onClick={() => onToggleSave(post)}
          aria-label={post.viewerSaved ? 'Remove from saved' : 'Save'}
        >
          <IconBookmark filled={post.viewerSaved} />
          <span>Save</span>
        </button>
        <button
          className="bszRailButton"
          type="button"
          aria-label="Share"
          onClick={() => {
            const shareText = `${post.title || CATEGORY_LABEL[post.category]} — IELTS Bite Size`
            if (navigator.share) {
              void navigator.share({ title: shareText, text: post.caption }).catch(() => undefined)
            } else {
              void navigator.clipboard?.writeText(`${shareText}\n${post.caption}`).catch(() => undefined)
            }
          }}
        >
          <IconShare />
          <span>Share</span>
        </button>
        {isAdmin && (
          <>
            <button
              className="bszRailButton bszRailButton--admin"
              type="button"
              onClick={() => onTogglePublish(post)}
            >
              {post.status === 'published' ? '🚫' : '🚀'}
              <span>{post.status === 'published' ? 'Unpublish' : 'Publish'}</span>
            </button>
            <button
              className="bszRailButton bszRailButton--admin"
              type="button"
              onClick={() => onAssignGroups(post)}
            >
              📁
              <span>Groups</span>
            </button>
            <button
              className="bszRailButton bszRailButton--admin"
              type="button"
              onClick={() => onDelete(post)}
            >
              🗑️
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </article>
  )
}

/* ------------------------------- comments -------------------------------- */

function BiteSizeComments({
  post,
  authHeaders,
  onClose
}: {
  post: BiteSizePost
  authHeaders?: Record<string, string>
  onClose: () => void
}) {
  const [comments, setComments] = useState<BiteSizeComment[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const response = await fetch(`/api/bite-size/posts/${post.id}/comments`, { headers: authHeaders })
        if (!response.ok) throw new Error('failed')
        const payload = await response.json()
        if (!cancelled) setComments(Array.isArray(payload?.comments) ? payload.comments : [])
      } catch {
        if (!cancelled) setComments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [authHeaders, post.id])

  const submit = async () => {
    const body = draft.trim()
    if (!body || busy) return
    setBusy(true)
    try {
      const response = await fetch(`/api/bite-size/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ body })
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not post that comment.'))
      const payload = await response.json()
      if (payload?.comment) setComments((current) => [payload.comment, ...current])
      setDraft('')
    } catch (commentError) {
      window.alert(commentError instanceof Error ? commentError.message : 'Could not post that comment.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (commentId: string) => {
    try {
      const response = await fetch(`/api/bite-size/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      if (!response.ok) throw new Error('failed')
      setComments((current) => current.filter((item) => item.id !== commentId))
    } catch {
      /* leave the comment in place if the delete failed */
    }
  }

  return (
    <div className="bszSheetBackdrop" onClick={onClose} role="presentation">
      <div className="bszSheet" onClick={(event) => event.stopPropagation()} role="presentation">
        <div className="bszSheetHandle" />
        <h3 className="bszSheetTitle">Comments</h3>
        <div className="bszCommentList">
          {loading ? (
            <p className="bszSheetHint">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="bszSheetHint">No comments yet. Start the conversation.</p>
          ) : (
            comments.map((comment) => (
              <div className="bszComment" key={comment.id}>
                <span className="bszCommentAvatar">{comment.authorName.slice(0, 2).toUpperCase()}</span>
                <div className="bszCommentBody">
                  <p>
                    <strong>{comment.authorName}</strong> {comment.body}
                  </p>
                  <span className="bszCommentMeta">
                    {formatRelativeTime(comment.createdAt)}
                    {comment.canDelete && (
                      <button type="button" onClick={() => void remove(comment.id)}>
                        Delete
                      </button>
                    )}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <form
          className="bszCommentForm"
          onSubmit={(event) => {
            event.preventDefault()
            void submit()
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a comment…"
            maxLength={600}
          />
          <button type="submit" disabled={!draft.trim() || busy}>
            {busy ? '…' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ------------------------------- composer -------------------------------- */

type ComposerStep = 'pick' | 'cover' | 'details' | 'uploading'

function BiteSizeComposer({
  authHeaders,
  bunnyEnabled,
  missingEnv,
  collections,
  onClose,
  onCreated
}: {
  authHeaders?: Record<string, string>
  bunnyEnabled: boolean
  missingEnv: string[]
  collections: BiteSizeCollection[]
  onClose: () => void
  onCreated: () => void
}) {
  const previewRef = useRef<HTMLVideoElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [objectUrl, setObjectUrl] = useState('')
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [coverSeconds, setCoverSeconds] = useState(0)
  const [coverPreview, setCoverPreview] = useState('')
  const [step, setStep] = useState<ComposerStep>('pick')
  const [category, setCategory] = useState<BiteSizeCategory>('writing')
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [publishNow, setPublishNow] = useState(true)
  const [chosenCollectionIds, setChosenCollectionIds] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    },
    [objectUrl]
  )

  const onPickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0]
    if (!picked) return
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    const url = URL.createObjectURL(picked)
    setFile(picked)
    setObjectUrl(url)
    setCoverSeconds(0)
    setCoverPreview('')
    setError('')
    setStep('cover')
    if (!title) setTitle(picked.name.replace(/\.[^.]+$/, '').slice(0, 80))
  }

  // The cover is a timestamp on the Bunny side; we only preview it locally.
  const refreshCoverPreview = useCallback(() => {
    const video = previewRef.current
    if (!video) return
    const frame = captureLocalVideoFrame(video)
    if (frame) setCoverPreview(frame)
  }, [])

  const onScrub = (seconds: number) => {
    setCoverSeconds(seconds)
    const video = previewRef.current
    if (video) video.currentTime = seconds
  }

  const share = async () => {
    if (!file) return
    setError('')
    setStep('uploading')
    setProgress(0)
    try {
      setStatusText('Reserving a slot on Bunny Stream…')
      const ticketResponse = await fetch('/api/admin/bite-size/upload-ticket', {
        method: 'POST',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || file.name })
      })
      if (!ticketResponse.ok) {
        throw new Error(await readError(ticketResponse, 'Could not start the upload.'))
      }
      const ticket: BiteSizeUploadTicket = await ticketResponse.json()

      setStatusText('Uploading to Bunny…')
      await uploadBiteSizeVideo({
        ticket,
        file,
        fileName: file.name,
        onProgress: (percent) => setProgress(percent)
      })

      setStatusText('Saving the post…')
      const createResponse = await fetch('/api/admin/bite-size/posts', {
        method: 'POST',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoGuid: ticket.videoGuid,
          category,
          title,
          caption,
          hashtags,
          coverTimeMs: Math.round(coverSeconds * 1000),
          durationSeconds,
          width: dimensions.width,
          height: dimensions.height,
          status: publishNow ? 'published' : 'draft'
        })
      })
      if (!createResponse.ok) {
        throw new Error(await readError(createResponse, 'Upload finished but the post did not save.'))
      }

      if (chosenCollectionIds.length) {
        const created = await createResponse.json()
        setStatusText('Adding it to your groups…')
        await fetch(`/api/admin/bite-size/posts/${created.post.id}/collections`, {
          method: 'PUT',
          headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectionIds: chosenCollectionIds })
        }).catch(() => undefined)
      }

      onCreated()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.')
      setStep('details')
    }
  }

  return (
    <div className="bszModalBackdrop" role="presentation">
      <div className="bszModal">
        <header className="bszModalHeader">
          <button type="button" onClick={onClose} className="bszModalGhost">
            Cancel
          </button>
          <h3>New Bite Size clip</h3>
          <button
            type="button"
            className="bszModalPrimary"
            disabled={!file || step === 'uploading' || !bunnyEnabled}
            onClick={() => void share()}
          >
            Share
          </button>
        </header>

        {!bunnyEnabled && (
          <p className="bszNotice bszNotice--error">
            Bunny Stream is not configured. Missing: {missingEnv.join(', ') || 'BUNNY_STREAM_API_KEY, BUNNY_BITESIZE_LIBRARY_ID, BUNNY_BITESIZE_CDN_HOSTNAME'}
          </p>
        )}
        {error && <p className="bszNotice bszNotice--error">{error}</p>}

        <div className="bszModalBody">
          <div className="bszComposerPreview">
            {objectUrl ? (
              <video
                ref={previewRef}
                src={objectUrl}
                playsInline
                muted
                preload="metadata"
                onLoadedMetadata={(event) => {
                  const target = event.currentTarget
                  setDurationSeconds(target.duration || 0)
                  setDimensions({ width: target.videoWidth, height: target.videoHeight })
                  target.currentTime = 0
                }}
                onSeeked={refreshCoverPreview}
              />
            ) : (
              <label className="bszDropZone">
                <input type="file" accept="video/*" onChange={onPickFile} hidden />
                <span className="bszDropGlyph">⬆️</span>
                <strong>Choose a video</strong>
                <span>MP4 or MOV · vertical 9:16 looks best</span>
              </label>
            )}
          </div>

          <div className="bszComposerForm">
            {file && (
              <>
                <label className="bszField">
                  <span>
                    Cover frame · {formatClock(coverSeconds)}
                    {durationSeconds > 0 ? ` / ${formatClock(durationSeconds)}` : ''}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0.1, durationSeconds)}
                    step={0.1}
                    value={coverSeconds}
                    onChange={(event) => onScrub(Number(event.target.value))}
                  />
                  <span className="bszFieldHint">
                    Drag to the moment you want as the cover. Bunny regenerates the thumbnail at
                    this timestamp.
                  </span>
                </label>

                {coverPreview && (
                  <div className="bszCoverStrip">
                    <img src={coverPreview} alt="Chosen cover frame" />
                    <span>Cover preview</span>
                  </div>
                )}

                <div className="bszField">
                  <span>Category</span>
                  <div className="bszCategoryPicker">
                    {CATEGORY_META.map((meta) => (
                      <button
                        key={meta.id}
                        type="button"
                        className={`bszCategoryChip ${category === meta.id ? 'is-active' : ''}`}
                        onClick={() => setCategory(meta.id)}
                      >
                        <span aria-hidden="true">{meta.emoji}</span>
                        {meta.label}
                        <small>{meta.thaiLabel}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="bszField">
                  <span>Title</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
                </label>

                <label className="bszField">
                  <span>Caption</span>
                  <textarea
                    value={caption}
                    onChange={(event) => setCaption(event.target.value)}
                    rows={3}
                    maxLength={2200}
                    placeholder="สรุปสั้น ๆ ให้จบใน 30 วินาที"
                  />
                </label>

                <label className="bszField">
                  <span>Hashtags</span>
                  <input
                    value={hashtags}
                    onChange={(event) => setHashtags(event.target.value)}
                    placeholder="task1 overview band7"
                  />
                </label>

                {collections.length > 0 && (
                  <div className="bszField">
                    <span>Groups</span>
                    <div className="bszGroupChecks">
                      {collections.map((collection) => (
                        <label className="bszGroupCheck" key={collection.id}>
                          <input
                            type="checkbox"
                            checked={chosenCollectionIds.includes(collection.id)}
                            onChange={(event) =>
                              setChosenCollectionIds((current) =>
                                event.target.checked
                                  ? [...current, collection.id]
                                  : current.filter((id) => id !== collection.id)
                              )
                            }
                          />
                          <span>
                            {collection.emoji} {collection.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <span className="bszFieldHint">
                      Groups show up as highlight circles above the grid.
                    </span>
                  </div>
                )}

                <label className="bszToggleRow">
                  <input
                    type="checkbox"
                    checked={publishNow}
                    onChange={(event) => setPublishNow(event.target.checked)}
                  />
                  <span>Publish immediately (otherwise it stays a draft)</span>
                </label>
              </>
            )}

            {step === 'uploading' && (
              <div className="bszUploadStatus">
                <div className="bszUploadBar">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <p>
                  {statusText} {progress > 0 && progress < 100 ? `${progress}%` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ groups admin ----------------------------- */

const GROUP_EMOJI_CHOICES = ['📌', '🔥', '⭐', '🎯', '💡', '📝', '🧠', '⚡', '🏆', '🍿']

function BiteSizeGroupsManager({
  authHeaders,
  collections,
  onClose,
  onChanged
}: {
  authHeaders?: Record<string, string>
  collections: BiteSizeCollection[]
  onClose: () => void
  onChanged: () => void
}) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📌')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const create = async () => {
    const trimmed = name.trim()
    if (!trimmed || busy) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/admin/bite-size/collections', {
        method: 'POST',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, emoji, description })
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not create the group.'))
      setName('')
      setDescription('')
      onChanged()
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Could not create the group.')
    } finally {
      setBusy(false)
    }
  }

  const rename = async (collection: BiteSizeCollection) => {
    const next = window.prompt('Rename this group', collection.name)
    if (next === null) return
    const trimmed = next.trim()
    if (!trimmed) return
    try {
      const response = await fetch(`/api/admin/bite-size/collections/${collection.id}`, {
        method: 'PATCH',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed })
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not rename the group.'))
      onChanged()
    } catch (renameError) {
      window.alert(renameError instanceof Error ? renameError.message : 'Could not rename the group.')
    }
  }

  const toggleStatus = async (collection: BiteSizeCollection) => {
    try {
      const response = await fetch(`/api/admin/bite-size/collections/${collection.id}`, {
        method: 'PATCH',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: collection.status === 'published' ? 'draft' : 'published' })
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not update the group.'))
      onChanged()
    } catch (statusError) {
      window.alert(statusError instanceof Error ? statusError.message : 'Could not update the group.')
    }
  }

  const remove = async (collection: BiteSizeCollection) => {
    if (!window.confirm(`Delete the group "${collection.name}"? The clips themselves stay.`)) return
    try {
      const response = await fetch(`/api/admin/bite-size/collections/${collection.id}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not delete the group.'))
      onChanged()
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : 'Could not delete the group.')
    }
  }

  return (
    <div className="bszModalBackdrop" onClick={onClose} role="presentation">
      <div className="bszModal bszModal--narrow" onClick={(event) => event.stopPropagation()} role="presentation">
        <header className="bszModalHeader">
          <button type="button" onClick={onClose} className="bszModalGhost">
            Close
          </button>
          <h3>Groups</h3>
          <span />
        </header>

        {error && <p className="bszNotice bszNotice--error">{error}</p>}

        <div className="bszGroupManagerBody">
          <form
            className="bszGroupCreate"
            onSubmit={(event) => {
              event.preventDefault()
              void create()
            }}
          >
            <div className="bszEmojiPicker">
              {GROUP_EMOJI_CHOICES.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className={`bszEmojiChoice ${emoji === choice ? 'is-active' : ''}`}
                  onClick={() => setEmoji(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
            <label className="bszField">
              <span>Group name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Task 1 in 60 seconds"
                maxLength={120}
              />
            </label>
            <label className="bszField">
              <span>Description (optional)</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={500}
              />
            </label>
            <button className="bszPrimaryButton" type="submit" disabled={!name.trim() || busy}>
              {busy ? 'Creating…' : 'Create group'}
            </button>
          </form>

          <div className="bszGroupList">
            {collections.length === 0 ? (
              <p className="bszSheetHint">No groups yet. Create one to bundle clips together.</p>
            ) : (
              collections.map((collection) => (
                <div className="bszGroupRow" key={collection.id}>
                  <span className="bszGroupRowFace">
                    {collection.coverThumbnailUrl ? (
                      <img src={collection.coverThumbnailUrl} alt="" loading="lazy" />
                    ) : (
                      collection.emoji
                    )}
                  </span>
                  <div className="bszGroupRowMeta">
                    <strong>{collection.name}</strong>
                    <span>
                      {collection.postCount} clips
                      {collection.status === 'draft' ? ' · hidden' : ''}
                    </span>
                  </div>
                  <div className="bszGroupRowActions">
                    <button type="button" onClick={() => void rename(collection)}>
                      Rename
                    </button>
                    <button type="button" onClick={() => void toggleStatus(collection)}>
                      {collection.status === 'published' ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" onClick={() => void remove(collection)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function BiteSizeGroupPicker({
  post,
  collections,
  authHeaders,
  onClose,
  onSaved
}: {
  post: BiteSizePost
  collections: BiteSizeCollection[]
  authHeaders?: Record<string, string>
  onClose: () => void
  onSaved: (collectionIds: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(post.collectionIds || [])
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    try {
      const response = await fetch(`/api/admin/bite-size/posts/${post.id}/collections`, {
        method: 'PUT',
        headers: { ...(authHeaders || {}), 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionIds: selected })
      })
      if (!response.ok) throw new Error(await readError(response, 'Could not save the groups.'))
      onSaved(selected)
    } catch (saveError) {
      window.alert(saveError instanceof Error ? saveError.message : 'Could not save the groups.')
      setBusy(false)
    }
  }

  return (
    <div className="bszModalBackdrop" onClick={onClose} role="presentation">
      <div className="bszModal bszModal--narrow" onClick={(event) => event.stopPropagation()} role="presentation">
        <header className="bszModalHeader">
          <button type="button" onClick={onClose} className="bszModalGhost">
            Cancel
          </button>
          <h3>Add to groups</h3>
          <button type="button" className="bszModalPrimary" onClick={() => void save()} disabled={busy}>
            {busy ? '…' : 'Save'}
          </button>
        </header>
        <div className="bszGroupManagerBody">
          {collections.length === 0 ? (
            <p className="bszSheetHint">No groups yet — create one from the + circle on the feed.</p>
          ) : (
            <div className="bszGroupChecks bszGroupChecks--stacked">
              {collections.map((collection) => (
                <label className="bszGroupCheck" key={collection.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(collection.id)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, collection.id]
                          : current.filter((id) => id !== collection.id)
                      )
                    }
                  />
                  <span>
                    {collection.emoji} {collection.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

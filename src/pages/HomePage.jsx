import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import { api } from '../api/client'

const ALL_TAGS = ['전체', '맛집탐방', '풋살', '운동', '보드게임', '클라이밍', '영화', '카페', '스터디']

export default function HomePage() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTag, setActiveTag] = useState('전체')

  useEffect(() => {
    api.getPosts()
      .then((res) => setPosts(res.posts ?? res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeTag === '전체'
    ? posts
    : posts.filter((p) => p.tags.includes(activeTag))

  return (
    <div className="app-shell">
      <div className="page">
        <Header
          right={
            <button className="header-btn" onClick={() => navigate('/notifications')} aria-label="알림">
              🔔
            </button>
          }
        />

        {/* Tag filter strip */}
        <div style={{
          display: 'flex', gap: 8, padding: '12px 16px 4px',
          overflowX: 'auto', flexShrink: 0,
        }}>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: '7px 14px', borderRadius: 20, fontWeight: 700, fontSize: 13,
                whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: activeTag === tag ? 'var(--primary)' : 'var(--surface)',
                color: activeTag === tag ? '#fff' : 'var(--text-sub)',
                boxShadow: activeTag === tag ? '0 2px 8px rgba(255,107,53,0.3)' : 'var(--shadow)',
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading && <div className="loading-wrap">⏳ 불러오는 중...</div>}

        {error && (
          <div style={{ padding: 16 }}>
            <div className="error-banner">{error}</div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-emoji">🌿</span>
            <p className="empty-state-title">아직 모집 글이 없어요</p>
            <p className="empty-state-desc">첫 번째로 모임을 만들어보세요!</p>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/posts/new')}
            >
              글쓰기
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="scroll-area">
            {filtered.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  )
}

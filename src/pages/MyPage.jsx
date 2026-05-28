import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export default function MyPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('created')

  useEffect(() => {
    api.getMe()
      .then(setMe)
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  if (loading) return (
    <div className="app-shell">
      <div className="page">
        <Header title="마이페이지" />
        <div className="loading-wrap">⏳ 불러오는 중...</div>
        <BottomNav />
      </div>
    </div>
  )

  const list = tab === 'created' ? (me?.createdPosts ?? []) : (me?.appliedPosts ?? [])

  return (
    <div className="app-shell">
      <div className="page">
        <Header title="마이페이지" />

        <div className="my-profile">
          <div className="my-avatar">😊</div>
          <div>
            <p className="my-nickname">{me?.nickname}</p>
            <p className="my-studentid">{me?.studentId} · {me?.email}</p>
          </div>
        </div>

        <div className="my-tabs">
          <button
            className={`my-tab ${tab === 'created' ? 'active' : ''}`}
            onClick={() => setTab('created')}
          >
            내가 만든 모임
          </button>
          <button
            className={`my-tab ${tab === 'applied' ? 'active' : ''}`}
            onClick={() => setTab('applied')}
          >
            신청한 모임
          </button>
        </div>

        <div className="my-content">
          {list.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state-emoji">{tab === 'created' ? '📝' : '🙋'}</span>
              <p className="empty-state-title">
                {tab === 'created' ? '아직 만든 모임이 없어요' : '신청한 모임이 없어요'}
              </p>
            </div>
          ) : (
            list.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        <div className="my-logout">
          <button className="btn btn-outline" onClick={handleLogout}>
            로그아웃
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

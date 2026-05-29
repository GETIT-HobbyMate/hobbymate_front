import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

function formatMeetingTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const STATUS_LABEL = {
  OPEN: '모집중',
  COMPLETED: '모집완료',
  MATCHED: '매칭완료',
}

export default function MyPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('hosted')

  useEffect(() => {
    api.getMe()
      // 백엔드: { data: { profile, hostedPosts, appliedPosts } } → client.js에서 data 언래핑
      .then(setMe)
      .catch((err) => setError(err.message))
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

  const profile = me?.profile ?? {}
  const list = tab === 'hosted' ? (me?.hostedPosts ?? []) : (me?.appliedPosts ?? [])

  return (
    <div className="app-shell">
      <div className="page">
        <Header title="마이페이지" />

        {error && (
          <div style={{ padding: 16 }}><div className="error-banner">{error}</div></div>
        )}

        <div className="my-profile">
          <div className="my-avatar">😊</div>
          <div>
            <p className="my-nickname">{profile.nickname}</p>
            <p className="my-studentid">{profile.studentId}</p>
          </div>
        </div>

        <div className="my-tabs">
          <button
            className={`my-tab ${tab === 'hosted' ? 'active' : ''}`}
            onClick={() => setTab('hosted')}
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
              <span className="empty-state-emoji">{tab === 'hosted' ? '📝' : '🙋'}</span>
              <p className="empty-state-title">
                {tab === 'hosted' ? '아직 만든 모임이 없어요' : '신청한 모임이 없어요'}
              </p>
            </div>
          ) : (
            // 백엔드 참여내역 항목은 { postId, title, status, meetingTime }만 제공
            list.map((post) => (
              <div
                key={post.postId}
                className="my-post-row"
                onClick={() => navigate(`/posts/${post.postId}`)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', borderBottom: '1px solid var(--border, #eee)',
                  cursor: 'pointer', gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontWeight: 700, fontSize: 14, margin: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {post.title}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-sub, #999)', margin: '4px 0 0' }}>
                    {formatMeetingTime(post.meetingTime)}
                  </p>
                </div>
                <span className={`badge badge-${post.status === 'OPEN' ? 'open' : 'matched'}`}>
                  {STATUS_LABEL[post.status] ?? post.status}
                </span>
              </div>
            ))
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

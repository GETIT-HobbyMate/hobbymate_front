import { useState, useEffect } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getNotifications()
      .then((res) => setNotifs(res.notifications ?? res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app-shell">
      <div className="page">
        <Header title="알림" />

        {loading && <div className="loading-wrap">⏳ 불러오는 중...</div>}

        {error && (
          <div style={{ padding: 16 }}>
            <div className="error-banner">{error}</div>
          </div>
        )}

        {!loading && notifs.length === 0 && (
          <div className="empty-state">
            <span className="empty-state-emoji">🔔</span>
            <p className="empty-state-title">알림이 없어요</p>
            <p className="empty-state-desc">매칭 완료 시 알림이 도착합니다.</p>
          </div>
        )}

        {!loading && notifs.length > 0 && (
          <div className="scroll-area">
            {notifs.map((n) => (
              <div key={n.id} className={`notif-item ${!n.isRead ? 'notif-unread' : ''}`}>
                <span className="notif-icon">{n.type === 'MATCHED' ? '🎉' : '💬'}</span>
                <div className="notif-body">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-desc">{n.body}</p>
                  {n.openChatLink && (
                    <a
                      href={n.openChatLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block', marginTop: 8,
                        padding: '7px 14px', borderRadius: 8,
                        background: '#fee500', color: '#3c1e1e',
                        fontSize: 12, fontWeight: 700,
                      }}
                    >
                      오픈채팅 참여 →
                    </a>
                  )}
                  <p className="notif-time">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  )
}

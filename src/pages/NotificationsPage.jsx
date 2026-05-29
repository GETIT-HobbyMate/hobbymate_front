import { useState, useEffect } from 'react'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

// 백엔드 알림 type → 아이콘
function iconFor(type) {
  switch (type) {
    case 'MATCH_COMPLETE': return '🎉'
    case 'POST_DELETED': return '🗑️'
    default: return '💬'
  }
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getNotifications()
      // 백엔드: { data: { notifications: [...] } } → client.js에서 data 언래핑 → { notifications }
      .then((res) => setNotifs(res.notifications ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // 알림 읽음 처리 (notificationId 필요 — 백엔드 응답에 id 포함 시 동작)
  async function handleRead(n) {
    if (n.id == null || n.isRead) return
    try {
      await api.readNotification(n.id)
      setNotifs((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item))
      )
    } catch (err) {
      setError(err.message)
    }
  }

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
            {notifs.map((n, idx) => {
              // 오픈채팅 링크: 백엔드는 openChatUrl로 내려줌 (구버전 openChatLink도 호환)
              const chatUrl = n.openChatUrl ?? n.openChatLink
              return (
                <div
                  key={n.id ?? idx}
                  className={`notif-item ${!n.isRead ? 'notif-unread' : ''}`}
                  onClick={() => handleRead(n)}
                  style={{ cursor: n.id != null && !n.isRead ? 'pointer' : 'default' }}
                >
                  <span className="notif-icon">{iconFor(n.type)}</span>
                  <div className="notif-body">
                    {/* 백엔드는 title/body 분리 없이 message 한 필드로 내려줌 */}
                    <p className="notif-desc">{n.message}</p>
                    {chatUrl && (
                      <a
                        href={chatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
              )
            })}
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  )
}

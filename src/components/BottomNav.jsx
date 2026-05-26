import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  { path: '/home', icon: '🏠', label: '홈' },
  { path: '/posts/new', icon: null, label: '작성' },
  { path: '/notifications', icon: '🔔', label: '알림' },
  { path: '/my', icon: '👤', label: '마이' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav" aria-label="하단 네비게이션">
      {tabs.map((tab) =>
        tab.icon === null ? (
          <button
            key={tab.path}
            className="nav-tab"
            onClick={() => navigate(tab.path)}
            aria-label="글쓰기"
          >
            <span className="nav-write-btn">＋</span>
          </button>
        ) : (
          <button
            key={tab.path}
            className={`nav-tab ${pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        )
      )}
    </nav>
  )
}

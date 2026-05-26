import { useNavigate } from 'react-router-dom'

export default function Header({ title, left, right }) {
  const navigate = useNavigate()

  return (
    <div className="header">
      {left ?? (
        title ? (
          <button className="header-btn" onClick={() => navigate(-1)} aria-label="뒤로">
            ←
          </button>
        ) : null
      )}
      {title ? (
        <span className="header-title">{title}</span>
      ) : (
        <span className="header-logo">취미메이트</span>
      )}
      {right ?? <div style={{ width: 36 }} />}
    </div>
  )
}

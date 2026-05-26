import { useNavigate } from 'react-router-dom'
import Tag from './Tag'

function formatDate(iso) {
  const d = new Date(iso)
  const mm = d.getMonth() + 1
  const dd = d.getDate()
  const hh = d.getHours().toString().padStart(2, '0')
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${mm}/${dd} ${hh}:${min}`
}

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const { id, title, tags, meetDate, location, currentCount, maxCount, status } = post
  const pct = Math.round((currentCount / maxCount) * 100)

  return (
    <article className="post-card" onClick={() => navigate(`/posts/${id}`)}>
      <div className="post-card-tags">
        {tags.map((t) => <Tag key={t} label={t} />)}
        <span className={`badge badge-${status === 'OPEN' ? 'open' : status === 'MATCHED' ? 'matched' : 'closed'}`}>
          {status === 'OPEN' ? '모집중' : status === 'MATCHED' ? '매칭완료' : '마감'}
        </span>
      </div>
      <p className="post-card-title">{title}</p>
      <div className="post-card-meta">
        <span className="post-card-meta-row">📅 {formatDate(meetDate)}</span>
        <span className="post-card-meta-row">📍 {location}</span>
      </div>
      <div className="post-card-footer">
        <div className="post-card-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-count">{currentCount}/{maxCount}명</span>
        </div>
      </div>
    </article>
  )
}

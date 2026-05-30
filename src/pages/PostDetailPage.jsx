import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import Tag from '../components/Tag'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export default function PostDetailPage() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  // 게시글을 불러와 화면용 형태로 매핑한다.
  // 백엔드 응답: { posts: { postId, author, content, currentCapacity, maxCapacity, meetingTime, ... } }
  async function loadPost() {
    const data = await api.getPost(postId)
    const p = data.posts ?? data
    setPost({
      ...p,
      authorId: p.author,
      currentCount: p.currentCapacity,
      maxCount: p.maxCapacity,
      meetDate: p.meetingTime,
      description: p.content,
      tags: p.tags ?? [],
    })
  }

  useEffect(() => {
    setLoading(true)
    loadPost()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [postId])

  const isOwner = post?.authorId === user?.id
  const hasApplied = post?.appliedUserIds?.includes(user?.id)
  const isFull = post?.currentCount >= post?.maxCount
  // 백엔드는 매칭 완료 시 status를 'COMPLETED'로 내려준다(구버전 호환 위해 'MATCHED'도 인정).
  const isMatched = post?.status === 'COMPLETED' || post?.status === 'MATCHED'

  async function handleApply() {
    setActionLoading(true)
    setError('')
    try {
      // 신청 응답에는 게시글 본문이 없으므로(빈 객체) 응답으로 덮어쓰지 말고 다시 불러온다.
      await api.applyPost(postId)
      await loadPost()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(false) }
  }

  async function handleCancel() {
    setActionLoading(true)
    setError('')
    try {
      await api.cancelApply(postId)
      await loadPost()
    } catch (err) { setError(err.message) }
    finally { setActionLoading(false) }
  }

  async function handleDelete() {
    if (!confirm('게시글을 삭제할까요?')) return
    setActionLoading(true)
    try {
      await api.deletePost(postId)
      navigate('/home', { replace: true })
    } catch (err) { setError(err.message) }
    finally { setActionLoading(false) }
  }

  if (loading) return (
    <div className="app-shell">
      <div className="page">
        <Header title="모임 상세" />
        <div className="loading-wrap">⏳ 불러오는 중...</div>
        <BottomNav />
      </div>
    </div>
  )

  if (error || !post) return (
    <div className="app-shell">
      <div className="page">
        <Header title="모임 상세" />
        <div style={{ padding: 16 }}><div className="error-banner">{error || '게시글을 찾을 수 없어요.'}</div></div>
        <BottomNav />
      </div>
    </div>
  )

  const pct = Math.round((post.currentCount / post.maxCount) * 100)

  return (
    <div className="app-shell">
      <div className="page">
        <Header title="모임 상세" />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
          <div className="detail-card">
            <div className="detail-tags">
              {post.tags.map((t) => <Tag key={t} label={t} />)}
              <span className={`badge badge-${isMatched ? 'matched' : 'open'}`}>
                {isMatched ? '매칭완료' : '모집중'}
              </span>
            </div>

            <h1 className="detail-title">{post.title}</h1>

            <div className="detail-info">
              <div className="detail-info-row">
                <span className="detail-info-icon">👤</span>
                <span>{post.authorNickname}</span>
              </div>
              <div className="detail-info-row">
                <span className="detail-info-icon">📅</span>
                <span>{formatDate(post.meetDate)}</span>
              </div>
              <div className="detail-info-row">
                <span className="detail-info-icon">📍</span>
                <span>{post.location}</span>
              </div>
            </div>

            {post.description && (
              <>
                <div className="detail-divider" style={{ margin: '16px 0' }} />
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{post.description}</p>
              </>
            )}

            <div className="detail-divider" style={{ margin: '16px 0' }} />

            <div className="detail-progress-label">
              <span>참여 현황</span>
              <span style={{ color: isMatched ? 'var(--primary)' : 'var(--green)', fontWeight: 800 }}>
                {post.currentCount}/{post.maxCount}명
              </span>
            </div>
            <div className="detail-progress-bar">
              <div className="detail-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {error && <div style={{ padding: '0 16px' }}><div className="error-banner">{error}</div></div>}
        </div>

        <div className="detail-action">
          {isMatched && post.openChatLink && (
            <a href={post.openChatLink} target="_blank" rel="noopener noreferrer" className="chat-link-btn">
              💬 카카오 오픈채팅 참여하기
            </a>
          )}

          {!isOwner && !isMatched && (
            hasApplied ? (
              <button className="btn btn-outline" onClick={handleCancel} disabled={actionLoading}>
                {actionLoading ? '처리 중...' : '신청 취소하기'}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleApply}
                disabled={actionLoading || isFull}
              >
                {actionLoading ? '신청 중...' : isFull ? '정원이 찼어요' : '참여 신청하기'}
              </button>
            )
          )}

          {isOwner && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? '삭제 중...' : '게시글 삭제'}
            </button>
          )}
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

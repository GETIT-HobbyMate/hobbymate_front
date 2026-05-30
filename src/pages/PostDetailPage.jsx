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

  // 상태 변수로 전환하여 실시간 DB 내역에 따른 동적 예외 상태 반영
  const [isOwner, setIsOwner] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplyFailed, setIsApplyFailed] = useState(false)

  // 게시글을 불러와 화면용 형태로 매핑한다.
  // 백엔드 응답: { posts: { postId, author, content, currentCapacity, maxCapacity, meetingTime, ... } }
  async function loadPost() {
    const data = await api.getPost(postId)
    const p = data.posts ?? data

    // DB 참여 및 개설 내역을 실시간 체크하여 방장 여부와 신청 완료 상태를 정확히 판별 (백엔드 getMe 활용)
    try {
      const meData = await api.getMe()
      const resData = meData?.data || meData
      
      const appliedList = resData?.appliedPosts || []
      const hostedList = resData?.hostedPosts || []
      
      // 내 참여 신청 내역 배열 및 내가 개설한 방 배열에 현재 postId가 교집합으로 존재하는지 검증
      setHasApplied(appliedList.some(ap => String(ap.postId) === String(postId)))
      setIsOwner(hostedList.some(hp => String(hp.postId) === String(postId)))
    } catch (e) {
      console.error(e)
      // 폴백 처리
      setIsOwner(p.author === user?.id)
    }

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

  const isFull = post?.currentCount >= post?.maxCount
  // 백엔드는 매칭 완료 시 status를 'COMPLETED'로 내려준다(구버전 호환 위해 'MATCHED'도 인정).
  const isMatched = post?.status === 'COMPLETED' || post?.status === 'MATCHED'

  async function handleApply() {
    setActionLoading(true)
    setError('')
    setIsApplyFailed(false)
    try {
      // 신청 응답에는 게시글 본문이 없으므로(빈 객체) 응답으로 덮어쓰지 말고 다시 불러온다.
      await api.applyPost(postId)
      await loadPost()
    } catch (err) { 
      setError(err.message) 
      setIsApplyFailed(true) // 동시 신청에 실패하여 밀려난 튕김 상황 핸들링 트리거 활성화
    }
    finally { setActionLoading(false) }
  }

  async function handleCancel() {
    setActionLoading(true)
    setError('')
    setIsApplyFailed(false)
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

  if (error && !isApplyFailed) return ( // 단순 신청 실패 에러 시 상세 페이지 내용이 날아가지 않도록 방어
    <div className="app-shell">
      <div className="page">
        <Header title="모임 상세" />
        <div style={{ padding: 16 }}><div className="error-banner">{error || '게시글을 찾을 수 없어요.'}</div></div>
        <BottomNav />
      </div>
    </div>
  )

  if (!post) return (
    <div className="app-shell">
      <div className="page">
        <Header title="모임 상세" />
        <div style={{ padding: 16 }}><div className="error-banner">게시글을 찾을 수 없어요.</div></div>
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

          {/* 방장이면 참가 신청 버튼이 비활성화가 되어 있게 처리 */}
          {isOwner && !isMatched && (
            <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', marginBottom: 8, backgroundColor: '#6c757d' }}>
              방장은 참여 신청을 할 수 없습니다
            </button>
          )}

          {/* 만약 두명이상이 동시에 신청을 해가지고, 본인이 밀려나 신청 실패하였다면 버튼 비활성화 및 상태 문구 출력 */}
          {!isOwner && !isMatched && isApplyFailed && (
            <button className="btn btn-primary" disabled style={{ backgroundColor: '#dc3545', opacity: 0.6, cursor: 'not-allowed' }}>
              참가 신청 실패 (정원 마감됨)
            </button>
          )}

          {!isOwner && !isMatched && !isApplyFailed && (
            hasApplied ? (
              /* 참가 신청을 했으면 DB 참여 내역을 체크하여 참가 신청 완료 완료 상태 출력 */
              <button className="btn btn-outline" onClick={handleCancel} disabled={actionLoading} style={{ borderColor: '#28a745', color: '#28a745', fontWeight: 'bold' }}>
                {actionLoading ? '처리 중...' : '✓ 참가 신청 완료 (클릭 시 취소)'}
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import { api } from '../api/client'

const TAG_OPTIONS = ['맛집탐방', '풋살', '운동', '보드게임', '클라이밍', '영화', '카페', '스터디', '독서']

export default function PostCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', location: '', meetDate: '',
    maxCount: 2, tags: [], openChatLink: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  function toggleTag(tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.title) { setError('제목을 입력해주세요.'); return }
    if (!form.location) { setError('장소를 입력해주세요.'); return }
    if (!form.meetDate) { setError('만나는 날짜/시간을 입력해주세요.'); return }
    if (form.tags.length === 0) { setError('태그를 1개 이상 선택해주세요.'); return }
    if (!form.openChatLink) { setError('카카오 오픈채팅 링크를 입력해주세요.'); return }

    setLoading(true)
    try {
      const payload = {
        title: form.title,
        content: form.description,
        meetingTime: form.meetDate.replace('T', ' '), // datetime-local → MySQL DATETIME 형식
        maxCapacity: form.maxCount,
        openChatUrl: form.openChatLink,
        isFulled: false,
        tags: form.tags,
      }

      const res = await api.createPost(payload)
      navigate(`/posts/${res.postId}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="page">
        <Header title="모임 만들기" />

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <form onSubmit={handleSubmit} className="create-form">
            {error && <div className="error-banner">{error}</div>}

            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                className="form-input"
                placeholder="예) 북문 파스타집 같이 가실 분!"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">태그</label>
              <div className="tags-picker">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag} type="button"
                    className={`tag-pick ${form.tags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">장소</label>
              <input
                className="form-input"
                placeholder="예) 경북대 북문 파스타집"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">만나는 날짜·시간</label>
              <input
                className="form-input"
                type="datetime-local"
                value={form.meetDate}
                onChange={(e) => update('meetDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">모집 인원</label>
              <div className="count-picker">
                <button
                  type="button" className="count-btn"
                  onClick={() => update('maxCount', Math.max(2, form.maxCount - 1))}
                  disabled={form.maxCount <= 2}
                >−</button>
                <span className="count-value">{form.maxCount}</span>
                <button
                  type="button" className="count-btn"
                  onClick={() => update('maxCount', Math.min(10, form.maxCount + 1))}
                  disabled={form.maxCount >= 10}
                >＋</button>
                <span style={{ fontSize: 13, color: 'var(--text-sub)' }}>명 (본인 포함)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">소개 (선택)</label>
              <textarea
                className="form-input"
                placeholder="어떤 모임인지 간단히 소개해주세요."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">카카오 오픈채팅 링크</label>
              <input
                className="form-input"
                placeholder="https://open.kakao.com/o/..."
                value={form.openChatLink}
                onChange={(e) => update('openChatLink', e.target.value)}
              />
              <p className="form-hint">매칭 완료 시 참여자에게만 공개됩니다.</p>
            </div>
          </form>
        </div>

        <div className="create-submit">
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '등록 중...' : '모임 등록하기'}
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

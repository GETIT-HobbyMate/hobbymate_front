import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ studentId: '', nickname: '', email: '', password: '', confirm: '' })
  const [checks, setChecks] = useState({ studentId: null, nickname: null })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }))
    if (k === 'studentId') setChecks((c) => ({ ...c, studentId: null }))
    if (k === 'nickname') setChecks((c) => ({ ...c, nickname: null }))
  }

  async function checkStudentId() {
    if (!form.studentId) return
    try {
      const res = await api.checkStudentId(form.studentId)
      setChecks((c) => ({ ...c, studentId: res.available ? 'ok' : 'dup' }))
    } catch { setChecks((c) => ({ ...c, studentId: 'err' })) }
  }

  async function checkNickname() {
    if (!form.nickname) return
    try {
      const res = await api.checkNickname(form.nickname)
      setChecks((c) => ({ ...c, nickname: res.available ? 'ok' : 'dup' }))
    } catch { setChecks((c) => ({ ...c, nickname: 'err' })) }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.studentId || !form.nickname || !form.email || !form.password) {
      setError('모든 항목을 입력해주세요.'); return
    }
    if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않아요.'); return }
    if (!form.email.endsWith('@knu.ac.kr')) { setError('경북대 이메일(@knu.ac.kr)만 사용 가능합니다.'); return }
    if (checks.studentId !== 'ok') { setError('학번 중복 확인을 완료해주세요.'); return }
    if (checks.nickname !== 'ok') { setError('닉네임 중복 확인을 완료해주세요.'); return }

    setLoading(true)
    try {
      await api.signup({ studentId: form.studentId, nickname: form.nickname, email: form.email, password: form.password })
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <form className="auth-page" onSubmit={handleSubmit} style={{ paddingTop: 40 }}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">취미메이트</Link>
          <p className="auth-tagline">경북대 학번·이메일로 회원가입</p>
        </div>

        <div className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">학번</label>
            <div className="form-input-row">
              <input
                className="form-input"
                placeholder="예) 2019123456"
                value={form.studentId}
                onChange={(e) => update('studentId', e.target.value)}
              />
              <button type="button" className="form-check-btn" onClick={checkStudentId}>중복확인</button>
            </div>
            {checks.studentId === 'ok' && <p className="form-success">사용 가능한 학번이에요.</p>}
            {checks.studentId === 'dup' && <p className="form-error">이미 사용 중인 학번이에요.</p>}
          </div>

          <div className="form-group">
            <label className="form-label">닉네임</label>
            <div className="form-input-row">
              <input
                className="form-input"
                placeholder="서비스 내에서 사용할 이름"
                value={form.nickname}
                onChange={(e) => update('nickname', e.target.value)}
              />
              <button type="button" className="form-check-btn" onClick={checkNickname}>중복확인</button>
            </div>
            {checks.nickname === 'ok' && <p className="form-success">사용 가능한 닉네임이에요.</p>}
            {checks.nickname === 'dup' && <p className="form-error">이미 사용 중인 닉네임이에요.</p>}
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <input
              className="form-input"
              type="email"
              placeholder="학교 이메일 (xxx@knu.ac.kr)"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
            <p className="form-hint">경북대 이메일(@knu.ac.kr)만 사용 가능해요.</p>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 확인</label>
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호 재입력"
              value={form.confirm}
              onChange={(e) => update('confirm', e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </div>

        <p className="auth-footer">
          이미 계정이 있으신가요?{' '}
          <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ studentId: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.studentId || !form.password) { setError('학번과 비밀번호를 입력해주세요.'); return }
    setLoading(true)
    try {
      const res = await api.login({ studentId: form.studentId, password: form.password })
      login(res.token, res.user)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <form className="auth-page" onSubmit={handleSubmit}>
        <div className="auth-header">
          <Link to="/" className="auth-logo">취미메이트</Link>
          <p className="auth-tagline">경북대 학우 전용 취미 매칭 플랫폼</p>
        </div>

        <div className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">학번</label>
            <input
              className="form-input"
              placeholder="예) 2019123456"
              value={form.studentId}
              onChange={(e) => update('studentId', e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              className="form-input"
              type="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <p className="auth-footer">
          아직 계정이 없으신가요?{' '}
          <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  )
}

import { mockApi } from './mock.js'

const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function req(method, path, body) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // 백엔드 공통 응답 규격: { success, message, data }
  // (DELETE 등 body가 비어 있는 응답도 있으므로 파싱 실패는 빈 객체로 처리)
  const json = await res.json().catch(() => ({}))

  // HTTP 에러거나, 200이어도 success:false면 message를 던진다
  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `서버 오류 (${res.status})`)
  }

  // data 봉투가 있으면 벗겨서 반환, 없으면(login/signup 등) 전체 반환
  return json.data !== undefined ? json.data : json
}

const realApi = {
  // ── 인증/회원 ──
  checkStudentId: (sid) => req('GET', `/api/auth/studentId/${sid}`),
  checkNickname: (nick) => req('GET', `/api/auth/nickname/${encodeURIComponent(nick)}`),
  signup: (data) => req('POST', '/api/auth/signup', data),
  login: (data) => req('POST', '/api/auth/login', data),
  getMe: () => req('GET', '/api/users/me'),
  // 명세서 1.6: 닉네임 / 비밀번호만 변경 가능
  updateMyProfile: (data) => req('PATCH', '/api/users/me', data),

  // ── 모집 게시글 ──
  getPosts: () => req('GET', '/api/posts'),
  getPost: (id) => req('GET', `/api/posts/${id}`),
  createPost: (data) => req('POST', '/api/posts', data),
  deletePost: (id) => req('DELETE', `/api/posts/${id}`),
  // 명세서 2.5: 매칭 게시물 검색
  searchPosts: (keyword) => req('GET', `/api/posts/search?keyword=${encodeURIComponent(keyword)}`),

  // ── 매칭 ──
  applyPost: (id) => req('POST', `/api/posts/${id}/apply`),
  cancelApply: (id) => req('DELETE', `/api/posts/${id}/apply`),

  // ── 알림 ──
  getNotifications: () => req('GET', '/api/notifications'),
  // 명세서 3.4: 알림 읽음 처리
  readNotification: (id) => req('PATCH', `/api/notifications/${id}/read`),
}

export const api = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : realApi

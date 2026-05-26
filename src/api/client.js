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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `서버 오류 (${res.status})`)
  }

  return res.json()
}

const realApi = {
  checkStudentId: (sid) => req('GET', `/api/auth/studentId/${sid}`),
  checkNickname: (nick) => req('GET', `/api/auth/nickname/${encodeURIComponent(nick)}`),
  signup: (data) => req('POST', '/api/auth/signup', data),
  login: (data) => req('POST', '/api/auth/login', data),

  getPosts: () => req('GET', '/api/posts'),
  getPost: (id) => req('GET', `/api/posts/${id}`),
  createPost: (data) => req('POST', '/api/posts', data),
  deletePost: (id) => req('DELETE', `/api/posts/${id}`),

  applyPost: (id) => req('POST', `/api/posts/${id}/apply`),
  cancelApply: (id) => req('DELETE', `/api/posts/${id}/apply`),

  getNotifications: () => req('GET', '/api/notifications'),
  getMe: () => req('GET', '/api/users/me'),
}

export const api = import.meta.env.VITE_USE_MOCK === 'true' ? mockApi : realApi

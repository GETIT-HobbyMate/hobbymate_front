const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))

export const MOCK_USER = {
  id: 1,
  studentId: '2019123456',
  nickname: '클라이머123',
}

const POSTS = [
  {
    id: 1,
    title: '북문 새로 생긴 파스타집 같이 가실 분!',
    tags: ['맛집탐방'],
    meetDate: '2026-05-27T12:00:00',
    location: '북문 파스타집 (경대점)',
    currentCount: 2,
    maxCount: 4,
    status: 'OPEN',
    authorNickname: '클라이머123',
    authorId: 1,
    description: '오늘 점심에 북문 새로 생긴 파스타 맛집 가려는데 같이 가실 분 구해요. 가격도 합리적이고 분위기 좋아요!',
    appliedUserIds: [],
  },
  {
    id: 2,
    title: '주말 풋살 같이 하실 분 구합니다 ⚽',
    tags: ['풋살', '운동'],
    meetDate: '2026-05-28T16:00:00',
    location: '경북대 운동장',
    currentCount: 5,
    maxCount: 6,
    status: 'OPEN',
    authorNickname: '풋살왕',
    authorId: 2,
    description: '실력 상관없이 즐겁게 뛰어요! 조끼 챙겨오세요.',
    appliedUserIds: [],
  },
  {
    id: 3,
    title: '보드게임카페 같이 가요 🎲',
    tags: ['보드게임'],
    meetDate: '2026-05-26T18:00:00',
    location: '반월당 보드게임카페',
    currentCount: 4,
    maxCount: 4,
    status: 'COMPLETED',
    authorNickname: '보드마스터',
    authorId: 3,
    description: '카탄, 아줄, 스플렌더 좋아하시는 분 환영!',
    appliedUserIds: [],
    openChatUrl: 'https://open.kakao.com/o/example',
  },
  {
    id: 4,
    title: '클라이밍 같이 하실 초보자 구해요 🧗',
    tags: ['클라이밍', '운동'],
    meetDate: '2026-05-29T14:00:00',
    location: '경대 클라이밍짐',
    currentCount: 1,
    maxCount: 3,
    status: 'OPEN',
    authorNickname: '암벽러버',
    authorId: 4,
    description: '처음이어도 괜찮아요! 기초 잡아드릴게요.',
    appliedUserIds: [],
  },
  {
    id: 5,
    title: '영화 같이 보실 분? 🎬',
    tags: ['영화'],
    meetDate: '2026-05-27T19:30:00',
    location: '동성로 CGV',
    currentCount: 2,
    maxCount: 2,
    status: 'COMPLETED',
    authorNickname: '시네마고',
    authorId: 5,
    description: '드디어 매칭됐어요!',
    appliedUserIds: [],
    openChatUrl: 'https://open.kakao.com/o/example2',
  },
  {
    id: 6,
    title: '카페에서 같이 공부해요 ☕',
    tags: ['카페', '스터디'],
    meetDate: '2026-05-26T14:00:00',
    location: '봉봉 브런치카페 (북문점)',
    currentCount: 1,
    maxCount: 4,
    status: 'OPEN',
    authorNickname: '공부하고싶다',
    authorId: 6,
    description: '조용히 각자 공부해요. 말 안 해도 됩니다 😅',
    appliedUserIds: [],
  },
]

// 백엔드 GET /api/notifications 의 data.notifications 형태와 동일하게 맞춤
// (type: MATCH_COMPLETE, message 단일 필드, openChatUrl, createdAt)
// ※ id / isRead 는 읽음 처리 기능을 위해 포함 — 백엔드도 동일하게 내려줘야 함
let NOTIFICATIONS = [
  {
    id: 1,
    type: 'MATCH_COMPLETE',
    postId: 1,
    message: '주최하신 [북문 파스타집] 모임의 인원이 모두 충족되어 모집이 완료되었습니다! 아래 오픈채팅방 링크로 참여해 주세요.',
    openChatUrl: 'https://open.kakao.com/o/example',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 2,
    type: 'MATCH_COMPLETE',
    postId: 3,
    message: '신청하신 [보드게임카페] 모임이 완료되었습니다! 아래 오픈채팅방 링크로 참여해 주세요.',
    openChatUrl: 'https://open.kakao.com/o/example',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 3,
    type: 'MATCH_COMPLETE',
    postId: 5,
    message: '신청하신 [영화 같이 보실 분] 모임이 완료되었습니다!',
    openChatUrl: 'https://open.kakao.com/o/example2',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const MOCK_TOKEN = 'mock-token-hobbymate'

export const mockApi = {
  checkStudentId: async () => { await delay(); return { available: true } },
  checkNickname: async () => { await delay(); return { available: true } },
  signup: async () => { await delay(600); return { success: true } },

  login: async () => {
    await delay(600)
    localStorage.setItem('token', MOCK_TOKEN)
    return { token: MOCK_TOKEN, user: MOCK_USER }
  },

  // 백엔드 GET /api/users/me 의 data 형태와 동일
  getMe: async () => {
    await delay()
    return {
      profile: { studentId: MOCK_USER.studentId, nickname: MOCK_USER.nickname },
      hostedPosts: [POSTS[0]].map((p) => ({
        postId: p.id, title: p.title, status: p.status, meetingTime: p.meetDate,
      })),
      appliedPosts: [POSTS[1], POSTS[2]].map((p) => ({
        postId: p.id, title: p.title, status: p.status, meetingTime: p.meetDate,
      })),
    }
  },

  // 명세서 1.6 — PATCH /api/users/me
  updateMyProfile: async () => {
    await delay(500)
    return { success: true, message: '프로필 정보가 변경되었습니다.' }
  },

  getPosts: async () => { await delay(); return { posts: POSTS } },

  getPost: async (id) => {
    await delay()
    const post = POSTS.find((p) => p.id === Number(id))
    if (!post) throw new Error('게시글을 찾을 수 없어요.')
    return post
  },

  createPost: async (data) => {
    await delay(700)
    return { id: 99, ...data, currentCount: 1, status: 'OPEN', authorNickname: MOCK_USER.nickname, authorId: MOCK_USER.id, appliedUserIds: [] }
  },

  deletePost: async () => { await delay(500) },

  // 명세서 2.5 — GET /api/posts/search
  searchPosts: async (keyword) => {
    await delay()
    const k = (keyword ?? '').trim()
    const posts = !k
      ? POSTS
      : POSTS.filter((p) => p.title.includes(k) || p.tags.some((t) => t.includes(k)))
    return { posts }
  },

  applyPost: async (id) => {
    await delay(600)
    const post = POSTS.find((p) => p.id === Number(id))
    const next = post.currentCount + 1
    return { ...post, currentCount: next, appliedUserIds: [MOCK_USER.id], status: next >= post.maxCount ? 'COMPLETED' : 'OPEN' }
  },

  cancelApply: async (id) => {
    await delay(500)
    const post = POSTS.find((p) => p.id === Number(id))
    return { ...post, currentCount: Math.max(0, post.currentCount - 1), appliedUserIds: [], status: 'OPEN' }
  },

  getNotifications: async () => { await delay(); return { notifications: NOTIFICATIONS } },

  // 명세서 3.4 — PATCH /api/notifications/:id/read
  readNotification: async (id) => {
    await delay(300)
    NOTIFICATIONS = NOTIFICATIONS.map((n) => (n.id === Number(id) ? { ...n, isRead: true } : n))
    return { success: true, message: '알림 읽음 처리 완료' }
  },
}

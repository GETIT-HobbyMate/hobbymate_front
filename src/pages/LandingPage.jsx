import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { id: 'all', label: '전체', icon: '✨' },
  { id: 'food', label: '맛집탐방', icon: '🍜' },
  { id: 'climbing', label: '클라이밍', icon: '🧗' },
  { id: 'board', label: '보드게임', icon: '🎲' },
  { id: 'futsal', label: '풋살매치', icon: '⚽' }
]

const MOCK_MEETUPS = [
  { id: 1, category: 'food', title: '북문 신상 파스타 맛집 부술 파티원 구해요!', time: '오늘 12:30', people: '5/8명', location: '경대 북문', status: 'OPEN' },
  { id: 2, category: 'climbing', title: '클라이밍 처음인데 같이 가실 분?', time: '내일 18:00', people: '1/3명', location: '동성로 락클라이밍', status: 'OPEN' },
  { id: 3, category: 'board', title: '하이보드에서 뱅(BANG!) 하실 분', time: '오늘 15:00', people: '4/4명', location: '북문 하이보드', status: 'MATCHED' },
  { id: 4, category: 'futsal', title: '주말 아침 상쾌하게 풋살 한 게임 ⚽', time: '토요일 10:00', people: '3/6명', location: '대구 풋살장', status: 'OPEN' }
]

const FEATURES = [
  { emoji: '⚡', title: '빠른 실시간 매칭', desc: '모집 인원이 꽉 차면 자동으로\n오픈채팅 링크가 스르륵 열려요.' },
  { emoji: '🔒', title: '안전한 교내 전용', desc: '경북대학교 웹메일 인증을 마친\n확실한 학우들만 모여있어요.' },
  { emoji: '🚨', title: '상습 노쇼는 그만!', desc: '모두의 즐거운 취미 생활을 위해\n비매너 유저를 꼼꼼하게 관리해요.' }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredMeetups = activeCategory === 'all'
    ? MOCK_MEETUPS
    : MOCK_MEETUPS.filter((m) => m.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'var(--sans)', color: '#1A0800' }}>
      
      {/* ─── 상단 헤더 ─── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)', height: '64px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
          🔥 취미메이트
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', color: '#1A0800', border: 'none', fontWeight: 700, fontSize: '15px', padding: '8px 16px', cursor: 'pointer'
          }}>로그인</button>
          <button onClick={() => navigate('/signup')} style={{
            background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '15px', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
          }}>시작하기</button>
        </div>
      </header>

      {/* ─── 메인 히어로 섹션 ─── */}
      <section style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '60px',
        padding: '80px 40px', background: 'linear-gradient(135deg, #FFF5EB 0%, #FFE8D6 100%)',
        borderBottom: '1px solid #FFE8DE', position: 'relative', overflow: 'hidden', minHeight: '600px'
      }}>
        {/* Left Column: Text */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#fff', color: 'var(--primary)', padding: '6px 14px',
            borderRadius: '24px', fontSize: '13px', fontWeight: 800, marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(255,107,53,0.1)'
          }}>
            <span style={{ fontSize: '15px' }}>🧑‍🎓</span> KNU students only
          </div>
          <h1 style={{ fontSize: '46px', fontWeight: 900, color: '#1A0800', lineHeight: 1.25, marginBottom: '20px', letterSpacing: '-1.5px', textAlign: 'left' }}>
            공강과 주말,<br />함께할 <span style={{ color: 'var(--primary)' }}>메이트를 빠르게</span>
          </h1>
          <p style={{ fontSize: '17px', color: '#7A5A4A', lineHeight: 1.6, marginBottom: '40px', fontWeight: 600, textAlign: 'left' }}>
            맛집 탐방부터 클라이밍, 보드게임, 풋살까지.<br />
            목적이 맞는 학우를 가볍게 만나보세요.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button onClick={() => navigate('/home')} style={{
              background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '16px', padding: '16px 28px', borderRadius: '16px', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,107,53,0.3)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              👥 모임 찾기 <span>→</span>
            </button>
            <button onClick={() => navigate('/posts/new')} style={{
              background: '#fff', color: 'var(--primary)', border: '1px solid #FFE8DE', fontWeight: 800, fontSize: '16px', padding: '16px 28px', borderRadius: '16px', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              + 모임 만들기
            </button>
          </div>
          <div style={{ fontSize: '13px', color: '#A08070', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔒</span> KNU 인증 기반으로 안전하게 운영돼요
          </div>
        </div>

        {/* Right Column: Phone Mockup & Floating Cards */}
        <div style={{ position: 'relative', width: '360px', height: '640px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1, flexShrink: 0 }}>
          
          {/* Floating Card: Matjib (Top Left) */}
          <div style={{
            position: 'absolute', top: '8%', left: '-90px', background: '#fff', padding: '16px 20px', borderRadius: '20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.08)', transform: 'rotate(-8deg)', zIndex: 3, width: '160px'
          }}>
            <div style={{ background: '#FFF9F7', height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '12px' }}>🍜</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#1A0800', marginBottom: '4px' }}>맛집 탐방</div>
            <div style={{ fontSize: '11px', color: '#A08070', fontWeight: 600 }}>오늘 12:30 · 2/4명</div>
          </div>

          {/* Floating Card: Climbing (Mid Right) */}
          <div style={{
            position: 'absolute', top: '30%', right: '-110px', background: '#fff', padding: '16px 20px', borderRadius: '20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.08)', transform: 'rotate(5deg)', zIndex: 3, width: '160px'
          }}>
            <div style={{ background: '#E6F4EA', height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '12px' }}>🧗</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#1A0800', marginBottom: '4px' }}>클라이밍</div>
            <div style={{ fontSize: '11px', color: '#A08070', fontWeight: 600 }}>내일 18:00 · 1/3명</div>
          </div>

          {/* Floating Card: Futsal (Bottom Right) */}
          <div style={{
            position: 'absolute', bottom: '15%', right: '-90px', background: '#fff', padding: '16px 20px', borderRadius: '20px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.08)', transform: 'rotate(-4deg)', zIndex: 3, width: '160px'
          }}>
            <div style={{ background: '#E8F0FE', height: '70px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', marginBottom: '12px' }}>⚽</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#1A0800', marginBottom: '4px' }}>풋살</div>
            <div style={{ fontSize: '11px', color: '#A08070', fontWeight: 600 }}>일요일 10:00 · 3/6명</div>
          </div>

          {/* Floating Orange Icon (Bottom Left) */}
          <div style={{
            position: 'absolute', bottom: '15%', left: '-30px', width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', boxShadow: '0 12px 24px rgba(255,107,53,0.4)', zIndex: 3
          }}>
            👥
          </div>

          {/* White Phone Shell */}
          <div style={{
            width: '320px', height: '640px', background: '#fff', borderRadius: '54px',
            padding: '12px', boxShadow: '0 32px 80px rgba(255,107,53,0.2), 0 8px 24px rgba(0,0,0,0.05), inset 0 0 0 1px #E5E5E5',
            position: 'relative', zIndex: 2
          }}>
            {/* Phone Screen */}
            <div style={{
              background: '#FAFAFA', borderRadius: '42px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
            }}>
              {/* App Header */}
              <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.5px' }}>취미메이트</span>
                <div style={{ display: 'flex', gap: '10px', color: '#A08070', fontSize: '18px' }}>
                  <span>🔔</span>
                  <span>⚙️</span>
                </div>
              </div>

              {/* Greeting */}
              <div style={{ padding: '0 24px 20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1A0800', lineHeight: 1.3, letterSpacing: '-0.5px' }}>
                  오늘, 함께할<br />메이트를 찾아볼까요? 🏄
                </h2>
              </div>

              {/* Category Bubbles */}
              <div style={{ padding: '0 24px 28px', display: 'flex', gap: '14px', overflowX: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 8px 16px rgba(255,107,53,0.3)' }}>🍽️</div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary)' }}>전체</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🍜</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#868E96' }}>맛집</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏃‍♂️</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#868E96' }}>스포츠</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '28px', background: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🏕️</div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#868E96' }}>아웃도어</span>
                </div>
              </div>

              {/* Section Title */}
              <div style={{ padding: '0 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#1A0800' }}>지금 뜨는 모임</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#A08070' }}>전체 보기 &gt;</span>
              </div>

              {/* Mock Posts */}
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'hidden' }}>
                {[
                  { title: '동성로 맛집 탐방 파티', time: '오늘 12:30 · 2/4명', tag: '마감임박', tagColor: '#ef4444' },
                  { title: '클라이밍 같이 하실 분!', time: '내일 18:00 · 1/3명', tag: '', tagColor: '' },
                  { title: '보드게임 한 판 어때요', time: '토요일 14:00 · 2/4명', tag: '모집중', tagColor: '#3b82f6' }
                ].map((post, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '20px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#F1F3F5', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1A0800', marginBottom: '6px' }}>{post.title}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#A08070' }}>{post.time}</div>
                    </div>
                    {post.tag && (
                      <span style={{ padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, background: `${post.tagColor}15`, color: post.tagColor }}>
                        {post.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 모임 탐색 프리뷰 섹션 ─── */}
      <section style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1A0800', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            지금 모집 중인 취미 모임 👀
          </h2>
          <p style={{ fontSize: '15px', color: '#A08070', fontWeight: 500 }}>
            원하는 카테고리를 선택해 실시간 모임을 확인해보세요.
          </p>
        </div>

        {/* 카테고리 가로 네비게이터 */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '20px', justifyContent: 'center', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '12px 20px', borderRadius: '24px', fontSize: '15px', fontWeight: 800,
                whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeCategory === cat.id ? 'var(--primary)' : '#fff',
                color: activeCategory === cat.id ? '#fff' : '#A08070',
                boxShadow: activeCategory === cat.id ? '0 8px 20px rgba(255,107,53,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                border: activeCategory === cat.id ? 'none' : '1px solid #FFE8DE'
              }}
            >
              <span style={{ marginRight: '6px' }}>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        {/* 모임 프리뷰 피드 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          {filteredMeetups.map((meetup) => (
            <div key={meetup.id} onClick={() => navigate('/login')} style={{
              background: '#fff', borderRadius: '24px', padding: '24px', cursor: 'pointer',
              border: '1px solid rgba(255,107,53,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', gap: '14px', transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1A0800', lineHeight: 1.4 }}>
                  {meetup.title}
                </h3>
                <span style={{
                  padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap',
                  background: meetup.status === 'OPEN' ? 'rgba(34,197,94,0.1)' : '#F1F3F5',
                  color: meetup.status === 'OPEN' ? '#22c55e' : '#868E96'
                }}>
                  {meetup.status === 'OPEN' ? '모집중' : '매칭완료'}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#A08070', fontWeight: 600, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '16px' }}>🕒</span> {meetup.time}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '16px' }}>👥</span> {meetup.people}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '16px' }}>📍</span> {meetup.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 기능 및 안전 피처 섹션 ─── */}
      <section style={{ padding: '80px 20px', background: '#FFF9F7', borderTop: '1px solid #FFE8DE' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1A0800', textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.5px' }}>
            안전하고 신뢰할 수 있는 만남 🛡️
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {FEATURES.map((feat, idx) => (
              <div key={idx} style={{
                background: '#fff', padding: '32px 24px', borderRadius: '28px',
                border: '1px solid #FFE8DE', boxShadow: '0 12px 32px rgba(0,0,0,0.03)',
                textAlign: 'center'
              }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '20px', background: 'var(--primary-dim)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px' 
                }}>
                  {feat.emoji}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1A0800', marginBottom: '12px' }}>{feat.title}</h3>
                <p style={{ fontSize: '14px', color: '#A08070', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 하단 푸터 ─── */}
      <footer style={{
        padding: '32px 24px', textAlign: 'center', fontSize: '13px', color: '#A08070', fontWeight: 600,
        borderTop: '1px solid #FFE8DE', background: '#fff'
      }}>
        © 2026 취미메이트 (HobbyMate). 경북대학교 학생 전용 서비스.
      </footer>
      
    </div>
  )
}
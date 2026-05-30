import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 인라인 스타일만 쓰는 페이지라 미디어쿼리 대신 화면폭으로 분기한다.
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

const MOCK_CARDS = [
  { tags: ['맛집탐방'], title: '북문 파스타 같이 가실 분!', count: '2/4', status: 'OPEN' },
  { tags: ['풋살'], title: '주말 풋살 모집 중 ⚽', count: '5/6', status: 'OPEN' },
  { tags: ['보드게임'], title: '보드게임카페 같이 가요 🎲', count: '4/4', status: 'MATCHED' },
]

const FEATURES = [
  { emoji: '⚡', title: '빠른 매칭', desc: '게시글을 올리고\n정원이 차면 자동 매칭' },
  { emoji: '🔒', title: '교내 전용', desc: '경북대 이메일 인증으로\n믿을 수 있는 학우만' },
  { emoji: '🔔', title: '안전한 만남', desc: '노쇼 신고 시스템으로\n신뢰도 높은 커뮤니티' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const m = useIsMobile()

  return (
    <div style={{ minHeight: '100svh', background: '#fff', fontFamily: 'var(--sans)', overflowX: 'hidden' }}>
      {/* ─── Nav ─── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: m ? '0 20px' : '0 40px', height: m ? 56 : 64,
        borderBottom: '1px solid #FFE8DE',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100,
      }}>
        <span style={{ fontSize: m ? 19 : 22, fontWeight: 900, color: 'var(--primary)', letterSpacing: -0.5 }}>
          취미메이트
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: m ? 12 : 32 }}>
          {/* 모바일에선 보조 메뉴는 숨기고 로그인만 노출 (가로 오버플로 방지) */}
          {!m && (
            <>
              <button
                onClick={() => navigate('/home')}
                style={{ fontSize: 14, fontWeight: 600, color: '#5C3820', background: 'none', border: 'none', cursor: 'pointer' }}
              >모집보기</button>
              <button
                onClick={() => navigate('/posts/new')}
                style={{ fontSize: 14, fontWeight: 600, color: '#5C3820', background: 'none', border: 'none', cursor: 'pointer' }}
              >작성하기</button>
              <button
                onClick={() => navigate('/my')}
                style={{ fontSize: 14, fontWeight: 600, color: '#5C3820', background: 'none', border: 'none', cursor: 'pointer' }}
              >마이페이지</button>
            </>
          )}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '9px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(255,107,53,0.3)',
            }}
          >로그인</button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{
        display: 'flex', alignItems: 'center',
        justifyContent: m ? 'center' : 'space-between',
        flexDirection: m ? 'column' : 'row',
        padding: m ? '44px 22px 48px' : '64px 80px 56px',
        background: 'linear-gradient(150deg, #fff 55%, #FFF4EE 100%)',
        gap: m ? 44 : 40,
      }}>
        {/* Left: text */}
        <div style={{ flex: '0 0 auto', maxWidth: m ? '100%' : 440, textAlign: m ? 'center' : 'left' }}>
          <div style={{
            display: 'inline-block', padding: '5px 12px', borderRadius: 20,
            background: 'var(--primary-dim)', color: 'var(--primary)',
            fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 0.3,
          }}>
            경북대 학우 전용 취미 매칭 플랫폼
          </div>
          <h1 style={{
            fontSize: m ? 32 : 46, fontWeight: 900, color: '#1A0800', lineHeight: 1.2,
            letterSpacing: m ? -1 : -1.5, marginBottom: 18,
          }}>
            공강이 심심할 땐,<br />
            <span style={{ color: 'var(--primary)' }}>취미메이트</span>
          </h1>
          <p style={{ fontSize: m ? 15 : 16, color: '#A08070', lineHeight: 1.7, marginBottom: 36 }}>
            경북대 학우들과 하루에 연결되고,<br />
            새로운 일상이 시작되는 곳
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: m ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding: '14px 28px', borderRadius: 12, fontWeight: 800, fontSize: 16,
                background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
                transition: 'all 0.15s',
              }}
            >
              지금 시작하기 →
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 16,
                background: 'transparent', color: 'var(--primary)',
                border: '2px solid var(--primary-border)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              로그인
            </button>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div style={{ flex: '0 0 auto', position: 'relative' }}>
          {/* Decorative blob */}
          <div style={{
            position: 'absolute', top: -30, right: -30,
            width: 280, height: 280,
            background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
            borderRadius: '50%', zIndex: 0,
          }} />

          {/* Phone shell */}
          <div style={{
            position: 'relative', zIndex: 1,
            width: 240, height: 480,
            background: '#1A0800',
            borderRadius: 40,
            padding: '14px 10px',
            boxShadow: '0 24px 60px rgba(26,8,0,0.25), 0 8px 20px rgba(26,8,0,0.15)',
          }}>
            {/* Notch */}
            <div style={{
              width: 70, height: 20, background: '#1A0800',
              borderRadius: 10, margin: '0 auto 8px',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            }} />

            {/* Screen */}
            <div style={{
              background: '#FFF9F7',
              borderRadius: 28,
              height: 400,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* App header */}
              <div style={{
                padding: '10px 14px 8px',
                background: '#fff',
                borderBottom: '1px solid #FFE8DE',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--primary)' }}>취미메이트</span>
                <span style={{ fontSize: 14 }}>🔔</span>
              </div>

              {/* Mock post cards */}
              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'hidden' }}>
                {MOCK_CARDS.map((card, i) => (
                  <div key={i} style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '10px 12px',
                    boxShadow: '0 1px 8px rgba(255,107,53,0.08)',
                    border: '1px solid #FFE8DE',
                  }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4, flexWrap: 'wrap' }}>
                      {card.tags.map((t) => (
                        <span key={t} style={{
                          fontSize: 9, fontWeight: 700, padding: '2px 6px',
                          borderRadius: 10, background: 'var(--primary-dim)', color: 'var(--primary)',
                        }}>{t}</span>
                      ))}
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px',
                        borderRadius: 10,
                        background: card.status === 'MATCHED' ? 'var(--primary-dim)' : 'rgba(34,197,94,0.1)',
                        color: card.status === 'MATCHED' ? 'var(--primary)' : '#22c55e',
                      }}>
                        {card.status === 'MATCHED' ? '매칭완료' : '모집중'}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#1A0800', marginBottom: 4, lineHeight: 1.3 }}>
                      {card.title}
                    </p>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <div style={{ flex: 1, height: 3, background: '#FFE8DE', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(parseInt(card.count) / parseInt(card.count.split('/')[1])) * 100}%`,
                          background: 'var(--primary)', borderRadius: 2,
                        }} />
                      </div>
                      <span style={{ fontSize: 9, color: '#A08070', fontWeight: 700 }}>{card.count}명</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating emoji decorations */}
          <div style={{
            position: 'absolute', top: 20, left: -20,
            fontSize: 28, filter: 'drop-shadow(0 2px 8px rgba(255,107,53,0.3))',
          }}>🧗</div>
          <div style={{
            position: 'absolute', bottom: 60, right: -24,
            fontSize: 26, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
          }}>🎲</div>
          <div style={{
            position: 'absolute', top: 160, right: -30,
            background: '#fff', borderRadius: 12, padding: '6px 10px',
            fontSize: 11, fontWeight: 700, color: 'var(--primary)',
            boxShadow: '0 4px 14px rgba(255,107,53,0.2)',
            border: '1px solid var(--primary-border)',
            whiteSpace: 'nowrap',
          }}>🎉 매칭 완료!</div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section style={{
        padding: m ? '52px 22px' : '72px 80px',
        background: '#fff',
        borderTop: '1px solid #FFE8DE',
      }}>
        <div style={{ textAlign: 'center', marginBottom: m ? 36 : 52 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 10, letterSpacing: 0.5 }}>
            WHY HOBBYMATE
          </p>
          <h2 style={{ fontSize: m ? 26 : 34, fontWeight: 900, color: '#1A0800', letterSpacing: -1 }}>
            함께라서 더 즐거운 취미
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              flex: '1 1 220px', maxWidth: 280,
              background: '#FFF9F7',
              border: '1px solid #FFE8DE',
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'var(--primary-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, margin: '0 auto 18px',
              }}>
                {f.emoji}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1A0800', marginBottom: 10 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: '#A08070', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section style={{
        padding: m ? '52px 24px' : '72px 80px',
        background: 'linear-gradient(135deg, var(--primary) 0%, #E04A1A 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: -1 }}>
          지금 바로 메이트를 찾아보세요
        </h2>
        <p style={{ fontSize: m ? 14 : 16, color: 'rgba(255,255,255,0.8)', marginBottom: m ? 28 : 36 }}>
          경북대 학번·이메일 인증 후 바로 시작할 수 있어요
        </p>
        <button
          onClick={() => navigate('/signup')}
          style={{
            padding: m ? '14px 32px' : '16px 40px', borderRadius: 14, fontWeight: 800, fontSize: m ? 16 : 17,
            background: '#fff', color: 'var(--primary)', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'transform 0.15s',
          }}
        >
          무료로 시작하기 →
        </button>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        padding: m ? '24px' : '28px 80px',
        borderTop: '1px solid #FFE8DE',
        display: 'flex',
        flexDirection: m ? 'column' : 'row',
        gap: m ? 8 : 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        background: '#fff',
      }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--primary)' }}>취미메이트</span>
        <span style={{ fontSize: 12, color: '#A08070' }}>© 2026 취미메이트. 경북대학교 학생 전용 서비스.</span>
      </footer>
    </div>
  )
}

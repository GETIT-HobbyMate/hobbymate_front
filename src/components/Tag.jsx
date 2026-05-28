const TAG_COLORS = {
  맛집탐방: { bg: '#fff0e6', color: '#e06020' },
  풋살: { bg: '#e6f4ff', color: '#1a7dc0' },
  운동: { bg: '#e8f8ee', color: '#1a9045' },
  보드게임: { bg: '#f3e8ff', color: '#7c3acc' },
  클라이밍: { bg: '#fff3e0', color: '#d07020' },
  영화: { bg: '#fce8ec', color: '#c0284a' },
  카페: { bg: '#fdf4e0', color: '#b07020' },
  스터디: { bg: '#e6f0ff', color: '#2050b0' },
  독서: { bg: '#f0f8e8', color: '#407020' },
  default: { bg: '#f5f0ee', color: '#806050' },
}

export default function Tag({ label }) {
  const style = TAG_COLORS[label] ?? TAG_COLORS.default
  return (
    <span className="tag" style={{ background: style.bg, color: style.color }}>
      {label}
    </span>
  )
}

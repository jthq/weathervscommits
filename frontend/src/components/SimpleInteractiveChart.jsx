import { useMemo, useState } from 'react'

function scale(values, minPx, maxPx) {
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1
  return (value) => maxPx - ((value - minVal) / range) * (maxPx - minPx)
}

function buildPath(points) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

function SimpleInteractiveChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null)
  const [showTemp, setShowTemp] = useState(true)
  const [showSnow, setShowSnow] = useState(true)

  const chart = useMemo(() => {
    const averageCommits = data.dates.map((_, idx) => {
      const commits = Object.values(data.students).map((studentSeries) => studentSeries[idx])
      return commits.reduce((sum, value) => sum + value, 0) / commits.length
    })

    const width = 920
    const height = 340
    const pad = { top: 24, right: 18, bottom: 36, left: 44 }
    const plotW = width - pad.left - pad.right
    const plotH = height - pad.top - pad.bottom

    const x = (idx) => pad.left + (idx / (data.dates.length - 1 || 1)) * plotW

    const yCommits = scale(averageCommits, pad.top, pad.top + plotH)
    const yTemp = scale(data.temperature, pad.top, pad.top + plotH)
    const ySnow = scale(data.snowfall, pad.top, pad.top + plotH)

    const commitsPoints = averageCommits.map((value, idx) => ({ x: x(idx), y: yCommits(value), v: value }))
    const tempPoints = data.temperature.map((value, idx) => ({ x: x(idx), y: yTemp(value), v: value }))
    const snowPoints = data.snowfall.map((value, idx) => ({ x: x(idx), y: ySnow(value), v: value }))

    return {
      width,
      height,
      pad,
      dates: data.dates,
      averageCommits,
      commitsPath: buildPath(commitsPoints),
      tempPath: buildPath(tempPoints),
      snowPath: buildPath(snowPoints),
      commitsPoints,
      tempPoints,
      snowPoints,
      gridY: [0, 0.25, 0.5, 0.75, 1].map((t) => pad.top + t * plotH),
    }
  }, [data])

  const shownIndex = hoverIndex ?? chart.dates.length - 1

  return (
    <section className="chart-section">
      <h2>Average Commit Trend vs Weather</h2>
      <p className="chart-meta">Interactive: hover across the chart for exact values, and toggle weather overlays.</p>

      <div className="controls">
        <button className={`chip ${showTemp ? 'active' : ''}`} onClick={() => setShowTemp((v) => !v)}>
          Temperature
        </button>
        <button className={`chip ${showSnow ? 'active' : ''}`} onClick={() => setShowSnow((v) => !v)}>
          Snowfall
        </button>
      </div>

      <svg
        className="chart-svg"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {chart.gridY.map((y) => (
          <line key={y} x1={chart.pad.left} x2={chart.width - chart.pad.right} y1={y} y2={y} stroke="#e4ecff" />
        ))}

        <path d={chart.commitsPath} fill="none" stroke="#2254d6" strokeWidth="3" />
        {showTemp && <path d={chart.tempPath} fill="none" stroke="#e57b1f" strokeWidth="2" strokeDasharray="6 4" />}
        {showSnow && <path d={chart.snowPath} fill="none" stroke="#2d9f87" strokeWidth="2" strokeDasharray="3 5" />}

        {chart.commitsPoints.map((point, idx) => (
          <g key={idx} onMouseEnter={() => setHoverIndex(idx)}>
            <line
              x1={point.x}
              x2={point.x}
              y1={chart.pad.top}
              y2={chart.height - chart.pad.bottom}
              stroke={hoverIndex === idx ? '#c5d8ff' : 'transparent'}
            />
            <circle cx={point.x} cy={point.y} r={hoverIndex === idx ? 5 : 3} fill="#2254d6" />
            <rect
              x={point.x - 8}
              y={chart.pad.top}
              width="16"
              height={chart.height - chart.pad.top - chart.pad.bottom}
              fill="transparent"
            />
          </g>
        ))}
      </svg>

      <div className="legend">
        <span><span className="legend-dot" style={{ background: '#2254d6' }} />Avg commits</span>
        <span><span className="legend-dot" style={{ background: '#e57b1f' }} />Temperature</span>
        <span><span className="legend-dot" style={{ background: '#2d9f87' }} />Snowfall</span>
      </div>

      <div className="tooltip">
        <strong>{chart.dates[shownIndex]}</strong>
        {` | Avg commits: ${chart.averageCommits[shownIndex].toFixed(2)}`}
        {showTemp ? ` | Temp: ${data.temperature[shownIndex].toFixed(1)}C` : ''}
        {showSnow ? ` | Snow: ${data.snowfall[shownIndex].toFixed(1)}mm` : ''}
      </div>
    </section>
  )
}

export default SimpleInteractiveChart

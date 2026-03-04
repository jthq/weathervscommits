import { useEffect, useState } from 'react'
import axios from 'axios'
import SimpleInteractiveChart from './components/SimpleInteractiveChart.jsx'
import Table from './components/Table'
import Conclusion from './components/Conclusion'

function pearson(a, b) {
  const n = a.length
  if (!n || n !== b.length) return 0

  const meanA = a.reduce((sum, value) => sum + value, 0) / n
  const meanB = b.reduce((sum, value) => sum + value, 0) / n

  let numerator = 0
  let denomA = 0
  let denomB = 0

  for (let i = 0; i < n; i += 1) {
    const da = a[i] - meanA
    const db = b[i] - meanB
    numerator += da * db
    denomA += da * da
    denomB += db * db
  }

  const denom = Math.sqrt(denomA * denomB)
  return denom === 0 ? 0 : numerator / denom
}

function strengthLabel(value) {
  const abs = Math.abs(value)
  if (abs < 0.1) return 'near-zero'
  if (abs < 0.3) return 'weak'
  if (abs < 0.5) return 'moderate'
  return 'strong'
}

function App() {
  const [data, setData] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, statsRes] = await Promise.all([
          axios.get('/api/data'),
          axios.get('/api/stats')
        ])
        setData(dataRes.data)
        setStats(statsRes.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load data. Make sure the backend is running on port 5000.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    )
  }

  const avgCommits = data.dates.map((_, idx) => {
    const values = Object.values(data.students).map((series) => series[idx])
    return values.reduce((sum, value) => sum + value, 0) / values.length
  })

  const corrCommitTemp = pearson(avgCommits, data.temperature)
  const corrCommitSnow = pearson(avgCommits, data.snowfall)
  const corrTempSnow = pearson(data.temperature, data.snowfall)

  return (
    <div className="container">
      <div className="header">
        <h1>Weather vs GitHub Activity</h1>
        <p>Anonymous aggregated analysis for January 2024</p>
      </div>

      <div className="stats-grid">
        <div className="stat-tile">
          <p className="stat-label">Sample Size</p>
          <p className="stat-value">N = {data.dates.length} days</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Commits vs Temp</p>
          <p className="stat-value">r = {corrCommitTemp.toFixed(3)}</p>
          <p className="stat-sub">{strengthLabel(corrCommitTemp)} negative</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Commits vs Snow</p>
          <p className="stat-value">r = {corrCommitSnow.toFixed(3)}</p>
          <p className="stat-sub">{strengthLabel(corrCommitSnow)} relationship</p>
        </div>
        <div className="stat-tile">
          <p className="stat-label">Temp vs Snow</p>
          <p className="stat-value">r = {corrTempSnow.toFixed(3)}</p>
          <p className="stat-sub">{strengthLabel(corrTempSnow)} positive</p>
        </div>
      </div>

      <div className="content">
        <div className="main-stack">
          {data && <SimpleInteractiveChart data={data} />}
          {data && <Table data={data} />}
          {stats && (
            <Conclusion
              stats={stats}
              correlations={{
                commitTemp: corrCommitTemp,
                commitSnow: corrCommitSnow,
                tempSnow: corrTempSnow,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App


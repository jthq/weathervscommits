import { useEffect, useState } from 'react'
import axios from 'axios'
import Chart from './components/Chart'
import Tables from './components/Tables'
import Conclusion from './components/Conclusion'

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
    return (
      <div className="container">
        <div className="loading">Loading data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Github Commits vs. Weather Study</h1>
        <p>Analyzing the correlation between colder temperatures and GitHub activity of Waterloo Students.</p>
        <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Usernames randomly pulled from https://uwgitrank.com/leaderboard.</p>
      </div>

      {data && <Chart data={data} />}
      {data && <Tables data={data} />}
      {stats && <Conclusion stats={stats} />}
    </div>
  )
}

export default App

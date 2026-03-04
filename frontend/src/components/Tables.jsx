function Tables({ data }) {
  // Calculate average commits per day
  const avgCommitsPerDay = data.dates.map((date, idx) => {
    const studentCommits = Object.keys(data.students).map(student => data.students[student][idx])
    const avg = studentCommits.reduce((a, b) => a + b, 0) / studentCommits.length
    return {
      date,
      temperature: data.temperature[idx],
      avgCommits: avg.toFixed(2)
    }
  })

  const snowfallData = data.dates.map((date, idx) => ({
    date,
    snowfall: data.snowfall[idx].toFixed(2)
  }))

  return (
    <>
      <div className="table-section">
        <h2>📊 Average Commits by Date</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temperature (°C)</th>
              <th>Avg Commits</th>
            </tr>
          </thead>
          <tbody>
            {avgCommitsPerDay.map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                <td>{row.temperature.toFixed(1)}</td>
                <td>{row.avgCommits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h2>🌨️ Snowfall Data by Date</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Snowfall (mm)</th>
            </tr>
          </thead>
          <tbody>
            {snowfallData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.date}</td>
                <td>{row.snowfall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Tables

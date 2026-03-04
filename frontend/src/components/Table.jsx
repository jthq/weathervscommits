function Table({ data }) {
  // Calculate average commits per day
  const avgCommitsPerDay = data.dates.map((date, idx) => {
    const studentCommits = Object.keys(data.students).map(student => data.students[student][idx])
    const avg = studentCommits.reduce((a, b) => a + b, 0) / studentCommits.length
    return {
      date,
      temperature: data.temperature[idx],
      avgCommits: avg.toFixed(2),
      snowfall: data.snowfall[idx].toFixed(2)
    }
  })

  return (
    <div className="table-section">
      <h2>Daily Data Table</h2>
      <p className="chart-meta">This table shows daily weather with average commits.</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp (°C)</th>
            <th>Avg Commits</th>
            <th>Snow (mm)</th>
          </tr>
        </thead>
        <tbody>
          {avgCommitsPerDay.map((row, idx) => (
            <tr key={idx}>
              <td>{row.date}</td>
              <td>{row.temperature.toFixed(1)}</td>
              <td>{row.avgCommits}</td>
              <td>{row.snowfall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

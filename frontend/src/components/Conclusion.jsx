function Conclusion({ stats, correlations }) {
  return (
    <div className="conclusion">
      <h2>Quick Notes</h2>
      
      <p>
        <strong>What this includes:</strong><br/>
        31 days in January 2024, 9 students, and daily average commits.
      </p>

      <p>
        <strong>Basic stats:</strong><br/>
        Avg temp: {stats.avg_temp.toFixed(2)}°C<br/>
        Temp range: {stats.min_temp.toFixed(1)}°C to {stats.max_temp.toFixed(1)}°C<br/>
        Total snowfall: {stats.total_snowfall.toFixed(1)}mm<br/>
        Avg daily commits: {stats.avg_commits.toFixed(2)}
      </p>

      <p>
        <strong>Correlations (r):</strong><br/>
        Commits vs temp: {correlations.commitTemp.toFixed(3)}<br/>
        Commits vs snowfall: {correlations.commitSnow.toFixed(3)}<br/>
        Temp vs snowfall: {correlations.tempSnow.toFixed(3)}
      </p>

      <p>
        <strong>Limitations:</strong><br/>
        One month is a small sample, and many other things (deadlines, classes, personal schedule) can affect commit activity.
      </p>

      <p>
        <strong>Takeaway:</strong><br/>
        In this small sample, weather seems to have a weak effect on commits. It is a nice first pass, but not a final conclusion.
      </p>
    </div>
  )
}

export default Conclusion

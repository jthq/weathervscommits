function Conclusion({ stats, correlations }) {
  return (
    <div className="conclusion">
      <h2>Technical Analysis</h2>
      
      <p>
        <strong>Dataset Properties:</strong><br/>
        Sample Size: N = 31 days (January 2024)<br/>
        Population: 9 anonymous student accounts<br/>
        Aggregation: Daily average commits across all subjects
      </p>

      <p>
        <strong>Summary Statistics:</strong><br/>
        Mean Temperature: {stats.avg_temp.toFixed(2)}°C<br/>
        Temperature Range: [{stats.min_temp.toFixed(1)}°C, {stats.max_temp.toFixed(1)}°C]<br/>
        Total Precipitation: {stats.total_snowfall.toFixed(1)}mm<br/>
        Mean Daily Commits: {stats.avg_commits.toFixed(2)}
      </p>

      <p>
        <strong>Correlation Analysis:</strong><br/>
        Pearson estimates from this dataset show commits vs temperature at r = {correlations.commitTemp.toFixed(3)}, commits vs snowfall at r = {correlations.commitSnow.toFixed(3)}, and temperature vs snowfall at r = {correlations.tempSnow.toFixed(3)}. This indicates weak-to-moderate negative association for commits vs temperature, near-zero linear association for commits vs snowfall, and moderate positive association between temperature and snowfall.
      </p>

      <p>
        <strong>Limitations:</strong><br/>
        • Single month observation (insufficient for seasonal analysis)<br/>
        • Confounding variables uncontrolled (deadlines, exams, personal factors)<br/>
        • Small sample size limits statistical power<br/>
        • No consideration of temporal lag effects
      </p>

      <p>
        <strong>Conclusion:</strong><br/>
        For this month-long sample, weather has limited explanatory power for average commit volume. The strongest signal is a moderate negative temperature-commit trend, but results remain exploratory due to sample size and unmodeled confounders. A longer multi-season panel with real per-day commit histories is needed for defensible inference.
      </p>
    </div>
  )
}

export default Conclusion

function Conclusion({ stats }) {
  return (
    <div className="conclusion">
      <h2>🔍 Conclusion</h2>
      <p>
        <strong>Overall Average Commits:</strong> {stats.avg_commits.toFixed(2)} across all students
      </p>
      <p>
        <strong>Temperature Range:</strong> {stats.min_temp.toFixed(1)}°C to {stats.max_temp.toFixed(1)}°C (Average: {stats.avg_temp.toFixed(1)}°C)
      </p>
      <p>
        <strong>Total Snowfall:</strong> {stats.total_snowfall.toFixed(1)}mm during the study period
      </p>
      <p style={{ marginTop: '15px' }}>
        The data reveals patterns in how Waterloo students' GitHub activity correlates with weather conditions.
        Individual students show varying levels of commits throughout the month, with notable differences
        in how weather patterns (temperature and snowfall) may influence coding activity. The relationship
        between colder temperatures and GitHub commits suggests that external weather conditions may impact
        student productivity and coding habits.
      </p>
      <p style={{ marginTop: '15px' }}>
        <strong>Note:</strong> This analysis is based on January 2024 data. Future studies across multiple seasons would
        provide stronger evidence of seasonal patterns in developer activity.
      </p>
    </div>
  )
}

export default Conclusion

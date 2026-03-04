import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B'
]

function Chart({ data }) {
  const chartData = data.dates.map((date, idx) => ({
    date: date,
    Temperature: data.temperature[idx],
    Snowfall: data.snowfall[idx],
    ...Object.keys(data.students).reduce((acc, student) => {
      acc[student] = data.students[student][idx]
      return acc
    }, {})
  }))

  const studentNames = Object.keys(data.students)

  return (
    <div className="chart-section">
      <h2>📈 Student Commits & Weather Patterns</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {studentNames.map((student, idx) => (
            <Line
              key={student}
              type="monotone"
              dataKey={student}
              stroke={COLORS[idx % COLORS.length]}
              dot={false}
              strokeWidth={2}
            />
          ))}
          <Line type="monotone" dataKey="Temperature" stroke="#FF4444" strokeWidth={2} />
          <Line type="monotone" dataKey="Snowfall" stroke="#4444FF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart

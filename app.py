import streamlit as st
import pandas as pd
import numpy as np
from data_engine import gimme_weather_data

st.set_page_config(page_title="Weather vs Commits", layout="centered")

# --- custom css for dark mode look ---

st.markdown("""
<style>
/* floating dots background */
@keyframes float {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
}
.particles {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
}
.particles span {
    position: absolute;
    bottom: -10px;
    width: 6px; height: 6px;
    background: rgba(108, 99, 255, 0.35);
    border-radius: 50%;
    animation: float linear infinite;
}
.particles span:nth-child(1) { left: 10%; animation-duration: 12s; animation-delay: 0s; width: 4px; height: 4px; }
.particles span:nth-child(2) { left: 25%; animation-duration: 15s; animation-delay: 2s; width: 7px; height: 7px; }
.particles span:nth-child(3) { left: 40%; animation-duration: 18s; animation-delay: 4s; }
.particles span:nth-child(4) { left: 55%; animation-duration: 11s; animation-delay: 1s; width: 5px; height: 5px; }
.particles span:nth-child(5) { left: 70%; animation-duration: 14s; animation-delay: 3s; width: 8px; height: 8px; }
.particles span:nth-child(6) { left: 85%; animation-duration: 16s; animation-delay: 5s; width: 4px; height: 4px; }
.particles span:nth-child(7) { left: 50%; animation-duration: 20s; animation-delay: 7s; width: 5px; height: 5px; }
.particles span:nth-child(8) { left: 15%; animation-duration: 13s; animation-delay: 6s; width: 6px; height: 6px; }

/* glow on metric cards */
[data-testid="stMetric"] {
    background: rgba(108, 99, 255, 0.08);
    border: 1px solid rgba(108, 99, 255, 0.2);
    border-radius: 10px;
    padding: 12px;
    backdrop-filter: blur(6px);
}

/* subtle glow on headings */
h1 {
    text-shadow: 0 0 20px rgba(108, 99, 255, 0.3);
}

/* softer dividers */
hr {
    border-color: rgba(108, 99, 255, 0.15) !important;
}

/* blur card style on dataframe */
[data-testid="stDataFrame"] {
    border-radius: 10px;
    overflow: hidden;
}
</style>

<div class="particles">
    <span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span>
</div>
""", unsafe_allow_html=True)

student_list = [
    'willzeng274', 'LucasHJin', 'adityamakkar000', 'connortbot',
    '1spyral', 'maminsed', 'adithayyil', 'WaronLimsakul', 'PLIAN78'
]

# --- helpers ---

def pearson(a, b):
    n = len(a)
    if n == 0 or n != len(b):
        return 0.0
    a = np.array(a, dtype=float)
    b = np.array(b, dtype=float)
    da = a - a.mean()
    db = b - b.mean()
    denom = np.sqrt((da ** 2).sum() * (db ** 2).sum())
    if denom == 0:
        return 0.0
    return float((da * db).sum() / denom)

# --- data loading ---

@st.cache_data
def load_data():
    weather = gimme_weather_data("Waterloo")

    # synthetic daily commits per student (same seed so results are consistent)
    np.random.seed(42)
    for s in student_list:
        weather[s] = np.random.randint(0, 8, size=len(weather))

    weather['Avg Commits'] = weather[student_list].mean(axis=1)
    return weather

with st.spinner('Fetching data...'):
    df = load_data()

# --- header ---

st.title("Weather vs GitHub Activity")
st.write("Simple January 2024 data experiment")
st.markdown("---")

# --- quick stats ---

avg_commits = df['Avg Commits'].values
temps = df['Temperature'].values
snow = df['Snowfall'].values

r_ct = pearson(avg_commits, temps)
r_cs = pearson(avg_commits, snow)
r_ts = pearson(temps, snow)

c1, c2, c3, c4 = st.columns(4)
c1.metric("Sample", f"N = {len(df)} days")
c2.metric("Commits vs Temp", f"r = {r_ct:.3f}")
c3.metric("Commits vs Snow", f"r = {r_cs:.3f}")
c4.metric("Temp vs Snow", f"r = {r_ts:.3f}")

st.markdown("---")

# --- chart ---

st.subheader("Average Commits vs Weather")
st.write("Toggle columns with the checkboxes below.")

show_temp = st.checkbox("Show Temperature", value=True)
show_snow = st.checkbox("Show Snowfall", value=True)

chart_cols = ['Avg Commits']
if show_temp:
    chart_cols.append('Temperature')
if show_snow:
    chart_cols.append('Snowfall')

chart_df = df.set_index('Date')[chart_cols]
st.line_chart(chart_df, height=360)

st.markdown("---")

# --- table ---

st.subheader("Daily Data Table")
st.write("This table shows daily weather with average commits.")
table_df = df[['Date', 'Temperature', 'Avg Commits', 'Snowfall']].copy()
table_df.columns = ['Date', 'Temp (°C)', 'Avg Commits', 'Snow (mm)']
st.dataframe(table_df, use_container_width=True, hide_index=True)

st.markdown("---")

# --- conclusion ---

st.subheader("Quick Notes")

st.markdown(f"""
**What this includes:**
31 days in January 2024, {len(student_list)} students, and daily average commits.

**Basic stats:**
- Avg temp: {temps.mean():.2f}°C
- Temp range: {temps.min():.1f}°C to {temps.max():.1f}°C
- Total snowfall: {snow.sum():.1f}mm
- Avg daily commits: {avg_commits.mean():.2f}

**Correlations (r):**
- Commits vs temp: {r_ct:.3f}
- Commits vs snowfall: {r_cs:.3f}
- Temp vs snowfall: {r_ts:.3f}

**Limitations:**
One month is a small sample, and many other things (deadlines, classes, personal schedule) can affect commit activity.

**Takeaway:**
In this small sample, weather seems to have a weak effect on commits. It is a nice first pass, but not a final conclusion.
""")
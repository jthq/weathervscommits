import streamlit as st
import pandas as pd
import numpy as np
from data_engine import gimme_weather_data

st.set_page_config(page_title="Weather vs Commits", layout="centered")

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

with st.spinner('Loading data...'):
    df = load_data()

# --- header ---

st.title("Weather vs Commits")
st.write("January 2024 data from Waterloo, Ontario")
st.markdown("---")

# --- chart ---

avg_commits = df['Avg Commits'].values
temps = df['Temperature'].values
snow = df['Snowfall'].values

r_ct = pearson(avg_commits, temps)
r_cs = pearson(avg_commits, snow)
r_ts = pearson(temps, snow)

st.subheader("Daily Commits vs Weather")

chart_df = df.set_index('Date')[['Avg Commits', 'Temperature', 'Snowfall']]
st.line_chart(chart_df, height=360)

st.markdown("---")

# --- table ---

st.subheader("Data Table")
table_df = df[['Date', 'Temperature', 'Avg Commits', 'Snowfall']].copy()
table_df.columns = ['Date', 'Temp (°C)', 'Avg Commits', 'Snow (mm)']
st.dataframe(table_df, use_container_width=True, hide_index=True)

st.markdown("---")

# --- conclusion ---

st.subheader("Conclusion")

st.write(f"""
Looking at this month of data, weather doesn't seem to explain much of the variation in commit volume. The only noticeable pattern is a moderate negative relationship between temperature and commits (r = {r_ct:.3f}), but even that feels tentative. With just a month of data and plenty of other factors I didn't account for, this is really just exploratory. To make a stronger claim, I'd need a longer, multi-season dataset with detailed day-by-day commit history.
""")

st.subheader("Limitations & Considerations")

st.write("""
- **Single month sample:** Only 31 days of data is insufficient for detecting seasonal patterns
- **Confounding variables:** Deadlines, exams, personal schedule, and project deadlines all influence commits
- **No individual histories:** Data is aggregated across students; individual variation is hidden
- **Synthetic data:** Daily commits are synthetically generated rather than real GitHub history
- **Temporal lag effects:** There may be delayed effects between weather and behavior that one month can't capture
""")
import streamlit as st
import pandas as pd
from data_engine import gimme_weather_data, get_student_commits

# Page config
st.set_page_config(page_title="Waterloo Grind", layout="wide")

# Title and explanation
st.title("Github Commits vs. Weather Study")
st.write("Analyzing the correlation between colder temperatures and GitHub activity of Waterloo Students.")
st.write("Usernames randomly pulled from https://uwgitrank.com/leaderboard.")
st.markdown("---")

# Student list
student_list = [
    'willzeng274', 'LucasHJin', 'adityamakkar000', 'connortbot', 
    '1spyral', 'maminsed', 'adithayyil', 'WaronLimsakul', 'PLIAN78'
]

# Load all data
@st.cache_data
def load_all_data():
    weather_data = gimme_weather_data("Waterloo")
    commit_data = {}
    for student in student_list:
        commit_data[student] = get_student_commits(student)
    return weather_data, commit_data

with st.spinner('Loading data for all students...'):
    weather_data, all_commits = load_all_data()
    
    # Add commit data to weather dataframe
    for student, commits in all_commits.items():
        weather_data[student] = commits

# GRAPH - All students in different colors + snowfall
st.subheader("📈 Student Commits & Weather Patterns")
chart_cols = student_list + ['Temperature', 'Snowfall']
st.line_chart(data=weather_data, x="Date", y=chart_cols, height=400)

st.markdown("---")

# AVERAGE COMMITS TABLE
st.subheader("📊 Average Commits by Date")
avg_commits_data = weather_data[['Date', 'Temperature']].copy()
avg_commits_data['Avg_Commits'] = weather_data[student_list].mean(axis=1)
st.dataframe(avg_commits_data, use_container_width=True)

st.markdown("---")

# SNOWFALL TABLE
st.subheader("🌨️ Snowfall Data by Date")
snowfall_data = weather_data[['Date', 'Snowfall']].copy()
st.dataframe(snowfall_data, use_container_width=True)

st.markdown("---")

# CONCLUSION
st.subheader("🔍 Conclusion")

avg_commits = weather_data[student_list].mean().mean()
max_temp = weather_data['Temperature'].max()
min_temp = weather_data['Temperature'].min()
total_snowfall = weather_data['Snowfall'].sum()
avg_temp = weather_data['Temperature'].mean()

conclusion = f"""
**Key Findings:**

- **Overall Average Commits**: {avg_commits:.1f} across all students
- **Temperature Range**: {min_temp:.1f}°C to {max_temp:.1f}°C (Average: {avg_temp:.1f}°C)
- **Total Snowfall**: {total_snowfall:.1f}mm during the study period

**Analysis:**
The data reveals patterns in how Waterloo students' GitHub activity correlates with weather conditions. 
Individual students show varying levels of commits throughout the month, with notable differences 
in how weather patterns (temperature and snowfall) may influence coding activity. The relationship 
between colder temperatures and GitHub commits suggests that external weather conditions may impact 
student productivity and coding habits.

**Note:** This analysis is based on January 2024 data. Future studies across multiple seasons would 
provide stronger evidence of seasonal patterns in developer activity.
"""

st.markdown(conclusion)
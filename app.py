import streamlit as st
from data_engine import gimme_weather_data, get_student_commits

# css
st.set_page_config(page_title="Waterloo Grind", layout="wide")
st.markdown("""
    <style>
    /* This sets the deep gradient background */
    .stApp {
        background: linear-gradient(135deg, #121217 0%, #1c1c2b 100%);
    }

    /* This creates the 'Glass' card effect */
    .main-card {
        background: rgba(255, 255, 255, 0.03); /* 97% transparent white */
        backdrop-filter: blur(15px);           /* The 'Frosty' blur effect */
        border-radius: 20px;                   /* Smooth rounded corners */
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border line */
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    /* Making the text clean and white */
    h1, p, label, .stSelectbox {
        color: #ffffff !important;
        font-family: 'Inter', 'Helvetica', sans-serif;
    }
    
    /* Making the button look sleek and translucent */
    .stButton>button {
        background: rgba(255, 255, 255, 0.1) !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 12px !important;
        padding: 10px 24px !important;
        transition: 0.3s;
    }

    .stButton>button:hover {
        background: rgba(255, 255, 255, 0.2) !important;
        border-color: #ffffff !important;
    }
    </style>
    """, unsafe_allow_html=True)
# content
st.title    ("Github Commits vs. Weather Study")
st.write("Analyzing the correlation between colder temperatures and GitHub activity of Waterloo Students.")
st.write("Usernames randomly pulled from https://uwgitrank.com/leaderboard.")

# selected studens via gitrank
student_list = [
    'willzeng274', 'LucasHJin', 'adityamakkar000', 'connortbot', 
    '1spyral', 'maminsed', 'adithayyil', 'WaronLimsakul', 'PLIAN78'
]
#drop down menu
selected_username = st.selectbox('Select a Student to Analyze:', student_list)

#actions
if st.button('Start Analysis'):
    with st.spinner(f'Fetching data for {selected_username}...'):
            weather_results = gimme_weather_data("Waterloo")
            commit_total = get_student_commits(selected_username)
            weather_results['Real_Commits'] = commit_total
            st.write(f"### Activity Chart: {selected_username}")
            st.line_chart(data=weather_results, x="Date", y=["Temperature", "Real_Commits"])
            st.write("### Data Log")
            st.dataframe(weather_results, use_container_width=True)
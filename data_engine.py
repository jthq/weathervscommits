import pandas as obeah
import requests as req
import streamlit as sl

def gimme_weather_data(wloo):
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude=43.46&longitude=-80.52&start_date=2024-01-01&end_date=2024-01-31&daily=temperature_2m_max,precipitation_sum&timezone=America%2FNew_York"

    # sending envelope to API
    api_delivery = req.get(url)
    # API gets mail
    unpacked_data = api_delivery.json()
    # Unpacking the mail ^
    weather_table = obeah.DataFrame(unpacked_data['daily']) # hi
    # makes a table with the data ^^^^

    # names r tedious so we gotta rename them
    weather_table = weather_table.rename(columns={
        'time': 'Date',
        'temperature_2m_max': 'Temperature',
        'precipitation_sum': 'Snowfall'
    })
    return weather_table

def get_student_commits(username):
    """Fetch total commit count for a GitHub user."""
    url = f"https://api.github.com/users/{username}"
    response = req.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('public_repos', 0)
    return 0

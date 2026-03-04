from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data_engine import gimme_weather_data, get_student_commits

app = Flask(__name__)
CORS(app)

student_list = [
    'willzeng274', 'LucasHJin', 'adityamakkar000', 'connortbot', 
    '1spyral', 'maminsed', 'adithayyil', 'WaronLimsakul', 'PLIAN78'
]

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        print("Fetching weather data...")
        weather_data = gimme_weather_data("Waterloo")
        print(f"Weather data shape: {weather_data.shape}")
        print(f"Weather columns: {weather_data.columns.tolist()}")
        
        # Generate synthetic daily commit data per student
        print("Generating commit data...")
        np.random.seed(42)  # for reproducibility
        for student in student_list:
            # Create daily commit data that varies (0-8 commits per day)
            daily_commits = np.random.randint(0, 8, size=len(weather_data))
            weather_data[student] = daily_commits
            print(f"{student}: generated {len(daily_commits)} days of data")
        
        # Convert to dict format for JSON
        data = {
            'dates': weather_data['Date'].astype(str).tolist(),
            'temperature': weather_data['Temperature'].astype(float).tolist(),
            'snowfall': weather_data['Snowfall'].astype(float).tolist(),
            'students': {}
        }
        
        for student in student_list:
            data['students'][student] = weather_data[student].astype(float).tolist()
        
        print("Data prepared successfully")
        return jsonify(data)
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        weather_data = gimme_weather_data("Waterloo")
        
        # Generate synthetic daily commit data per student
        np.random.seed(42)  # for reproducibility
        for student in student_list:
            daily_commits = np.random.randint(0, 8, size=len(weather_data))
            weather_data[student] = daily_commits
        
        stats = {
            'avg_temp': float(weather_data['Temperature'].mean()),
            'max_temp': float(weather_data['Temperature'].max()),
            'min_temp': float(weather_data['Temperature'].min()),
            'total_snowfall': float(weather_data['Snowfall'].sum()),
            'avg_commits': float(weather_data[student_list].mean().mean())
        }
        
        return jsonify(stats)
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

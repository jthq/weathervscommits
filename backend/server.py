from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sys
import os
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
        weather_data = gimme_weather_data("Waterloo")
        commit_data = {}
        
        for student in student_list:
            commit_data[student] = get_student_commits(student)
        
        # Convert to dict format for JSON
        data = {
            'dates': weather_data['Date'].tolist(),
            'temperature': weather_data['Temperature'].tolist(),
            'snowfall': weather_data['Snowfall'].tolist(),
            'students': {}
        }
        
        for student in student_list:
            data['students'][student] = weather_data[student].tolist()
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        weather_data = gimme_weather_data("Waterloo")
        commit_data = {}
        
        for student in student_list:
            commit_data[student] = get_student_commits(student)
        
        for student, commits in commit_data.items():
            weather_data[student] = commits
        
        avg_commits_per_day = []
        for student_list_local in student_list:
            avg_commits_per_day.append(weather_data[student_list_local].mean())
        
        stats = {
            'avg_temp': float(weather_data['Temperature'].mean()),
            'max_temp': float(weather_data['Temperature'].max()),
            'min_temp': float(weather_data['Temperature'].min()),
            'total_snowfall': float(weather_data['Snowfall'].sum()),
            'avg_commits': float(sum(avg_commits_per_day) / len(avg_commits_per_day))
        }
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

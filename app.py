from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
from points_calculator import calculate_points
from badges import SKILL_BADGES_LIST, CLOUD_DIGITAL_LEADER_BADGES

app = Flask(__name__)

def fetch_data(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract user name
    name_element = soup.find('h1', class_='ql-display-small')
    user_name = name_element.get_text(strip=True) if name_element else 'Unknown User'

    # Initialize categories
    game_trivia = []
    level_games = []
    skill_badges = []
    cloud_digital_leader = []

    badges = soup.find_all('div', class_='profile-badge')

    for badge in badges:
        title = badge.find('span', class_='ql-title-medium').get_text(strip=True)
        image_src = badge.find('img')['src']
        earned_date = badge.find('span', class_='ql-body-medium').get_text(strip=True)
        
        # Normalize title
        normalized_title = title.lower().strip()

        # Categorize based on title
        if "the arcade trivia" in normalized_title:
            game_trivia.append({'title': title, 'image': image_src, 'date': earned_date})
        elif "level" in normalized_title or "the arcade base camp" in normalized_title or "the arcade certification zone" in normalized_title:
            level_games.append({'title': title, 'image': image_src, 'date': earned_date})
        elif normalized_title in [badge.lower().strip() for badge in SKILL_BADGES_LIST]:
            skill_badges.append({'title': title, 'image': image_src, 'date': earned_date})
        elif normalized_title in [badge.lower().strip() for badge in CLOUD_DIGITAL_LEADER_BADGES]:
            cloud_digital_leader.append({'title': title, 'image': image_src, 'date': earned_date})

    # Calculate points
    points = calculate_points(skill_badges, game_trivia, level_games, len(cloud_digital_leader)-1)

    # Count badges
    return {
        'user_name': user_name,
        'game_trivia': game_trivia,
        'level_games': level_games,
        'skill_badges': skill_badges,
        'cloud_digital_leader': cloud_digital_leader,
        'badge_counts': {
            'game_trivia_count': len(game_trivia),
            'level_games_count': len(level_games),
            'skill_badges_count': len(skill_badges),
            'cloud_digital_leader_count': len(cloud_digital_leader),
            'total_badges': len(game_trivia) + len(level_games) + len(skill_badges) + len(cloud_digital_leader)
        },
        'points': points
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        if profile_url:
            data = fetch_data(profile_url)
        else:
            data = {
                'user_name': 'Unknown User',
                'game_trivia': [],
                'level_games': [],
                'skill_badges': [],
                'cloud_digital_leader': [],
                'badge_counts': {
                    'game_trivia_count': 0,
                    'level_games_count': 0,
                    'skill_badges_count': 0,
                    'cloud_digital_leader_count': 0,
                    'total_badges': 0
                },
                'points': {
                    'total_points': 0,
                    'game_trivia_points': 0,
                    'level_games_points': 0,
                    'skill_badges_points': 0,
                    'cloud_digital_leader_points': 0
                }
            }
    else:
        data = {
            'user_name': 'Unknown User',
            'game_trivia': [],
            'level_games': [],
            'skill_badges': [],
            'cloud_digital_leader': [],
            'badge_counts': {
                'game_trivia_count': 0,
                'level_games_count': 0,
                'skill_badges_count': 0,
                'cloud_digital_leader_count': 0,
                'total_badges': 0
            },
            'points': {
                'total_points': 0,
                'game_trivia_points': 0,
                'level_games_points': 0,
                'skill_badges_points': 0,
                'cloud_digital_leader_points': 0
            }
        }
    
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)

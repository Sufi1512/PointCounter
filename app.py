from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
from points_calculator import calculate_points
from badges import SKILL_BADGES_LIST, CLOUD_DIGITAL_LEADER_BADGES

app = Flask(__name__)

def fetch_data(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract user name
        name_element = soup.find('h1', class_='ql-display-small')
        user_name = name_element.get_text(strip=True) if name_element else 'Unknown User'

        # Initialize categories
        categories = {
            'game_trivia': [],
            'level_games': [],
            'skill_badges': [],
            'cloud_digital_leader': []
        }

        badges = soup.find_all('div', class_='profile-badge')

        for badge in badges:
            title = badge.find('span', class_='ql-title-medium').get_text(strip=True)
            image_src = badge.find('img')['src']
            earned_date = badge.find('span', class_='ql-body-medium').get_text(strip=True)
            
            # Normalize title
            normalized_title = title.lower().strip()

            # Categorize based on title
            if "the arcade trivia" in normalized_title:
                categories['game_trivia'].append({'title': title, 'image': image_src, 'date': earned_date})
            elif any(keyword in normalized_title for keyword in ["level", "the arcade base camp", "the arcade certification zone"]):
                categories['level_games'].append({'title': title, 'image': image_src, 'date': earned_date})
            elif normalized_title in [badge.lower().strip() for badge in SKILL_BADGES_LIST]:
                categories['skill_badges'].append({'title': title, 'image': image_src, 'date': earned_date})
            elif normalized_title in [badge.lower().strip() for badge in CLOUD_DIGITAL_LEADER_BADGES]:
                categories['cloud_digital_leader'].append({'title': title, 'image': image_src, 'date': earned_date})

        # Calculate points
        points = calculate_points(categories['skill_badges'], categories['game_trivia'], 
                                  categories['level_games'], len(categories['cloud_digital_leader'])-1)

        # Count badges
        badge_counts = {f"{key}_count": len(value) for key, value in categories.items()}
        badge_counts['total_badges'] = sum(badge_counts.values())

        return {
            'user_name': user_name,
            **categories,
            'badge_counts': badge_counts,
            'points': points
        }
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return get_default_data()

def get_default_data():
    return {
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

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        data = fetch_data(profile_url) if profile_url else get_default_data()
    else:
        data = get_default_data()
    
    return render_template('index.html', data=data)

@app.route('/about', methods=['GET', 'POST'])
def about():
    if request.method == 'POST':
        # Process form data here
        form_data = request.form.get('some_field')
        # Do something with the data
        return render_template('about.html', form_data=form_data)
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)

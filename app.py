from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
from points_calculator import calculate_points
from badges import SKILL_BADGES_LIST, CLOUD_DIGITAL_LEADER_BADGES
from datetime import datetime

app = Flask(__name__)

# Define date ranges for filtering badges
DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 12, 31).date())
SPECIAL_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 7, 31).date())

def parse_date(date_str):
    if date_str is None:
        return None
    
    try:
        # Remove the "Earned " prefix and potential suffixes like " EDT" or " EST"
        date_str = date_str.replace('Earned ', '').replace(' EDT', '').replace(' EST', '')
        # Parse the date string to a datetime object
        return datetime.strptime(date_str, '%b %d, %Y').date()
    except ValueError:
        return None

def filter_badges_by_date(badges, date_range):
    start_date, end_date = date_range
    filtered_badges = []
    for badge in badges:
        earned_date = parse_date(badge.get('date'))
        if earned_date and start_date <= earned_date <= end_date:
            filtered_badges.append(badge)
    return filtered_badges

def fetch_data(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract user name
        name_element = soup.find('h1', class_='ql-display-small')
        user_name = name_element.get_text(strip=True) if name_element else 'Arcade User'

        # Initialize categories
        categories = {
            'game_trivia': [],
            'level_games': [],
            'skill_badges': [],
            'cloud_digital_leader': [],
            'flash_games': []
        }

        badges = soup.find_all('div', class_='profile-badge')

        for badge in badges:
            title = badge.find('span', class_='ql-title-medium').get_text(strip=True)
            image_src = badge.find('img')['src']
            earned_date = badge.find('span', class_='ql-body-medium').get_text(strip=True)
            
            # Normalize title
            normalized_title = title.lower().strip()

            # Categorize based on title
            badge_info = {'title': title, 'image': image_src, 'date': earned_date}
            if "the arcade trivia" in normalized_title:
                categories['game_trivia'].append(badge_info)
            elif any(keyword in normalized_title for keyword in ["level", "the arcade base camp",]):
                categories['level_games'].append(badge_info)
            elif normalized_title in [badge.lower().strip() for badge in SKILL_BADGES_LIST]:
                categories['skill_badges'].append(badge_info)
            elif normalized_title in [badge.lower().strip() for badge in CLOUD_DIGITAL_LEADER_BADGES]:
                categories['cloud_digital_leader'].append(badge_info)
            elif any(keyword in normalized_title for keyword in ["the arcade-athon", "the arcade certification zone"]):
                categories['flash_games'].append(badge_info)

        # Filter badges by date
        categories['skill_badges'] = filter_badges_by_date(categories['skill_badges'], DATE_RANGE)
        categories['game_trivia'] = filter_badges_by_date(categories['game_trivia'], DATE_RANGE)
        categories['level_games'] = filter_badges_by_date(categories['level_games'], DATE_RANGE)
        categories['flash_games'] = filter_badges_by_date(categories['flash_games'], DATE_RANGE)
        
        # Calculate points
        points = calculate_points(categories['skill_badges'], categories['game_trivia'], 
                                  categories['level_games'], len(categories['cloud_digital_leader'])-1, categories['flash_games'])

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
        'user_name': 'Arcade User',
        'game_trivia': [],
        'level_games': [],
        'flash_games': [],
        'skill_badges': [],
        'cloud_digital_leader': [],
        'badge_counts': {
            'game_trivia_count': 0,
            'level_games_count': 0,
            'skill_badges_count': 0,
            'cloud_digital_leader_count': 0,
            'flash_games_count': 0,
            'total_badges': 0
        },
        'points': {
            'total_points': 0,
            'game_trivia_points': 0,
            'flash_games_points': 0,
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

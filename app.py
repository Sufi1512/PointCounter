from flask import Flask, render_template, request, redirect, url_for
import requests
from bs4 import BeautifulSoup
from points_calculator import calculate_points
from badges import SKILL_BADGES_LIST, CLOUD_DIGITAL_LEADER_BADGES, Arcade_Classroom
from datetime import datetime

app = Flask(__name__)

# Define date ranges for filtering badges
DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 12, 31).date())
SPECIAL_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 7, 31).date())

def parse_date(date_str):
    if date_str is None:
        return None
    try:
        date_str = date_str.replace('Earned ', '').replace(' EDT', '').replace(' EST', '')
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

        # Extract avatar URL
        avatar_element = soup.find('ql-avatar', class_='profile-avatar')
        avatar_url = avatar_element['src'] if avatar_element and 'src' in avatar_element.attrs else url_for('static', filename='default_avatar.png')

        # Initialize categories
        categories = {
            'game_trivia': [],
            'level_games': [],
            'skill_badges': [],
            'cloud_digital_leader': [],
            'flash_games': [],
            'arcade_classroom': [],
        }

        badges = soup.find_all('div', class_='profile-badge')

        for badge in badges:
            title = badge.find('span', class_='ql-title-medium').get_text(strip=True)
            image_src = badge.find('img')['src']
            earned_date = badge.find('span', class_='ql-body-medium').get_text(strip=True)

            # Normalize title
            normalized_title = title.lower().strip()
            badge_info = {'title': title, 'image': image_src, 'date': earned_date}

            # Calculate points for this badge
            if "the arcade trivia" in normalized_title:
                badge_info['points'] = 1
                categories['game_trivia'].append(badge_info)
            elif any(keyword in normalized_title for keyword in ["level", "the arcade base camp"]):
                badge_info['points'] = 1
                categories['level_games'].append(badge_info)
            elif normalized_title in [badge.lower().strip() for badge in SKILL_BADGES_LIST]:
                earned_date_parsed = parse_date(earned_date)
                if earned_date_parsed and SPECIAL_DATE_RANGE[0] <= earned_date_parsed <= SPECIAL_DATE_RANGE[1]:
                    badge_info['points'] = 1  # Special bonus
                else:
                    badge_info['points'] = 0.5  # Normal skill badge
                categories['skill_badges'].append(badge_info)
            elif normalized_title in [badge.lower().strip() for badge in CLOUD_DIGITAL_LEADER_BADGES]:
                badge_info['points'] = 0
                categories['cloud_digital_leader'].append(badge_info)
            elif normalized_title in [badge.lower().strip() for badge in Arcade_Classroom]:
                badge_info['points'] = 0
                categories['arcade_classroom'].append(badge_info)
            elif any(keyword in normalized_title for keyword in ["the arcade-athon", "the arcade certification zone", "arcade explorers", "trick-or-skills", "diwali in the arcade", "arcade snowdown"]):
                if 'the arcade certification zone' in normalized_title:
                    badge_info['points'] = 1
                else:
                    badge_info['points'] = 2
                categories['flash_games'].append(badge_info)
            else:
                badge_info['points'] = 0

        # Filter badges by date
        categories['skill_badges'] = filter_badges_by_date(categories['skill_badges'], DATE_RANGE)
        categories['game_trivia'] = filter_badges_by_date(categories['game_trivia'], DATE_RANGE)
        categories['level_games'] = filter_badges_by_date(categories['level_games'], DATE_RANGE)
        categories['flash_games'] = filter_badges_by_date(categories['flash_games'], DATE_RANGE)

        # Calculate points
        points = calculate_points(categories['skill_badges'], categories['game_trivia'], 
                                  categories['level_games'], len(categories['cloud_digital_leader']) - 1, 
                                  categories['flash_games'], len(categories['arcade_classroom']) / 2)

        # Count badges
        badge_counts = {f"{key}_count": len(value) for key, value in categories.items()}
        badge_counts['total_badges'] = sum(badge_counts.values())

        return {
            'user_name': user_name,
            'avatar_url': avatar_url,
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
        'avatar_url': url_for('static', filename='default_avatar.png'),
        'game_trivia': [],
        'level_games': [],
        'flash_games': [],
        'skill_badges': [],
        'cloud_digital_leader': [],
        'arcade_classroom': [],
        'badge_counts': {
            'game_trivia_count': 0,
            'level_games_count': 0,
            'skill_badges_count': 0,
            'cloud_digital_leader_count': 0,
            'arcade_classroom_count': 0,
            'flash_games_count': 0,
            'total_badges': 0
        },
        'points': {
            'total_points': 0,
            'game_trivia_points': 0,
            'flash_games_points': 0,
            'level_games_points': 0,
            'skill_badges_points': 0,
            'cloud_digital_leader_points': 0,
            'arcade_classroom_points': 0,
            'special_skill_badges_points': 0,
            'normal_skill_badges_points': 0,
            'special_badges_count': 0,
            'normal_badges_count': 0,
            'flash_games_count': 0,
            'milestone': "No Milestone Achieved",
            'milestone_bonus': 0,
        }
    }

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        data = fetch_data(profile_url) if profile_url else get_default_data()
        return redirect(url_for('dashboard', profile_url=profile_url))
    return render_template('landing.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    cohort_active = True
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        data = fetch_data(profile_url) if profile_url and cohort_active else get_default_data()
        return render_template('dashboard.html', data=data, cohort_active=cohort_active)
    elif request.method == 'GET':
        profile_url = request.args.get('profile_url')
        if profile_url:
            data = fetch_data(profile_url) if cohort_active else get_default_data()
            return render_template('dashboard.html', data=data, cohort_active=cohort_active)
        return redirect(url_for('index'))

@app.route('/about', methods=['GET', 'POST'])
def about():
    if request.method == 'POST':
        form_data = request.form.get('some_field')
        return render_template('about.html', form_data=form_data)
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
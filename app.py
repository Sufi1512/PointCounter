from flask import Flask, render_template, request, redirect, url_for
import requests
from bs4 import BeautifulSoup
from points_calculator import calculate_points, LAB_FREE_COURSES
from badges import SKILL_BADGES_LIST
from datetime import datetime
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Define date range for the new cohort (update for July–December 2025 as per your milestones)
DATE_RANGE = (datetime(2025, 7, 1).date(), datetime(2025, 12, 31).date())


def parse_date(date_str):
    if date_str is None:
        return None
    try:
        date_str = date_str.replace('Earned ', '').replace(
            ' EDT', '').replace(' EST', '')
        return datetime.strptime(date_str, '%b %d, %Y').date()
    except ValueError:
        app.logger.error(f"Failed to parse date: {date_str}")
        return None


def filter_badges_by_date(badges, date_range):
    start_date, end_date = date_range
    filtered_badges = []
    for badge in badges:
        earned_date = parse_date(badge.get('date'))
        app.logger.debug(
            f"Badge '{badge.get('title')}' earned on: {earned_date}")
        if earned_date and start_date <= earned_date <= end_date:
            filtered_badges.append(badge)
        elif not earned_date:
            app.logger.warning(
                f"Badge '{badge.get('title')}' has invalid date: {badge.get('date')}")
        else:
            app.logger.debug(
                f"Badge '{badge.get('title')}' filtered out (outside {start_date} - {end_date})")
    return filtered_badges


def fetch_data(url, is_facilitator=False):
    try:
        response = requests.get(url, timeout=25)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract user name
        name_element = soup.find('h1', class_='ql-display-small')
        user_name = name_element.get_text(
            strip=True) if name_element else 'Arcade User'

        # Extract avatar URL
        avatar_element = soup.find('ql-avatar', class_='profile-avatar')
        avatar_url = avatar_element['src'] if avatar_element and 'src' in avatar_element.attrs else url_for(
            'static', filename='default_avatar.png')

        # Initialize categories
        categories = {
            'game_trivia': [],
            'level_games': [],
            'skill_badges': [],
            'flash_games': [],
            'lab_free_courses': [],
        }

        badges = soup.find_all('div', class_='profile-badge')
        app.logger.debug(f"Total badges found: {len(badges)}")

        for badge in badges:
            title = badge.find(
                'span', class_='ql-title-medium').get_text(strip=True)
            image_src = badge.find('img')['src']
            earned_date = badge.find(
                'span', class_='ql-body-medium').get_text(strip=True)

            normalized_title = title.lower().strip()
            badge_info = {'title': title,
                          'image': image_src, 'date': earned_date}
            app.logger.debug(
                f"Processing badge: {title} (normalized: {normalized_title})")

            # Special games (2 points each)
            if any(keyword in normalized_title for keyword in [
                "extraskillestrial",
                "arcade techcare",
                "arcade networskills",
                "arcade explorers",
                "trick-or-skills",
                "diwali in the arcade",
                "arcade snowdown",
                "future ready skills",  # Added new special game
                "skills scribble",
            ]):
                badge_info['points'] = 2
                categories['flash_games'].append(badge_info)
                app.logger.debug(
                    f"Categorized as flash_games (special game, 2 points): {title}")
            # Regular categories
            elif any(keyword in normalized_title for keyword in ["trivia", "the arcade trivia", "arcade trivia", "trivia game", "trivia challenge"]):
                badge_info['points'] = 1
                categories['game_trivia'].append(badge_info)
                app.logger.debug(f"Categorized as game_trivia: {title}")
            # Updated to include "base camp"
            elif any(keyword in normalized_title for keyword in ["level", "base camp"]):
                badge_info['points'] = 1
                categories['level_games'].append(badge_info)
                app.logger.debug(f"Categorized as level_games: {title}")
            elif normalized_title in [badge.lower().strip() for badge in SKILL_BADGES_LIST]:
                badge_info['points'] = 0.5
                categories['skill_badges'].append(badge_info)
                app.logger.debug(f"Categorized as skill_badges: {title}")
            elif normalized_title in [course.lower().strip() for course in LAB_FREE_COURSES]:
                badge_info['points'] = 0
                categories['lab_free_courses'].append(badge_info)
                app.logger.debug(f"Categorized as lab_free_courses: {title}")
            elif "arcade certification zone" in normalized_title:
                badge_info['points'] = 1
                categories['flash_games'].append(badge_info)
                app.logger.debug(
                    f"Categorized as flash_games (cert zone): {title}")
            else:
                app.logger.debug(f"Badge not categorized: {title}")

        # Filter badges by date
        for category in categories:
            app.logger.debug(
                f"Before filtering {category}: {categories[category]}")
            categories[category] = filter_badges_by_date(
                categories[category], DATE_RANGE)
            app.logger.debug(
                f"After filtering {category}: {categories[category]}")

        # Calculate points
        points = calculate_points(
            categories['skill_badges'],
            categories['game_trivia'],
            categories['level_games'],
            categories['flash_games'],
            categories['lab_free_courses'],
            is_facilitator=is_facilitator
        )

        badge_counts = {f"{key}_count": len(value)
                        for key, value in categories.items()}

        # --- FIX: Unique badge counting ---
        unique_badge_keys = set()
        for cat_list in categories.values():
            for badge in cat_list:
                # Using (title, date) as a unique identifier
                unique_badge_keys.add((badge['title'], badge.get('date', '')))
        badge_counts['total_badges'] = len(unique_badge_keys)
        # --- END FIX ---

        return {
            'user_name': user_name,
            'avatar_url': avatar_url,
            **categories,
            'badge_counts': badge_counts,
            'points': points,
            'is_facilitator': is_facilitator,
            'public_profile_url': url,
        }
    except requests.RequestException as e:
        app.logger.error(f"Error fetching data: {e}")
        return get_default_data()


def get_default_data():
    return {
        'user_name': 'Arcade User',
        'avatar_url': url_for('static', filename='default_avatar.png'),
        'game_trivia': [],
        'level_games': [],
        'skill_badges': [],
        'flash_games': [],
        'lab_free_courses': [],
        'badge_counts': {
            'game_trivia_count': 0,
            'level_games_count': 0,
            'skill_badges_count': 0,
            'flash_games_count': 0,
            'lab_free_courses_count': 0,
            'total_badges': 0
        },
        'points': {
            'game_points': 0,
            'game_trivia_points': 0,
            'skill_badges_points': 0,
            'lab_free_count': 0,
            'special_game_count': 0,
            'milestone': "No Milestone Achieved",
            'milestone_bonus': 0,
            'facilitator_bonus': 0,
            'total_points': 0
        },
        'is_facilitator': False
    }


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        is_facilitator = request.form.get('is_facilitator') == 'yes'
        if profile_url:
            return redirect(url_for('dashboard', profile_url=profile_url, is_facilitator='yes' if is_facilitator else 'no'))
    return render_template('landing.html')


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    cohort_active = True
    if request.method == 'POST':
        profile_url = request.form.get('profile_url')
        is_facilitator = request.form.get('is_facilitator') == 'yes'
        data = fetch_data(
            profile_url, is_facilitator) if profile_url and cohort_active else get_default_data()
        return render_template('dashboard.html', data=data, cohort_active=cohort_active)
    elif request.method == 'GET':
        profile_url = request.args.get('profile_url')
        is_facilitator = request.args.get('is_facilitator') == 'yes'
        if profile_url:
            data = fetch_data(
                profile_url, is_facilitator) if cohort_active else get_default_data()
            return render_template('dashboard.html', data=data, cohort_active=cohort_active)
        return redirect(url_for('index'))
    return redirect(url_for('index'))


@app.route('/about')
def about():
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True)

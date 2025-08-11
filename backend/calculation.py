from datetime import datetime

# Define date ranges for the new cohort (July-December 2025)
DATE_RANGE = (datetime(2025, 7, 1).date(), datetime(2025, 12, 31).date())
FACILITATOR_DATE_RANGE = (datetime(2025, 8, 4).date(), datetime(2025, 10, 6).date())
SPECIAL_DATE_RANGE = (datetime(2025, 7, 1).date(), datetime(2025, 7, 15).date())

# Lab-free courses list
LAB_FREE_COURSES = [
    'Responsible AI: Applying AI Principles with Google Cloud',
    'Responsible AI for Digital Leaders with Google Cloud',
    'Customer Experience with Google AI Architecture',
    'Machine Learning Operations (MLOps) with Vertex AI: Model Evaluation',
    'Conversational AI on Vertex AI and Dialogflow CX',
    'Building Complex End to End Self-Service Experiences in Dialogflow CX',
    'Google Drive', 'Google Docs', 'Google Slides', 'Google Meet', 'Google Sheets', 'Google Calendar',
    'Digital Transformation with Google Cloud', 'Exploring Data Transformation with Google Cloud',
    'Infrastructure and Application Modernization with Google Cloud', 'Scaling with Google Cloud Operations',
    'Innovating with Google Cloud Artificial Intelligence', 'Trust and Security with Google Cloud'
]

def parse_date(date_str):
    if date_str is None:
        return None
    try:
        date_str = date_str.replace('Earned ', '').replace(' EDT', '').replace(' EST', '')
        return datetime.strptime(date_str, '%b %d, %Y').date()
    except ValueError:
        print(f"Failed to parse date: {date_str}")

def filter_badges_by_date(badges, date_range):
    start_date, end_date = date_range
    return [badge for badge in badges if (parse_date(badge.get('date')) and start_date <= parse_date(badge.get('date')) <= end_date)]

def calculate_points(skill_badges, game_trivia, level_games, flash_games, lab_free_courses, is_facilitator=False):
    skill_badges = filter_badges_by_date(skill_badges, DATE_RANGE)
    game_trivia = filter_badges_by_date(game_trivia, DATE_RANGE)
    level_games = filter_badges_by_date(level_games, DATE_RANGE)
    flash_games = filter_badges_by_date(flash_games, DATE_RANGE)
    lab_free_courses = filter_badges_by_date(lab_free_courses, DATE_RANGE)

    all_games = level_games + flash_games
    game_trivia_points = len(game_trivia)

    special_skill_badges_points = normal_skill_badges_points = 0
    special_skill_badges_count = normal_skill_badges_count = 0
    game_points = special_game_count = 0

    for badge in skill_badges:
        earned_date = parse_date(badge.get('date'))
        if earned_date:
            if SPECIAL_DATE_RANGE[0] <= earned_date <= SPECIAL_DATE_RANGE[1]:
                special_skill_badges_points += 1
                special_skill_badges_count += 1
            else:
                normal_skill_badges_points += 0.5
                normal_skill_badges_count += 1

    skill_badges_points = special_skill_badges_points + normal_skill_badges_points

    special_games = [
        "the arcade-athon", "arcade networkskills", "arcade explorers",
        "trick-or-skills", "diwali in the arcade", "arcade snowdown", "techcare", "ExtraSkillestrial!"
    ]

    for badge in all_games:
        title = badge.get('title', '')
        if any(keyword.lower() == title.lower() or keyword.lower() in title.lower() for keyword in special_games):
            game_points += 2
            special_game_count += 1
        else:
            game_points += 1

    milestones = [
        {"milestone": "Ultimate Milestone", "bonus": 25, "level_games": 12, "game_trivia": 8, "skill_badges": 52, "lab_free": 24},
        {"milestone": "Milestone 3", "bonus": 15, "level_games": 10, "game_trivia": 7, "skill_badges": 38, "lab_free": 18},
        {"milestone": "Milestone 2", "bonus": 8, "level_games": 8, "game_trivia": 6, "skill_badges": 28, "lab_free": 12},
        {"milestone": "Milestone 1", "bonus": 2, "level_games": 6, "game_trivia": 5, "skill_badges": 14, "lab_free": 6}
    ]

    milestone = "No Milestone Achieved"
    milestone_bonus = facilitator_bonus = 0

    for m in milestones:
        if (len(all_games) >= m["level_games"] and len(game_trivia) >= m["game_trivia"] and
            len(skill_badges) >= m["skill_badges"] and len(lab_free_courses) >= m["lab_free"]):
            milestone = m["milestone"]
            if is_facilitator:
                facilitator_bonus = m["bonus"]
            else:
                milestone_bonus = m["bonus"]
            break

    total_points = game_points + game_trivia_points + skill_badges_points
    total_points += facilitator_bonus if is_facilitator else milestone_bonus

    return {
        'game_points': game_points,
        'game_trivia_points': game_trivia_points,
        'skill_badges_points': skill_badges_points,
        'special_skill_badges_points': special_skill_badges_points,
        'normal_skill_badges_points': normal_skill_badges_points,
        'special_skill_badges_count': special_skill_badges_count,
        'normal_skill_badges_count': normal_skill_badges_count,
        'lab_free_count': len(lab_free_courses),
        'special_game_count': special_game_count,
        'milestone': milestone,
        'milestone_bonus': milestone_bonus,
        'facilitator_bonus': facilitator_bonus,
        'total_points': int(total_points),
    }

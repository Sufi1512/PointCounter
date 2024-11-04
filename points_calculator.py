from datetime import datetime

# Define date ranges
FACILITATOR_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 9, 27).date())  # Facilitator program bonus points range
DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 12, 31).date())  # General badge earning range
SPECIAL_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 7, 31).date())  # Special bonus period

def parse_date(date_str):
    if date_str is None:
        return None
    
    try:
        # Remove the "Earned " prefix and potential suffixes like " EDT" or " EST"
        date_str = date_str.replace('Earned ', '').replace(' EDT', '').replace(' EST', '')
        # Parse the date string to a datetime object
        return datetime.strptime(date_str, '%b %d, %Y').date()
    except ValueError:
        print(f"Failed to parse date: {date_str}")
        return None

def filter_badges_by_date(badges, date_range):
    """
    Filters badges that were earned within the specified date range.
    """
    start_date, end_date = date_range
    filtered_badges = []
    for badge in badges:
        earned_date = parse_date(badge.get('date'))
        if earned_date and start_date <= earned_date <= end_date:
            filtered_badges.append(badge)
    return filtered_badges

def calculate_points(skill_badges, game_trivia, level_games, cloud_digital_leader, flash_games):
    # Filter badges to include only those earned between 22-Jul-2024 and 31-Dec-2024
    skill_badges = filter_badges_by_date(skill_badges, DATE_RANGE)
    game_trivia = filter_badges_by_date(game_trivia, DATE_RANGE)
    level_games = filter_badges_by_date(level_games, DATE_RANGE)
    flash_games = filter_badges_by_date(flash_games, DATE_RANGE)

    # Filter badges within facilitator bonus range
    facilitator_skill_badges = filter_badges_by_date(skill_badges, FACILITATOR_DATE_RANGE)
    facilitator_game_trivia = filter_badges_by_date(game_trivia, FACILITATOR_DATE_RANGE)
    facilitator_level_games = filter_badges_by_date(level_games, FACILITATOR_DATE_RANGE)

    # Initialize points counters
    game_trivia_points = len(game_trivia)
    level_games_points = len(level_games)
    flash_games_points = 0
    special_skill_badges_points = 0
    normal_skill_badges_points = 0
    special_badges_count = 0
    normal_badges_count = 0

    # Calculate flash games points
    for badge in flash_games:
        title = badge.get('title').lower()
        if 'the arcade certification zone' in title:
            flash_games_points += 1
        elif 'the arcade-athon' or 'arcade explorers' or 'trick-or-skills' or 'diwali in the arcade' in title:
            flash_games_points += 2

    # Calculate skill badge points
    for badge in skill_badges:
        earned_date = parse_date(badge.get('date'))
        if earned_date:
            if SPECIAL_DATE_RANGE[0] <= earned_date <= SPECIAL_DATE_RANGE[1]:
                special_skill_badges_points += 1  # Special bonus for skill badges earned in this period
                special_badges_count += 1
            else:
                normal_skill_badges_points += 0.5  # Normal skill badge points
                normal_badges_count += 1

    # Define cases as dictionaries with criteria and corresponding milestone details
    cases = {
        "Criteria 1": [
            {"milestone": "Ultimate Milestone By Criteria 1", "bonus": 25, "level_games": 6, "game_trivia": 8, "skill_badges": 42},
            {"milestone": "Milestone 3 By Criteria 1", "bonus": 15, "level_games": 5, "game_trivia": 6, "skill_badges": 28},
            {"milestone": "Milestone 2 By Criteria 1", "bonus": 9, "level_games": 3, "game_trivia": 4, "skill_badges": 18},
            {"milestone": "Milestone 1 By Criteria 1", "bonus": 2, "level_games": 2, "game_trivia": 2, "skill_badges": 8},
        ],
        "Criteria 2": [
            {"milestone": "Ultimate Milestone By Criteria 2", "bonus": 30, "level_games": 4, "game_trivia": 4, "skill_badges": 44},
            {"milestone": "Milestone 3 By Criteria 2", "bonus": 19, "level_games": 3, "game_trivia": 3, "skill_badges": 30},
            {"milestone": "Milestone 2 By Criteria 2", "bonus": 11, "level_games": 2, "game_trivia": 2, "skill_badges": 20},
            {"milestone": "Milestone 1 By Criteria 2", "bonus": 3, "level_games": 1, "game_trivia": 1, "skill_badges": 10},
        ],
    }

    # Initialize milestone and bonus
    milestone = "No Milestone Achieved"
    milestone_bonus = 0

    # Check each criteria set
    criteria_milestones = []
    for criteria, milestones in cases.items():
        for m in milestones:
            if len(facilitator_level_games) >= m["level_games"] and len(facilitator_game_trivia) >= m["game_trivia"] and len(facilitator_skill_badges) >= m["skill_badges"]:
                # Only badges within the facilitator date range are counted for milestone bonus
                criteria_milestones.append({"criteria": criteria, "milestone": m["milestone"], "bonus": m["bonus"]})
                break  # Stop checking further milestones in this criteria as they are ordered from highest to lowest

    # Determine the highest milestone based on bonus points
    if criteria_milestones:
        highest_milestone = max(criteria_milestones, key=lambda x: x['bonus'])
        milestone = highest_milestone["milestone"]
        milestone_bonus = highest_milestone["bonus"]

    # Calculate total points including milestone bonus
    if cloud_digital_leader < 5:
        cloud_digital_leader = 0

    total_points = (game_trivia_points + level_games_points +
                    int(special_skill_badges_points) + int(normal_skill_badges_points) +
                    cloud_digital_leader + flash_games_points + milestone_bonus)
    
    return {
        'game_trivia_points': game_trivia_points,
        'level_games_points': level_games_points,
        'flash_games_points': flash_games_points,
        'special_skill_badges_points': special_skill_badges_points,
        'normal_skill_badges_points': int(normal_skill_badges_points),  # Convert to integer for consistency
        'special_badges_count': special_badges_count,
        'normal_badges_count': normal_badges_count,
        'cloud_digital_leader_points': cloud_digital_leader,
        'flash_games_count': len(flash_games),
        'milestone': milestone,
        'milestone_bonus': milestone_bonus,
        'total_points': total_points,
    }

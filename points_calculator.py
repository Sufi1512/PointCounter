from datetime import datetime

# Define date range for special points calculation
SPECIAL_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 7, 31).date())

def parse_date(date_str):
    if date_str is None:
        return None
    
    try:
        # Remove the "Earned " prefix and the " EDT" suffix
        date_str = date_str.replace('Earned ', '').replace(' EDT', '')
        # Parse the date string to a datetime object
        return datetime.strptime(date_str, '%b %d, %Y').date()
    except ValueError:
        # Return None if parsing fails
        return None

def calculate_points(skill_badges, game_trivia, level_games, cloud_digital_leader):
    # Initialize points counters
    game_trivia_points = len(game_trivia)
    level_games_points = len(level_games)
    skill_badges_points = 0

    # Calculate skill badge points
    for badge in skill_badges:
        # Convert earned date string to datetime object
        earned_date = parse_date(badge.get('date'))
        if earned_date:
            if SPECIAL_DATE_RANGE[0] <= earned_date <= SPECIAL_DATE_RANGE[1]:
                # Special point rule for skill badges within the date range
                skill_badges_points += 1
            else:
                # Default rule: 1 point for every 2 skill badges
                skill_badges_points += 0.5

    # Calculate total points
    total_points = game_trivia_points + level_games_points + int(skill_badges_points)+cloud_digital_leader
    
    return {
        'game_trivia_points': game_trivia_points,
        'level_games_points': level_games_points,
        'skill_badges_points': int(skill_badges_points), # Convert to integer for consistency
        'cloud_digital_leader_points': cloud_digital_leader,
        'total_points': total_points
    }

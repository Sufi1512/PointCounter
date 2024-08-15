from datetime import datetime
import math

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
    special_skill_badges_points = 0
    normal_skill_badges_points = 0
    special_badges_count = 0
    normal_badges_count = 0
    
    # Calculate skill badge points
    for badge in skill_badges:
        # Convert earned date string to datetime object
        earned_date = parse_date(badge.get('date'))
        if earned_date:
            if SPECIAL_DATE_RANGE[0] <= earned_date <= SPECIAL_DATE_RANGE[1]:
                # Special point rule for skill badges within the date range
                special_skill_badges_points += 1
                special_badges_count += 1
            else:
                # Default rule: 1 point for every 2 skill badges
                normal_skill_badges_points += 0.5
                normal_badges_count += 1
    
    # Floor the normal_skill_badges_points
    normal_skill_badges_points = math.floor(normal_skill_badges_points)
    
    # Calculate total points
    if cloud_digital_leader < 5:
        cloud_digital_leader = 0
    
    total_points = game_trivia_points + level_games_points + int(special_skill_badges_points) + normal_skill_badges_points + cloud_digital_leader
    
    return {
        'game_trivia_points': game_trivia_points,
        'level_games_points': level_games_points,
        'special_skill_badges_points': special_skill_badges_points,
        'normal_skill_badges_points': normal_skill_badges_points,  # Now floored
        'special_badges_count': special_badges_count,
        'normal_badges_count': normal_badges_count,
        'cloud_digital_leader_points': cloud_digital_leader,
        'total_points': total_points
    }
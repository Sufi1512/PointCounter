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

    # Calculate milestone bonus points
    milestone = "No Milestone Achieved"
    milestone_bonus = 0

    if len(level_games) >= 6 and len(game_trivia) >= 8 and len(skill_badges) >= 42:
        # Ultimate Milestone
        milestone = "Ultimate Milestone"
        milestone_bonus = 25
    elif len(level_games) >= 5 and len(game_trivia) >= 6 and len(skill_badges) >= 28:
        # Milestone 3
        milestone = "Milestone 3"
        milestone_bonus = 15
    elif len(level_games) >= 3 and len(game_trivia) >= 4 and len(skill_badges) >= 18:
        # Milestone 2
        milestone = "Milestone 2"
        milestone_bonus = 9
    elif len(level_games) >= 2 and len(game_trivia) >= 2 and len(skill_badges) >= 8:
        # Milestone 1
        milestone = "Milestone 1"
        milestone_bonus = 2

    # Calculate total points including milestone bonus
    if cloud_digital_leader < 5:
        cloud_digital_leader = 0

    total_points = (game_trivia_points + level_games_points +
                    int(special_skill_badges_points) + int(normal_skill_badges_points) +
                    cloud_digital_leader + milestone_bonus)
    
    return {
        'game_trivia_points': game_trivia_points,
        'level_games_points': level_games_points,
        'special_skill_badges_points': special_skill_badges_points,
        'normal_skill_badges_points': int(normal_skill_badges_points), # Convert to integer for consistency
        'special_badges_count': special_badges_count,
        'normal_badges_count': normal_badges_count,
        'cloud_digital_leader_points': cloud_digital_leader,
        'milestone': milestone,
        'milestone_bonus': milestone_bonus,
        'total_points': total_points
    }

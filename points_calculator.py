from datetime import datetime
import math

# Define date range for special points calculation
SPECIAL_DATE_RANGE = (datetime(2024, 7, 22).date(), datetime(2024, 7, 31).date())
CUTOFF_DATE = datetime(2024, 7, 23).date()

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
    badges_after_cutoff = 0
    
    # Flags to check if any badge of each type is earned before cutoff date
    skill_badge_before_cutoff = False
    game_trivia_before_cutoff = False
    level_games_before_cutoff = False

    # Check game trivia badges
    for badge in game_trivia:
        earned_date = parse_date(badge.get('date'))
        if earned_date and earned_date <= CUTOFF_DATE:
            game_trivia_before_cutoff = True
            break

    # Check level games badges
    for badge in level_games:
        earned_date = parse_date(badge.get('date'))
        if earned_date and earned_date <= CUTOFF_DATE:
            level_games_before_cutoff = True
            break

    # Calculate skill badge points
    for badge in skill_badges:
        earned_date = parse_date(badge.get('date'))
        
        if earned_date:
            if earned_date <= CUTOFF_DATE:
                skill_badge_before_cutoff = True
            else:
                badges_after_cutoff += 1
            
            if SPECIAL_DATE_RANGE[0] <= earned_date <= SPECIAL_DATE_RANGE[1]:
                special_skill_badges_points += 1
                special_badges_count += 1
            else:
                normal_skill_badges_points += 0.5
                normal_badges_count += 1
    
    # Set counts to zero if any badge of that type is earned before cutoff date
    if skill_badge_before_cutoff:
        special_skill_badges_points = 0
        normal_skill_badges_points = 0
    if game_trivia_before_cutoff:
        game_trivia_points = 0
    if level_games_before_cutoff:
        level_games_points = 0

    # Floor the normal_skill_badges_points
    normal_skill_badges_points = math.floor(normal_skill_badges_points)
    
    # Calculate total points
    if cloud_digital_leader < 5:
        cloud_digital_leader = 0
    
    total_points = game_trivia_points + level_games_points + int(special_skill_badges_points) + normal_skill_badges_points + cloud_digital_leader
    if total_points < 0:
        total_points = 0

    # Check if no badges were found after the cutoff date
    no_badges_after_cutoff = badges_after_cutoff == 0
    
    return {
        'game_trivia_points': game_trivia_points,
        'level_games_points': level_games_points,
        'special_skill_badges_points': special_skill_badges_points,
        'normal_skill_badges_points': normal_skill_badges_points,
        'special_badges_count': special_badges_count,
        'normal_badges_count': normal_badges_count,
        'cloud_digital_leader_points': cloud_digital_leader,
        'total_points': total_points,
        'badges_after_cutoff': badges_after_cutoff,
        'no_badges_after_cutoff': no_badges_after_cutoff
    }
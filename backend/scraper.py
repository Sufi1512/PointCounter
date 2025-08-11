import requests
from bs4 import BeautifulSoup
from calculation import calculate_points, LAB_FREE_COURSES, DATE_RANGE, filter_badges_by_date
from badges import SKILL_BADGES_LIST
import re

def validate_skillboost_url(url):
    """Validate if the URL is a valid SkillBoost profile URL"""
    # Check if it's a Google avatar URL (invalid)
    if "googleusercontent.com" in url or "lh3.googleusercontent.com" in url:
        return False, "This appears to be a Google avatar image URL, not a SkillBoost profile URL"
    
    # Check if it's a Qwiklabs CDN URL (invalid)
    if "cdn.qwiklabs.com" in url:
        return False, "This appears to be a Qwiklabs CDN image URL, not a SkillBoost profile URL"
    
    # Check if it's a general image URL (invalid)
    if any(ext in url.lower() for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']):
        return False, "This appears to be an image file URL, not a SkillBoost profile URL"
    
    # Check if it's a valid SkillBoost URL
    if "skillboost.withgoogle.com" in url or "skillboost.google.com" in url:
        return True, "Valid SkillBoost URL"
    
    # Check if it's a general URL that might be valid
    if url.startswith(('http://', 'https://')):
        return True, "URL format looks valid, attempting to scrape"
    
    return False, "Invalid URL format. Please provide a complete SkillBoost profile URL"

def scrape_profile(url, is_facilitator=False):
    # Validate URL first
    is_valid, message = validate_skillboost_url(url)
    if not is_valid:
        raise ValueError(f"Invalid URL: {message}")
    
    try:
        response = requests.get(url, timeout=25)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Check if this is actually a SkillBoost profile page
        if not soup.find('div', class_='profile-badge') and not soup.find('h1', class_='ql-display-small'):
            raise ValueError("This URL doesn't appear to be a valid SkillBoost profile page. Please check the URL and ensure it's a public SkillBoost profile.")

        user_name = soup.find('h1', class_='ql-display-small')
        user_name = user_name.get_text(strip=True) if user_name else "Arcade User"
        
        # Look specifically for the user's profile image, not any random image
        avatar_url = ""
        # Try to find the user's profile image - look for the ql-avatar element first
        profile_avatar = soup.find('ql-avatar', class_='profile-avatar')
        if profile_avatar:
            avatar_url = profile_avatar.get('src', '')
        else:
            # Fallback to looking for regular img tags with common patterns
            profile_image = soup.find('img', class_='profile-image') or \
                           soup.find('img', class_='avatar') or \
                           soup.find('img', class_='user-avatar') or \
                           soup.find('img', alt=lambda x: x and 'profile' in x.lower()) or \
                           soup.find('img', alt=lambda x: x and 'avatar' in x.lower())
            
            if profile_image:
                avatar_url = profile_image.get('src', '')
            else:
                # If no specific profile image found, look for the first image that's not a logo/badge
                all_images = soup.find_all('img')
                for img in all_images:
                    src = img.get('src', '')
                    # Skip common logo/badge images
                    if any(skip in src.lower() for skip in ['logo', 'badge', 'qwiklabs', 'cdn.qwiklabs']):
                        continue
                    # Skip very small images (likely icons)
                    if img.get('width') and int(img.get('width', 0)) < 50:
                        continue
                    if img.get('height') and int(img.get('height', 0)) < 50:
                        continue
                    # This might be the profile image
                    avatar_url = src
                    break
                
                # If we still don't have a good image, return empty string instead of random image
                if not avatar_url or any(skip in avatar_url.lower() for skip in ['logo', 'badge', 'qwiklabs', 'cdn.qwiklabs']):
                    avatar_url = ""

        categories = {
            "level_games": [],
            "game_trivia": [],
            "skill_badges": [],
            "flash_games": [],
            "lab_free_courses": []
        }

        badges = soup.find_all('div', class_='profile-badge')
        if not badges:
            raise ValueError("No badges found on this profile. The profile might be private or the URL is incorrect.")

        for badge in badges:
            title_elem = badge.find('span', class_='ql-title-medium')
            image_elem = badge.find('img')
            date_elem = badge.find('span', class_='ql-body-medium')
            
            if not all([title_elem, image_elem, date_elem]):
                continue
                
            title = title_elem.get_text(strip=True)
            image_src = image_elem['src']
            earned_date = date_elem.get_text(strip=True)

            normalized_title = title.lower()
            badge_info = {"title": title, "image": image_src, "date": earned_date}

            if any(k in normalized_title for k in ["trivia", "arcade trivia"]):
                categories["game_trivia"].append(badge_info)
            elif any(k in normalized_title for k in ["level", "base camp"]):
                categories["level_games"].append(badge_info)
            elif title in SKILL_BADGES_LIST:
                categories["skill_badges"].append(badge_info)
            elif title in LAB_FREE_COURSES:
                categories["lab_free_courses"].append(badge_info)
            elif "arcade certification zone" in normalized_title:
                categories["flash_games"].append(badge_info)

        for cat in categories:
            categories[cat] = filter_badges_by_date(categories[cat], DATE_RANGE)

        points = calculate_points(categories["skill_badges"], categories["game_trivia"], categories["level_games"], categories["flash_games"], categories["lab_free_courses"], is_facilitator)

        # Add facilitator milestone badges if user is a facilitator
        facilitator_milestone = {}
        if is_facilitator:
            # Define facilitator milestone date range (Aug 4, 2025 to Oct 6, 2025)
            from datetime import datetime
            facilitator_start = datetime(2025, 8, 4)
            facilitator_end = datetime(2025, 10, 6)
            
            def filter_facilitator_badges(badges):
                """Filter badges for facilitator milestone period"""
                filtered = []
                for badge in badges:
                    try:
                        # Parse the date from the badge
                        date_str = badge['date']
                        
                        # Handle common date formats
                        if 'ago' in date_str.lower():
                            # Skip relative dates like "2 days ago"
                            continue
                        
                        # Try to parse the date with more formats
                        parsed_date = None
                        date_formats = [
                            '%b %d, %Y',      # Aug 4, 2025
                            '%B %d, %Y',      # August 4, 2025
                            '%Y-%m-%d',       # 2025-08-04
                            '%d/%m/%Y',       # 04/08/2025
                            '%m/%d/%Y',       # 08/04/2025
                            '%d-%m-%Y',       # 04-08-2025
                            '%m-%d-%Y',       # 08-04-2025
                            '%b %d %Y',       # Aug 4 2025
                            '%B %d %Y',       # August 4 2025
                            '%Y/%m/%d',       # 2025/08/04
                            '%d %b %Y',       # 4 Aug 2025
                            '%d %B %Y',       # 4 August 2025
                            'Earned %b %d, %Y EDT',  # Earned Aug 10, 2025 EDT
                            'Earned %B %d, %Y EDT',  # Earned August 10, 2025 EDT
                            'Earned %b %d, %Y',      # Earned Aug 10, 2025
                            'Earned %B %d, %Y',      # Earned August 10, 2025
                        ]
                        
                        for fmt in date_formats:
                            try:
                                parsed_date = datetime.strptime(date_str.strip(), fmt)
                                break
                            except ValueError:
                                continue
                        
                        if parsed_date and facilitator_start <= parsed_date <= facilitator_end:
                            filtered.append(badge)
                            
                    except Exception:
                        continue
                
                return filtered
            
            # Filter badges for each category within facilitator milestone period
            facilitator_milestone = {
                "skill_badges": filter_facilitator_badges(categories["skill_badges"]),
                "game_trivia": filter_facilitator_badges(categories["game_trivia"]),
                "level_games": filter_facilitator_badges(categories["level_games"]),
                "flash_games": filter_facilitator_badges(categories["flash_games"]),
                "lab_free_courses": filter_facilitator_badges(categories["lab_free_courses"])
            }
            
            # Note: facilitator_milestone might be empty if:
            # 1. All badge dates are relative (e.g., "2 days ago")
            # 2. All badges are outside the Aug 4 - Oct 6, 2025 period
            # 3. Date formats are not recognized

        return {
            "user_information": {
                "name": user_name,
                "profile_image": avatar_url,
                "profile_url": url
            },
            "points_data": points,
            "badges": {
                "level_game": categories["level_games"],
                "trivia_game": categories["game_trivia"],
                "skill_badge": categories["skill_badges"]
            },
            "special_badges_1_point": [b["title"] for b in categories["skill_badges"] if points["special_skill_badges_points"]],
            "special_badges_2_points": [b["title"] for b in categories["flash_games"] if points["special_game_count"] > 0],
            "facilitator_milestone": facilitator_milestone
        }
        
    except requests.RequestException as e:
        raise ValueError(f"Failed to fetch the profile: {str(e)}. Please check if the URL is accessible.")
    except Exception as e:
        raise ValueError(f"Error processing the profile: {str(e)}")

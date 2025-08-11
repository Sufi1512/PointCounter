#!/usr/bin/env python3
"""
Comprehensive test for facilitator milestone functionality
"""

from datetime import datetime

def test_facilitator_milestone_logic():
    """Test the facilitator milestone logic with sample badge data"""
    
    print("Facilitator Milestone Complete Test")
    print("=" * 60)
    
    # Sample badge data that might come from scraping
    sample_badges = [
        {"title": "Python Basics", "image": "python.png", "date": "Aug 4, 2025"},
        {"title": "Web Development", "image": "web.png", "date": "Aug 15, 2025"},
        {"title": "Data Science", "image": "data.png", "date": "Sep 20, 2025"},
        {"title": "Machine Learning", "image": "ml.png", "date": "Oct 6, 2025"},
        {"title": "Old Badge", "image": "old.png", "date": "Jan 15, 2025"},
        {"title": "Future Badge", "image": "future.png", "date": "Dec 1, 2025"},
        {"title": "Recent Badge", "image": "recent.png", "date": "2 days ago"},
        {"title": "Last Week", "image": "week.png", "date": "1 week ago"},
    ]
    
    # Define facilitator milestone date range (Aug 4, 2025 to Oct 6, 2025)
    facilitator_start = datetime(2025, 8, 4)
    facilitator_end = datetime(2025, 10, 6)
    
    print(f"Facilitator period: {facilitator_start.strftime('%B %d, %Y')} to {facilitator_end.strftime('%B %d, %Y')}")
    print()
    
    def filter_facilitator_badges(badges):
        """Filter badges for facilitator milestone period"""
        filtered = []
        for badge in badges:
            try:
                date_str = badge['date']
                print(f"Processing: {badge['title']} - Date: {date_str}")
                
                # Handle relative dates
                if 'ago' in date_str.lower():
                    print(f"  -> Skipping relative date: {date_str}")
                    continue
                
                # Try to parse the date
                parsed_date = None
                date_formats = [
                    '%b %d, %Y', '%B %d, %Y', '%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y',
                    '%d-%m-%Y', '%m-%d-%Y', '%b %d %Y', '%B %d %Y', '%Y/%m/%d',
                    '%d %b %Y', '%d %B %Y'
                ]
                
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.strptime(date_str.strip(), fmt)
                        print(f"  -> Parsed: {parsed_date}")
                        break
                    except ValueError:
                        continue
                
                if parsed_date:
                    if facilitator_start <= parsed_date <= facilitator_end:
                        print(f"  -> ✅ WITHIN facilitator period!")
                        filtered.append(badge)
                    else:
                        print(f"  -> ❌ OUTSIDE facilitator period")
                else:
                    print(f"  -> ❌ Could not parse date")
                    
            except Exception as e:
                print(f"  -> Error: {e}")
                continue
            
            print()
        
        return filtered
    
    # Test the filtering
    print("Testing badge filtering:")
    print("-" * 40)
    
    filtered_badges = filter_facilitator_badges(sample_badges)
    
    print(f"\nResults:")
    print(f"Total badges processed: {len(sample_badges)}")
    print(f"Badges within facilitator period: {len(filtered_badges)}")
    
    if filtered_badges:
        print("\nFacilitator milestone badges:")
        for badge in filtered_badges:
            print(f"  - {badge['title']} ({badge['date']})")
    else:
        print("\nNo badges found within facilitator period")
        print("This could happen if:")
        print("  1. All dates are relative (e.g., '2 days ago')")
        print("  2. All dates are outside Aug 4 - Oct 6, 2025")
        print("  3. Date format is not recognized")
    
    print("\nExpected API response structure:")
    print("""
{
  "facilitator_milestone": {
    "skill_badges": [...],
    "game_trivia": [...],
    "level_games": [...],
    "flash_games": [...],
    "lab_free_courses": [...]
  }
}
    """)

if __name__ == "__main__":
    test_facilitator_milestone_logic() 
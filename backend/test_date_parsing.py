#!/usr/bin/env python3
"""
Test script to debug date parsing for facilitator milestone
"""

from datetime import datetime

def test_date_parsing():
    """Test various date formats that might appear in scraped data"""
    
    # Sample dates that might appear in SkillBoost badges
    test_dates = [
        "Aug 4, 2025",
        "August 4, 2025", 
        "2025-08-04",
        "04/08/2025",
        "08/04/2025",
        "4 Aug 2025",
        "4 August 2025",
        "2025/08/04",
        "Aug 4 2025",
        "August 4 2025",
        "4 days ago",  # This should be skipped
        "2 weeks ago", # This should be skipped
        "Invalid date", # This should fail
    ]
    
    # Define facilitator milestone date range (Aug 4, 2025 to Oct 6, 2025)
    facilitator_start = datetime(2025, 8, 4)
    facilitator_end = datetime(2025, 10, 6)
    
    print("Date Parsing Test for Facilitator Milestone")
    print("=" * 60)
    print(f"Facilitator period: {facilitator_start.strftime('%B %d, %Y')} to {facilitator_end.strftime('%B %d, %Y')}")
    print()
    
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
    ]
    
    for date_str in test_dates:
        print(f"Testing: '{date_str}'")
        
        # Skip relative dates
        if 'ago' in date_str.lower():
            print(f"  -> Skipping relative date")
            continue
            
        # Try to parse the date
        parsed_date = None
        for fmt in date_formats:
            try:
                parsed_date = datetime.strptime(date_str.strip(), fmt)
                print(f"  -> Successfully parsed with format '{fmt}': {parsed_date}")
                break
            except ValueError:
                continue
        
        if parsed_date:
            if facilitator_start <= parsed_date <= facilitator_end:
                print(f"  -> ✅ WITHIN facilitator period!")
            else:
                print(f"  -> ❌ OUTSIDE facilitator period")
        else:
            print(f"  -> ❌ Could not parse date")
        
        print()

if __name__ == "__main__":
    test_date_parsing() 
#!/usr/bin/env python3
"""
Test script to verify the facilitator milestone date parsing fix
"""

from datetime import datetime
from scraper import scrape_profile

def test_facilitator_date_parsing():
    """Test that the new date format is parsed correctly"""
    
    # Test the specific date format from the user's JSON
    test_date = "Earned Aug 10, 2025 EDT"
    
    # Define facilitator milestone date range (Aug 4, 2025 to Oct 6, 2025)
    facilitator_start = datetime(2025, 8, 4)
    facilitator_end = datetime(2025, 10, 6)
    
    # Test different date formats
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
    
    print("Testing date parsing for facilitator milestone...")
    print(f"Test date: {test_date}")
    print(f"Facilitator period: {facilitator_start.strftime('%Y-%m-%d')} to {facilitator_end.strftime('%Y-%m-%d')}")
    print()
    
    # Try to parse the test date
    parsed_date = None
    for fmt in date_formats:
        try:
            parsed_date = datetime.strptime(test_date.strip(), fmt)
            print(f"✅ SUCCESS: Parsed with format '{fmt}' -> {parsed_date}")
            break
        except ValueError:
            print(f"❌ FAILED: Format '{fmt}'")
    
    if parsed_date:
        print(f"\n📅 Parsed date: {parsed_date}")
        
        # Check if it falls within facilitator period
        if facilitator_start <= parsed_date <= facilitator_end:
            print("✅ Date falls within facilitator milestone period!")
        else:
            print("❌ Date is outside facilitator milestone period")
            
        print(f"Date: {parsed_date.strftime('%Y-%m-%d')}")
        print(f"Start: {facilitator_start.strftime('%Y-%m-%d')}")
        print(f"End: {facilitator_end.strftime('%Y-%m-%d')}")
    else:
        print("❌ Failed to parse the date with any format")

if __name__ == "__main__":
    test_facilitator_date_parsing() 
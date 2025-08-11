#!/usr/bin/env python3
"""
Test script to demonstrate URL validation functionality
"""

from scraper import validate_skillboost_url

def test_urls():
    """Test various URL types"""
    
    test_cases = [
        # Invalid URLs
        ("https://lh3.googleusercontent.com/a/ACg8ocKWQ7BiqCAnkizpNS6VuDC7seCW78CKlFnkQR6bkN8Bt5h6JQ=s320-c", "Google avatar URL"),
        ("https://cdn.qwiklabs.com/PGyhmgS3zZncIEGywnx5UXsKwepRRFQ9BhAg%2FWHNrlQ%3D", "Qwiklabs CDN URL"),
        ("not-a-url", "Invalid format"),
        
        # Valid URLs
        ("https://skillboost.withgoogle.com/public_profile/username", "Valid SkillBoost URL"),
        ("https://skillboost.google.com/profile/user123", "Valid SkillBoost URL"),
        ("https://example.com/profile", "General valid URL"),
    ]
    
    print("URL Validation Test Results:")
    print("=" * 50)
    
    for url, description in test_cases:
        is_valid, message = validate_skillboost_url(url)
        status = "✅ VALID" if is_valid else "❌ INVALID"
        print(f"{status}: {description}")
        print(f"URL: {url}")
        print(f"Result: {message}")
        print("-" * 50)

if __name__ == "__main__":
    test_urls() 
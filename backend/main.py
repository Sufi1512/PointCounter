from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from calculation import DATE_RANGE, SPECIAL_DATE_RANGE
from badges import SKILL_BADGES_LIST
from scraper import scrape_profile

app = FastAPI(
    title="SkillBoost Scraper API",
    description="API to scrape and calculate points from SkillBoost profiles",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/fetch-info")
def fetch_info(profile_url: str = Query(..., description="Public SkillBoost profile URL"),
               is_facilitator: bool = Query(False, description="Whether the user is a facilitator")):
    """
    Fetch and calculate points from a SkillBoost profile.
    
    The URL should be a public SkillBoost profile URL, not an image URL.
    Example: https://www.cloudskillsboost.google/public_profiles/...
    """
    
    print(f"Received profile_url: {profile_url}")
    print(f"is_facilitator: {is_facilitator}")
    
    # Basic URL validation
    if not profile_url.startswith(('http://', 'https://')):
        raise HTTPException(
            status_code=400, 
            detail="Invalid URL format. Please provide a complete URL starting with http:// or https://"
        )
    
    # Check for common mistakes
    if "googleusercontent.com" in profile_url or "lh3.googleusercontent.com" in profile_url:
        raise HTTPException(
            status_code=400,
            detail="This appears to be a Google avatar image URL, not a SkillBoost profile URL. Please provide the actual SkillBoost profile page URL."
        )

    try:
        scraped = scrape_profile(profile_url, is_facilitator)

        # Points are already calculated in the scraper
        return JSONResponse(content={
            "user_information": scraped["user_information"],
            "points_data": scraped["points_data"],
            "badges": scraped["badges"],
            "special_badges_1_point": scraped.get("special_badges_1_point", []),
            "special_badges_2_points": scraped.get("special_badges_2_points", []),
            "facilitator_milestone": scraped.get("facilitator_milestone", {})
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch info: {str(e)}"
        )

@app.get("/")
def read_root():
    return {
        "message": "SkillBoost Scraper API is running!",
        "usage": "Use /fetch-info?profile_url=YOUR_PROFILE_URL to get profile data and points",
        "note": "Make sure to provide a public SkillBoost profile URL, not an image URL"
    }

@app.get("/help")
def get_help():
    return {
        "title": "SkillBoost Scraper API Help",
        "description": "This API helps calculate points from SkillBoost profiles",
        "endpoints": {
            "/": "API status and basic info",
            "/help": "This help message",
            "/fetch-info": "Fetch profile data and calculate points"
        },
        "url_format": "The skillboost_url parameter should be a public SkillBoost profile URL",
        "example": "https://skillboost.withgoogle.com/public_profile/username",
        "parameters": {
            "profile_url": "Public SkillBoost profile URL (required)",
            "is_facilitator": "Boolean flag for facilitator status (optional, default: false)"
        },
        "response_structure": {
            "user_information": "User name, profile image, and profile URL",
            "points_data": "Calculated points and milestone information",
            "badges": "Categorized badges (level games, trivia games, skill badges)",
            "special_badges_1_point": "Special skill badges worth 1 point",
            "special_badges_2_points": "Special game badges worth 2 points",
            "facilitator_milestone": "Badges earned between Aug 4-Oct 6, 2025 (only when is_facilitator=true)"
        },
        "common_mistakes": [
            "Don't use Google avatar image URLs",
            "Don't use private profile URLs",
            "Make sure the profile is publicly accessible"
        ],
        "facilitator_feature": "When is_facilitator=true, the API will include a special milestone section for badges earned during the facilitator period (August 4 - October 6, 2025)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from Backend.db.database import get_db
from Backend.api.auth import get_current_user
from Backend.services.roadmap_ai import generate_career_roadmap, analyze_skills_gap

router = APIRouter()

@router.post("/generate", response_model=Dict[str, Any])
async def create_career_roadmap(
    current_position: str = Body(...),
    target_position: str = Body(...),
    years_experience: int = Body(...),
    skills: List[str] = Body(...),
    industry: Optional[str] = Body(None),
    preferences: Optional[Dict[str, Any]] = Body(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate a career roadmap from current position to target position
    """
    try:
        # Call AI service to generate roadmap
        roadmap = generate_career_roadmap(
            current_position=current_position,
            target_position=target_position,
            years_experience=years_experience,
            skills=skills,
            industry=industry,
            preferences=preferences
        )
        
        # Save to user history or return directly
        return roadmap
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating roadmap: {str(e)}"
        )

@router.post("/skills-gap", response_model=Dict[str, Any])
async def analyze_skills_gap_for_position(
    current_skills: List[str] = Body(...),
    target_position: str = Body(...),
    years_experience: Optional[int] = Body(None),
    industry: Optional[str] = Body(None),
    include_resources: bool = Body(True),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze the skills gap between current skills and those needed for a target position
    """
    try:
        # Call AI service to analyze skills gap
        analysis = analyze_skills_gap(
            current_skills=current_skills,
            target_position=target_position,
            years_experience=years_experience,
            industry=industry,
            include_resources=include_resources
        )
        
        return analysis
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing skills gap: {str(e)}"
        )

@router.post("/next-steps", response_model=Dict[str, Any])
async def get_next_career_steps(
    current_position: str = Body(...),
    years_experience: int = Body(...),
    skills: List[str] = Body(...),
    preferences: Optional[Dict[str, Any]] = Body(None),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get possible next steps in career based on current position and skills
    """
    try:
        # This is a simpler version of the roadmap that just focuses on immediate next steps
        # We can reuse the roadmap generator with a shorter timeframe
        
        if preferences is None:
            preferences = {}
        
        preferences["timeframe"] = "short"  # Focus on immediate next steps
        preferences["steps_count"] = 3  # Limit to 3 possible paths
        
        # Call AI service to generate roadmap
        roadmap = generate_career_roadmap(
            current_position=current_position,
            target_position=None,  # No specific target, just next steps
            years_experience=years_experience,
            skills=skills,
            industry=None,
            preferences=preferences
        )
        
        return roadmap
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating next steps: {str(e)}"
        ) 
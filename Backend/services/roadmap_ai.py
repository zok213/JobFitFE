import os
import logging
import openai
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_career_roadmap(
    current_position: str, 
    target_position: Optional[str], 
    years_experience: int,
    skills: List[str],
    industry: Optional[str] = None,
    preferences: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Generate an AI-powered career roadmap
    """
    try:
        # Set default preferences if none provided
        if preferences is None:
            preferences = {}
        
        timeframe = preferences.get("timeframe", "medium")  # short, medium, long
        focus_areas = preferences.get("focus_areas", ["skills", "education", "experience"])
        steps_count = preferences.get("steps_count", 5)
        
        # Prepare the prompt
        prompt = f"""
        Generate a career roadmap for someone in the following situation:
        
        Current Position: {current_position}
        Years of Experience: {years_experience}
        Current Skills: {', '.join(skills)}
        """
        
        if target_position:
            prompt += f"Target Position: {target_position}\n"
        else:
            prompt += "Looking for possible next career steps (no specific target position).\n"
        
        if industry:
            prompt += f"Industry: {industry}\n"
        
        prompt += f"""
        Preferences:
        - Timeframe: {timeframe} term
        - Focus on: {', '.join(focus_areas)}
        - Number of steps: {steps_count}
        
        Create a detailed career roadmap including:
        1. A clear path from current position to target position (or possible advancement paths)
        2. Skills to develop at each stage
        3. Certifications or education that would be beneficial
        4. Approximate timeline
        5. Potential job titles for each step
        6. Advice for success
        
        Return the result as a JSON object with the following structure:
        {{
            "summary": "Brief summary of the roadmap",
            "steps": [
                {{
                    "step": 1,
                    "title": "Step title",
                    "description": "Detailed description",
                    "timeline": "Expected timeline",
                    "skills": ["Skill 1", "Skill 2"],
                    "certifications": ["Certification 1", "Certification 2"],
                    "job_titles": ["Job title 1", "Job title 2"]
                }},
                ...
            ],
            "advice": "General advice for the journey"
        }}
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=[
                {"role": "system", "content": "You are a career development expert who creates detailed, actionable career roadmaps."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        # Extract JSON part
        json_start = content.find("{")
        json_end = content.rfind("}") + 1
        
        if json_start == -1 or json_end == 0:
            # Fallback if JSON parsing fails
            return generate_fallback_roadmap(current_position, target_position, years_experience)
        
        json_str = content[json_start:json_end]
        roadmap = json.loads(json_str)
        
        # Add metadata
        roadmap["generated_at"] = datetime.utcnow().isoformat()
        roadmap["current_position"] = current_position
        roadmap["target_position"] = target_position if target_position else "Career Advancement"
        roadmap["years_experience"] = years_experience
        
        return roadmap
    
    except Exception as e:
        logger.error(f"Error generating career roadmap: {str(e)}")
        return generate_fallback_roadmap(current_position, target_position, years_experience)

def analyze_skills_gap(
    current_skills: List[str],
    target_position: str,
    years_experience: Optional[int] = None,
    industry: Optional[str] = None,
    include_resources: bool = True
) -> Dict[str, Any]:
    """
    Analyze the skills gap between current skills and those needed for a target position
    """
    try:
        # Prepare the prompt
        prompt = f"""
        Analyze the skills gap for someone in the following situation:
        
        Current Skills: {', '.join(current_skills)}
        Target Position: {target_position}
        """
        
        if years_experience is not None:
            prompt += f"Years of Experience: {years_experience}\n"
        
        if industry:
            prompt += f"Industry: {industry}\n"
        
        prompt += f"""
        Provide a detailed analysis of:
        1. Skills they already have that are valuable for the target position
        2. Critical skills they need to develop to be competitive for the target position
        3. Complementary skills that would give them an advantage
        4. Skills they have that may need to be upgraded or refreshed
        """
        
        if include_resources:
            prompt += """
            5. For each skill to develop, suggest specific resources (courses, books, certifications, projects)
            """
        
        prompt += """
        Return the result as a JSON object with the following structure:
        {
            "target_position": "The target position",
            "existing_skills": [
                {"skill": "Skill name", "relevance": "High/Medium/Low", "comment": "Comment about this skill"}
            ],
            "missing_skills": [
                {"skill": "Skill name", "priority": "High/Medium/Low", "comment": "Why this skill is important"}
            ],
            "skills_to_upgrade": [
                {"skill": "Skill name", "comment": "How to upgrade this skill"}
            ],
            "learning_path": "Suggested learning sequence"
        }
        """
        
        if include_resources:
            prompt += """
            ,
            "resources": [
                {"skill": "Skill name", "resources": [
                    {"type": "Course/Book/Project/etc.", "name": "Resource name", "link": "URL if applicable", "description": "Brief description"}
                ]}
            ]
            """
        
        prompt += "\n}"
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a career development expert who specializes in skills gap analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2500
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        # Extract JSON part
        json_start = content.find("{")
        json_end = content.rfind("}") + 1
        
        if json_start == -1 or json_end == 0:
            # Fallback if JSON parsing fails
            return generate_fallback_skills_gap(current_skills, target_position)
        
        json_str = content[json_start:json_end]
        analysis = json.loads(json_str)
        
        # Add metadata
        analysis["generated_at"] = datetime.utcnow().isoformat()
        
        return analysis
    
    except Exception as e:
        logger.error(f"Error analyzing skills gap: {str(e)}")
        return generate_fallback_skills_gap(current_skills, target_position)

def generate_fallback_roadmap(current_position: str, target_position: Optional[str], years_experience: int) -> Dict[str, Any]:
    """
    Generate a fallback career roadmap when the AI generation fails
    """
    target = target_position if target_position else "Career Advancement"
    
    fallback_roadmap = {
        "summary": f"Career path from {current_position} to {target}",
        "current_position": current_position,
        "target_position": target,
        "years_experience": years_experience,
        "generated_at": datetime.utcnow().isoformat(),
        "steps": [
            {
                "step": 1,
                "title": "Skill Enhancement",
                "description": "Focus on developing core skills required for advancement in your field.",
                "timeline": "6-12 months",
                "skills": ["Technical skills", "Communication", "Problem-solving"],
                "certifications": ["Industry-specific certifications"],
                "job_titles": [current_position]
            },
            {
                "step": 2,
                "title": "Experience Building",
                "description": "Take on projects that demonstrate your capabilities and build relevant experience.",
                "timeline": "1-2 years",
                "skills": ["Project management", "Leadership", "Domain expertise"],
                "certifications": ["Advanced certifications"],
                "job_titles": ["Senior " + current_position, "Lead " + current_position]
            },
            {
                "step": 3,
                "title": "Professional Growth",
                "description": "Expand your professional network and visibility within your industry.",
                "timeline": "Ongoing",
                "skills": ["Networking", "Industry knowledge", "Personal branding"],
                "certifications": ["Leadership certifications"],
                "job_titles": [target if target_position else "Advanced positions in your field"]
            }
        ],
        "advice": "Continuous learning and adaptation are key to career advancement. Regularly reassess your goals and skills to stay relevant in your industry."
    }
    
    return fallback_roadmap

def generate_fallback_skills_gap(current_skills: List[str], target_position: str) -> Dict[str, Any]:
    """
    Generate fallback skills gap analysis when the AI generation fails
    """
    fallback_analysis = {
        "target_position": target_position,
        "generated_at": datetime.utcnow().isoformat(),
        "existing_skills": [
            {"skill": skill, "relevance": "Medium", "comment": "Continue developing this skill"} 
            for skill in current_skills[:3]  # Include up to 3 skills
        ],
        "missing_skills": [
            {"skill": "Technical expertise", "priority": "High", "comment": "Specific technical skills relevant to the position"},
            {"skill": "Leadership", "priority": "Medium", "comment": "Ability to lead teams and projects"},
            {"skill": "Industry knowledge", "priority": "High", "comment": "Deep understanding of the industry"}
        ],
        "skills_to_upgrade": [
            {"skill": current_skills[0] if current_skills else "Communication", "comment": "Enhance to professional level"}
        ],
        "learning_path": "Focus first on high-priority missing skills, then upgrade existing skills while gaining practical experience."
    }
    
    return fallback_analysis 
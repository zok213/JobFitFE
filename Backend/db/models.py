from Backend.models.user import User, UserProfile, UserSettings, Notification, UserFeedback
from Backend.models.job import (
    Job, 
    JobSkill, 
    JobMatchScore, 
    JobFavorite, 
    JobApplication,
    JobType,
    ExperienceLevel
)
from Backend.models.resume import Resume, Education, Experience, ResumeSkill

# Import Base from database module
from Backend.db.database import Base

# For alembic to detect all models
__all__ = [
    'User',
    'UserProfile',
    'UserSettings',
    'Notification',
    'UserFeedback',
    'Job',
    'JobSkill',
    'JobMatchScore',
    'JobFavorite',
    'JobApplication',
    'JobType',
    'ExperienceLevel',
    'Resume',
    'Education',
    'Experience',
    'ResumeSkill',
    'Base'
] 
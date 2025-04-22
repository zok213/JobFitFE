from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

from Backend.models.job import JobType, ExperienceLevel


class JobSkillBase(BaseModel):
    skill_name: str
    importance: Optional[float] = 1.0
    years_required: Optional[int] = None


class JobSkillCreate(JobSkillBase):
    pass


class JobSkillResponse(JobSkillBase):
    id: str
    job_id: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = "USD"
    job_type: JobType
    is_remote: Optional[bool] = False
    experience_level: ExperienceLevel
    application_deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    company_logo: Optional[str] = None


class JobCreate(JobBase):
    skills: Optional[List[JobSkillCreate]] = None


class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = None
    job_type: Optional[JobType] = None
    is_remote: Optional[bool] = None
    experience_level: Optional[ExperienceLevel] = None
    application_deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    company_logo: Optional[str] = None
    is_active: Optional[bool] = None
    skills: Optional[List[JobSkillCreate]] = None


class JobListResponse(JobBase):
    id: str
    is_active: bool
    views_count: int
    applications_count: int
    created_at: datetime
    
    class Config:
        orm_mode = True


class JobResponse(JobListResponse):
    posted_by: str
    skills: List[JobSkillResponse]
    is_favorited: Optional[bool] = False
    match_score: Optional[float] = None
    updated_at: datetime
    
    class Config:
        orm_mode = True


class JobMatchScoreBase(BaseModel):
    score: float
    score_details: Optional[Dict[str, Any]] = None
    ai_insights: Optional[Dict[str, Any]] = None


class JobMatchScoreResponse(JobMatchScoreBase):
    id: str
    job_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class JobApplicationBase(BaseModel):
    cover_letter: Optional[str] = None


class JobApplicationCreate(JobApplicationBase):
    resume_id: Optional[str] = None


class JobApplicationUpdate(JobApplicationBase):
    resume_id: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class JobApplicationResponse(JobApplicationBase):
    id: str
    job_id: str
    user_id: str
    resume_id: Optional[str] = None
    status: str
    application_date: datetime
    updated_at: datetime
    interview_date: Optional[datetime] = None
    interview_details: Optional[str] = None
    
    # Include job details for convenience
    job_title: Optional[str] = None
    company: Optional[str] = None
    
    class Config:
        orm_mode = True
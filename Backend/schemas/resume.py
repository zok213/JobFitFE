from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ResumeBase(BaseModel):
    title: str


class ResumeCreate(ResumeBase):
    pass  # File will be handled separately


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    is_default: Optional[bool] = None


class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    file_path: str
    file_type: str
    file_size: int
    is_default: bool
    parsed: bool
    parsed_text: Optional[str] = None
    last_parsed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class EducationBase(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None
    gpa: Optional[float] = None
    location: Optional[str] = None


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    gpa: Optional[float] = None
    location: Optional[str] = None


class EducationResponse(EducationBase):
    id: str
    resume_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class ExperienceBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: str
    resume_id: str
    responsibilities: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    skills_used: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class ResumeSkillBase(BaseModel):
    name: str
    proficiency: Optional[int] = None
    years_experience: Optional[float] = None
    category: Optional[str] = None


class ResumeSkillCreate(ResumeSkillBase):
    pass


class ResumeSkillUpdate(BaseModel):
    name: Optional[str] = None
    proficiency: Optional[int] = None
    years_experience: Optional[float] = None
    category: Optional[str] = None


class ResumeSkillResponse(ResumeSkillBase):
    id: str
    resume_id: str
    verified: Optional[bool] = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True 
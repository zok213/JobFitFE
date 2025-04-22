from sqlalchemy import Boolean, Column, String, DateTime, ForeignKey, Text, Integer, Float, Enum, JSON, Table, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from enum import Enum as PyEnum

from Backend.db.database import Base

class JobType(PyEnum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"
    TEMPORARY = "temporary"

class ExperienceLevel(PyEnum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MID = "mid_level"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    
    # Salary and job details
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String, default="USD")
    job_type = Column(Enum(JobType), nullable=False, index=True)
    is_remote = Column(Boolean, default=False, index=True)
    experience_level = Column(Enum(ExperienceLevel), nullable=False, index=True)
    
    # Application details
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    application_url = Column(String, nullable=True)
    company_logo = Column(String, nullable=True)
    
    # Metadata
    posted_by = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")
    match_scores = relationship("JobMatchScore", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")
    favorites = relationship("JobFavorite", back_populates="job", cascade="all, delete-orphan")
    recruiter = relationship("User", back_populates="posted_jobs")

class JobSkill(Base):
    __tablename__ = "job_skills"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False)
    importance = Column(Float, default=1.0)  # Scale of 0-1, where 1 is most important
    years_required = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="skills")
    
    __table_args__ = (
        UniqueConstraint('job_id', 'skill_name', name='uix_job_skill'),
    )

class JobMatchScore(Base):
    __tablename__ = "job_match_scores"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    score = Column(Float, nullable=False)  # 0-100 match score
    score_details = Column(JSON, nullable=True)  # Breakdown of score by category
    ai_insights = Column(JSON, nullable=True)  # AI-generated insights about the match
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="match_scores")
    user = relationship("User", back_populates="job_matches")
    
    __table_args__ = (
        UniqueConstraint('job_id', 'user_id', name='uix_job_user_match'),
    )

class JobFavorite(Base):
    __tablename__ = "job_favorites"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="favorites")
    user = relationship("User", back_populates="favorite_jobs")
    
    __table_args__ = (
        UniqueConstraint('job_id', 'user_id', name='uix_job_user_favorite'),
    )

class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(String, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    cover_letter = Column(Text, nullable=True)
    
    # Application status
    status = Column(String, default="applied")  # applied, reviewed, interview, rejected, offered, accepted
    status_updated_at = Column(DateTime(timezone=True), nullable=True)
    
    # Interview details
    interview_date = Column(DateTime(timezone=True), nullable=True)
    interview_details = Column(Text, nullable=True)
    
    # Feedback
    recruiter_notes = Column(Text, nullable=True)
    rejected_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    user = relationship("User", back_populates="job_applications")
    resume = relationship("Resume", back_populates="job_applications")
    
    __table_args__ = (
        UniqueConstraint('job_id', 'user_id', name='uix_job_user_application'),
    ) 
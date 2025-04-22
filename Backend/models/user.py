from sqlalchemy import Boolean, Column, String, DateTime, ForeignKey, Text, Integer, Float, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from enum import Enum as PyEnum

from Backend.db.database import Base

class UserRole(PyEnum):
    CANDIDATE = "candidate"
    RECRUITER = "recruiter"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)  # Nullable for social login
    email_verified = Column(Boolean, default=False)
    username = Column(String, unique=True, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CANDIDATE, nullable=False)
    
    # Social login info
    google_id = Column(String, nullable=True, unique=True)
    facebook_id = Column(String, nullable=True, unique=True)
    github_id = Column(String, nullable=True, unique=True)
    
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_applications = relationship("JobApplication", back_populates="user", cascade="all, delete-orphan")
    job_matches = relationship("JobMatchScore", back_populates="user", cascade="all, delete-orphan")
    favorite_jobs = relationship("JobFavorite", back_populates="user", cascade="all, delete-orphan")
    posted_jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("UserFeedback", back_populates="user", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Personal info
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Professional info
    current_position = Column(String, nullable=True)
    company = Column(String, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    skills = Column(JSON, nullable=True)  # [{"name": "Python", "years": 3, "level": "expert"}, ...]
    education = Column(JSON, nullable=True)  # [{"degree": "BS", "field": "CS", "institution": "MIT", "year": 2020}, ...]
    experience = Column(JSON, nullable=True)  # [{"title": "Developer", "company": "Google", "start_date": "2020-01", "end_date": "2022-01", "description": "..."}, ...]
    certifications = Column(JSON, nullable=True)  # [{"name": "AWS Certified", "issuer": "Amazon", "date": "2021-05", "expires": "2024-05"}, ...]
    
    # Location
    location = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Job search preferences
    job_types = Column(JSON, nullable=True)  # ["full_time", "contract"]
    desired_salary = Column(Integer, nullable=True)
    desired_salary_currency = Column(String, default="USD", nullable=True)
    remote_preference = Column(String, nullable=True)  # "remote", "hybrid", "onsite"
    willing_to_relocate = Column(Boolean, default=False)
    preferred_locations = Column(JSON, nullable=True)  # ["New York, NY", "Boston, MA"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="profile")

class UserSettings(Base):
    __tablename__ = "user_settings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    job_match_notifications = Column(Boolean, default=True)
    application_update_notifications = Column(Boolean, default=True)
    message_notifications = Column(Boolean, default=True)
    
    # UI preferences
    theme = Column(String, default="light")  # light, dark, system
    language = Column(String, default="en")
    
    # Privacy settings
    profile_visibility = Column(String, default="public")  # public, private, connections_only
    show_activity = Column(Boolean, default=True)
    share_job_applications = Column(Boolean, default=False)
    
    # AI preferences
    ai_personalization = Column(Boolean, default=True)
    ai_suggestions = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="settings")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)  # job_match, application_update, message, system
    title = Column(String, nullable=False)
    content = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    action_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # For related entities
    related_entity_type = Column(String, nullable=True)  # job, application, message
    related_entity_id = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class UserFeedback(Base):
    __tablename__ = "user_feedback"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    feedback_type = Column(String, nullable=False)  # feature_request, bug_report, general_feedback
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)  # 1-5 rating
    status = Column(String, default="submitted")  # submitted, under_review, resolved, implemented
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="feedback")

class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False)
    skill_level = Column(Integer, nullable=True)  # 1-5 scale
    years_experience = Column(Float, nullable=True)  # Can be 0.5, 1, 2.5 etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="skills")

class UserFavoriteJob(Base):
    __tablename__ = "user_favorite_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="favorite_jobs")
    job = relationship("Job")

class AIToolUsage(Base):
    __tablename__ = "ai_tool_usage"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tool_type = Column(String, nullable=False)  # ROADMAP, CV_ASSISTANT, JOB_MATCH, INTERVIEWER
    usage_count = Column(Integer, default=0)
    is_favorite = Column(Boolean, default=False)
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="ai_usage") 
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any


class UserProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    current_position: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(UserProfileBase):
    # Fields that can be added in update but not required in create
    skills: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    job_types: Optional[List[str]] = None
    desired_salary: Optional[int] = None
    remote_preference: Optional[str] = None
    willing_to_relocate: Optional[bool] = None


class UserProfileResponse(UserProfileBase):
    id: str
    user_id: str
    profile_picture: Optional[str] = None
    skills: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    certifications: Optional[List[Dict[str, Any]]] = None
    job_types: Optional[List[str]] = None
    desired_salary: Optional[int] = None
    remote_preference: Optional[str] = None
    willing_to_relocate: Optional[bool] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        orm_mode = True


class UserSettingsBase(BaseModel):
    theme: Optional[str] = "light"
    language: Optional[str] = "en"
    email_notifications: Optional[bool] = True
    job_match_notifications: Optional[bool] = True
    application_update_notifications: Optional[bool] = True
    message_notifications: Optional[bool] = True
    profile_visibility: Optional[str] = "public"
    show_activity: Optional[bool] = True
    share_job_applications: Optional[bool] = False
    ai_personalization: Optional[bool] = True
    ai_suggestions: Optional[bool] = True


class UserSettingsUpdate(UserSettingsBase):
    pass


class UserSettingsResponse(UserSettingsBase):
    id: str
    user_id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    
    class Config:
        orm_mode = True 
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class InterviewBase(BaseModel):
    interview_date: Optional[datetime] = None
    interview_details: Optional[str] = None


class InterviewCreate(InterviewBase):
    pass


class InterviewUpdate(InterviewBase):
    pass


class InterviewResponse(BaseModel):
    application_id: str
    job_id: str
    job_title: str
    company: str
    interview_date: Optional[datetime] = None
    interview_details: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class InterviewQuestionBase(BaseModel):
    question: str
    looking_for: str
    sample_answer: str
    category: str


class InterviewQuestionResponse(InterviewQuestionBase):
    id: str
    
    class Config:
        orm_mode = True


class InterviewFeedbackBase(BaseModel):
    strengths: List[str]
    areas_to_improve: List[str]
    overall_score: int  # 1-10
    notes: Optional[str] = None


class InterviewFeedbackCreate(InterviewFeedbackBase):
    pass


class InterviewFeedbackUpdate(BaseModel):
    strengths: Optional[List[str]] = None
    areas_to_improve: Optional[List[str]] = None
    overall_score: Optional[int] = None
    notes: Optional[str] = None


class InterviewFeedbackResponse(InterviewFeedbackBase):
    id: str
    application_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True 
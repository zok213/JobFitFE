from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from Backend.db.database import get_db
from Backend.models.job import Job, JobApplication
from Backend.api.auth import get_current_user
from Backend.schemas.interviews import (
    InterviewResponse,
    InterviewCreate,
    InterviewUpdate,
    InterviewQuestionResponse
)
from Backend.services.interview_ai import generate_interview_questions

router = APIRouter()

@router.get("/applications/{application_id}/interview", response_model=InterviewResponse)
async def get_interview_for_application(
    application_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get interview details for a job application
    """
    # Check if application exists and belongs to user
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Return interview details if the application has an interview scheduled
    if application.status != "interview":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No interview scheduled for this application"
        )
    
    # Get job details
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    # Construct response
    response = {
        "application_id": application.id,
        "job_id": job.id,
        "job_title": job.title,
        "company": job.company,
        "interview_date": application.interview_date,
        "interview_details": application.interview_details,
        "status": application.status,
        "created_at": application.created_at,
        "updated_at": application.updated_at
    }
    
    return response

@router.get("/applications/{application_id}/questions", response_model=List[InterviewQuestionResponse])
async def generate_interview_questions_for_application(
    application_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate AI interview questions for a job application
    """
    # Check if application exists and belongs to user
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Get job details
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    # Generate questions using AI
    questions = generate_interview_questions(job.title, job.description, job.requirements)
    
    return questions

@router.post("/applications/{application_id}/prepare", response_model=InterviewResponse)
async def prepare_for_interview(
    application_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Prepare for an interview by setting up details
    """
    # Check if application exists and belongs to user
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Get job details
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    # Update application status to interview
    application.status = "interview"
    application.status_updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(application)
    
    # Generate generic interview details if none exist
    if not application.interview_details:
        application.interview_details = f"Preparation for interview with {job.company} for {job.title} position"
        db.commit()
        db.refresh(application)
    
    # Construct response
    response = {
        "application_id": application.id,
        "job_id": job.id,
        "job_title": job.title,
        "company": job.company,
        "interview_date": application.interview_date,
        "interview_details": application.interview_details,
        "status": application.status,
        "created_at": application.created_at,
        "updated_at": application.updated_at
    }
    
    return response

@router.put("/applications/{application_id}/interview", response_model=InterviewResponse)
async def update_interview_details(
    application_id: str,
    interview_data: InterviewUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update interview details for a job application
    """
    # Check if application exists and belongs to user
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == current_user.id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update interview details
    if interview_data.interview_date:
        application.interview_date = interview_data.interview_date
    
    if interview_data.interview_details:
        application.interview_details = interview_data.interview_details
    
    # Ensure status is interview
    application.status = "interview"
    application.status_updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(application)
    
    # Get job details
    job = db.query(Job).filter(Job.id == application.job_id).first()
    
    # Construct response
    response = {
        "application_id": application.id,
        "job_id": job.id,
        "job_title": job.title,
        "company": job.company,
        "interview_date": application.interview_date,
        "interview_details": application.interview_details,
        "status": application.status,
        "created_at": application.created_at,
        "updated_at": application.updated_at
    }
    
    return response
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from Backend.db.database import get_db
from Backend.models.job import Job, JobSkill, JobType, ExperienceLevel, JobMatchScore, JobFavorite
from Backend.api.auth import get_current_user
from Backend.schemas.job import (
    JobCreate, 
    JobUpdate, 
    JobResponse, 
    JobListResponse,
    JobSkillCreate,
    JobMatchScoreResponse
)

router = APIRouter()

@router.get("/", response_model=List[JobListResponse])
async def get_jobs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = None,
    job_type: Optional[JobType] = None,
    experience_level: Optional[ExperienceLevel] = None,
    is_remote: Optional[bool] = None,
    min_salary: Optional[int] = None,
    location: Optional[str] = None,
    company: Optional[str] = None,
    skills: Optional[List[str]] = Query(None)
):
    """
    Get a list of jobs with optional filtering parameters
    """
    query = db.query(Job).filter(Job.is_active == True)
    
    # Apply filters if they are provided
    if search:
        query = query.filter(
            (Job.title.ilike(f"%{search}%")) | 
            (Job.description.ilike(f"%{search}%")) |
            (Job.company.ilike(f"%{search}%"))
        )
    
    if job_type:
        query = query.filter(Job.job_type == job_type)
        
    if experience_level:
        query = query.filter(Job.experience_level == experience_level)
        
    if is_remote is not None:
        query = query.filter(Job.is_remote == is_remote)
        
    if min_salary:
        query = query.filter(Job.salary_min >= min_salary)
        
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
        
    if company:
        query = query.filter(Job.company.ilike(f"%{company}%"))
    
    # Apply pagination
    total = query.count()
    jobs = query.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
    
    return jobs

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: str, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get detailed information about a specific job
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Increment view count
    job.views_count += 1
    db.commit()
    
    # Check if the job is favorited by the current user
    is_favorited = db.query(JobFavorite).filter(
        JobFavorite.job_id == job_id,
        JobFavorite.user_id == current_user.id
    ).first() is not None
    
    # Get match score if it exists
    match_score = db.query(JobMatchScore).filter(
        JobMatchScore.job_id == job_id,
        JobMatchScore.user_id == current_user.id
    ).first()
    
    # Include match score and favorite status in the response
    job_dict = JobResponse.from_orm(job).dict()
    job_dict["is_favorited"] = is_favorited
    job_dict["match_score"] = match_score.score if match_score else None
    
    return job_dict

@router.post("/", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new job posting
    """
    # Create job object
    db_job = Job(
        title=job_data.title,
        company=job_data.company,
        location=job_data.location,
        description=job_data.description,
        requirements=job_data.requirements,
        responsibilities=job_data.responsibilities,
        benefits=job_data.benefits,
        salary_min=job_data.salary_min,
        salary_max=job_data.salary_max,
        salary_currency=job_data.salary_currency,
        job_type=job_data.job_type,
        is_remote=job_data.is_remote,
        experience_level=job_data.experience_level,
        application_deadline=job_data.application_deadline,
        application_url=job_data.application_url,
        company_logo=job_data.company_logo,
        posted_by=current_user.id
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    # Add skills if provided
    if job_data.skills:
        for skill_data in job_data.skills:
            db_skill = JobSkill(
                job_id=db_job.id,
                skill_name=skill_data.skill_name,
                importance=skill_data.importance,
                years_required=skill_data.years_required
            )
            db.add(db_skill)
        
        db.commit()
        db.refresh(db_job)
    
    return db_job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(
    job_id: str,
    job_data: JobUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Update an existing job posting
    """
    db_job = db.query(Job).filter(Job.id == job_id).first()
    
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if the current user is the one who posted the job
    if db_job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this job"
        )
    
    # Update job fields
    for field, value in job_data.dict(exclude_unset=True).items():
        if field != "skills":
            setattr(db_job, field, value)
    
    # Update skills if provided
    if job_data.skills is not None:
        # Remove existing skills
        db.query(JobSkill).filter(JobSkill.job_id == job_id).delete()
        
        # Add new skills
        for skill_data in job_data.skills:
            db_skill = JobSkill(
                job_id=db_job.id,
                skill_name=skill_data.skill_name,
                importance=skill_data.importance,
                years_required=skill_data.years_required
            )
            db.add(db_skill)
    
    db.commit()
    db.refresh(db_job)
    
    return db_job

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Delete a job posting
    """
    db_job = db.query(Job).filter(Job.id == job_id).first()
    
    if not db_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if the current user is the one who posted the job
    if db_job.posted_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this job"
        )
    
    db.delete(db_job)
    db.commit()
    
    return {"message": "Job deleted successfully"}

@router.post("/{job_id}/favorite")
async def toggle_favorite_job(
    job_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Toggle favorite status for a job
    """
    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if already favorited
    favorite = db.query(JobFavorite).filter(
        JobFavorite.job_id == job_id,
        JobFavorite.user_id == current_user.id
    ).first()
    
    if favorite:
        # Remove from favorites
        db.delete(favorite)
        db.commit()
        return {"message": "Job removed from favorites"}
    else:
        # Add to favorites
        new_favorite = JobFavorite(
            job_id=job_id,
            user_id=current_user.id
        )
        db.add(new_favorite)
        db.commit()
        return {"message": "Job added to favorites"}

@router.get("/favorites", response_model=List[JobListResponse])
async def get_favorite_jobs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20
):
    """
    Get all jobs favorited by the current user
    """
    favorites = db.query(Job).join(
        JobFavorite, Job.id == JobFavorite.job_id
    ).filter(
        JobFavorite.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return favorites

@router.get("/{job_id}/match", response_model=JobMatchScoreResponse)
async def get_job_match(
    job_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get match score between user and job
    """
    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Get match score
    match_score = db.query(JobMatchScore).filter(
        JobMatchScore.job_id == job_id,
        JobMatchScore.user_id == current_user.id
    ).first()
    
    if not match_score:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Match score not found"
        )
    
    return match_score 
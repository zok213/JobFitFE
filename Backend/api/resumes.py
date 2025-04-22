from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from datetime import datetime

from Backend.db.database import get_db
from Backend.models.resume import Resume, Education, Experience, ResumeSkill
from Backend.api.auth import get_current_user
from Backend.schemas.resume import (
    ResumeResponse,
    ResumeCreate,
    ResumeUpdate,
    EducationCreate,
    EducationUpdate,
    EducationResponse,
    ExperienceCreate,
    ExperienceUpdate,
    ExperienceResponse,
    ResumeSkillCreate,
    ResumeSkillUpdate,
    ResumeSkillResponse
)
from Backend.services.resume_parser import parse_resume

router = APIRouter()

# Helper function to validate resume file
def validate_resume_file(file: UploadFile):
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]
    allowed_extensions = [".pdf", ".docx", ".doc"]
    
    # Check content type
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Please upload a PDF, DOCX, or DOC file."
        )
    
    # Check file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file extension. Please upload a PDF, DOCX, or DOC file."
        )
    
    # Check file size (max 5MB)
    file.file.seek(0, os.SEEK_END)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is too large. Maximum file size is 5MB."
        )
    
    return file_extension, file_size

@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all resumes for the current user
    """
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific resume by ID
    """
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    return resume

@router.post("/", response_model=ResumeResponse)
async def upload_resume(
    background_tasks: BackgroundTasks,
    title: str,
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a new resume
    """
    # Validate file
    file_extension, file_size = validate_resume_file(file)
    
    # Create directory for user's resumes if it doesn't exist
    user_upload_dir = os.path.join("uploads", "resumes", current_user.id)
    os.makedirs(user_upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_name = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(user_upload_dir, file_name)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create resume record
    new_resume = Resume(
        user_id=current_user.id,
        title=title,
        file_path=file_path,
        file_type=file_extension[1:],  # Remove the dot
        file_size=file_size
    )
    
    # Make the resume the default if it's the user's first resume
    existing_resumes = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    if existing_resumes == 0:
        new_resume.is_default = True
    
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    # Parse resume in the background
    background_tasks.add_task(
        parse_resume, 
        resume_id=new_resume.id, 
        db=db
    )
    
    return new_resume

@router.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    resume_data: ResumeUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update resume details
    """
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Update fields
    for field, value in resume_data.dict(exclude_unset=True).items():
        if field == "is_default" and value:
            # If setting this resume as default, unset default flag on other resumes
            if value:
                db.query(Resume).filter(
                    Resume.user_id == current_user.id,
                    Resume.id != resume_id
                ).update({"is_default": False})
        
        setattr(resume, field, value)
    
    db.commit()
    db.refresh(resume)
    
    return resume

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a resume
    """
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Delete the file if it exists
    if resume.file_path and os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except:
            pass
    
    # Delete the resume from database
    db.delete(resume)
    
    # If this was the default resume, set another resume as default
    if resume.is_default:
        another_resume = db.query(Resume).filter(
            Resume.user_id == current_user.id,
            Resume.id != resume_id
        ).first()
        
        if another_resume:
            another_resume.is_default = True
    
    db.commit()
    
    return {"message": "Resume deleted successfully"}

# Education routes
@router.post("/{resume_id}/education", response_model=EducationResponse)
async def add_education(
    resume_id: str,
    education_data: EducationCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add education to a resume
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Create education
    education = Education(
        resume_id=resume_id,
        **education_data.dict()
    )
    
    db.add(education)
    db.commit()
    db.refresh(education)
    
    return education

@router.put("/{resume_id}/education/{education_id}", response_model=EducationResponse)
async def update_education(
    resume_id: str,
    education_id: str,
    education_data: EducationUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update education entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get education
    education = db.query(Education).filter(Education.id == education_id, Education.resume_id == resume_id).first()
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    # Update fields
    for field, value in education_data.dict(exclude_unset=True).items():
        setattr(education, field, value)
    
    db.commit()
    db.refresh(education)
    
    return education

@router.delete("/{resume_id}/education/{education_id}")
async def delete_education(
    resume_id: str,
    education_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete education entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get education
    education = db.query(Education).filter(Education.id == education_id, Education.resume_id == resume_id).first()
    if not education:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Education not found"
        )
    
    db.delete(education)
    db.commit()
    
    return {"message": "Education deleted successfully"}

# Experience routes
@router.post("/{resume_id}/experience", response_model=ExperienceResponse)
async def add_experience(
    resume_id: str,
    experience_data: ExperienceCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add experience to a resume
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Create experience
    experience = Experience(
        resume_id=resume_id,
        **experience_data.dict()
    )
    
    db.add(experience)
    db.commit()
    db.refresh(experience)
    
    return experience

@router.put("/{resume_id}/experience/{experience_id}", response_model=ExperienceResponse)
async def update_experience(
    resume_id: str,
    experience_id: str,
    experience_data: ExperienceUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update experience entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get experience
    experience = db.query(Experience).filter(Experience.id == experience_id, Experience.resume_id == resume_id).first()
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    # Update fields
    for field, value in experience_data.dict(exclude_unset=True).items():
        setattr(experience, field, value)
    
    db.commit()
    db.refresh(experience)
    
    return experience

@router.delete("/{resume_id}/experience/{experience_id}")
async def delete_experience(
    resume_id: str,
    experience_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete experience entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get experience
    experience = db.query(Experience).filter(Experience.id == experience_id, Experience.resume_id == resume_id).first()
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    db.delete(experience)
    db.commit()
    
    return {"message": "Experience deleted successfully"}

# Skill routes
@router.post("/{resume_id}/skills", response_model=ResumeSkillResponse)
async def add_skill(
    resume_id: str,
    skill_data: ResumeSkillCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add skill to a resume
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Check if skill already exists
    existing_skill = db.query(ResumeSkill).filter(
        ResumeSkill.resume_id == resume_id,
        ResumeSkill.name == skill_data.name
    ).first()
    
    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill already exists in this resume"
        )
    
    # Create skill
    skill = ResumeSkill(
        resume_id=resume_id,
        **skill_data.dict()
    )
    
    db.add(skill)
    db.commit()
    db.refresh(skill)
    
    return skill

@router.put("/{resume_id}/skills/{skill_id}", response_model=ResumeSkillResponse)
async def update_skill(
    resume_id: str,
    skill_id: str,
    skill_data: ResumeSkillUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update skill entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get skill
    skill = db.query(ResumeSkill).filter(ResumeSkill.id == skill_id, ResumeSkill.resume_id == resume_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    # Check for name conflicts if name is being changed
    if skill_data.name and skill_data.name != skill.name:
        existing_skill = db.query(ResumeSkill).filter(
            ResumeSkill.resume_id == resume_id,
            ResumeSkill.name == skill_data.name,
            ResumeSkill.id != skill_id
        ).first()
        
        if existing_skill:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Skill name already exists in this resume"
            )
    
    # Update fields
    for field, value in skill_data.dict(exclude_unset=True).items():
        setattr(skill, field, value)
    
    db.commit()
    db.refresh(skill)
    
    return skill

@router.delete("/{resume_id}/skills/{skill_id}")
async def delete_skill(
    resume_id: str,
    skill_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete skill entry
    """
    # Verify resume belongs to user
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    
    # Get skill
    skill = db.query(ResumeSkill).filter(ResumeSkill.id == skill_id, ResumeSkill.resume_id == resume_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
    
    db.delete(skill)
    db.commit()
    
    return {"message": "Skill deleted successfully"} 
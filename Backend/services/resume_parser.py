import os
import re
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import docx2txt
import PyPDF2
from sqlalchemy.orm import Session

from Backend.models.resume import Resume, Education, Experience, ResumeSkill

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return ""

def extract_text_from_docx(file_path: str) -> str:
    """Extract text from a DOCX file"""
    try:
        text = docx2txt.process(file_path)
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}")
        return ""

def extract_text_from_doc(file_path: str) -> str:
    """Extract text from a DOC file"""
    # This is a placeholder. For real implementation, you might need antiword or textract
    # For simplicity, we'll return an error message
    return "DOC file parsing not implemented. Please convert to DOCX or PDF."

def extract_text(file_path: str, file_type: str) -> str:
    """Extract text from a resume file based on its type"""
    if file_type.lower() == "pdf":
        return extract_text_from_pdf(file_path)
    elif file_type.lower() == "docx":
        return extract_text_from_docx(file_path)
    elif file_type.lower() == "doc":
        return extract_text_from_doc(file_path)
    else:
        return f"Unsupported file type: {file_type}"

def extract_education(text: str) -> List[Dict[str, Any]]:
    """Extract education information from resume text"""
    # This is a simple implementation
    # For a production app, you'd use more sophisticated NLP or ML techniques
    education_list = []
    
    # Look for education section
    education_pattern = r'(?i)education|academic|degree|university|college|school'
    education_matches = re.search(education_pattern, text)
    
    if education_matches:
        # Very basic extraction - in production you'd use more sophisticated parsing
        # This is just a placeholder for demonstration
        education_text = text[education_matches.start():]
        # Extract first 500 chars after education section starts
        education_text = education_text[:500]
        
        # Just create a single education entry as placeholder
        education = {
            "institution": "Extract from resume",
            "degree": "Extract from resume",
            "field_of_study": "Extract from resume",
            "start_date": None,
            "end_date": None,
            "is_current": False,
        }
        education_list.append(education)
    
    return education_list

def extract_experience(text: str) -> List[Dict[str, Any]]:
    """Extract work experience from resume text"""
    # This is a simple implementation
    # For a production app, you'd use more sophisticated NLP or ML techniques
    experience_list = []
    
    # Look for experience section
    experience_pattern = r'(?i)experience|work|employment|career|job'
    experience_matches = re.search(experience_pattern, text)
    
    if experience_matches:
        # Very basic extraction - in production you'd use more sophisticated parsing
        # This is just a placeholder for demonstration
        experience_text = text[experience_matches.start():]
        # Extract first 500 chars after experience section starts
        experience_text = experience_text[:500]
        
        # Just create a single experience entry as placeholder
        experience = {
            "title": "Extract from resume",
            "company": "Extract from resume",
            "location": "Extract from resume",
            "start_date": None,
            "end_date": None,
            "is_current": False,
            "description": "Extract from resume"
        }
        experience_list.append(experience)
    
    return experience_list

def extract_skills(text: str) -> List[Dict[str, Any]]:
    """Extract skills from resume text"""
    # This is a simple implementation
    # For a production app, you'd use more sophisticated NLP or ML techniques
    skills_list = []
    
    # Basic skill keywords to look for
    common_skills = [
        "python", "javascript", "java", "c++", "c#", "sql", "html", "css",
        "react", "angular", "vue", "node", "express", "django", "flask",
        "aws", "azure", "gcp", "docker", "kubernetes", "agile", "scrum"
    ]
    
    # Look for skills
    for skill in common_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text.lower()):
            skills_list.append({
                "name": skill.title(),
                "proficiency": None,
                "years_experience": None
            })
    
    return skills_list

def parse_resume(resume_id: str, db: Session) -> None:
    """Parse a resume and extract information"""
    try:
        # Get resume from database
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            logger.error(f"Resume not found: {resume_id}")
            return
        
        # Extract text based on file type
        extracted_text = extract_text(resume.file_path, resume.file_type)
        if not extracted_text:
            logger.error(f"Failed to extract text from resume: {resume_id}")
            return
        
        # Update resume with extracted text
        resume.parsed_text = extracted_text
        resume.parsed = True
        resume.last_parsed_at = datetime.utcnow()
        
        # Extract education, experience, and skills
        education_list = extract_education(extracted_text)
        experience_list = extract_experience(extracted_text)
        skills_list = extract_skills(extracted_text)
        
        # Add education entries
        for edu_data in education_list:
            education = Education(resume_id=resume_id, **edu_data)
            db.add(education)
        
        # Add experience entries
        for exp_data in experience_list:
            experience = Experience(resume_id=resume_id, **exp_data)
            db.add(experience)
        
        # Add skill entries
        for skill_data in skills_list:
            # Check if skill already exists
            existing_skill = db.query(ResumeSkill).filter(
                ResumeSkill.resume_id == resume_id,
                ResumeSkill.name == skill_data["name"]
            ).first()
            
            if not existing_skill:
                skill = ResumeSkill(resume_id=resume_id, **skill_data)
                db.add(skill)
        
        # Commit changes
        db.commit()
        logger.info(f"Successfully parsed resume: {resume_id}")
        
    except Exception as e:
        logger.error(f"Error parsing resume {resume_id}: {str(e)}")
        # If there's an error, still mark the resume as parsed but with error
        try:
            resume = db.query(Resume).filter(Resume.id == resume_id).first()
            if resume:
                resume.parsed = True
                resume.last_parsed_at = datetime.utcnow()
                db.commit()
        except Exception as inner_e:
            logger.error(f"Error updating resume status: {str(inner_e)}")
import os
import logging
import json
from typing import Dict, Any, List, Optional, Tuple
import re

from Backend.services.ai_service import AIService, AIModelProvider
from Backend.services.resume_parser import extract_text, extract_education, extract_experience, extract_skills

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CVScreeningService:
    """Service for screening and evaluating candidate CVs/resumes"""
    
    def __init__(self):
        """Initialize the CV screening service"""
        self.ai_service = AIService()
    
    async def screen_cv(
        self, 
        cv_text: str, 
        job_title: str, 
        job_description: str, 
        requirements: List[str]
    ) -> Dict[str, Any]:
        """
        Screen and evaluate a CV against job requirements
        
        Args:
            cv_text: The extracted text from the CV/resume
            job_title: The title of the job
            job_description: The description of the job
            requirements: List of job requirements
            
        Returns:
            Dictionary containing screening results including score and match details
        """
        try:
            # Extract CV components
            education = extract_education(cv_text)
            experience = extract_experience(cv_text)
            skills = extract_skills(cv_text)
            
            # Generate candidate summary
            candidate_summary = await self._generate_candidate_summary(cv_text)
            
            # Evaluate candidate against job profile
            evaluation = await self._evaluate_candidate(
                candidate_summary=candidate_summary,
                education=education,
                experience=experience,
                skills=skills,
                job_title=job_title,
                job_description=job_description,
                requirements=requirements
            )
            
            # Calculate match score
            match_score, score_breakdown = await self._calculate_match_score(
                cv_text=cv_text,
                job_title=job_title,
                job_description=job_description,
                requirements=requirements,
                evaluation=evaluation
            )
            
            # Generate detailed considerations
            considerations = await self._generate_considerations(
                evaluation=evaluation,
                match_score=match_score,
                job_title=job_title
            )
            
            return {
                "candidate_summary": candidate_summary,
                "extracted_education": education,
                "extracted_experience": experience,
                "extracted_skills": skills,
                "evaluation": evaluation,
                "match_score": match_score,
                "score_breakdown": score_breakdown,
                "considerations": considerations
            }
            
        except Exception as e:
            logger.error(f"Error screening CV: {str(e)}")
            return {
                "error": str(e),
                "candidate_summary": "Error generating candidate summary",
                "extracted_education": [],
                "extracted_experience": [],
                "extracted_skills": [],
                "evaluation": "Unable to evaluate candidate",
                "match_score": 0,
                "score_breakdown": {},
                "considerations": [
                    "An error occurred while processing this CV",
                    "Please try again or contact support if the issue persists"
                ]
            }
    
    async def _generate_candidate_summary(self, cv_text: str) -> str:
        """
        Generate a concise summary of the candidate based on their CV
        
        Args:
            cv_text: The extracted text from the CV/resume
            
        Returns:
            A summary of the candidate's background and qualifications
        """
        prompt = f"""
        Please provide a concise professional summary of the candidate based on the following CV.
        Focus on their career trajectory, education, key skills, and notable achievements.
        Keep the summary to 3-5 sentences.

        CV TEXT:
        {cv_text[:5000]}  # Limiting text length to avoid token issues
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=300,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error generating candidate summary: {result['error']}")
                return "Unable to generate candidate summary. Please review the CV directly."
            
            return result["text"].strip()
        
        except Exception as e:
            logger.error(f"Error generating candidate summary: {str(e)}")
            return "Unable to generate candidate summary. Please review the CV directly."
    
    async def _evaluate_candidate(
        self,
        candidate_summary: str,
        education: List[Dict[str, str]],
        experience: List[Dict[str, str]],
        skills: List[str],
        job_title: str,
        job_description: str,
        requirements: List[str]
    ) -> str:
        """
        Evaluate the candidate against the job requirements
        
        Args:
            candidate_summary: Summary of the candidate
            education: Extracted education information
            experience: Extracted experience information
            skills: Extracted skills
            job_title: The title of the job
            job_description: The description of the job
            requirements: List of job requirements
            
        Returns:
            Evaluation text detailing how well the candidate matches the job
        """
        # Format education and experience for prompt
        education_text = "\n".join([f"- {edu.get('degree', 'Degree')} in {edu.get('field', 'Field')} from {edu.get('institution', 'Institution')}, {edu.get('date', 'Date')}" for edu in education]) if education else "No education information extracted"
        
        experience_text = "\n".join([f"- {exp.get('title', 'Title')} at {exp.get('company', 'Company')}, {exp.get('date', 'Date')}: {exp.get('description', 'No description')[:100]}..." for exp in experience]) if experience else "No experience information extracted"
        
        skills_text = ", ".join(skills) if skills else "No skills extracted"
        
        requirements_text = "\n".join([f"- {req}" for req in requirements])
        
        prompt = f"""
        Evaluate how well the candidate matches the job requirements based on the following information:
        
        JOB TITLE: {job_title}
        
        JOB DESCRIPTION:
        {job_description[:500]}...
        
        JOB REQUIREMENTS:
        {requirements_text}
        
        CANDIDATE SUMMARY:
        {candidate_summary}
        
        CANDIDATE EDUCATION:
        {education_text}
        
        CANDIDATE EXPERIENCE:
        {experience_text}
        
        CANDIDATE SKILLS:
        {skills_text}
        
        Please provide a detailed evaluation that addresses:
        1. How well the candidate's education matches the job requirements
        2. How relevant their work experience is to the position
        3. The alignment between their skills and the required skills
        4. Any notable strengths or potential areas of concern

        Keep the evaluation objective, balanced, and professional. Provide specific examples from their background to support your assessment.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=800,
                temperature=0.4
            )
            
            if "error" in result:
                logger.error(f"Error evaluating candidate: {result['error']}")
                return "Unable to evaluate candidate against job requirements. Please review the CV manually."
            
            return result["text"].strip()
        
        except Exception as e:
            logger.error(f"Error evaluating candidate: {str(e)}")
            return "Unable to evaluate candidate against job requirements. Please review the CV manually."
    
    async def _calculate_match_score(
        self,
        cv_text: str,
        job_title: str,
        job_description: str,
        requirements: List[str],
        evaluation: str
    ) -> Tuple[int, Dict[str, int]]:
        """
        Calculate a match score for how well the candidate matches the job
        
        Args:
            cv_text: The extracted text from the CV/resume
            job_title: The title of the job
            job_description: The description of the job
            requirements: List of job requirements
            evaluation: The candidate evaluation text
            
        Returns:
            Tuple containing overall match score (0-100) and score breakdown by category
        """
        requirements_text = "\n".join([f"- {req}" for req in requirements])
        
        prompt = f"""
        Based on the candidate's CV and the job requirements, calculate a match score (0-100) indicating how well the candidate matches the job.
        
        JOB TITLE: {job_title}
        
        JOB DESCRIPTION:
        {job_description[:300]}...
        
        JOB REQUIREMENTS:
        {requirements_text}
        
        CANDIDATE EVALUATION:
        {evaluation}
        
        Please calculate scores in the following categories and an overall score:
        1. Education fit (0-100): How well does the candidate's education match the requirements?
        2. Experience fit (0-100): How relevant is the candidate's work experience?
        3. Skills match (0-100): How well do the candidate's skills align with required skills?
        4. Overall fit (0-100): Overall match score considering all factors
        
        Return only a JSON object with the scores, like this:
        {{
            "education_fit": 85,
            "experience_fit": 70,
            "skills_match": 90,
            "overall_fit": 80
        }}
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=200,
                temperature=0.2
            )
            
            if "error" in result:
                logger.error(f"Error calculating match score: {result['error']}")
                return 0, {"education_fit": 0, "experience_fit": 0, "skills_match": 0, "overall_fit": 0}
            
            # Extract JSON from response
            text = result["text"]
            match = re.search(r'\{.*\}', text, re.DOTALL)
            
            if not match:
                logger.error("Could not extract JSON from response")
                return 0, {"education_fit": 0, "experience_fit": 0, "skills_match": 0, "overall_fit": 0}
            
            score_json = json.loads(match.group(0))
            overall_score = score_json.get("overall_fit", 0)
            
            # Create score breakdown
            score_breakdown = {
                "education_fit": score_json.get("education_fit", 0),
                "experience_fit": score_json.get("experience_fit", 0),
                "skills_match": score_json.get("skills_match", 0)
            }
            
            return overall_score, score_breakdown
        
        except Exception as e:
            logger.error(f"Error calculating match score: {str(e)}")
            return 0, {"education_fit": 0, "experience_fit": 0, "skills_match": 0, "overall_fit": 0}
    
    async def _generate_considerations(
        self,
        evaluation: str,
        match_score: int,
        job_title: str
    ) -> List[str]:
        """
        Generate considerations and next steps based on the evaluation
        
        Args:
            evaluation: The candidate evaluation text
            match_score: The overall match score (0-100)
            job_title: The title of the job
            
        Returns:
            List of considerations and recommended next steps
        """
        prompt = f"""
        Based on the following evaluation and match score, provide 3-5 key considerations for hiring managers regarding this candidate for the {job_title} position.
        
        MATCH SCORE: {match_score}/100
        
        EVALUATION:
        {evaluation}
        
        These considerations should include:
        - Key strengths relevant to the position
        - Potential areas of concern or gaps
        - Recommended follow-up questions for interviews
        - Suggested next steps in the hiring process
        
        Return only a list of bullet points, each as a separate item, without any introduction or conclusion.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=500,
                temperature=0.4
            )
            
            if "error" in result:
                logger.error(f"Error generating considerations: {result['error']}")
                return self._generate_fallback_considerations(match_score)
            
            # Split by newlines and clean up bullet points
            considerations = []
            for line in result["text"].strip().split('\n'):
                line = line.strip()
                if line:
                    # Remove bullet point markers (-, *, •) from the beginning of lines
                    line = re.sub(r'^[-*•]+\s*', '', line)
                    considerations.append(line)
            
            return considerations
        
        except Exception as e:
            logger.error(f"Error generating considerations: {str(e)}")
            return self._generate_fallback_considerations(match_score)
    
    def _generate_fallback_considerations(self, match_score: int) -> List[str]:
        """Generate fallback considerations when AI generation fails"""
        if match_score >= 80:
            return [
                "The candidate appears to be a strong match for the position based on qualifications and experience",
                "Consider scheduling an interview to assess cultural fit and soft skills",
                "Prepare technical questions to validate the skills listed on the resume",
                "Verify the candidate's achievements and experience through reference checks"
            ]
        elif match_score >= 50:
            return [
                "The candidate meets some but not all of the job requirements",
                "Consider whether training could bridge any skills gaps",
                "Ask for work samples or portfolio to better assess capabilities",
                "Conduct a technical assessment to verify skills relevant to the position"
            ]
        else:
            return [
                "The candidate does not appear to meet the key requirements for this position",
                "Consider whether the candidate might be suitable for other open positions",
                "If pursuing, prepare specific questions about how they would address their experience gaps",
                "Recommend looking for candidates with more relevant experience and skills"
            ] 
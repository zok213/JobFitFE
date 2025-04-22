import os
import logging
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

from Backend.services.ai_service import AIService, AIModelProvider

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResumeGeneratorService:
    """Service for generating resumes and cover letters"""
    
    def __init__(self):
        """Initialize the resume generator service"""
        self.ai_service = AIService()
    
    async def extract_resume_keywords(self, resume_text: str) -> List[str]:
        """
        Extract keywords from a resume
        
        Args:
            resume_text: The text content of the resume
            
        Returns:
            List of keywords extracted from the resume
        """
        prompt = f"""
        Please extract the most important keywords from the following resume. 
        Focus on skills, technologies, job titles, and qualifications.
        Return ONLY a list of keywords, separated by commas.

        RESUME:
        {resume_text}
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=200,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error extracting resume keywords: {result['error']}")
                return []
            
            # Parse comma-separated list
            keywords = [kw.strip() for kw in result["text"].split(",")]
            return [kw for kw in keywords if kw]  # Filter out empty strings
        
        except Exception as e:
            logger.error(f"Error extracting resume keywords: {str(e)}")
            return []
            
    async def extract_job_description_keywords(self, job_description: str) -> List[str]:
        """
        Extract keywords from a job description
        
        Args:
            job_description: The text content of the job description
            
        Returns:
            List of keywords extracted from the job description
        """
        prompt = f"""
        Please extract the most important keywords from the following job description.
        Focus on required skills, technologies, qualifications, and responsibilities.
        Return ONLY a list of keywords, separated by commas.

        JOB DESCRIPTION:
        {job_description}
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=200,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error extracting job description keywords: {result['error']}")
                return []
            
            # Parse comma-separated list
            keywords = [kw.strip() for kw in result["text"].split(",")]
            return [kw for kw in keywords if kw]  # Filter out empty strings
        
        except Exception as e:
            logger.error(f"Error extracting job description keywords: {str(e)}")
            return []
    
    async def refine_keywords(self, resume_keywords: List[str], job_keywords: List[str]) -> List[str]:
        """
        Refine and prioritize keywords based on matches between resume and job description
        
        Args:
            resume_keywords: Keywords extracted from the resume
            job_keywords: Keywords extracted from the job description
            
        Returns:
            Refined list of keywords
        """
        prompt = f"""
        I have extracted keywords from a resume and a job description.
        
        Resume Keywords: {', '.join(resume_keywords)}
        
        Job Description Keywords: {', '.join(job_keywords)}
        
        Please analyze these keywords and provide a refined list that:
        1. Prioritizes keywords that appear in both lists
        2. Includes important keywords from the job description that should be emphasized
        3. Suggests additional relevant keywords that might be beneficial
        
        Return ONLY a list of keywords, separated by commas.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=300,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error refining keywords: {result['error']}")
                return resume_keywords  # Fallback to original resume keywords
            
            # Parse comma-separated list
            keywords = [kw.strip() for kw in result["text"].split(",")]
            return [kw for kw in keywords if kw]  # Filter out empty strings
        
        except Exception as e:
            logger.error(f"Error refining keywords: {str(e)}")
            return resume_keywords  # Fallback to original resume keywords
    
    async def generate_resume_content(
        self, 
        user_data: Dict[str, Any], 
        resume_text: str, 
        job_description: str = None,
        refined_keywords: List[str] = None
    ) -> Dict[str, Any]:
        """
        Generate resume content tailored to a job description
        
        Args:
            user_data: User information and preferences
            resume_text: Original resume text
            job_description: Job description to tailor resume to (optional)
            refined_keywords: List of refined keywords (optional)
            
        Returns:
            Generated resume content including summary, skills, and achievements
        """
        # Prepare base prompt
        prompt = f"""
        Generate professional resume content based on the following information:
        
        USER INFORMATION:
        {json.dumps(user_data, indent=2)}
        
        ORIGINAL RESUME:
        {resume_text}
        """
        
        # Add job description if available
        if job_description:
            prompt += f"""
            
            JOB DESCRIPTION TO TAILOR FOR:
            {job_description}
            """
        
        # Add refined keywords if available
        if refined_keywords:
            prompt += f"""
            
            KEYWORDS TO EMPHASIZE:
            {', '.join(refined_keywords)}
            """
        
        prompt += """
        
        Please generate the following resume sections:
        1. A professional summary (3-4 sentences)
        2. A skills section (bullet points, organized by category)
        3. Professional achievements (3-5 bullet points highlighting key accomplishments)
        
        Return the content as a JSON object with the following structure:
        {
            "summary": "Professional summary text",
            "skills": [
                {
                    "category": "Category name",
                    "skills": ["Skill 1", "Skill 2", ...]
                },
                ...
            ],
            "achievements": [
                "Achievement 1",
                "Achievement 2",
                ...
            ]
        }
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=1500,
                temperature=0.5
            )
            
            if "error" in result:
                logger.error(f"Error generating resume content: {result['error']}")
                return self._generate_fallback_resume_content()
            
            # Extract JSON from response
            text = result["text"]
            json_start = text.find("{")
            json_end = text.rfind("}") + 1
            
            if json_start == -1 or json_end == 0:
                logger.error("Error parsing JSON from response")
                return self._generate_fallback_resume_content()
            
            json_str = text[json_start:json_end]
            return json.loads(json_str)
        
        except Exception as e:
            logger.error(f"Error generating resume content: {str(e)}")
            return self._generate_fallback_resume_content()
    
    async def generate_cover_letter(
        self, 
        user_data: Dict[str, Any], 
        resume_text: str, 
        job_description: str,
        company_name: str,
        hiring_manager: str = None
    ) -> str:
        """
        Generate a cover letter tailored to a job description
        
        Args:
            user_data: User information and preferences
            resume_text: Original resume text
            job_description: Job description to tailor cover letter to
            company_name: Name of the company
            hiring_manager: Name of the hiring manager (optional)
            
        Returns:
            Generated cover letter text
        """
        # Gather company information
        company_info = await self._get_company_info(company_name)
        
        # Prepare prompt
        prompt = f"""
        Generate a professional cover letter based on the following information:
        
        USER INFORMATION:
        {json.dumps(user_data, indent=2)}
        
        RESUME HIGHLIGHTS:
        {resume_text[:500]}... (truncated)
        
        JOB DESCRIPTION:
        {job_description}
        
        COMPANY:
        {company_name}
        """
        
        if company_info:
            prompt += f"""
            COMPANY INFORMATION:
            {company_info}
            """
        
        if hiring_manager:
            prompt += f"""
            HIRING MANAGER:
            {hiring_manager}
            """
        
        prompt += """
        
        Please write a professional cover letter that:
        1. Opens with a strong introduction that captures attention
        2. Highlights relevant skills and experiences that match the job description
        3. Explains why the candidate is interested in the company specifically
        4. Concludes with a call to action
        
        Format the letter professionally with appropriate salutation and closing.
        The tone should be confident but not arrogant, enthusiastic but professional.
        Keep the letter concise, approximately 300-400 words.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=2000,
                temperature=0.7
            )
            
            if "error" in result:
                logger.error(f"Error generating cover letter: {result['error']}")
                return self._generate_fallback_cover_letter(user_data["name"] if "name" in user_data else "", company_name)
            
            return result["text"]
        
        except Exception as e:
            logger.error(f"Error generating cover letter: {str(e)}")
            return self._generate_fallback_cover_letter(user_data["name"] if "name" in user_data else "", company_name)
    
    async def _get_company_info(self, company_name: str) -> str:
        """
        Get information about a company for use in cover letter generation
        
        Args:
            company_name: Name of the company
            
        Returns:
            String with company information
        """
        prompt = f"""
        Please provide brief information about {company_name}, including:
        1. The company's mission and values
        2. Major products or services
        3. Company culture or working environment
        
        Keep the information concise, about 3-5 sentences in total.
        If you don't have specific information about this company, indicate that.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=300,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error getting company info: {result['error']}")
                return ""
            
            return result["text"]
        
        except Exception as e:
            logger.error(f"Error getting company info: {str(e)}")
            return ""
    
    def _generate_fallback_resume_content(self) -> Dict[str, Any]:
        """Generate fallback resume content when AI generation fails"""
        return {
            "summary": "Experienced professional with a proven track record of success in the field. Skilled in problem-solving, communication, and teamwork with a strong focus on delivering results.",
            "skills": [
                {
                    "category": "Technical Skills",
                    "skills": ["Microsoft Office", "Data Analysis", "Project Management"]
                },
                {
                    "category": "Soft Skills",
                    "skills": ["Communication", "Leadership", "Problem-solving", "Teamwork"]
                }
            ],
            "achievements": [
                "Successfully delivered projects on time and within budget",
                "Improved team productivity through effective process improvements",
                "Received recognition for outstanding performance and initiative"
            ]
        }
    
    def _generate_fallback_cover_letter(self, name: str, company_name: str) -> str:
        """Generate fallback cover letter when AI generation fails"""
        today = datetime.now().strftime("%B %d, %Y")
        
        return f"""
        {today}

        Dear Hiring Manager,

        I am writing to express my interest in the position at {company_name}. With my background and skills, I believe I am well-qualified for this role and would be a valuable addition to your team.

        Throughout my career, I have developed strong skills in problem-solving, communication, and teamwork. I am excited about the opportunity to bring these abilities to {company_name} and contribute to your ongoing success.

        I am particularly drawn to {company_name} because of your reputation for excellence and innovation in the industry. I am confident that my experience and enthusiasm would allow me to make significant contributions to your team.

        Thank you for considering my application. I look forward to the opportunity to discuss how my qualifications align with your needs in more detail.

        Sincerely,
        {name}
        """ 
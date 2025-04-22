import os
import logging
import openai
from typing import List, Dict, Any
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_interview_questions(job_title: str, job_description: str, job_requirements: str = None) -> List[Dict[str, Any]]:
    """
    Generate AI-powered interview questions for a job
    """
    try:
        # Prepare the prompt
        prompt = f"""
        Generate 10 interview questions for a {job_title} position.
        
        Job Description:
        {job_description}
        
        """
        
        if job_requirements:
            prompt += f"""
            Job Requirements:
            {job_requirements}
            """
            
        prompt += """
        For each question, provide:
        1. The question text
        2. What the interviewer is looking for in the answer
        3. A sample good answer
        4. The question category (Technical, Behavioral, Experience, etc.)
        
        Return the result as a JSON array of objects with the following structure:
        [
            {
                "question": "Question text",
                "looking_for": "What the interviewer is looking for",
                "sample_answer": "A sample good answer",
                "category": "Question category"
            },
            ...
        ]
        """
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert interviewer who creates highly relevant interview questions for job positions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Parse the response
        content = response.choices[0].message.content
        
        # Extract JSON part
        json_start = content.find("[")
        json_end = content.rfind("]") + 1
        
        if json_start == -1 or json_end == 0:
            # Fallback if JSON parsing fails
            return generate_fallback_questions(job_title)
        
        json_str = content[json_start:json_end]
        questions = json.loads(json_str)
        
        # Validate and clean up the questions
        valid_questions = []
        for i, q in enumerate(questions[:10]):  # Limit to 10 questions
            try:
                valid_question = {
                    "id": str(i+1),
                    "question": q.get("question", ""),
                    "looking_for": q.get("looking_for", ""),
                    "sample_answer": q.get("sample_answer", ""),
                    "category": q.get("category", "General")
                }
                valid_questions.append(valid_question)
            except Exception as e:
                logger.error(f"Error processing question {i}: {str(e)}")
        
        return valid_questions
    
    except Exception as e:
        logger.error(f"Error generating interview questions: {str(e)}")
        return generate_fallback_questions(job_title)

def generate_fallback_questions(job_title: str) -> List[Dict[str, Any]]:
    """
    Generate fallback interview questions when the AI generation fails
    """
    fallback_questions = [
        {
            "id": "1",
            "question": f"Tell me about your previous experience related to {job_title} positions.",
            "looking_for": "The candidate should demonstrate relevant experience and achievements in similar roles.",
            "sample_answer": "In my previous role as a [Similar Role], I worked on [relevant projects/responsibilities] which improved [metric] by [achievement]. This experience directly relates to the requirements for this position.",
            "category": "Experience"
        },
        {
            "id": "2",
            "question": "What are your greatest strengths and how would they contribute to this role?",
            "looking_for": "The candidate should identify strengths relevant to the position and provide examples.",
            "sample_answer": "My greatest strengths are [specific skills relevant to job]. For example, when I [specific situation], I was able to [action taken] which resulted in [positive outcome].",
            "category": "Behavioral"
        },
        {
            "id": "3",
            "question": "Describe a challenging situation you faced at work and how you resolved it.",
            "looking_for": "Looking for problem-solving abilities, resilience, and practical approaches to difficulties.",
            "sample_answer": "I faced a challenge when [specific problem]. I approached it by [actions taken], which resulted in [positive outcome]. This taught me [lesson learned].",
            "category": "Behavioral"
        },
        {
            "id": "4",
            "question": "Why are you interested in this position and our company?",
            "looking_for": "The candidate should demonstrate knowledge about the company and explain why they're a good fit.",
            "sample_answer": "I'm interested in your company because of [specific aspects of company culture/products/services]. This position aligns with my career goals in [specific ways] and I'm excited about contributing to [specific projects/goals].",
            "category": "Motivational"
        },
        {
            "id": "5",
            "question": "Where do you see yourself professionally in five years?",
            "looking_for": "The candidate should show ambition while being realistic, and demonstrate alignment with company growth.",
            "sample_answer": "In five years, I hope to have grown into a [target role] where I can [specific contributions]. I'm particularly interested in developing my skills in [relevant areas] which align with this role and your company's direction.",
            "category": "Career Goals"
        }
    ]
    
    return fallback_questions 
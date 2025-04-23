from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import os
import uuid
import tempfile
import uvicorn
from typing import Optional, Dict, Any, List, Union
import traceback
import json
import httpx
import asyncio

app = FastAPI(title="JobFit API", version="1.0.0")

# Cấu hình CORS để cho phép frontend kết nối
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong môi trường sản xuất nên chỉ định cụ thể origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khóa API của Jina AI DeepSearch
JINA_API_KEY = "jina_bafb743236fb458fb79db0dcaca4dd6cOcq6cZEzckw2sGbJgdvuy4fNvqHR"

# Models
class CVUploadResponse(BaseModel):
    id: str
    filename: str
    status: str
    extracted_text: Optional[str] = None
    message: Optional[str] = None

class JobMatchRequest(BaseModel):
    cv_text: str
    job_description: str

class JobMatchResponse(BaseModel):
    analysis: str
    match_score: int
    timestamp: str

@app.get("/")
async def root():
    return {"message": "JobFit API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/resumes/upload", response_model=CVUploadResponse)
async def upload_cv(file: UploadFile = File(...)):
    """
    Tải lên và xử lý file CV
    """
    try:
        # Tạo ID duy nhất cho CV
        cv_id = str(uuid.uuid4())
        
        # Kiểm tra định dạng file
        filename = file.filename
        file_extension = os.path.splitext(filename)[1].lower()
        
        if file_extension not in ['.pdf', '.docx', '.doc']:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or DOC files.")
        
        # Tạo thư mục tạm để lưu file
        temp_dir = tempfile.mkdtemp()
        temp_file_path = os.path.join(temp_dir, filename)
        
        # Lưu file tải lên vào thư mục tạm
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Giả định trích xuất văn bản từ file CV
        # Trong môi trường thực, bạn sẽ sử dụng thư viện như pdf-parse, mammoth...
        extracted_text = extract_text_from_cv(temp_file_path, file_extension)
        
        # Xóa file tạm sau khi xử lý
        shutil.rmtree(temp_dir)
        
        return {
            "id": cv_id,
            "filename": filename,
            "status": "success",
            "extracted_text": extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text,
            "message": "CV uploaded and processed successfully"
        }
    
    except Exception as e:
        print(f"Error processing CV: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process CV: {str(e)}")

@app.post("/api/cv/analyze")
async def analyze_cv(cv_text: str = Body(..., embed=True)):
    """
    Phân tích CV sử dụng Jina AI
    """
    try:
        # Cấu trúc payload cho API
        payload = {
            "model": "jina-deepsearch-v1",
            "messages": [
                {
                    "role": "user",
                    "content": f"""Provide a deep and insightful analysis on this CV: "{cv_text}". 
                    Ensure the response is well-structured with the following sections:
                    1. Candidate Summary: A brief overview of the candidate's background and skills
                    2. Key Skills: List and categorize their skills (technical, soft, domain knowledge)
                    3. Experience Analysis: Highlight important roles and achievements
                    4. Education: Analysis of educational background
                    5. Strengths: What makes this candidate stand out
                    6. Areas for Improvement: Constructive feedback on potential gaps
                    7. Job Fit Assessment: Types of roles this candidate would be suitable for
                    
                    Format the result in Markdown with clear headings and bullet points."""
                }
            ],
            "stream": False,
            "temperature": 0.7,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://deepsearch.jina.ai/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": f"Bearer {JINA_API_KEY}",
                    "User-Agent": "Mozilla/5.0",
                },
                json=payload,
                timeout=120.0
            )
            
            if response.status_code != 200:
                print(f"Error from Jina AI: {response.text}")
                raise HTTPException(status_code=response.status_code, 
                                  detail=f"Jina AI error: {response.text}")
            
            result = response.json()
            
            # Trích xuất nội dung
            content = ""
            if "choices" in result and len(result["choices"]) > 0:
                choice = result["choices"][0]
                if "message" in choice and "content" in choice["message"]:
                    content = choice["message"]["content"]
                elif "text" in choice:
                    content = choice["text"]
            
            if not content:
                raise HTTPException(status_code=500, detail="No content found in Jina AI response")
            
            return {"analysis": content, "timestamp": get_current_timestamp()}
    
    except Exception as e:
        print(f"Error analyzing CV: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to analyze CV: {str(e)}")

@app.post("/api/jobs/match", response_model=JobMatchResponse)
async def match_job(data: JobMatchRequest):
    """
    So khớp CV với mô tả công việc sử dụng Jina AI
    """
    try:
        # Cấu trúc payload cho API
        payload = {
            "model": "jina-deepsearch-v1",
            "messages": [
                {
                    "role": "user",
                    "content": f"""Analyze how well this candidate's CV matches the job description:
                    
CV Text:
"""
{data.cv_text}
"""

Job Description:
"""
{data.job_description}
"""

Please provide a comprehensive job match analysis with the following sections:
1. Match Score: Give an overall match percentage (0-100%) and brief explanation
2. Skills Match: List matching skills, missing skills, and exceeding skills
3. Experience Match: Analyze how the candidate's experience aligns with job requirements
4. Education Match: Evaluate educational requirements vs. candidate's qualifications
5. Key Strengths: Highlight the candidate's most relevant strengths for this role
6. Improvement Areas: Skills or experiences the candidate could develop to better match
7. Recommendations: Specific advice for the candidate to improve their fit for this role

Format the response in Markdown with clear headings and organized information."""
                }
            ],
            "stream": False,
            "temperature": 0.5,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://deepsearch.jina.ai/v1/chat/completions",
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": f"Bearer {JINA_API_KEY}",
                    "User-Agent": "Mozilla/5.0",
                },
                json=payload,
                timeout=120.0
            )
            
            if response.status_code != 200:
                print(f"Error from Jina AI: {response.text}")
                raise HTTPException(status_code=response.status_code, 
                                  detail=f"Jina AI error: {response.text}")
            
            result = response.json()
            
            # Trích xuất nội dung
            content = ""
            if "choices" in result and len(result["choices"]) > 0:
                choice = result["choices"][0]
                if "message" in choice and "content" in choice["message"]:
                    content = choice["message"]["content"]
                elif "text" in choice:
                    content = choice["text"]
            
            if not content:
                raise HTTPException(status_code=500, detail="No content found in Jina AI response")
            
            # Phân tích nội dung để lấy điểm match
            match_score = extract_match_score(content)
            
            return {
                "analysis": content, 
                "match_score": match_score,
                "timestamp": get_current_timestamp()
            }
    
    except Exception as e:
        print(f"Error matching job: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to match job: {str(e)}")

# Helper functions
def extract_text_from_cv(file_path, file_extension):
    """
    Hàm giả lập để trích xuất text từ CV
    Trong môi trường thực, nên sử dụng các thư viện chuyên dụng
    """
    try:
        # Mô phỏng việc trích xuất văn bản - trong thực tế sẽ sử dụng thư viện thích hợp
        # Ví dụ: PyPDF2, pdfminer.six cho PDF, python-docx cho DOCX
        
        # Trong bản demo này, chỉ trả về text giả lập
        return """DEMO CV CONTENT:
        
John Doe
Software Engineer with 5+ years of experience
john.doe@example.com | (123) 456-7890 | linkedin.com/in/johndoe
        
SKILLS
- Programming: Python, JavaScript, TypeScript, Java
- Web: React, Node.js, Express, HTML5, CSS3
- Data: SQL, MongoDB, PostgreSQL, Redis
- Tools: Git, Docker, AWS, Azure, CI/CD
        
EXPERIENCE
Senior Software Engineer | ABC Tech | 2019 - Present
- Led development of microservices architecture serving 1M+ users
- Optimized database performance resulting in 30% faster query response times
- Mentored junior developers and conducted code reviews
        
Software Developer | XYZ Solutions | 2017 - 2019
- Developed RESTful APIs for mobile applications
- Implemented OAuth 2.0 authentication system
- Collaborated with UX team to improve user interfaces
        
EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2013 - 2017
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Database Systems"""
    except Exception as e:
        print(f"Error extracting text from file: {str(e)}")
        return "Error extracting text from CV"

def extract_match_score(content):
    """
    Trích xuất điểm match từ nội dung phân tích
    """
    try:
        # Tìm phần trăm match trong nội dung
        import re
        match_pattern = re.compile(r'match(?:\s+score)?(?:\s*:?\s*)(\d{1,3})(?:\s*%)?', re.IGNORECASE)
        match = match_pattern.search(content)
        
        if match and match.group(1):
            score = int(match.group(1))
            return score if 0 <= score <= 100 else 0
    except Exception as e:
        print(f"Error extracting match score: {str(e)}")
    
    # Nếu không tìm thấy hoặc có lỗi, trả về 0
    return 0

def get_current_timestamp():
    """
    Trả về timestamp hiện tại dưới dạng chuỗi ISO
    """
    from datetime import datetime
    return datetime.now().isoformat()

if __name__ == "__main__":
    uvicorn.run("run_simple_server:app", host="0.0.0.0", port=8000, reload=True) 
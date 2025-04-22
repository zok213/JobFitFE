from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
import httpx
import json
import re
from pydantic import BaseModel
import uvicorn
import asyncio
import time

# Tạo FastAPI app với thông tin chi tiết hơn
app = FastAPI(
    title="JobFit.AI Roadmap API Proxy",
    description="API proxy để kết nối với Jina AI DeepSearch để tạo lộ trình sự nghiệp",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "JobFit.AI Team",
        "url": "https://jobfit.ai",
        "email": "support@jobfit.ai",
    },
    license_info={
        "name": "MIT",
    },
)

# Thiết lập CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong môi trường sản xuất, hãy giới hạn nguồn gốc
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Model định nghĩa dữ liệu đầu vào
class RoadmapRequest(BaseModel):
    chatInput: str

    class Config:
        schema_extra = {
            "example": {
                "chatInput": "Career roadmap for a frontend developer to become a lead developer"
            }
        }


# Model định nghĩa dữ liệu đầu ra
class RoadmapResponse(BaseModel):
    text: str
    nonce: str = ""

    class Config:
        schema_extra = {
            "example": {
                "text": "# Career Roadmap: Frontend Developer to Lead Developer\n\n## 1. Foundation Stage...",
                "nonce": "1687245689",
            }
        }


async def extract_and_format_markdown(raw_data: str) -> str:
    """Trích xuất và định dạng markdown từ phản hồi của Jina AI"""
    print(f"Raw response length: {len(raw_data)}")
    print(f"Raw response preview: {raw_data[:500]}...")

    # Nếu dữ liệu đã là markdown (không bắt đầu bằng 'data:' hoặc '{'), trả về trực tiếp
    if not raw_data.startswith("data:") and not raw_data.startswith("{"):
        print("Response is already in markdown format, returning directly")
        return raw_data.strip()

    # Nếu dữ liệu là JSON, thử phân tích
    if raw_data.startswith("{"):
        try:
            data = json.loads(raw_data)
            print(f"Parsed JSON with keys: {list(data.keys())}")

            if "choices" in data and len(data["choices"]) > 0:
                # Kiểm tra format của choices - có thể là message hoặc delta
                choice = data["choices"][0]
                print(f"First choice keys: {list(choice.keys())}")

                # Thử lấy content từ message
                if "message" in choice and "content" in choice["message"]:
                    content = choice["message"]["content"]
                    print(f"Found content in message: {content[:100]}...")
                    return content.strip()

                # Thử lấy content từ delta
                if "delta" in choice and "content" in choice["delta"]:
                    content = choice["delta"]["content"]
                    print(f"Found content in delta: {content[:100]}...")
                    return content.strip()

                # Thử lấy content từ text trực tiếp
                if "text" in choice:
                    content = choice["text"]
                    print(f"Found direct text content: {content[:100]}...")
                    return content.strip()

                # Nếu không tìm thấy content trong các cấu trúc đã biết
                print(f"Unable to extract content from choice: {choice}")
                return json.dumps(data, indent=2)  # Trả về JSON để debug
            else:
                # Kiểm tra các kiểu dữ liệu khác
                if "content" in data:
                    return data["content"].strip()
                print(f"No choices found in JSON, raw data: {raw_data[:200]}...")
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            # Tiếp tục với logic cũ nếu không phải JSON hợp lệ

    # Xử lý kiểu dữ liệu stream (cho tương thích ngược)
    json_strings = re.split(r"\n\ndata: ", raw_data)
    json_strings = [s.replace("data: ", "") for s in json_strings]

    # Lọc các chuỗi trống
    json_strings = [s for s in json_strings if s.strip()]
    print(f"Split into {len(json_strings)} JSON chunks")

    last_content = ""

    # Tìm nội dung cuối cùng bằng cách lặp ngược
    for i in range(len(json_strings) - 1, -1, -1):
        try:
            parsed_chunk = json.loads(json_strings[i])
            print(f"Parsed chunk {i}: {json.dumps(parsed_chunk)[:200]}...")

            if parsed_chunk.get("choices") and len(parsed_chunk["choices"]) > 0:
                for j in range(len(parsed_chunk["choices"]) - 1, -1, -1):
                    choice = parsed_chunk["choices"][j]

                    if choice.get("delta") and choice["delta"].get("content"):
                        last_content = choice["delta"]["content"].strip()
                        break
                    elif choice.get("message") and choice["message"].get("content"):
                        last_content = choice["message"]["content"].strip()
                        break
                    elif "text" in choice:
                        last_content = choice["text"].strip()
                        break

            if last_content:
                break  # Dừng khi tìm thấy nội dung cuối cùng
        except json.JSONDecodeError as e:
            print(f"JSON decode error for chunk {i}: {e}")
            continue  # Bỏ qua chuỗi không phải JSON

    if not last_content:
        # Fallback nếu không tìm thấy nội dung từ phân tích cấu trúc JSON
        print("Fallback content extraction")

        # Tìm kiếm nội dung trực tiếp trong văn bản
        content_matches = re.findall(r'"content":"(.*?)"', raw_data, re.DOTALL)
        if content_matches:
            print(f"Found {len(content_matches)} content matches in raw text")
            last_content = content_matches[-1]
            # Xử lý các ký tự escape
            last_content = (
                last_content.replace("\\n", "\n")
                .replace('\\"', '"')
                .replace("\\\\", "\\")
            )
        else:
            # Nếu không tìm thấy nội dung, trả về raw data gốc
            print("No content matches found, returning raw data")
            return raw_data.strip()

    # Làm sạch và định dạng Markdown
    # Định dạng chú thích
    last_content = re.sub(r"\[\^(\d+)\]: (.*?)\n", r"[$1]: $2\n", last_content)
    # Chú thích nội tuyến
    last_content = re.sub(r"\[\^(\d+)\]", r"[^$1]", last_content)
    # Định dạng liên kết
    last_content = re.sub(r"(https?://[^\s]+)(?=[^]]*\])", r"<$1>", last_content)

    print(f"Returning formatted content: {last_content[:200]}...")
    return last_content.strip()


async def fetch_jina_ai_response(prompt: str) -> str:
    """Gửi yêu cầu đến Jina AI DeepSearch API và trả về kết quả thô"""
    print("\n" + "=" * 80)
    print("STARTING JINA AI REQUEST")
    print("=" * 80)

    url = "https://deepsearch.jina.ai/v1/chat/completions"

    # API key cho Jina AI - sử dụng API key thực tế
    api_key = "jina_6849ca29ece94fda8e4266c14764c40dTky_rfQjF8-aRKKXzbnSkJwgfYUc"

    # Đặt biến tracking
    use_jina = api_key != ""

    if use_jina:
        # Cấu trúc yêu cầu đơn giản hơn
        payload = {
            "model": "jina-deepsearch-v1",
            "messages": [
                {
                    "role": "user",
                    "content": f"""Tạo một lộ trình chi tiết dựa trên đề tài: "{prompt}". 
Cấu trúc lộ trình cần có:

1. Tiêu đề chính mô tả lộ trình
2. Giới thiệu ngắn gọn về lộ trình
3. Các giai đoạn phát triển (ít nhất 4 giai đoạn), mỗi giai đoạn cần có:
   - Tiêu đề giai đoạn và khung thời gian
   - Mô tả rõ ràng về mục tiêu của giai đoạn
   - Danh sách các kỹ năng cốt lõi cần phát triển (3-5 kỹ năng)
   - Với MỖI kỹ năng, cung cấp 1 link cụ thể đến nguồn học tập chất lượng
   - Danh sách nguồn học tập khuyến nghị (3-5 nguồn), bao gồm:
     * Khóa học online (kèm link cụ thể đến từng khóa học)
     * Sách và tài liệu (kèm link mua hoặc đọc online)
     * Dự án thực hành (mô tả ngắn gọn và link đến hướng dẫn nếu có)
   - Các cột mốc quan trọng cần đạt được trong giai đoạn

4. Lời khuyên bổ sung và hướng phát triển tiếp theo

Đảm bảo mỗi link đều là link thực tế đến trang web chính thức, không sử dụng link giả. Với khóa học, ưu tiên các nguồn nổi tiếng như Coursera, Udemy, edX, v.v.
Format kết quả dưới dạng Markdown với các tiêu đề, danh sách có đánh dấu, và links được nhúng đúng cách.""",
                }
            ],
            "stream": False,
            "temperature": 0.7,
        }

        # Headers cho Jina API
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Authorization": f"Bearer {api_key}",
        }

        print(f"PROMPT: {prompt[:100]}...")
        print(f"REQUEST URL: {url}")
        print(f"REQUEST HEADERS: {headers}")
        print(f"REQUEST PAYLOAD: {json.dumps(payload, indent=2)}")

        try:
            # Tăng timeout để đảm bảo đủ thời gian cho API phản hồi
            async with httpx.AsyncClient(timeout=300.0) as client:
                print(f"\nSending request to Jina AI...")
                response = await client.post(url, json=payload, headers=headers)
                print(f"RESPONSE STATUS: {response.status_code}")

                # In thêm thông tin headers của response
                print(f"RESPONSE HEADERS: {dict(response.headers)}")

                # Kiểm tra và in thông tin lỗi nếu có
                if response.status_code >= 400:
                    print(f"ERROR RESPONSE: {response.text}")
                    raise Exception(f"Error from Jina AI: {response.text}")

                # In phần đầu của response để debug
                response_text = response.text
                print(f"RESPONSE PREVIEW: {response_text[:200]}...")

                try:
                    # Với stream=False, phản hồi sẽ là JSON hoàn chỉnh
                    json_response = response.json()
                    print(f"JSON KEYS: {list(json_response.keys())}")

                    if "choices" in json_response and len(json_response["choices"]) > 0:
                        choice = json_response["choices"][0]
                        print(f"CHOICE KEYS: {list(choice.keys())}")

                        # Trích xuất nội dung từ phản hồi JSON
                        if "message" in choice and "content" in choice["message"]:
                            content = choice["message"]["content"]
                            print(f"CONTENT FOUND IN message.content")
                            return content
                        elif "text" in choice:
                            print(f"CONTENT FOUND IN text")
                            return choice["text"]
                        else:
                            print("NO CONTENT FOUND IN EXPECTED LOCATIONS")
                            return json.dumps(json_response, indent=2)
                    else:
                        print(f"NO CHOICES FOUND IN RESPONSE")
                        return json.dumps(json_response, indent=2)
                except Exception as e:
                    print(f"ERROR PARSING JSON: {e}")
                    return response_text

        except httpx.HTTPStatusError as e:
            print(f"HTTP ERROR: {e.response.status_code} - {e.response.text}")
            print(f"ERROR RESPONSE HEADERS: {dict(e.response.headers)}")
            raise Exception(f"Error from Jina AI: {e.response.text}")
        except httpx.RequestError as e:
            print(f"REQUEST ERROR: {str(e)}")
            raise Exception(f"Request error: {str(e)}")
        except httpx.TimeoutException as e:
            print(f"TIMEOUT ERROR: {str(e)}")
            raise Exception(f"Timeout connecting to Jina AI: {str(e)}")
        except Exception as e:
            print(f"UNEXPECTED ERROR: {str(e)}")
            import traceback

            traceback.print_exc()
            raise Exception(f"Unexpected error: {str(e)}")
    else:
        print("API KEY IS EMPTY - USING FALLBACK METHOD")
        return generate_fallback_roadmap(prompt)


def generate_fallback_roadmap(prompt: str) -> str:
    """Tạo roadmap mẫu dựa trên prompt của người dùng"""
    # Phân tích prompt để xác định lĩnh vực và mục tiêu
    prompt_lower = prompt.lower()

    # Xác định lĩnh vực (mặc định là developer)
    domain = "developer"
    if (
        "frontend" in prompt_lower
        or "front-end" in prompt_lower
        or "front end" in prompt_lower
    ):
        domain = "frontend developer"
    elif (
        "backend" in prompt_lower
        or "back-end" in prompt_lower
        or "back end" in prompt_lower
    ):
        domain = "backend developer"
    elif (
        "fullstack" in prompt_lower
        or "full-stack" in prompt_lower
        or "full stack" in prompt_lower
    ):
        domain = "fullstack developer"
    elif "data" in prompt_lower and (
        "science" in prompt_lower or "scientist" in prompt_lower
    ):
        domain = "data scientist"
    elif (
        "ai" in prompt_lower
        or "machine learning" in prompt_lower
        or "ml" in prompt_lower
    ):
        domain = "AI/ML engineer"
    elif "devops" in prompt_lower:
        domain = "DevOps engineer"
    elif "cloud" in prompt_lower:
        domain = "cloud engineer"
    elif "security" in prompt_lower or "cybersecurity" in prompt_lower:
        domain = "security specialist"
    elif "mobile" in prompt_lower or "android" in prompt_lower or "ios" in prompt_lower:
        domain = "mobile developer"
    elif (
        "ux" in prompt_lower
        or "ui" in prompt_lower
        or "user experience" in prompt_lower
    ):
        domain = "UX/UI designer"

    # Xác định mục tiêu (mặc định là senior)
    target = "senior professional"
    if "lead" in prompt_lower:
        target = "lead"
    elif "manager" in prompt_lower:
        target = "manager"
    elif "architect" in prompt_lower:
        target = "architect"
    elif "senior" in prompt_lower:
        target = "senior"
    elif "principal" in prompt_lower:
        target = "principal"
    elif "expert" in prompt_lower or "specialist" in prompt_lower:
        target = "expert"

    # Tạo roadmap dựa trên domain và target
    return f"""# Career Roadmap: From {domain.title()} to {target.title()} {domain.title()}

## 1. Foundation Stage (0-6 months)

### Core Skills to Develop
- **Fundamentals** - Start with [Relevant Documentation](https://www.w3schools.com/)
- **Version Control** - Learn [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
- **Core Concepts** - Master [Key Principles](https://roadmap.sh/)

### Key Resources
- **Course**: [Comprehensive Learning Path](https://www.coursera.org/)
- **Book**: [Essential Reading](https://www.amazon.com/books-used-books-textbooks/b?ie=UTF8&node=283155)
- **Practice**: [Project-based Learning](https://www.freecodecamp.org/)

## 2. Intermediate Stage (6-12 months)

### Core Skills to Develop
- **Advanced Techniques** - Learn from [Technical Documentation](https://developer.mozilla.org/en-US/)
- **Frameworks & Tools** - Master [Popular Technologies](https://github.com/trending)
- **Testing & Quality** - Understand [Testing Methodologies](https://www.testim.io/blog/test-automation-basics/)

### Key Resources
- **Course**: [Specialized Training](https://www.udemy.com/)
- **Book**: [In-depth Knowledge](https://www.oreilly.com/)
- **Project**: Build a comprehensive portfolio project

## 3. Advanced Stage (12-18 months)

### Core Skills to Develop
- **Architecture Design** - Learn [System Design](https://github.com/donnemartin/system-design-primer)
- **Performance Optimization** - Master [Optimization Techniques](https://web.dev/learn/performance/)
- **Mentoring & Leadership** - Develop [Leadership Skills](https://www.mindtools.com/pages/article/leadership-theories.htm)

### Key Resources
- **Course**: [Expert-level Training](https://www.pluralsight.com/)
- **Book**: [Advanced Concepts](https://www.manning.com/)
- **Project**: Lead a team project or contribute to open source

## 4. {target.title()} Transition (18-24 months)

### Core Skills to Develop
- **Strategic Thinking** - Read [Strategic Leadership](https://hbr.org/topic/strategic-thinking)
- **Team Management** - Learn [Effective Management](https://www.manager-tools.com/)
- **Industry Expertise** - Develop [Domain Knowledge](https://spectrum.ieee.org/)

### Key Resources
- **Course**: [Leadership & Management](https://www.linkedin.com/learning/)
- **Book**: [Professional Development](https://www.goodreads.com/shelf/show/professional-development)
- **Project**: Lead a significant initiative with measurable business impact

This roadmap is based on industry best practices and will help you progress from your current role to a {target} position with a focus on both technical excellence and leadership skills.
"""


@app.post("/api/roadmap/generate", response_model=RoadmapResponse, tags=["Roadmap"])
async def generate_roadmap(request: RoadmapRequest):
    """
    Tạo roadmap từ prompt người dùng và trả về kết quả dạng JSON để frontend sử dụng

    - **chatInput**: Nội dung yêu cầu từ người dùng, ví dụ: "Career roadmap for frontend developer to become lead developer"

    Returns:
        RoadmapResponse: Kết quả dạng JSON với:
            - text: Nội dung roadmap dạng markdown
            - nonce: Token random để tránh cache
    """
    try:
        print(f"Received request with prompt: {request.chatInput[:100]}...")

        # Biến để theo dõi trạng thái
        use_fallback = False
        error_info = None

        try:
            # Gọi API Jina AI DeepSearch
            start_time = time.time()
            raw_response = await fetch_jina_ai_response(request.chatInput)
            api_time = time.time() - start_time
            print(f"Jina API call took {api_time:.2f} seconds")

            # Xử lý và định dạng phản hồi
            start_time = time.time()
            formatted_response = await extract_and_format_markdown(raw_response)
            process_time = time.time() - start_time
            print(f"Processing response took {process_time:.2f} seconds")

            # Nếu phản hồi quá ngắn hoặc không có nội dung, chuyển sang fallback
            if len(formatted_response) < 100 or "error" in formatted_response.lower():
                print(f"Response too short or contains error: {formatted_response}")
                use_fallback = True
                error_info = "Response quality insufficient"

        except Exception as e:
            print(f"Error calling Jina AI: {str(e)}")
            use_fallback = True
            error_info = str(e)

        # Sử dụng mẫu dữ liệu dự phòng nếu API không hoạt động
        if use_fallback:
            print(f"Using fallback data due to: {error_info}")
            # Tạo một roadmap mẫu dựa trên input
            formatted_response = generate_fallback_roadmap(request.chatInput)

        # Tạo nonce random để tránh cache
        nonce = str(int(time.time()))

        # Trả về kết quả dạng JSON
        return JSONResponse(
            content={
                "text": formatted_response,
                "nonce": nonce,
                "fallback_used": use_fallback,
                "fallback_reason": error_info if use_fallback else None,
            }
        )
    except Exception as e:
        print(f"Error generating roadmap: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error generating roadmap: {str(e)}"
        )


@app.get("/health", tags=["Monitoring"])
async def health_check():
    """
    Kiểm tra trạng thái của API

    Returns:
        dict: Thông tin về trạng thái API
    """
    return {
        "status": "ok",
        "timestamp": time.time(),
        "version": app.version,
        "service": "JobFit.AI Roadmap API",
    }


@app.get("/", tags=["Info"])
async def root():
    """
    Thông tin về API

    Returns:
        dict: Thông tin chi tiết về API
    """
    return {
        "name": app.title,
        "version": app.version,
        "description": app.description,
        "docs": "/docs",
        "redoc": "/redoc",
    }


# Tùy chỉnh OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Thêm thông tin server
    openapi_schema["servers"] = [
        {"url": "http://localhost:8000", "description": "Local development server"}
    ]

    # Cập nhật schema
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.post("/test-jina-api", tags=["Testing"])
async def test_jina_api():
    """
    Thử nghiệm kết nối trực tiếp đến Jina AI API

    Returns:
        dict: Kết quả từ Jina AI
    """
    try:
        # API key cho Jina AI
        api_key = "jina_6849ca29ece94fda8e4266c14764c40dTky_rfQjF8-aRKKXzbnSkJwgfYUc"
        url = "https://deepsearch.jina.ai/v1/chat/completions"

        # Cấu trúc yêu cầu đơn giản
        payload = {
            "model": "jina-deepsearch-v1",
            "messages": [
                {
                    "role": "user",
                    "content": "Hello, this is a test message. Please respond with something short.",
                }
            ],
            "stream": False,
        }

        # Headers cho Jina API
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Authorization": f"Bearer {api_key}",
        }

        print(f"\n==== TEST JINA API ====")
        print(f"REQUEST URL: {url}")
        print(f"REQUEST PAYLOAD: {json.dumps(payload)}")

        # Sử dụng httpx trực tiếp thay vì hàm fetch_jina_ai_response
        async with httpx.AsyncClient(timeout=120.0) as client:
            print(f"Sending request to Jina AI...")
            response = await client.post(url, json=payload, headers=headers)
            print(f"RESPONSE STATUS: {response.status_code}")

            response_data = {
                "status_code": response.status_code,
                "headers": dict(response.headers),
            }

            # Thử phân tích JSON
            try:
                response_data["json"] = response.json()
                print(f"Successfully parsed JSON")

                # Trích xuất nội dung nếu có
                if (
                    "choices" in response_data["json"]
                    and len(response_data["json"]["choices"]) > 0
                ):
                    choice = response_data["json"]["choices"][0]
                    if "message" in choice and "content" in choice["message"]:
                        response_data["content"] = choice["message"]["content"]
                    elif "text" in choice:
                        response_data["content"] = choice["text"]
            except Exception as e:
                response_data["text"] = response.text
                response_data["error_parsing"] = str(e)
                print(f"Error parsing JSON: {e}")

            return response_data
    except Exception as e:
        print(f"Error testing Jina API: {str(e)}")
        import traceback

        traceback.print_exc()
        return {"error": str(e), "traceback": traceback.format_exc()}


if __name__ == "__main__":
    print("Starting JobFit.AI Roadmap API Proxy...")
    print("Swagger UI available at: http://localhost:8000/docs")
    print("ReDoc available at: http://localhost:8000/redoc")
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import json
import asyncio
import re
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI(title="JobFit.AI Roadmap API")

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


# Model định nghĩa dữ liệu đầu ra
class RoadmapResponse(BaseModel):
    text: str


async def extract_and_format_markdown(raw_data: str) -> str:
    """Trích xuất và định dạng markdown từ phản hồi của Jina AI"""
    # Tách chuỗi JSON
    json_strings = re.split(r"\n\ndata: ", raw_data)
    json_strings = [s.replace("data: ", "") for s in json_strings]

    last_content = ""

    # Tìm nội dung cuối cùng bằng cách lặp ngược
    for i in range(len(json_strings) - 1, -1, -1):
        try:
            parsed_chunk = json.loads(json_strings[i])

            if parsed_chunk.get("choices") and len(parsed_chunk["choices"]) > 0:
                for j in range(len(parsed_chunk["choices"]) - 1, -1, -1):
                    choice = parsed_chunk["choices"][j]

                    if choice.get("delta") and choice["delta"].get("content"):
                        last_content = choice["delta"]["content"].strip()
                        break

            if last_content:
                break  # Dừng khi tìm thấy nội dung cuối cùng
        except json.JSONDecodeError:
            continue  # Bỏ qua chuỗi không phải JSON

    # Làm sạch và định dạng Markdown
    last_content = re.sub(
        r"\[\^(\d+)\]: (.*?)\n", r"[$1]: $2\n", last_content
    )  # Định dạng chú thích
    last_content = re.sub(r"\[\^(\d+)\]", r"[^$1]", last_content)  # Chú thích nội tuyến
    last_content = re.sub(
        r"(https?://[^\s]+)(?=[^]]*\])", r"<$1>", last_content
    )  # Định dạng liên kết

    return last_content.strip()


async def fetch_jina_ai_response(prompt: str) -> str:
    """Gửi yêu cầu đến Jina AI DeepSearch API và trả về kết quả thô"""
    url = "https://deepsearch.jina.ai/v1/chat/completions"

    payload = {
        "model": "jina-deepsearch-v1",
        "messages": [
            {
                "role": "user",
                "content": "You are an advanced AI researcher that provides precise, well-structured, and insightful roadmaps based on deep analysis. Your responses are factual, concise, and highly relevant.",
            },
            {"role": "assistant", "content": "Hi, how can I help you?"},
            {
                "role": "user",
                "content": f'Provide a detailed and insightful roadmap on: "{prompt}". Ensure the roadmap is well-structured, fact-based, and directly relevant to the topic, with no unnecessary information. Furthermore, each course or skill included in the roadmap should come with a corresponding link.',
            },
        ],
        "stream": True,
        "reasoning_effort": "low",
    }

    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.text
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=e.response.status_code,
                detail=f"Error from Jina AI: {e.response.text}",
            )
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")


@app.post("/api/roadmaps/generate", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """Tạo roadmap từ prompt người dùng"""
    try:
        # Gọi API Jina AI DeepSearch
        raw_response = await fetch_jina_ai_response(request.chatInput)

        # Xử lý và định dạng phản hồi
        formatted_response = await extract_and_format_markdown(raw_response)

        # Trả về kết quả
        return RoadmapResponse(text=formatted_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error generating roadmap: {str(e)}"
        )


# Cho mục đích kiểm tra
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

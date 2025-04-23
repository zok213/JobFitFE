# JobFit Backend API

Backend API cho ứng dụng JobFit, cung cấp các dịch vụ phân tích CV và so khớp công việc.

## Tính năng

- Upload và phân tích CV từ file PDF/DOCX
- Phân tích CV sử dụng AI để trích xuất thông tin
- So khớp CV với mô tả công việc để đánh giá mức độ phù hợp
- Tích hợp với Jina AI DeepSearch cho phân tích nội dung thông minh

## Cài đặt

```bash
# Clone repository
git clone <repository_url>
cd JobFitFE/Backend

# Tạo và kích hoạt môi trường ảo (tùy chọn nhưng được khuyến nghị)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt
```

## Cấu hình

Tạo file `.env` trong thư mục Backend với nội dung:

```
JINA_API_KEY=your_jina_api_key_here
PORT=8000
```

## Chạy server

```bash
# Chạy server phát triển với auto-reload
python run_simple_server.py

# Hoặc sử dụng uvicorn trực tiếp
uvicorn run_simple_server:app --host 0.0.0.0 --port 8000 --reload
```

Server sẽ chạy tại địa chỉ http://localhost:8000

## API Endpoints

### Health Check

```
GET /health
```

Kiểm tra trạng thái hoạt động của API.

### Upload CV

```
POST /api/resumes/upload
```

Tải lên và xử lý file CV. Yêu cầu form-data với trường `file` chứa file PDF, DOCX hoặc DOC.

### Phân tích CV

```
POST /api/cv/analyze
```

Phân tích nội dung CV và trả về báo cáo chi tiết. Yêu cầu payload JSON với trường `cv_text`.

### So khớp công việc

```
POST /api/jobs/match
```

So sánh CV với mô tả công việc và cung cấp báo cáo về mức độ phù hợp. Yêu cầu payload JSON với các trường `cv_text` và `job_description`.

## Tích hợp với Frontend

Frontend (Next.js) sẽ kết nối với backend thông qua các API endpoint. URL backend được cấu hình trong biến môi trường `NEXT_PUBLIC_API_URL` của frontend.

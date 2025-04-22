# JobFit.AI Backend

The backend API for JobFit.AI, an AI-powered job matching and career development platform.

## Features

- **User Authentication**: Secure registration and login system
- **Job Posting & Search**: Post and search for jobs with advanced filtering
- **AI-Powered Job Matching**: Match candidates with jobs based on skills and experience
- **Resume Management**: Upload, parse, and manage resumes
- **Interview Preparation**: AI-generated interview questions and preparation guides
- **Career Roadmaps**: Generate personalized career development plans

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI GPT API
- **File Storage**: Local file storage (S3 in production)
- **Testing**: Pytest

## Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL (or SQLite for development)
- Virtual environment (recommended)

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/JobFit.git
cd JobFit/Backend
```

2. Create and activate a virtual environment:

```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```
pip install -r requirements.txt
```

4. Copy the environment file and configure it:

```
cp .env.example .env
# Edit .env with your configurations
```

5. Run the database migrations:

```
alembic upgrade head
```

6. Start the development server:

```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000. API documentation will be available at http://localhost:8000/docs

## API Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User profile management
- `/api/jobs` - Job posting and searching
- `/api/resumes` - Resume management
- `/api/interviews` - Interview preparation
- `/api/roadmaps` - Career roadmap generation

## Database Schema

The database schema includes the following main entities:

- **Users**: User accounts with profiles and settings
- **Jobs**: Job listings with skills and requirements
- **Resumes**: User resumes with skills, education and experience
- **Applications**: Job applications with statuses and interview details

## Development

### Code Style

We follow PEP 8 for Python code style. You can check your code with:

```
flake8 .
```

### Running Tests

```
pytest
```

### Database Migrations

To create a new migration after model changes:

```
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

## Deployment

For production deployment, additional configuration is needed:

- Set `ENVIRONMENT=production` in .env
- Configure proper database credentials
- Set up S3 for file storage
- Configure CORS settings
- Set up a production server (e.g., Gunicorn with Nginx)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# JobFit.AI Roadmap API Proxy

API proxy để kết nối với Jina AI DeepSearch để tạo lộ trình sự nghiệp.

## Cài đặt

```bash
# Cài đặt các thư viện cần thiết
pip install -r requirements.txt
```

## Chạy API Server

```bash
# Chạy server ở port 8000
python run_simple_server.py
```

Server sẽ khởi động tại: http://localhost:8000

## Swagger UI Documentation

Swagger UI có sẵn tại: http://localhost:8000/docs

Đây là giao diện tương tác với API, cho phép bạn:

- Xem tất cả các endpoints có sẵn
- Gửi requests thử nghiệm trực tiếp từ trình duyệt
- Xem chi tiết về các tham số và cấu trúc dữ liệu

## ReDoc Documentation

Một phiên bản tài liệu API khác có sẵn tại: http://localhost:8000/redoc

## API Endpoints

### Tạo Roadmap

- **URL**: `/api/roadmap/generate`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "chatInput": "Career roadmap for a frontend developer to become a lead developer"
  }
  ```
- **Response**:
  ```json
  {
    "text": "# Career Roadmap: Frontend Developer to Lead Developer\n\n## 1. Foundation Stage...",
    "nonce": "1687245689"
  }
  ```

### Kiểm tra trạng thái

- **URL**: `/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": 1687245689.123,
    "version": "1.0.0",
    "service": "JobFit.AI Roadmap API"
  }
  ```

## Kết nối với Frontend

Frontend có thể kết nối với API proxy này thông qua Next.js API route. Đảm bảo rằng biến môi trường `NEXT_PUBLIC_API_URL` được cấu hình đúng trong file `.env.local` của dự án frontend:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Import the database initialization
from Backend.db.database import engine, get_db, mongodb_client, redis_client, Base

# Import middlewares
from Backend.middleware.rate_limiter import RateLimitMiddleware

# Import routers
from Backend.api.auth import router as auth_router
from Backend.api.users import router as users_router
from Backend.api.jobs import router as jobs_router
from Backend.api.resumes import router as resumes_router
from Backend.api.interviews import router as interviews_router
from Backend.api.roadmaps import router as roadmaps_router
from Backend.api.ai import router as ai_router
from Backend.api.test import router as test_router

# Thêm import và các tính năng từ roadmap_api
from roadmap_api import (
    RoadmapRequest,
    RoadmapResponse,
    extract_and_format_markdown,
    fetch_jina_ai_response,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the database tables on startup
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

    # Test MongoDB connection if available
    if mongodb_client:
        try:
            mongodb_client.admin.command("ping")
            logger.info("MongoDB connection successful")
        except Exception as e:
            logger.error(f"MongoDB connection failed: {str(e)}")

    # Test Redis connection if available
    if redis_client:
        try:
            redis_client.ping()
            logger.info("Redis connection successful")
        except Exception as e:
            logger.error(f"Redis connection failed: {str(e)}")

    yield

    # Clean up resources on shutdown
    logger.info("Shutting down application...")

    # Close MongoDB connection if it exists
    if mongodb_client:
        try:
            mongodb_client.close()
            logger.info("MongoDB connection closed")
        except Exception as e:
            logger.error(f"Error closing MongoDB connection: {str(e)}")

    # Redis connection automatically closes


# Initialize the FastAPI app
app = FastAPI(
    title="JobFit.AI API",
    description="""
    Backend API for JobFit.AI - The AI-powered job matching platform.
    
    ## Features
    
    * **Authentication** - Register, login, and manage user sessions
    * **User Management** - Create and update user profiles
    * **Job Management** - Search, filter, and apply for jobs
    * **Resume Analysis** - AI-powered resume analysis and improvement
    * **Interview Preparation** - AI-generated interview questions and feedback
    * **Career Roadmaps** - Personalized career development plans
    
    ## Authentication
    
    Most endpoints require authentication. Use the `/api/auth/token` endpoint to get a JWT token,
    then include it in the Authorization header as `Bearer {token}`.
    
    ## Rate Limiting
    
    API requests are rate-limited based on user tiers:
    - Free: 100 requests per minute
    - Basic: 300 requests per minute
    - Premium: 1000 requests per minute
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None,  # Disable default docs to customize it
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


# Middleware for request timing
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Add rate limiting middleware with tiered rate limits
rate_limit = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))
rate_limit_window = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds

# Configure tiered rate limiting
app.add_middleware(
    RateLimitMiddleware,
    window_size=rate_limit_window,
    max_requests=rate_limit,
    redis_client=(
        redis_client
        if not os.getenv("REDIS_DISABLED", "false").lower() == "true"
        else None
    ),  # Pass Redis client for distributed rate limiting, or None if disabled
)

# Configure CORS
origins = os.getenv("FRONTEND_URL", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom Swagger UI (with better theme and authentication support)
@app.get("/api/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - API Documentation",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
        init_oauth={
            "clientId": "",
            "usePkceWithAuthorizationCodeGrant": True,
        },
    )


# Include routers
# Note: We maintain both Supabase and JWT authentication for flexibility
# - Frontend uses Supabase auth
# - Backend has its own JWT auth for API access
# - We use a hybrid approach that can validate both types of tokens
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(resumes_router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(interviews_router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(roadmaps_router, prefix="/api/roadmaps", tags=["Career Roadmaps"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Services"])
# Add test router for development and testing
if os.getenv("ENVIRONMENT", "development") != "production":
    app.include_router(test_router, prefix="/api/test", tags=["Testing"])


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint that displays welcome message and basic API information.
    """
    return {
        "message": "Welcome to JobFit.AI API - Your AI-powered Career Assistant",
        "version": app.version,
        "documentation": "/api/docs",
        "health_check": "/health",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint that verifies all system components are working.

    Returns information about:
    - API status
    - Database connections
    - External services
    - System information
    """
    # Collect system status
    system_info = {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "version": app.version,
        "environment": os.getenv("ENVIRONMENT", "development"),
        "databases": {
            "postgresql": "ok",
            "mongodb": "not configured",
            "redis": "not configured",
        },
    }

    # Check database connections
    try:
        # Test SQL database connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
    except Exception as e:
        system_info["databases"]["postgresql"] = f"error: {str(e)}"
        system_info["status"] = "error"

    # Test MongoDB connection if available
    if mongodb_client:
        try:
            mongodb_client.admin.command("ping")
            system_info["databases"]["mongodb"] = "ok"
        except Exception as e:
            system_info["databases"]["mongodb"] = f"error: {str(e)}"
            system_info["status"] = "degraded"

    # Test Redis connection if available
    if redis_client:
        try:
            redis_client.ping()
            system_info["databases"]["redis"] = "ok"
        except Exception as e:
            system_info["databases"]["redis"] = f"error: {str(e)}"
            system_info["status"] = "degraded"

    return system_info


@app.get("/api/debug", tags=["Debugging"])
async def debug_info(request: Request):
    """
    Debug endpoint that returns useful debugging information.
    This endpoint is only available in development environments.

    Returns:
    - Request headers
    - Environment variables (non-sensitive)
    - Connection information
    - Available API routes
    """
    # Only allow in development mode
    if os.getenv("ENVIRONMENT", "development") != "development":
        raise HTTPException(status_code=404, detail="Not found")

    # Get request information
    headers = dict(request.headers)
    # Remove sensitive headers
    if "authorization" in headers:
        headers["authorization"] = "Bearer [REDACTED]"
    if "cookie" in headers:
        headers["cookie"] = "[REDACTED]"

    # Get environment info (excluding sensitive data)
    env_vars = {}
    sensitive_keys = ["PASSWORD", "SECRET", "KEY", "TOKEN", "CREDENTIAL"]
    for key, value in os.environ.items():
        if any(sensitive in key.upper() for sensitive in sensitive_keys):
            env_vars[key] = "[REDACTED]"
        else:
            env_vars[key] = value

    # Get route information
    routes = []
    for route in app.routes:
        routes.append(
            {
                "path": route.path,
                "name": route.name,
                "methods": getattr(route, "methods", None),
            }
        )

    return {
        "request": {
            "headers": headers,
            "client": {
                "host": request.client.host if request.client else None,
                "port": request.client.port if request.client else None,
            },
            "method": request.method,
            "url": str(request.url),
        },
        "environment": env_vars,
        "routes": routes,
        "system": {"time": datetime.utcnow().isoformat(), "version": app.version},
    }


# Thêm endpoint cho roadmap API vào app chính
@app.post("/api/roadmaps/generate", response_model=RoadmapResponse, tags=["Roadmap"])
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


if __name__ == "__main__":
    import uvicorn

    # Determine port from environment variable or use default
    port = int(os.getenv("PORT", "8000"))

    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=os.getenv("ENVIRONMENT", "development") == "development",
    )

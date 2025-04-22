from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Header
from fastapi.security import OAuth2PasswordRequestForm
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import os
import random
import string
import time
import asyncio

from Backend.db.database import get_db, mongodb_client, redis_client
from Backend.models.user import User
from Backend.api.auth import get_current_user, create_access_token

router = APIRouter()

@router.get("/echo")
async def echo(
    request: Request,
    user_agent: Optional[str] = Header(None)
):
    """
    Echo back the request information for testing.
    
    This endpoint returns all the request details, which can be helpful for:
    - Testing CORS configurations
    - Debugging header issues
    - Verifying client information
    """
    return {
        "method": request.method,
        "url": str(request.url),
        "headers": {k: v for k, v in request.headers.items() if k.lower() != "authorization"},
        "client": {
            "host": request.client.host if request.client else None,
            "port": request.client.port if request.client else None
        },
        "user_agent": user_agent,
        "time": datetime.utcnow().isoformat()
    }

@router.get("/auth-check")
async def auth_check(current_user: User = Depends(get_current_user)):
    """
    Test endpoint that verifies authentication is working.
    
    This endpoint requires authentication and returns the current user's information.
    """
    return {
        "authenticated": True,
        "user_id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "time": datetime.utcnow().isoformat()
    }

@router.get("/db-check")
async def db_check(db = Depends(get_db)):
    """
    Test endpoint that checks database connections.
    
    Tests connections to:
    - PostgreSQL (SQLAlchemy)
    - MongoDB (if configured)
    - Redis (if configured)
    """
    results = {
        "postgresql": "ok",
        "mongodb": "not configured",
        "redis": "not configured",
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Test PostgreSQL
    try:
        # Try to query users table
        db.query(User).limit(1).all()
    except Exception as e:
        results["postgresql"] = f"error: {str(e)}"
    
    # Test MongoDB if available
    if mongodb_client:
        try:
            mongodb_client.admin.command('ping')
            # Count documents in a collection as a more thorough test
            count = mongodb_client.get_default_database().test_collection.count_documents({})
            results["mongodb"] = f"ok - {count} documents in test collection"
        except Exception as e:
            results["mongodb"] = f"error: {str(e)}"
    
    # Test Redis if available
    if redis_client:
        try:
            # Set and get a test value
            test_key = f"test:{datetime.utcnow().timestamp()}"
            test_value = "".join(random.choices(string.ascii_letters, k=10))
            redis_client.set(test_key, test_value, ex=60)  # expire in 60 seconds
            retrieved_value = redis_client.get(test_key)
            if retrieved_value and retrieved_value.decode() == test_value:
                results["redis"] = "ok - set/get working"
            else:
                results["redis"] = f"error: value mismatch - {test_value} vs {retrieved_value}"
            
            # Clean up test key
            redis_client.delete(test_key)
        except Exception as e:
            results["redis"] = f"error: {str(e)}"
    
    return results

@router.get("/rate-limit-test")
async def rate_limit_test():
    """
    Test endpoint for rate limiting.
    
    Make repeated calls to this endpoint to test rate limiting functionality.
    The endpoint returns the current call count and timestamp.
    """
    return {
        "message": "Rate limit test endpoint",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/delay/{seconds}")
async def delay_response(seconds: int):
    """
    Test endpoint that delays the response for the specified number of seconds.
    
    This can be used to test:
    - Timeout handling
    - Long-running requests
    - Client cancellation behavior
    
    Maximum delay is 30 seconds for security reasons.
    """
    # Cap delay at 30 seconds for security
    seconds = min(seconds, 30)
    
    # Wait for the specified time
    await asyncio.sleep(seconds)
    
    return {
        "message": f"Response delayed by {seconds} seconds",
        "requested_delay": seconds,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/error/{status_code}")
async def generate_error(status_code: int, response: Response):
    """
    Test endpoint that generates an HTTP error with the specified status code.
    
    This can be used to test error handling in clients.
    """
    if 400 <= status_code < 600:
        response.status_code = status_code
        return {
            "error": f"Test error with status code {status_code}",
            "timestamp": datetime.utcnow().isoformat()
        }
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status code: {status_code}. Must be between 400-599."
        )

@router.post("/token/test")
async def test_create_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Test endpoint for token creation.
    
    This endpoint accepts any username/password combination for testing purposes.
    Only available in development environment.
    """
    # Only available in development
    if os.getenv("ENVIRONMENT", "development") != "development":
        raise HTTPException(status_code=404, detail="Not found")
    
    # Create a test token with 5 minute expiry
    access_token_expires = timedelta(minutes=5)
    access_token = create_access_token(
        data={"sub": f"test_user_{form_data.username}"},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 300,  # 5 minutes in seconds
        "test_user": form_data.username,
        "timestamp": datetime.utcnow().isoformat(),
        "note": "This is a test token and should only be used for API testing"
    } 
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
import jwt
import logging
import requests
from datetime import datetime
from typing import Optional, Dict, Any
import json
from jwt.api_jwk import PyJWK

from Backend.db.database import get_db
from Backend.models.user import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security scheme for Bearer token
security = HTTPBearer()

# Get Supabase URL and anon key from environment
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

class SupabaseAuthBackend:
    """Authentication backend for Supabase JWT tokens"""
    
    # Cache the JWKS to avoid fetching it for every request
    _jwks_cache: Dict[str, Any] = {}
    _jwks_timestamp: float = 0
    _cache_ttl: int = 3600  # 1 hour in seconds
    
    async def fetch_jwks(self):
        """Fetch the JSON Web Key Set from Supabase with caching"""
        current_time = datetime.now().timestamp()
        
        # Use cached JWKS if available and not expired
        if self._jwks_cache and (current_time - self._jwks_timestamp) < self._cache_ttl:
            return self._jwks_cache
        
        try:
            jwks_url = f"{SUPABASE_URL}/auth/v1/jwks"
            response = requests.get(jwks_url)
            response.raise_for_status()  # Raise exception for non-200 status
            
            # Update cache
            self._jwks_cache = response.json()
            self._jwks_timestamp = current_time
            
            return self._jwks_cache
        except Exception as e:
            logger.error(f"Error fetching JWKS: {str(e)}")
            # Return cached version if available, even if expired
            if self._jwks_cache:
                logger.warning("Using expired JWKS cache due to fetch failure")
                return self._jwks_cache
            return None
    
    async def verify_token(self, token: str) -> Optional[dict]:
        """Verify the Supabase JWT token with proper signature validation"""
        try:
            # First, decode without verification to get the header
            header = jwt.get_unverified_header(token)
            kid = header.get('kid')
            
            if not kid:
                logger.error("No 'kid' in token header")
                return None
                
            # Get the JWKS
            jwks = await self.fetch_jwks()
            if not jwks:
                logger.error("Could not fetch JWKS")
                return None
                
            # Find the key that matches the kid in the token header
            key = None
            for jwk in jwks.get('keys', []):
                if jwk.get('kid') == kid:
                    key = jwk
                    break
                    
            if not key:
                logger.error(f"No matching key found for kid: {kid}")
                return None
                
            # Construct a PyJWK from the JWK
            public_key = PyJWK.from_dict(key).key
                
            # Verify and decode the token
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience="authenticated"
            )
            
            return payload
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying token: {str(e)}")
            return None

async def get_current_user_supabase(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get the current user from a Supabase JWT token"""
    auth_backend = SupabaseAuthBackend()
    
    token = credentials.credentials
    payload = await auth_backend.verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user_id from Supabase token
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get or create user in our database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Create a new user record if it doesn't exist
        email = payload.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email not found in token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = User(id=user_id, email=email, email_verified=True)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.commit()
    
    return user

# Optional function that tries both auth methods
async def get_current_user_hybrid(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Try to authenticate with Supabase first, then fall back to JWT
    This allows for a transition period when migrating from JWT to Supabase
    """
    auth_header = request.headers.get("Authorization")
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        
        # Try Supabase auth first
        try:
            auth_backend = SupabaseAuthBackend()
            payload = await auth_backend.verify_token(token)
            
            if payload:
                # Extract user_id from Supabase token
                user_id = payload.get("sub")
                if user_id:
                    # Get or create user in our database
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        return user
            
            # If Supabase auth failed, try JWT
            from Backend.api.auth import get_current_user as jwt_get_current_user
            return await jwt_get_current_user(db=db, token=token)
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    ) 
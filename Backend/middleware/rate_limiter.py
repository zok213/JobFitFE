import time
import os
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging
from typing import Dict, Tuple, Optional, List, Any
import redis
import json
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Maximum window size before cleaning up expired timestamps (to avoid memory leaks)
MAX_WINDOW_SIZE = 24 * 60 * 60  # 24 hours in seconds

class RateLimiter:
    """
    Implementation of a sliding window rate limiter with Redis support
    """
    def __init__(
        self, 
        window_size: int = 60, 
        max_requests: int = 100,
        redis_client: Optional[redis.Redis] = None
    ):
        """
        Initialize rate limiter
        
        Args:
            window_size: Size of the window in seconds
            max_requests: Maximum number of requests allowed in the window
            redis_client: Optional Redis client for distributed rate limiting
        """
        self.window_size = window_size
        self.max_requests = max_requests
        self.redis_client = redis_client
        
        # Only used if Redis is not available
        # Store client request timestamps: {client_id: [timestamp1, timestamp2, ...]}
        self.client_requests: Dict[str, List[float]] = {}
        
        # Whitelist and tier-based rate limits
        self.ip_whitelist: List[str] = os.getenv("RATE_LIMIT_IP_WHITELIST", "").split(",")
        
        # Default tier rate limits
        self.tier_limits = {
            "free": int(os.getenv("RATE_LIMIT_TIER_FREE", "100")),
            "basic": int(os.getenv("RATE_LIMIT_TIER_BASIC", "300")),
            "premium": int(os.getenv("RATE_LIMIT_TIER_PREMIUM", "1000")),
            "unlimited": int(os.getenv("RATE_LIMIT_TIER_UNLIMITED", "5000")),
        }
        
        logger.info(f"Rate limiter initialized with tiers: {self.tier_limits}")
        
        # In-memory storage for tracking request timestamps
        self.client_requests = {}
        self.last_cleanup_time = time.time()
    
    def _hash_client_ip(self, ip: str) -> str:
        """
        Hash the client IP for privacy and storage
        """
        return hashlib.sha256(ip.encode()).hexdigest()[:16]
    
    def _get_client_id(self, request: Request) -> str:
        """
        Get client identifier based on IP and optional user token
        
        Returns a tuple of (client_id, user_id, subscription_tier)
        """
        # Get client IP and apply privacy-preserving hashing
        client_ip = request.client.host if request.client else "unknown"
        hashed_ip = self._hash_client_ip(client_ip)
        
        # Default tier and user ID
        user_id = None
        tier = "free"
        
        # Try to get user ID and subscription tier from authorization header
        auth_header = request.headers.get("Authorization")
        
        if auth_header and auth_header.startswith("Bearer "):
            try:
                # Extract user info from token
                # In a real app, this would properly decode and verify the JWT
            token = auth_header.replace("Bearer ", "")
                
                # This is just a placeholder - replace with actual token parsing
            token_hash = hash(token)
                user_id = str(token_hash)
                
                # Get user subscription tier from request state if available
                # This would typically be set by an earlier auth middleware
                tier = getattr(request.state, "user_tier", "free")
            except Exception as e:
                logger.warning(f"Error processing auth token for rate limiting: {e}")
        
        # For API keys, check for an API key header
        api_key = request.headers.get("X-API-Key")
        if api_key:
            try:
                # In a real app, look up the API key and get the associated tier
                # This is just a placeholder for demonstration
                if api_key.startswith("premium_"):
                    tier = "premium"
                elif api_key.startswith("basic_"):
                    tier = "basic"
            except Exception as e:
                logger.warning(f"Error processing API key for rate limiting: {e}")
        
        # If client IP is in whitelist, use unlimited tier
        if client_ip in self.ip_whitelist:
            tier = "unlimited"
            
        client_id = f"{hashed_ip}:{user_id or ''}:{tier}"
        return client_id, user_id, tier
    
    def is_rate_limited(self, request: Request) -> Tuple[bool, Optional[int], str]:
        """
        Check if a client is rate limited
        
        Returns:
            Tuple of (is_limited, retry_after, tier)
        """
        current_time = time.time()
        client_id, user_id, tier = self._get_client_id(request)
        
        # Get appropriate rate limit for the tier
        tier_limit = self.tier_limits.get(tier, self.max_requests)
        
        # If using Redis for distributed rate limiting
        if self.redis_client:
            return self._check_rate_limit_redis(client_id, tier, tier_limit, current_time)
        
        # Fallback to in-memory rate limiting
        return self._check_rate_limit_memory(client_id, tier, tier_limit, current_time)
    
    def _check_rate_limit_redis(
        self, client_id: str, tier: str, tier_limit: int, current_time: float
    ) -> Tuple[bool, Optional[int], str]:
        """
        Check rate limit using Redis sliding window
        """
        # If Redis client is None, fallback to memory-based rate limiting
        if self.redis_client is None:
            logger.debug("Redis client not available, falling back to in-memory rate limiting")
            return self._check_rate_limit_memory(client_id, tier, tier_limit, current_time)
            
        try:
            # Create sliding window key
            key = f"rate_limit:{client_id}"
            
            # Clean up old requests outside the window and add new request
            pipeline = self.redis_client.pipeline()
            
            # Remove timestamps older than the window
            pipeline.zremrangebyscore(key, 0, current_time - self.window_size)
            
            # Count existing requests
            pipeline.zcard(key)
            
            # Add current request with timestamp as score
            pipeline.zadd(key, {str(current_time): current_time})
            
            # Set key expiration to ensure cleanup
            pipeline.expire(key, self.window_size * 2)
            
            # Execute pipeline
            _, request_count, *_ = pipeline.execute()
            
            # Check if rate limit exceeded
            if request_count >= tier_limit:
                # Get the oldest timestamp
                oldest = self.redis_client.zrange(key, 0, 0, withscores=True)
                if oldest:
                    _, oldest_time = oldest[0]
                    retry_after = int(self.window_size - (current_time - oldest_time))
                    return True, max(1, retry_after), tier
                return True, self.window_size, tier
                
            return False, None, tier
            
        except redis.RedisError as e:
            logger.error(f"Redis error in rate limiter: {e}")
            # Fallback to in-memory on Redis error
            return self._check_rate_limit_memory(client_id, tier, tier_limit, current_time)
    
    def _check_rate_limit_memory(
        self, client_id: str, tier: str, tier_limit: int, current_time: float
    ) -> Tuple[bool, Optional[int], str]:
        """
        Check rate limit using in-memory storage
        """
        # Clean up old entries periodically to avoid memory leaks
        if current_time - self.last_cleanup_time > 300:  # Every 5 minutes
            self._cleanup_expired_timestamps(current_time)
            self.last_cleanup_time = current_time
        
        # Create entry for this client if it doesn't exist
        if client_id not in self.client_requests:
            self.client_requests[client_id] = []
        
        # Remove timestamps outside the window
        min_timestamp = current_time - self.window_size
        self.client_requests[client_id] = [
            ts for ts in self.client_requests[client_id] if ts > min_timestamp
        ]
        
        # If client exceeds rate limit
        if len(self.client_requests[client_id]) >= tier_limit:
            # Calculate when the client can retry
            if self.client_requests[client_id]:
            oldest_request = min(self.client_requests[client_id])
            retry_after = int(self.window_size - (current_time - oldest_request))
                return True, max(1, retry_after), tier
            return True, self.window_size, tier
        
        # Record this request
        self.client_requests[client_id].append(current_time)
        return False, None, tier
    
    def _cleanup_expired_timestamps(self, current_time: float) -> None:
        """Clean up expired timestamps to avoid memory leaks"""
        min_timestamp = current_time - self.window_size
        clients_to_remove = []
        
        for client_id, timestamps in self.client_requests.items():
            # Remove timestamps outside the window
            self.client_requests[client_id] = [
                ts for ts in timestamps if ts > min_timestamp
            ]
            
            # Mark empty clients for removal
            if not self.client_requests[client_id]:
                clients_to_remove.append(client_id)
        
        # Remove empty clients
        for client_id in clients_to_remove:
            del self.client_requests[client_id]

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware for rate limiting API requests
    """
    def __init__(
        self, 
        app, 
        window_size: int = 60, 
        max_requests: Optional[int] = None,
        redis_client: Optional[redis.Redis] = None
    ):
        super().__init__(app)
        # Get rate limit from environment or use default
        if max_requests is None:
            max_requests = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))
        
        self.rate_limiter = RateLimiter(window_size, max_requests, redis_client)
        logger.info(f"Rate limiter middleware initialized: base limit {max_requests} requests per {window_size} seconds")
        
        # Paths excluded from rate limiting
        self.excluded_paths = [
            "/docs", 
            "/redoc", 
            "/openapi.json", 
            "/health", 
            "/favicon.ico",
            "/api/auth/public"
        ]
    
    async def dispatch(self, request: Request, call_next):
        """
        Process request through rate limiter
        """
        # Skip rate limiting for certain paths
        for path in self.excluded_paths:
            if request.url.path.startswith(path):
            return await call_next(request)
        
        # Check rate limit
        is_limited, retry_after, tier = self.rate_limiter.is_rate_limited(request)
        
        if is_limited:
            client_ip = request.client.host if request.client else "unknown"
            logger.warning(f"Rate limit exceeded for {client_ip} on {request.url.path} (tier: {tier})")
            
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "detail": "Rate limit exceeded",
                    "retry_after": retry_after,
                    "tier": tier
                },
                headers={
                    "Retry-After": str(retry_after),
                    "X-RateLimit-Limit": str(self.rate_limiter.tier_limits.get(tier, self.rate_limiter.max_requests)),
                    "X-RateLimit-Reset": str(int(time.time()) + retry_after)
                }
            )
        
        # Add rate limit info to response headers
        response = await call_next(request)
        
        # Add rate limit headers to response
        if isinstance(response, Response):
            response.headers["X-RateLimit-Limit"] = str(self.rate_limiter.tier_limits.get(tier, self.rate_limiter.max_requests))
            response.headers["X-RateLimit-Tier"] = tier
        
        return response 
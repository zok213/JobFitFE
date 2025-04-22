import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import redis
import pymongo
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get database URL from environment or use a default SQLite database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./jobfit.db")

# Create SQLAlchemy engine with optimized pool settings
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
    pool_size=10,  # Increased from default 5
    max_overflow=20,  # Allow up to 20 connections overflow
    pool_timeout=30,  # Wait up to 30 seconds for a connection
    pool_recycle=1800,  # Recycle connections after 30 minutes
    pool_pre_ping=True  # Verify connections before using them
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for declarative models
Base = declarative_base()

# MongoDB connection
def get_mongodb_client() -> Optional[pymongo.MongoClient]:
    """Get MongoDB client with connection pooling."""
    try:
        # Check if MongoDB is disabled
        if os.getenv("MONGODB_DISABLED", "false").lower() == "true":
            logger.info("MongoDB connection disabled by configuration")
            return None

        mongodb_uri = os.getenv("MONGODB_URI")
        if mongodb_uri:
            # Configure connection pool
            client = pymongo.MongoClient(
                mongodb_uri,
                maxPoolSize=50,  # Maximum number of connections in the pool
                minPoolSize=10,   # Minimum number of connections in the pool
                maxIdleTimeMS=60000,  # Maximum time a connection can be idle (1 minute)
                connectTimeoutMS=5000,  # Connection timeout (5 seconds)
                serverSelectionTimeoutMS=5000  # Server selection timeout (5 seconds)
            )
            # Test connection
            client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            return client
        else:
            logger.warning("MongoDB URI not found in environment variables")
            return None
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {str(e)}")
        return None

# Redis connection
def get_redis_client() -> Optional[redis.Redis]:
    """Get Redis client with optimized connection pool."""
    try:
        # Check if Redis is disabled
        if os.getenv("REDIS_DISABLED", "false").lower() == "true":
            logger.info("Redis connection disabled by configuration")
            return None

        redis_host = os.getenv("REDIS_HOST")
        redis_password = os.getenv("REDIS_PASSWORD")
        redis_ssl = os.getenv("REDIS_SSL", "false").lower() == "true"
        
        if redis_host and redis_password:
            # Create connection pool
            pool = redis.ConnectionPool(
                host=redis_host,
                password=redis_password,
                ssl=redis_ssl,
                decode_responses=True,
                max_connections=20,  # Maximum number of connections in the pool
                socket_timeout=5,    # Socket timeout in seconds
                socket_connect_timeout=5  # Connection timeout in seconds
            )
            
            # Create Redis client with the pool
            client = redis.Redis(connection_pool=pool)
            
            # Test connection
            client.ping()
            logger.info("Successfully connected to Redis")
            return client
        else:
            logger.warning("Redis credentials not found in environment variables")
            return None
    except Exception as e:
        logger.error(f"Error connecting to Redis: {str(e)}")
        return None

# Initialize database connections
mongodb_client = get_mongodb_client()
redis_client = get_redis_client()

# Get MongoDB database name from environment or use default
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "n8n")

# Dependency for SQL Database
def get_db():
    """Get SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency for MongoDB
def get_mongodb():
    """Get MongoDB database."""
    if mongodb_client:
        return mongodb_client[MONGODB_DB_NAME]  # Use environment variable for DB name
    else:
        raise Exception("MongoDB connection not available")

# Dependency for Redis
def get_redis():
    """Get Redis client."""
    if redis_client:
        return redis_client
    else:
        raise Exception("Redis connection not available") 
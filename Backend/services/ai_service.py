import os
import logging
from typing import Dict, Any, List, Optional, Union
import requests
import json
from enum import Enum
import time
from dotenv import load_dotenv

# Try to import AI libraries with error handling
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

try:
    from langchain.embeddings import HuggingFaceEmbeddings
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False

try:
    import pinecone
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIModelProvider(str, Enum):
    """Enum for supported AI model providers"""
    OPENAI = "openai"
    GEMINI = "gemini"
    OPENROUTER = "openrouter"
    HUGGINGFACE = "huggingface"

class AIService:
    """Service for handling AI model interactions"""
    
    def __init__(self):
        """Initialize AI service and check for available models"""
        
        # Initialize OpenAI if available
        self.openai_available = False
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
        
        if OPENAI_AVAILABLE and self.openai_api_key and self.openai_api_key != "your_openai_api_key":
            try:
                openai.api_key = self.openai_api_key
                self.openai_available = True
                logger.info("OpenAI successfully initialized")
            except Exception as e:
                logger.error(f"Error initializing OpenAI: {str(e)}")
        
        # Initialize Gemini if available
        self.gemini_available = False
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        if GEMINI_AVAILABLE and self.gemini_api_key:
            try:
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-pro')
                self.gemini_available = True
                logger.info("Google Gemini successfully initialized")
            except Exception as e:
                logger.error(f"Error initializing Gemini: {str(e)}")
        
        # Initialize HuggingFace if available
        self.hf_available = False
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
        
        if HF_AVAILABLE and self.hf_api_key:
            try:
                # We'll initialize HF models on demand
                self.hf_available = True
                logger.info("HuggingFace API successfully initialized")
            except Exception as e:
                logger.error(f"Error initializing HuggingFace: {str(e)}")
        
        # Initialize Pinecone if available
        self.pinecone_available = False
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
        
        if PINECONE_AVAILABLE and self.pinecone_api_key:
            try:
                pinecone.init(api_key=self.pinecone_api_key)
                self.pinecone_available = True
                logger.info("Pinecone successfully initialized")
            except Exception as e:
                logger.error(f"Error initializing Pinecone: {str(e)}")
        
        # Initialize OpenRouter
        self.openrouter_available = False
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        
        if self.openrouter_api_key:
            self.openrouter_available = True
            logger.info("OpenRouter successfully initialized")
    
    def list_available_providers(self) -> List[str]:
        """List all available AI providers"""
        providers = []
        
        if self.openai_available:
            providers.append(AIModelProvider.OPENAI)
        
        if self.gemini_available:
            providers.append(AIModelProvider.GEMINI)
        
        if self.openrouter_available:
            providers.append(AIModelProvider.OPENROUTER)
        
        if self.hf_available:
            providers.append(AIModelProvider.HUGGINGFACE)
        
        return providers
    
    async def generate_text(
        self, 
        prompt: str, 
        provider: AIModelProvider = None,
        model: str = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        retry_count: int = 3,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate text using the specified AI provider
        
        Args:
            prompt: Text prompt to send to the model
            provider: AI provider to use. If None, will use first available
            model: Specific model to use. If None, will use default
            max_tokens: Maximum tokens to generate
            temperature: Temperature for generation
            retry_count: Number of retries on failure
            **kwargs: Additional parameters to pass to the model
        
        Returns:
            Dictionary with generated text and metadata
        """
        # If no provider specified, use first available
        if provider is None:
            available_providers = self.list_available_providers()
            if not available_providers:
                return {"error": "No AI providers available"}
            provider = available_providers[0]
        
        # Attempt to generate with retries
        for attempt in range(retry_count):
            try:
                if provider == AIModelProvider.OPENAI and self.openai_available:
                    return await self._generate_openai(prompt, model, max_tokens, temperature, **kwargs)
                
                elif provider == AIModelProvider.GEMINI and self.gemini_available:
                    return await self._generate_gemini(prompt, model, max_tokens, temperature, **kwargs)
                
                elif provider == AIModelProvider.OPENROUTER and self.openrouter_available:
                    return await self._generate_openrouter(prompt, model, max_tokens, temperature, **kwargs)
                
                elif provider == AIModelProvider.HUGGINGFACE and self.hf_available:
                    return await self._generate_huggingface(prompt, model, max_tokens, temperature, **kwargs)
                
                else:
                    return {"error": f"Provider {provider} not available or invalid"}
            
            except Exception as e:
                logger.error(f"Error generating text with {provider}, attempt {attempt+1}/{retry_count}: {str(e)}")
                if attempt == retry_count - 1:
                    return {"error": f"Failed after {retry_count} attempts: {str(e)}"}
                time.sleep(1)  # Wait before retrying
    
    async def _generate_openai(
        self, 
        prompt: str, 
        model: str = None, 
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text using OpenAI API"""
        if not OPENAI_AVAILABLE:
            return {"error": "OpenAI library not installed"}
        
        if not self.openai_api_key:
            return {"error": "OpenAI API key not configured"}
        
        model = model or self.openai_model
        
        completion = await openai.ChatCompletion.acreate(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            **kwargs
        )
        
        return {
            "text": completion.choices[0].message.content,
            "model": model,
            "provider": AIModelProvider.OPENAI,
            "tokens": {
                "prompt": completion.usage.prompt_tokens,
                "completion": completion.usage.completion_tokens,
                "total": completion.usage.total_tokens
            }
        }
    
    async def _generate_gemini(
        self, 
        prompt: str, 
        model: str = None, 
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text using Google Gemini API"""
        if not GEMINI_AVAILABLE:
            return {"error": "Gemini library not installed"}
        
        if not self.gemini_api_key:
            return {"error": "Gemini API key not configured"}
        
        try:
            gemini_model = self.gemini_model
            response = gemini_model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": max_tokens,
                    "temperature": temperature,
                    **kwargs
                }
            )
            
            return {
                "text": response.text,
                "model": "gemini-pro",
                "provider": AIModelProvider.GEMINI
            }
        except Exception as e:
            logger.error(f"Error generating with Gemini: {str(e)}")
            raise
    
    async def _generate_openrouter(
        self, 
        prompt: str, 
        model: str = None, 
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text using OpenRouter API"""
        if not self.openrouter_api_key:
            return {"error": "OpenRouter API key not configured"}
        
        model = model or "openai/gpt-3.5-turbo"
        
        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        data.update(**kwargs)
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code != 200:
            logger.error(f"OpenRouter API error: {response.text}")
            return {"error": f"OpenRouter API error: {response.status_code}"}
        
        result = response.json()
        
        return {
            "text": result["choices"][0]["message"]["content"],
            "model": model,
            "provider": AIModelProvider.OPENROUTER,
            "tokens": result.get("usage", {})
        }
    
    async def _generate_huggingface(
        self, 
        prompt: str, 
        model: str = None, 
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate text using HuggingFace API"""
        if not HF_AVAILABLE:
            return {"error": "HuggingFace libraries not installed"}
        
        if not self.hf_api_key:
            return {"error": "HuggingFace API key not configured"}
        
        model = model or "gpt2"
        
        headers = {
            "Authorization": f"Bearer {self.hf_api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": temperature,
                **kwargs
            }
        }
        
        api_url = f"https://api-inference.huggingface.co/models/{model}"
        response = requests.post(api_url, headers=headers, json=data)
        
        if response.status_code != 200:
            logger.error(f"HuggingFace API error: {response.text}")
            return {"error": f"HuggingFace API error: {response.status_code}"}
        
        result = response.json()
        
        if isinstance(result, list):
            return {
                "text": result[0].get("generated_text", ""),
                "model": model,
                "provider": AIModelProvider.HUGGINGFACE
            }
        else:
            return {
                "text": result.get("generated_text", ""),
                "model": model,
                "provider": AIModelProvider.HUGGINGFACE
            }
    
    async def embed_text(
        self, 
        text: Union[str, List[str]], 
        provider: AIModelProvider = None,
        model: str = None
    ) -> Dict[str, Any]:
        """
        Generate embeddings for text
        
        Args:
            text: Single string or list of strings to embed
            provider: AI provider to use for embeddings
            model: Specific model to use
        
        Returns:
            Dictionary with embeddings and metadata
        """
        # Default to OpenAI if available
        if provider is None:
            if self.openai_available:
                provider = AIModelProvider.OPENAI
            elif self.hf_available:
                provider = AIModelProvider.HUGGINGFACE
            else:
                return {"error": "No embedding providers available"}
        
        try:
            if provider == AIModelProvider.OPENAI and self.openai_available:
                return await self._embed_openai(text, model)
            
            elif provider == AIModelProvider.HUGGINGFACE and self.hf_available:
                return await self._embed_huggingface(text, model)
            
            else:
                return {"error": f"Provider {provider} not available for embeddings"}
        
        except Exception as e:
            logger.error(f"Error generating embeddings with {provider}: {str(e)}")
            return {"error": f"Failed to generate embeddings: {str(e)}"}
    
    async def _embed_openai(self, text: Union[str, List[str]], model: str = None) -> Dict[str, Any]:
        """Generate embeddings using OpenAI API"""
        if not OPENAI_AVAILABLE:
            return {"error": "OpenAI library not installed"}
        
        model = model or "text-embedding-3-small"
        
        # Handle both single strings and lists
        input_text = [text] if isinstance(text, str) else text
        
        response = await openai.Embedding.acreate(
            model=model,
            input=input_text
        )
        
        return {
            "embeddings": [item["embedding"] for item in response["data"]],
            "model": model,
            "provider": AIModelProvider.OPENAI,
            "dimensions": len(response["data"][0]["embedding"]) if response["data"] else 0,
            "tokens": response["usage"]["total_tokens"]
        }
    
    async def _embed_huggingface(self, text: Union[str, List[str]], model: str = None) -> Dict[str, Any]:
        """Generate embeddings using HuggingFace API"""
        if not HF_AVAILABLE:
            return {"error": "HuggingFace libraries not installed"}
        
        model = model or "sentence-transformers/all-MiniLM-L6-v2"
        
        headers = {
            "Authorization": f"Bearer {self.hf_api_key}",
            "Content-Type": "application/json"
        }
        
        # Handle both single strings and lists
        input_text = [text] if isinstance(text, str) else text
        
        data = {
            "inputs": input_text,
            "options": {
                "wait_for_model": True
            }
        }
        
        api_url = f"https://api-inference.huggingface.co/models/{model}"
        response = requests.post(api_url, headers=headers, json=data)
        
        if response.status_code != 200:
            logger.error(f"HuggingFace API error: {response.text}")
            return {"error": f"HuggingFace API error: {response.status_code}"}
        
        embeddings = response.json()
        
        return {
            "embeddings": embeddings,
            "model": model,
            "provider": AIModelProvider.HUGGINGFACE,
            "dimensions": len(embeddings[0]) if embeddings else 0
        }

# Create a singleton instance
ai_service = AIService() 
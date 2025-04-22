import os
import logging
from typing import Dict, Any, List, Optional, Tuple
import json
import re

from Backend.services.ai_service import AIService, AIModelProvider
from Backend.services.vector_db_service import VectorDBService, Document
from Backend.services.document_processor import DocumentProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGBotService:
    """Service for a Retrieval Augmented Generation chatbot"""
    
    def __init__(self, 
                collection_name: str = "jobfit_documents",
                memory_window: int = 5):
        """
        Initialize the RAG Bot service
        
        Args:
            collection_name: Name of the vector database collection to use
            memory_window: Number of previous messages to include in context window
        """
        self.ai_service = AIService()
        self.vector_db = VectorDBService()
        self.doc_processor = DocumentProcessor()
        self.collection_name = collection_name
        self.memory_window = memory_window
    
    async def add_document(self, 
                         document_text: str, 
                         document_metadata: Dict[str, Any]) -> bool:
        """
        Process and add a document to the vector database
        
        Args:
            document_text: The text content of the document
            document_metadata: Metadata for the document (title, source, author, etc.)
            
        Returns:
            Boolean indicating success
        """
        try:
            # Process the document (chunk it)
            chunks = self.doc_processor.split_text(document_text)
            
            # Create document objects with metadata
            documents = []
            for i, chunk in enumerate(chunks):
                # Clone metadata and add chunk-specific info
                chunk_metadata = document_metadata.copy()
                chunk_metadata["chunk_id"] = i
                chunk_metadata["chunk_count"] = len(chunks)
                
                doc = Document(
                    text=chunk,
                    metadata=chunk_metadata
                )
                documents.append(doc)
            
            # Add to vector database
            await self.vector_db.add_documents(
                collection_name=self.collection_name,
                documents=documents
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error adding document to RAG system: {str(e)}")
            return False
    
    async def generate_answer(self, 
                           query: str, 
                           chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generate an answer to a query using RAG approach
        
        Args:
            query: The user's query
            chat_history: List of previous chat messages in format 
                         [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
            
        Returns:
            Dictionary containing the answer and relevant context
        """
        try:
            # Default to empty list if None
            if chat_history is None:
                chat_history = []
            
            # Retrieve relevant documents
            relevant_docs = await self.vector_db.search(
                collection_name=self.collection_name,
                query=query,
                top_k=5
            )
            
            if not relevant_docs:
                # Fall back to general knowledge if no docs found
                return await self._generate_general_answer(query, chat_history)
            
            # Format retrieved contexts
            contexts = []
            for doc in relevant_docs:
                # Add source information
                source = f"{doc.metadata.get('title', 'Unknown source')}"
                if "url" in doc.metadata:
                    source += f" ({doc.metadata['url']})"
                
                contexts.append({
                    "text": doc.text,
                    "source": source,
                    "relevance_score": doc.score if hasattr(doc, 'score') else None
                })
            
            # Get the limited chat history (last N messages)
            limited_history = chat_history[-self.memory_window*2:] if chat_history else []
            
            # Generate answer
            answer = await self._generate_answer_from_contexts(
                query=query,
                contexts=contexts,
                chat_history=limited_history
            )
            
            # Extract source citations
            sources = []
            seen_sources = set()
            for ctx in contexts:
                source = ctx["source"]
                if source not in seen_sources:
                    sources.append(source)
                    seen_sources.add(source)
            
            return {
                "answer": answer,
                "sources": sources,
                "contexts": contexts
            }
            
        except Exception as e:
            logger.error(f"Error generating RAG answer: {str(e)}")
            return {
                "answer": "I'm sorry, I encountered an error while trying to answer your question. Please try again or rephrase your query.",
                "sources": [],
                "contexts": []
            }
    
    async def _generate_answer_from_contexts(self, 
                                         query: str, 
                                         contexts: List[Dict[str, Any]], 
                                         chat_history: List[Dict[str, str]]) -> str:
        """
        Generate an answer based on retrieved contexts and chat history
        
        Args:
            query: User query
            contexts: List of context documents with their sources
            chat_history: List of previous chat messages
            
        Returns:
            Generated answer text
        """
        # Format context text
        context_text = "\n\n".join([
            f"Context {i+1} (from {ctx['source']}):\n{ctx['text']}"
            for i, ctx in enumerate(contexts)
        ])
        
        # Format chat history
        history_text = ""
        if chat_history:
            history_text = "Previous messages:\n"
            for msg in chat_history:
                role = msg["role"].capitalize()
                history_text += f"{role}: {msg['content']}\n"
        
        prompt = f"""
        You are JobFit.AI's intelligent assistant. Answer the user's question based primarily on the provided context information.
        If the context doesn't contain the necessary information, you may use your general knowledge but make it clear when you're doing so.
        
        {history_text}
        
        Here are relevant sections from our knowledge base to help answer the query:
        
        {context_text}
        
        User Query: {query}
        
        Please provide a clear, concise, and helpful response. If appropriate, cite the sources you used from the context.
        If you don't know the answer or if the information is not in the context, admit that you don't know rather than making up information.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=800,
                temperature=0.3
            )
            
            if "error" in result:
                logger.error(f"Error generating answer from contexts: {result['error']}")
                return "I'm sorry, I couldn't generate a response based on the available information. Please try asking in a different way."
            
            return result["text"].strip()
        
        except Exception as e:
            logger.error(f"Error generating answer from contexts: {str(e)}")
            return "I'm sorry, I couldn't generate a response based on the available information. Please try asking in a different way."
    
    async def _generate_general_answer(self, 
                                   query: str, 
                                   chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Generate a general answer when no relevant documents are found
        
        Args:
            query: User query
            chat_history: Previous chat history
            
        Returns:
            Answer response object with empty sources and contexts
        """
        # Format chat history
        history_text = ""
        if chat_history:
            history_text = "Previous messages:\n"
            for msg in chat_history:
                role = msg["role"].capitalize()
                history_text += f"{role}: {msg['content']}\n"
        
        prompt = f"""
        You are JobFit.AI's intelligent assistant specialized in career development, job seeking, and professional growth.
        The user's question doesn't match any specific documents in our knowledge base, so please answer based on general knowledge
        about careers, job interviews, resume building, professional development, and similar topics.
        
        {history_text}
        
        User Query: {query}
        
        Please provide a helpful response. Be honest about limitations of your knowledge.
        At the end, suggest that the user could ask more specific questions about JobFit.AI's services if appropriate.
        """
        
        try:
            result = await self.ai_service.generate_text(
                prompt=prompt,
                provider=AIModelProvider.GEMINI if self.ai_service.gemini_available else None,
                max_tokens=600,
                temperature=0.4
            )
            
            if "error" in result:
                logger.error(f"Error generating general answer: {result['error']}")
                answer = "I'm sorry, I don't have specific information to answer your question. Please try asking something related to JobFit.AI's services, resume building, job searching, or career development."
            else:
                answer = result["text"].strip()
            
            return {
                "answer": answer,
                "sources": [],
                "contexts": []
            }
        
        except Exception as e:
            logger.error(f"Error generating general answer: {str(e)}")
            return {
                "answer": "I'm sorry, I don't have specific information to answer your question. Please try asking something related to JobFit.AI's services, resume building, job searching, or career development.",
                "sources": [],
                "contexts": []
            }
    
    async def process_admin_query(self, query: str) -> Dict[str, Any]:
        """
        Process admin-specific queries about the RAG system
        
        Args:
            query: Admin query about the system
            
        Returns:
            Response with system information
        """
        # Check for specific admin queries
        if "document count" in query.lower():
            try:
                count = await self.vector_db.get_document_count(self.collection_name)
                return {
                    "answer": f"There are currently {count} document chunks in the vector database collection '{self.collection_name}'.",
                    "system_info": {"document_count": count}
                }
            except Exception as e:
                logger.error(f"Error getting document count: {str(e)}")
                return {
                    "answer": "Unable to retrieve document count due to an error.",
                    "system_info": {"error": str(e)}
                }
                
        elif "system status" in query.lower():
            try:
                status = await self.vector_db.get_system_status()
                return {
                    "answer": f"Vector database status: {status.get('status', 'Unknown')}. Collection '{self.collection_name}' contains {status.get('document_count', 'unknown')} document chunks.",
                    "system_info": status
                }
            except Exception as e:
                logger.error(f"Error getting system status: {str(e)}")
                return {
                    "answer": "Unable to retrieve system status due to an error.",
                    "system_info": {"error": str(e)}
                }
                
        # For unknown admin queries, provide help
        return {
            "answer": "Available admin queries include: 'document count', 'system status'. Please try one of these queries for system information.",
            "system_info": {}
        }
    
    async def clear_collection(self) -> bool:
        """
        Clear all documents from the collection
        
        Returns:
            Boolean indicating success
        """
        try:
            await self.vector_db.delete_collection(self.collection_name)
            await self.vector_db.create_collection(self.collection_name)
            return True
        except Exception as e:
            logger.error(f"Error clearing collection: {str(e)}")
            return False 
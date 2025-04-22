import os
import logging
from typing import List, Dict, Any, Optional
import re
import unicodedata

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    """
    Processes documents by splitting them into smaller chunks suitable for embedding
    """
    
    def __init__(self, 
                chunk_size: int = 1000, 
                chunk_overlap: int = 200,
                separator: str = "\n"):
        """
        Initialize the document processor
        
        Args:
            chunk_size: The target size of each text chunk (in characters)
            chunk_overlap: The number of characters to overlap between chunks
            separator: The separator to use for splitting text
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separator = separator
    
    def split_text(self, text: str) -> List[str]:
        """
        Split text into chunks suitable for embedding
        
        Args:
            text: The text to split
            
        Returns:
            List of text chunks
        """
        try:
            # If text is shorter than chunk size, return as single chunk
            if len(text) <= self.chunk_size:
                return [text]
            
            # Split on separator
            splits = text.split(self.separator)
            
            # Create chunks with overlap
            chunks = []
            current_chunk = []
            current_length = 0
            
            for split in splits:
                # Add separator back in, except for the first split
                if current_chunk:
                    split_with_separator = self.separator + split
                else:
                    split_with_separator = split
                
                # If adding this split would exceed the chunk size, finalize the chunk
                if current_length + len(split_with_separator) > self.chunk_size and current_chunk:
                    # Join the current chunk and add it to chunks
                    chunks.append("".join(current_chunk))
                    
                    # Calculate overlap - keep parts of the current chunk for overlap
                    if self.chunk_overlap > 0:
                        # Calculate how many characters we should keep for overlap
                        overlap_start = max(0, current_length - self.chunk_overlap)
                        
                        # Rebuild current_chunk with overlap
                        overlap_text = "".join(current_chunk)
                        current_chunk = [overlap_text[overlap_start:]]
                        current_length = len(current_chunk[0])
                    else:
                        # No overlap, start fresh
                        current_chunk = []
                        current_length = 0
                
                # Add the current split to the chunk
                current_chunk.append(split_with_separator)
                current_length += len(split_with_separator)
            
            # Add the last chunk if there's anything left
            if current_chunk:
                chunks.append("".join(current_chunk))
            
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting text: {str(e)}")
            # Return the original text as a fallback
            return [text]
    
    def clean_text(self, text: str) -> str:
        """
        Clean and normalize text before processing
        
        Args:
            text: The text to clean
            
        Returns:
            Cleaned text
        """
        try:
            # Remove excessive whitespace
            text = re.sub(r'\s+', ' ', text)
            
            # Replace special characters that might cause issues
            text = text.replace('\u0000', ' ')  # Null bytes
            
            # Remove control characters except newlines and tabs
            text = ''.join(char for char in text if char == '\n' or char == '\t' or not unicodedata.category(char).startswith('C'))
            
            # Normalize unicode (e.g., convert ñ to n)
            text = unicodedata.normalize('NFKD', text)
            
            return text.strip()
            
        except Exception as e:
            logger.error(f"Error cleaning text: {str(e)}")
            return text  # Return original text as fallback
    
    def split_by_heading(self, text: str, heading_pattern: str = r'^#{1,6}\s+.+$') -> List[Dict[str, str]]:
        """
        Split text by headings (e.g., Markdown headings)
        
        Args:
            text: The text to split
            heading_pattern: Regex pattern for identifying headings
            
        Returns:
            List of dictionaries with heading and content
        """
        try:
            # Find all headings
            heading_matches = list(re.finditer(heading_pattern, text, re.MULTILINE))
            
            if not heading_matches:
                # No headings found, return entire text
                return [{"heading": "", "content": text}]
            
            sections = []
            for i, match in enumerate(heading_matches):
                # Get the heading
                heading = match.group(0)
                
                # Determine start and end of content
                start = match.end()
                end = heading_matches[i+1].start() if i < len(heading_matches) - 1 else len(text)
                
                # Extract content
                content = text[start:end].strip()
                
                sections.append({
                    "heading": heading,
                    "content": content
                })
            
            return sections
            
        except Exception as e:
            logger.error(f"Error splitting by heading: {str(e)}")
            return [{"heading": "", "content": text}]  # Return original text as fallback
    
    def extract_metadata(self, text: str) -> Dict[str, Any]:
        """
        Extract metadata from document text (e.g., title, author)
        
        Args:
            text: The document text
            
        Returns:
            Dictionary of extracted metadata
        """
        metadata = {}
        
        try:
            # Try to extract title (first heading)
            title_match = re.search(r'^#{1,2}\s+(.+)$', text, re.MULTILINE)
            if title_match:
                metadata["title"] = title_match.group(1).strip()
            
            # Try to extract author
            author_match = re.search(r'[Aa]uthor:\s*(.+?)(?:\n|$)', text)
            if author_match:
                metadata["author"] = author_match.group(1).strip()
            
            # Try to extract date
            date_match = re.search(r'[Dd]ate:\s*(.+?)(?:\n|$)', text)
            if date_match:
                metadata["date"] = date_match.group(1).strip()
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error extracting metadata: {str(e)}")
            return metadata 
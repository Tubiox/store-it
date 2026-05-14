import os
from typing import Optional
from google import genai
from google.genai import types
import base64
from io import BytesIO
import asyncio

# Initialize Gemini client (automatically uses GEMINI_API_KEY environment variable)
client = genai.Client()

MODEL_NAME = "gemini-2.5-flash-lite"

# Token/size limits for different file types
TEXT_MAX_SIZE = 500 * 1024  # 500KB for text files
PDF_MAX_SIZE = 2 * 1024 * 1024  # 2MB for PDFs
IMAGE_MAX_SIZE = 5 * 1024 * 1024  # 5MB for images
VIDEO_MAX_SIZE = 10 * 1024 * 1024  # 10MB for video metadata
OVERALL_MAX_SIZE = 20 * 1024 * 1024  # 20MB overall limit

def get_summary_prompt(file_type: str) -> str:
    """Get appropriate prompt based on file type"""
    base_prompt = "Provide a concise and informative summary of this file in 2-3 sentences. Focus on the key content and main points."
    
    type_prompts = {
        "text": f"{base_prompt} This is a text file.",
        "document": f"{base_prompt} This is a document (PDF, Word, etc.).",
        "image": f"{base_prompt} This is an image. Describe what you see.",
        "audio": f"{base_prompt} This is audio. Summarize the main content based on any metadata or embedded text.",
        "video": f"{base_prompt} This is video. Summarize based on any available metadata or frames.",
    }
    
    return type_prompts.get(file_type, base_prompt)


def detect_file_category(content_type: str, filename: str = "") -> str:
    """Detect file category from content type and filename"""
    content_type_lower = content_type.lower()
    filename_lower = filename.lower()
    
    if "image" in content_type_lower:
        return "image"
    elif "video" in content_type_lower:
        return "video"
    elif "audio" in content_type_lower:
        return "audio"
    elif "pdf" in content_type_lower or filename_lower.endswith(".pdf"):
        return "document"
    elif any(doc_type in content_type_lower for doc_type in ["word", "document", "sheet", "presentation"]):
        return "document"
    elif "text" in content_type_lower or filename_lower.endswith((".txt", ".md", ".csv")):
        return "text"
    else:
        return "text"


async def generate_file_summary(
    file_content: bytes,
    content_type: str,
    filename: str = ""
) -> Optional[str]:
    """
    Generate a summary for the given file content using Gemini API.
    Intelligently handles large files by truncating or sampling content.
    
    Args:
        file_content: The decrypted file bytes
        content_type: MIME type of the file
        filename: Name of the file
    
    Returns:
        Summary string or None if generation fails
    
    Raises:
        ValueError: If file is too large or unsupported
        Exception: If API call fails
    """
    
    # Check overall file size
    if len(file_content) > OVERALL_MAX_SIZE:
        raise ValueError(f"File too large for summary. Max size: 20MB, provided: {len(file_content) / (1024*1024):.1f}MB")
    
    file_category = detect_file_category(content_type, filename)
    prompt = get_summary_prompt(file_category)
    
    try:
        # Define a function to make the blocking API call
        def _call_gemini_api():
            # Handle different file types intelligently
            if "image" in content_type.lower():
                # Images are efficient, send as-is
                if len(file_content) > IMAGE_MAX_SIZE:
                    raise ValueError(f"Image too large. Max: 5MB, provided: {len(file_content) / (1024*1024):.1f}MB")
                
                return client.models.generate_content(
                    model=MODEL_NAME,
                    contents=[
                        prompt,
                        types.Part.from_bytes(data=file_content, mime_type=content_type)
                    ]
                )
            
            elif "pdf" in content_type.lower() or "pdf" in filename.lower():
                # For PDFs, truncate if needed
                if len(file_content) > PDF_MAX_SIZE:
                    # For large PDFs, just send first 2MB (usually covers several pages)
                    file_content_truncated = file_content[:PDF_MAX_SIZE]
                    truncation_note = " (Note: Analyzed first portion of file due to size)"
                else:
                    file_content_truncated = file_content
                    truncation_note = ""
                
                return client.models.generate_content(
                    model=MODEL_NAME,
                    contents=[
                        prompt + truncation_note,
                        types.Part.from_bytes(data=file_content_truncated, mime_type="application/pdf")
                    ]
                )
            
            else:
                # For text-based files, decode and truncate if needed
                try:
                    text_content = file_content.decode("utf-8")
                except UnicodeDecodeError:
                    # If UTF-8 fails, try common encodings
                    text_content = None
                    for encoding in ["latin-1", "cp1252", "utf-16"]:
                        try:
                            text_content = file_content.decode(encoding)
                            break
                        except:
                            continue
                    
                    if text_content is None:
                        # If all else fails, send file as blob
                        if len(file_content) > VIDEO_MAX_SIZE:
                            raise ValueError(f"Binary file too large for summary")
                        return client.models.generate_content(
                            model=MODEL_NAME,
                            contents=[
                                prompt + " (Note: File is binary/encoded)",
                                types.Part.from_bytes(data=file_content, mime_type=content_type or "application/octet-stream")
                            ]
                        )
                
                # Truncate large text files intelligently
                if len(text_content) > TEXT_MAX_SIZE:
                    # Keep first 300KB + last 50KB for context
                    first_part = text_content[:300000]
                    last_part = text_content[-50000:] if len(text_content) > 350000 else ""
                    text_content = first_part + "\n\n...[content truncated]...\n\n" + last_part
                    truncation_note = " (Note: Large file - analyzed beginning and end)"
                else:
                    truncation_note = ""
                
                return client.models.generate_content(
                    model=MODEL_NAME,
                    contents=[prompt + truncation_note, text_content]
                )
        
        # Run the blocking API call in a thread pool
        response = await asyncio.to_thread(_call_gemini_api)
        
        summary = response.text.strip() if response.text else None
        return summary
    
    except ValueError as e:
        # Re-raise ValueError with user-friendly message
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"Error generating summary: {error_msg}")
        
        # Provide helpful error messages
        if "INVALID_ARGUMENT" in error_msg and "token" in error_msg.lower():
            raise ValueError("File content is too complex or large for summary. Try a smaller or simpler file.")
        elif "RESOURCE_EXHAUSTED" in error_msg:
            raise ValueError("API quota exceeded. Please try again later.")
        elif "PERMISSION_DENIED" in error_msg:
            raise ValueError("API authentication failed. Please check your GEMINI_API_KEY.")
        else:
            raise Exception(f"Failed to generate summary: {error_msg}")

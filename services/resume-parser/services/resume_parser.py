import logging
import asyncio
from typing import Dict, Any, Optional
from pathlib import Path
import PyPDF2
from docx import Document
from PIL import Image
import io
import torch
from transformers import AutoProcessor, AutoModelForVision2Seq
from datetime import datetime
import re

logger = logging.getLogger(__name__)


class ResumeParserService:
    def __init__(self, model_name: str, api_token: str):
        self.model_name = model_name
        self.api_token = api_token
        self.processor = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    async def initialize(self):
        """Initialize the model (lazy loading)"""
        try:
            logger.info(f"Loading model: {self.model_name}")
            logger.info(f"Using device: {self.device}")

            # Load processor and model
            self.processor = AutoProcessor.from_pretrained(
                self.model_name,
                use_auth_token=self.api_token
            )
            self.model = AutoModelForVision2Seq.from_pretrained(
                self.model_name,
                use_auth_token=self.api_token
            ).to(self.device)

            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise

    async def parse_resume(
        self,
        file_path: str,
        log_callback=None
    ) -> Dict[str, Any]:
        """
        Parse resume file and extract structured data

        Args:
            file_path: Path to the resume file
            log_callback: Optional async callback for logging

        Returns:
            Dictionary with parsed resume data
        """
        try:
            if log_callback:
                await log_callback("info", f"Starting resume parsing: {file_path}")

            file_path_obj = Path(file_path)
            file_extension = file_path_obj.suffix.lower()

            # Extract text based on file type
            if file_extension == '.pdf':
                text, images = await self._extract_from_pdf(file_path, log_callback)
            elif file_extension == '.docx':
                text = await self._extract_from_docx(file_path, log_callback)
                images = []
            elif file_extension in ['.png', '.jpg', '.jpeg']:
                text = ""
                images = [file_path]
            elif file_extension == '.txt':
                text = await self._extract_from_txt(file_path, log_callback)
                images = []
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")

            # Parse the text/images using AI model
            if log_callback:
                await log_callback("info", "Extracting structured data using AI model...")

            parsed_data = await self._extract_structured_data(text, images, log_callback)

            if log_callback:
                await log_callback("info", "Resume parsing completed successfully")

            return parsed_data

        except Exception as e:
            logger.error(f"Error parsing resume: {e}")
            if log_callback:
                await log_callback("error", f"Parsing failed: {str(e)}")
            raise

    async def _extract_from_pdf(
        self,
        file_path: str,
        log_callback=None
    ) -> tuple[str, list]:
        """Extract text and images from PDF"""
        try:
            if log_callback:
                await log_callback("info", "Extracting content from PDF...")

            text = ""
            images = []

            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                num_pages = len(pdf_reader.pages)

                if log_callback:
                    await log_callback("info", f"Processing {num_pages} pages...")

                for page_num, page in enumerate(pdf_reader.pages, 1):
                    text += page.extract_text()
                    if log_callback:
                        await log_callback("info", f"Extracted page {page_num}/{num_pages}")

            # TODO: Extract images from PDF if needed
            # This would require pdf2image library

            return text, images

        except Exception as e:
            logger.error(f"Error extracting from PDF: {e}")
            raise

    async def _extract_from_docx(
        self,
        file_path: str,
        log_callback=None
    ) -> str:
        """Extract text from DOCX"""
        try:
            if log_callback:
                await log_callback("info", "Extracting text from DOCX...")

            doc = Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])

            if log_callback:
                await log_callback("info", "DOCX extraction completed")

            return text

        except Exception as e:
            logger.error(f"Error extracting from DOCX: {e}")
            raise

    async def _extract_from_txt(
        self,
        file_path: str,
        log_callback=None
    ) -> str:
        """Extract text from TXT"""
        try:
            if log_callback:
                await log_callback("info", "Reading text file...")

            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()

            if log_callback:
                await log_callback("info", "Text file read completed")

            return text

        except Exception as e:
            logger.error(f"Error reading text file: {e}")
            raise

    async def _extract_structured_data(
        self,
        text: str,
        images: list,
        log_callback=None
    ) -> Dict[str, Any]:
        """
        Use AI model to extract structured data from resume text/images

        This is a simplified implementation. For production, you would:
        1. Use the model to analyze the document
        2. Implement sophisticated NLP to extract fields
        3. Use entity recognition and pattern matching
        """

        # For now, implement rule-based parsing with regex patterns
        # This can be enhanced with the actual LayoutLMv3/Donut model

        if log_callback:
            await log_callback("info", "Analyzing resume structure...")

        parsed_data = {
            "personal_info": self._extract_personal_info(text),
            "work_experience": self._extract_work_experience(text),
            "projects": self._extract_projects(text),
            "education": self._extract_education(text),
            "skills": self._extract_skills(text)
        }

        # Log summary
        if log_callback:
            await log_callback("info", f"Extracted {len(parsed_data['work_experience'])} work experiences")
            await log_callback("info", f"Extracted {len(parsed_data['projects'])} projects")
            await log_callback("info", f"Extracted {len(parsed_data['education'])} education entries")
            await log_callback("info", f"Extracted {len(parsed_data['skills'])} skills")

        return parsed_data

    def _extract_personal_info(self, text: str) -> Dict[str, Any]:
        """Extract personal information using regex patterns"""
        info = {}

        # Email
        email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if email_match:
            info['email'] = email_match.group()

        # Phone (multiple formats)
        phone_patterns = [
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',  # 123-456-7890
            r'\b\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'  # International
        ]
        for pattern in phone_patterns:
            phone_match = re.search(pattern, text)
            if phone_match:
                info['phone'] = phone_match.group()
                break

        # Name (simplified - usually appears at the beginning)
        lines = text.strip().split('\n')
        if lines:
            first_line = lines[0].strip()
            if len(first_line.split()) <= 4 and len(first_line) < 50:
                info['fullName'] = first_line

        # Location
        location_patterns = [
            r'(?:Location|City|Address):\s*([^\n]+)',
            r'([A-Z][a-z]+,\s*[A-Z][a-z]+)'  # City, State
        ]
        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                info['location'] = match.group(1).strip()
                break

        return info

    def _extract_work_experience(self, text: str) -> list[Dict[str, Any]]:
        """Extract work experience entries"""
        experiences = []

        # Pattern for work experience section
        # This is simplified - real implementation would be more sophisticated
        lines = text.split('\n')
        current_exp = None
        experience_section = False

        for line in lines:
            line_lower = line.lower()

            # Detect experience section
            if any(keyword in line_lower for keyword in ['experience', 'employment', 'work history']):
                experience_section = True
                continue

            if experience_section and any(keyword in line_lower for keyword in ['education', 'projects', 'skills']):
                break

            if not experience_section:
                continue

            # Detect company/position lines (simplified)
            # Look for patterns like "Company Name - Position"
            if ' - ' in line or ' at ' in line:
                if current_exp:
                    experiences.append(current_exp)

                parts = line.split(' - ') if ' - ' in line else line.split(' at ')
                if len(parts) >= 2:
                    current_exp = {
                        'company': parts[0].strip(),
                        'position': parts[1].strip(),
                        'description': '',
                        'startDate': None,
                        'endDate': None
                    }

            elif current_exp:
                # Accumulate description
                if current_exp['description']:
                    current_exp['description'] += ' ' + line.strip()
                else:
                    current_exp['description'] = line.strip()

        if current_exp:
            experiences.append(current_exp)

        return experiences

    def _extract_projects(self, text: str) -> list[Dict[str, Any]]:
        """Extract project entries"""
        projects = []

        # Simplified implementation
        lines = text.split('\n')
        project_section = False
        current_project = None

        for line in lines:
            line_lower = line.lower()

            if 'project' in line_lower:
                project_section = True
                continue

            if project_section and any(keyword in line_lower for keyword in ['education', 'experience', 'skills']):
                break

            if not project_section:
                continue

            # Detect project names (simplified)
            if line.strip() and not line.startswith(' '):
                if current_project:
                    projects.append(current_project)

                current_project = {
                    'name': line.strip(),
                    'description': '',
                    'url': '',
                    'startDate': None,
                    'endDate': None
                }
            elif current_project:
                current_project['description'] += ' ' + line.strip()

        if current_project:
            projects.append(current_project)

        return projects

    def _extract_education(self, text: str) -> list[Dict[str, Any]]:
        """Extract education entries"""
        education_entries = []

        lines = text.split('\n')
        education_section = False
        current_edu = None

        for line in lines:
            line_lower = line.lower()

            if 'education' in line_lower:
                education_section = True
                continue

            if education_section and any(keyword in line_lower for keyword in ['experience', 'projects', 'skills']):
                break

            if not education_section:
                continue

            # Detect education entries (simplified)
            if any(keyword in line_lower for keyword in ['university', 'college', 'school', 'institute']):
                if current_edu:
                    education_entries.append(current_edu)

                current_edu = {
                    'school': line.strip(),
                    'degree': '',
                    'major': '',
                    'startDate': None,
                    'endDate': None,
                    'gpa': None
                }
            elif current_edu:
                if 'degree' in line_lower or 'bachelor' in line_lower or 'master' in line_lower:
                    current_edu['degree'] = line.strip()
                elif 'gpa' in line_lower:
                    gpa_match = re.search(r'(\d+\.?\d*)', line)
                    if gpa_match:
                        current_edu['gpa'] = float(gpa_match.group(1))

        if current_edu:
            education_entries.append(current_edu)

        return education_entries

    def _extract_skills(self, text: str) -> list[Dict[str, Any]]:
        """Extract skills"""
        skills = []

        lines = text.split('\n')
        skills_section = False

        for line in lines:
            line_lower = line.lower()

            if 'skill' in line_lower:
                skills_section = True
                continue

            if skills_section and any(keyword in line_lower for keyword in ['experience', 'projects', 'education']):
                break

            if not skills_section:
                continue

            # Extract skills (comma-separated or bullet points)
            if line.strip():
                # Split by comma, bullet, or dash
                skill_items = re.split(r'[,•\-\n]', line.strip())

                for skill in skill_items:
                    skill = skill.strip()
                    if skill and len(skill) > 2:
                        skills.append({
                            'name': skill,
                            'category': 'Technical',
                            'proficiency': 'INTERMEDIATE'
                        })

        return skills[:20]  # Limit to 20 skills

"""
LayoutLM-enhanced Transformer provider for resume parsing.
Uses LayoutLM for better document understanding and structure preservation.
"""

from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
import torch
import re
from typing import Dict, Any, List, Tuple
import logging
from .base_llm import BaseLLMProvider
from config.output_schema import ResumeData, Address, Skill, Education, WorkExperience
from config.llm_config import LLMConfig
from ..file_processors.layoutlm_pdf_processor import LayoutLMPDFProcessor


class LayoutLMTransformerProvider(BaseLLMProvider):
    """LayoutLM-enhanced Transformer provider for better document understanding"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(config or {})
        self.layoutlm_processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.pdf_processor = LayoutLMPDFProcessor()
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize LayoutLM models"""
        try:
            if self.pdf_processor.is_available():
                self.layoutlm_processor = self.pdf_processor.processor
                self.logger.info(f"LayoutLM models initialized on {self.device}")
            else:
                self.logger.warning("LayoutLM not available, falling back to basic processing")
        
        except Exception as e:
            self.logger.error(f"Failed to initialize LayoutLM models: {e}")
            self.layoutlm_processor = None
    
    def is_available(self) -> bool:
        """Check if LayoutLM models are available"""
        return self.pdf_processor.is_available()
    
    def extract_resume_data(self, resume_text: str, pdf_path: str = None) -> ResumeData:
        """Extract structured data from resume using LayoutLM-enhanced processing"""
        try:
            # If we have the PDF path, use LayoutLM for better structure
            if pdf_path and self.is_available():
                return self._extract_with_layoutlm(pdf_path)
            else:
                # Fallback to enhanced text processing
                return self._extract_from_text(resume_text)
        
        except Exception as e:
            self.logger.error(f"LayoutLM extraction failed: {e}")
            return self._get_fallback_data(resume_text)
    
    def _extract_with_layoutlm(self, pdf_path: str) -> ResumeData:
        """Extract resume data using LayoutLM for better structure understanding"""
        try:
            # Get structured text from LayoutLM
            structured_text = self.pdf_processor.extract_text(pdf_path)
            
            # Get document structure information
            doc_structure = self.pdf_processor.get_document_structure(pdf_path)
            
            # Extract resume data with enhanced structure awareness
            resume_data = ResumeData()
            
            # Use structure-aware extraction
            sections = self._identify_sections(structured_text, doc_structure)
            
            # Extract information from identified sections
            resume_data.first_name, resume_data.last_name = self._extract_name_enhanced(
                sections.get('contact', ''), structured_text
            )
            resume_data.email = self._extract_email_enhanced(sections.get('contact', ''), structured_text)
            resume_data.phone = self._extract_phone_enhanced(sections.get('contact', ''), structured_text)
            resume_data.address = self._extract_address_enhanced(sections.get('contact', ''), structured_text)
            
            resume_data.summary = self._extract_summary_enhanced(
                sections.get('summary', ''), sections.get('objective', ''), structured_text
            )
            resume_data.skills = self._extract_skills_enhanced(sections.get('skills', ''), structured_text)
            resume_data.education_history = self._extract_education_enhanced(
                sections.get('education', ''), structured_text
            )
            resume_data.work_history = self._extract_work_experience_enhanced(
                sections.get('experience', ''), structured_text
            )
            
            self.logger.info("Successfully extracted resume data using LayoutLM")
            return resume_data
        
        except Exception as e:
            self.logger.error(f"LayoutLM-based extraction failed: {e}")
            return self._extract_from_text(self.pdf_processor._fallback_extraction(pdf_path))
    
    def _identify_sections(self, text: str, doc_structure: Dict) -> Dict[str, str]:
        """Identify and extract different sections of the resume"""
        sections = {}
        lines = text.split('\n')
        
        # Common section headers
        section_patterns = {
            'contact': ['contact', 'personal information', 'personal details'],
            'summary': ['summary', 'profile', 'about', 'overview'],
            'objective': ['objective', 'career objective', 'goal'],
            'experience': ['experience', 'work experience', 'employment', 'professional experience', 'career'],
            'education': ['education', 'academic', 'qualification', 'educational background'],
            'skills': ['skills', 'technical skills', 'technologies', 'competencies', 'tech stack'],
            'projects': ['projects', 'project experience'],
            'certifications': ['certifications', 'certificates', 'credentials'],
            'awards': ['awards', 'achievements', 'honors']
        }
        
        current_section = None
        section_content = []
        
        # Extract contact information from the top of the document
        contact_lines = []
        for i, line in enumerate(lines[:10]):  # Check first 10 lines for contact info
            if self._contains_contact_info(line):
                contact_lines.append(line)
        sections['contact'] = '\n'.join(contact_lines)
        
        # Process remaining lines for other sections
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check if this line is a section header
            found_section = None
            for section_name, patterns in section_patterns.items():
                if any(pattern in line_lower for pattern in patterns):
                    # Additional check: line should be relatively short and not contain too much detail
                    if len(line.split()) <= 5 and not self._contains_contact_info(line):
                        found_section = section_name
                        break
            
            if found_section:
                # Save previous section
                if current_section and section_content:
                    sections[current_section] = '\n'.join(section_content)
                
                # Start new section
                current_section = found_section
                section_content = []
            elif current_section:
                # Add content to current section
                if line.strip():
                    section_content.append(line)
        
        # Save last section
        if current_section and section_content:
            sections[current_section] = '\n'.join(section_content)
        
        return sections
    
    def _contains_contact_info(self, line: str) -> bool:
        """Check if line contains contact information"""
        # Email pattern
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', line):
            return True
        
        # Phone pattern
        if re.search(r'[\+]?[\d\s\-\(\)]{10,}', line):
            return True
        
        # Address indicators
        address_indicators = ['road', 'street', 'avenue', 'city', 'state', 'country', 'pin', 'zip']
        if any(indicator in line.lower() for indicator in address_indicators):
            return True
        
        return False
    
    def _extract_name_enhanced(self, contact_section: str, full_text: str) -> Tuple[str, str]:
        """Enhanced name extraction using structure awareness"""
        # First try to extract from contact section
        if contact_section:
            lines = contact_section.split('\n')
            for line in lines:
                line = line.strip()
                # Look for name patterns (2-3 words, mostly alphabetic)
                words = line.split()
                if 2 <= len(words) <= 3 and all(word.replace('.', '').isalpha() for word in words):
                    # Check if it doesn't contain contact info
                    if not self._contains_contact_info(line):
                        return words[0], ' '.join(words[1:])
        
        # Fallback to first few lines of document
        lines = full_text.split('\n')[:5]
        for line in lines:
            line = line.strip()
            words = line.split()
            if 2 <= len(words) <= 3 and all(word.replace('.', '').isalpha() for word in words):
                if not self._contains_contact_info(line) and len(line) < 50:
                    return words[0], ' '.join(words[1:])
        
        return "", ""
    
    def _extract_email_enhanced(self, contact_section: str, full_text: str) -> str:
        """Enhanced email extraction"""
        # Search in contact section first
        text_to_search = contact_section if contact_section else full_text
        
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text_to_search)
        
        if matches:
            return matches[0]
        
        return ""
    
    def _extract_phone_enhanced(self, contact_section: str, full_text: str) -> str:
        """Enhanced phone extraction"""
        text_to_search = contact_section if contact_section else full_text
        
        # Enhanced phone patterns
        phone_patterns = [
            r'\(\+91\)\s*\d{10}',  # (+91) 1234567890
            r'\+91[-.\s]?\d{10}',  # +91-1234567890
            r'\+91\d{10}',  # +911234567890
            r'\(\+\d{1,3}\)\s*\d{3}[A-Z]*\d{4,7}',  # (+91)889XXXXX28 format
            r'\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}',
            r'\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text_to_search)
            if matches:
                phone = matches[0].strip()
                # Clean up the phone number
                digits_only = re.sub(r'[^\d]', '', phone)
                if len(digits_only) >= 10:
                    return phone
        
        return ""
    
    def _extract_address_enhanced(self, contact_section: str, full_text: str) -> Address:
        """Enhanced address extraction"""
        text_to_search = contact_section if contact_section else full_text[:500]  # First 500 chars
        
        city, state, country = "", "", ""
        
        # Common Indian cities and states
        indian_cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
            'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
            'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
            'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot'
        ]
        
        indian_states = [
            'Maharashtra', 'MH', 'Karnataka', 'KA', 'Tamil Nadu', 'TN', 'Delhi', 'DL',
            'Gujarat', 'GJ', 'Rajasthan', 'RJ', 'Punjab', 'PB', 'Haryana', 'HR',
            'Uttar Pradesh', 'UP', 'West Bengal', 'WB', 'Madhya Pradesh', 'MP'
        ]
        
        countries = ['India', 'IND', 'USA', 'US', 'United States', 'UK', 'Canada']
        
        text_upper = text_to_search.upper()
        
        # Find matches
        for city_name in indian_cities:
            if city_name.upper() in text_upper:
                city = city_name
                break
        
        for state_name in indian_states:
            if state_name.upper() in text_upper:
                state = state_name
                break
        
        for country_name in countries:
            if country_name.upper() in text_upper:
                country = country_name
                break
        
        return Address(city=city, state=state, country=country)
    
    def _extract_summary_enhanced(self, summary_section: str, objective_section: str, full_text: str) -> str:
        """Enhanced summary extraction"""
        # Use dedicated summary section if available
        if summary_section and len(summary_section.strip()) > 20:
            return summary_section.strip()
        
        if objective_section and len(objective_section.strip()) > 20:
            return objective_section.strip()
        
        # Fallback: look for summary-like content in first few paragraphs
        lines = full_text.split('\n')
        for i, line in enumerate(lines[:15]):
            if len(line.split()) > 15 and not self._contains_contact_info(line):
                # This might be a summary paragraph
                summary_lines = [line]
                # Check next few lines
                for j in range(i+1, min(i+5, len(lines))):
                    next_line = lines[j].strip()
                    if next_line and len(next_line.split()) > 5:
                        summary_lines.append(next_line)
                    else:
                        break
                
                summary = ' '.join(summary_lines)
                if len(summary) > 50:
                    return summary
        
        return "Professional summary not found in resume."
    
    def _extract_skills_enhanced(self, skills_section: str, full_text: str) -> List[Skill]:
        """Enhanced skills extraction"""
        # Use dedicated skills section if available
        text_to_search = skills_section if skills_section else full_text
        
        # Comprehensive technical skills list
        skill_keywords = [
            # Programming Languages
            "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby", "go",
            "swift", "kotlin", "scala", "r", "matlab", "shell", "bash",
            
            # Web Technologies
            "react", "angular", "vue", "jquery", "bootstrap", "tailwind", "html", "css",
            "scss", "sass", "webpack", "nodejs", "express", "django", "flask",
            
            # Databases
            "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
            
            # Cloud/DevOps
            "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git",
            
            # Tools
            "linux", "windows", "jira", "figma", "photoshop",
            
            # Data Science/ML
            "machine learning", "ai", "tensorflow", "pytorch", "pandas", "numpy"
        ]
        
        found_skills = set()
        text_lower = text_to_search.lower()
        
        # Extract from predefined skills list
        for skill in skill_keywords:
            if skill in text_lower:
                found_skills.add(skill)
        
        # Extract from skills section with better parsing
        if skills_section:
            lines = skills_section.split('\n')
            for line in lines:
                if len(line) < 100:  # Skip long descriptions
                    # Split by common delimiters
                    skills_in_line = re.split(r'[,;|•\-&+/]', line)
                    for skill in skills_in_line:
                        skill = skill.strip()
                        if self._is_valid_skill(skill):
                            found_skills.add(skill.lower())
        
        # Convert to Skill objects
        skill_objects = [Skill(skill=skill) for skill in sorted(found_skills)]
        return skill_objects[:20]  # Limit to 20 skills
    
    def _is_valid_skill(self, skill: str) -> bool:
        """Check if a string is a valid skill"""
        if not skill or len(skill) < 2 or len(skill) > 30:
            return False
        
        if skill.count(' ') > 2:  # Too many spaces
            return False
        
        # Skip common non-skill words
        invalid_words = ['experience', 'years', 'months', 'worked', 'using', 'with']
        if skill.lower() in invalid_words:
            return False
        
        return True
    
    def _extract_education_enhanced(self, education_section: str, full_text: str) -> List[Education]:
        """Enhanced education extraction with structure awareness"""
        text_to_search = education_section if education_section else full_text

        education_list = []
        lines = text_to_search.split('\n')

        # Enhanced degree patterns
        degree_patterns = [
            r'(bachelor|master|phd|doctorate|diploma|certificate)[\s\w]*',
            r'(b\.?[aes]\.?|m\.?[aes]\.?|ph\.?d\.?|m\.?tech|b\.?tech)[\s\w]*',
            r'(bsc|msc|ba|ma|bcom|mcom|bba|mba|be|me|btech|mtech)',
            r'(engineering|computer science|information technology)'
        ]

        # Institution patterns
        institution_patterns = [
            r'(university|college|institute|school|academy)',
            r'(iit|nit|iiit|bits|vit|mit|stanford|harvard)',
        ]

        # Date patterns
        date_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',  # 2015 - 2019
            r'\d{4}',  # Just year
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}'
        ]

        current_education = None

        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue

            # Check for degree
            degree_match = None
            for pattern in degree_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    degree_match = line
                    break

            # Check for institution
            institution_match = None
            for pattern in institution_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    institution_match = line
                    break

            # Check for dates
            date_match = None
            for pattern in date_patterns:
                match = re.search(pattern, line)
                if match:
                    date_match = match.group()
                    break

            # Process matches
            if degree_match:
                if current_education:
                    education_list.append(current_education)

                from_date, to_date = " ", " "
                if date_match:
                    if '-' in date_match or '–' in date_match:
                        dates = re.split(r'[-–]', date_match)
                        from_date = dates[0].strip() if len(dates) > 0 else " "
                        to_date = dates[1].strip() if len(dates) > 1 else " "
                    else:
                        to_date = date_match.strip()

                current_education = Education(
                    degree=degree_match,
                    name="",
                    from_date=from_date,
                    to_date=to_date
                )

            elif institution_match and current_education and not current_education.name:
                current_education.name = institution_match

            elif date_match and current_education and current_education.from_date == " ":
                if '-' in date_match or '–' in date_match:
                    dates = re.split(r'[-–]', date_match)
                    current_education.from_date = dates[0].strip() if len(dates) > 0 else " "
                    current_education.to_date = dates[1].strip() if len(dates) > 1 else " "
                else:
                    current_education.to_date = date_match.strip()

        if current_education:
            education_list.append(current_education)

        return education_list

    def _extract_work_experience_enhanced(self, experience_section: str, full_text: str) -> List[WorkExperience]:
        """Enhanced work experience extraction with structure awareness"""
        text_to_search = experience_section if experience_section else full_text

        work_list = []
        lines = text_to_search.split('\n')

        # Enhanced company patterns
        company_patterns = [
            r'^[A-Z][A-Z\s&.,]+$',  # All caps company names
            r'^[A-Z][a-zA-Z\s&.,]+ (Inc|LLC|Corp|Ltd|Co|Company|Technologies|Tech|Solutions)\.?$',
            r'^[A-Z][a-zA-Z\s&.,]+ (Pvt\.? Ltd\.?|Private Limited)$',
        ]

        # Job title keywords
        title_keywords = [
            "engineer", "developer", "manager", "analyst", "specialist", "consultant",
            "director", "lead", "senior", "junior", "intern", "associate", "founder"
        ]

        # Date patterns
        date_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',
            r'\d{4}\s*[-–]\s*(present|current)',
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*\d{4}',
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(present|current)',
        ]

        current_work = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check for date range
            date_match = None
            for pattern in date_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    date_match = match.group()
                    break

            # Check for company
            is_company = any(re.match(pattern, line) for pattern in company_patterns)

            # Check for job title
            is_title = any(keyword in line.lower() for keyword in title_keywords)

            if date_match:
                if current_work:
                    work_list.append(current_work)

                # Extract dates
                dates = re.split(r'[-–]', date_match)
                from_date = dates[0].strip() if len(dates) > 0 else " "
                to_date = dates[1].strip() if len(dates) > 1 else " "

                # Look for company/title in the same line
                line_before_date = line[:line.find(date_match)].strip()

                current_work = WorkExperience(
                    company=line_before_date if not is_title else "",
                    title=line_before_date if is_title else "",
                    description="",
                    from_date=from_date,
                    to_date=to_date
                )

            elif is_company and (not current_work or not current_work.company):
                if current_work:
                    current_work.company = line
                else:
                    current_work = WorkExperience(
                        company=line,
                        title="",
                        description="",
                        from_date=" ",
                        to_date=" "
                    )

            elif is_title and (not current_work or not current_work.title):
                if current_work:
                    current_work.title = line
                else:
                    current_work = WorkExperience(
                        company="",
                        title=line,
                        description="",
                        from_date=" ",
                        to_date=" "
                    )

            elif current_work and len(line) > 15 and not is_company and not is_title:
                # Add to description
                if current_work.description:
                    current_work.description += " " + line
                else:
                    current_work.description = line

        if current_work:
            work_list.append(current_work)

        return work_list
    
    def _extract_from_text(self, text: str) -> ResumeData:
        """Fallback text-based extraction when LayoutLM is not available"""
        # Use the original transformer logic as fallback
        from .transformer_llm import TransformerLLMProvider
        fallback_provider = TransformerLLMProvider()
        return fallback_provider.extract_resume_data(text)
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the LayoutLM models"""
        if not self.is_available():
            return {"status": "unavailable", "reason": "LayoutLM models not initialized"}
        
        return {
            "status": "available",
            "provider": "LayoutLM Transformers",
            "device": self.device,
            "model": "microsoft/layoutlmv3-base"
        }

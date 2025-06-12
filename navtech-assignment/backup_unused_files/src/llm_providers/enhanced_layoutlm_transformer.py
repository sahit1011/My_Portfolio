"""
Enhanced LayoutLM Transformer provider that works optimally with LayoutLM-extracted text.
This provider is specifically designed to work with the enhanced LayoutLM processor output.
"""

from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
import torch
import re
from typing import Dict, Any, List, Tuple
import logging
from .base_llm import BaseLLMProvider
from config.output_schema import ResumeData, Address, Skill, Education, WorkExperience
from config.llm_config import LLMConfig


class EnhancedLayoutLMTransformer(BaseLLMProvider):
    """Enhanced transformer provider optimized for LayoutLM-extracted text"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(config or {})
        self.ner_pipeline = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize transformer models optimized for document understanding"""
        try:
            # Use a model that's better for document understanding
            model_name = "microsoft/layoutlmv3-base"
            
            # Try LayoutLM first, fallback to BERT
            try:
                self.ner_pipeline = pipeline(
                    "ner",
                    model=model_name,
                    tokenizer=model_name,
                    aggregation_strategy="simple",
                    device=0 if self.device == "cuda" else -1
                )
                self.logger.info(f"LayoutLM NER pipeline initialized on {self.device}")
            except Exception:
                # Fallback to BERT-based NER
                fallback_model = "dbmdz/bert-large-cased-finetuned-conll03-english"
                self.ner_pipeline = pipeline(
                    "ner",
                    model=fallback_model,
                    tokenizer=fallback_model,
                    aggregation_strategy="simple",
                    device=0 if self.device == "cuda" else -1
                )
                self.logger.info(f"Fallback BERT NER pipeline initialized on {self.device}")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize transformer models: {e}")
            self.ner_pipeline = None
    
    def is_available(self) -> bool:
        """Check if transformer models are available"""
        return self.ner_pipeline is not None
    
    def extract_resume_data(self, resume_text: str, pdf_path: str = None) -> ResumeData:
        """Extract structured data from LayoutLM-processed resume text"""
        if not self.is_available():
            self.logger.error("Enhanced LayoutLM transformer models not available")
            return self._get_fallback_data(resume_text)
        
        try:
            # Extract entities using NER with better chunking
            entities = self._extract_entities_enhanced(resume_text)
            
            # Analyze document structure with LayoutLM awareness
            sections = self._analyze_layoutlm_structure(resume_text)
            
            # Extract structured information with enhanced methods
            resume_data = ResumeData()
            
            # Extract personal information with LayoutLM-aware methods
            resume_data.first_name, resume_data.last_name = self._extract_name_layoutlm(
                resume_text, entities, sections
            )
            resume_data.email = self._extract_email_layoutlm(resume_text, sections)
            resume_data.phone = self._extract_phone_layoutlm(resume_text, sections)
            resume_data.address = self._extract_address_layoutlm(resume_text, entities, sections)
            
            # Extract professional information
            resume_data.summary = self._extract_summary_layoutlm(resume_text, sections)
            resume_data.skills = self._extract_skills_layoutlm(resume_text, sections)
            resume_data.education_history = self._extract_education_layoutlm(resume_text, entities, sections)
            resume_data.work_history = self._extract_work_experience_layoutlm(resume_text, entities, sections)
            
            self.logger.info("Successfully extracted resume data using enhanced LayoutLM transformer")
            return resume_data
        
        except Exception as e:
            self.logger.error(f"Enhanced LayoutLM transformer extraction failed: {e}")
            return self._get_fallback_data(resume_text)
    
    def _extract_entities_enhanced(self, text: str) -> List[Dict]:
        """Enhanced entity extraction with better chunking for LayoutLM text"""
        try:
            # Use larger chunks since LayoutLM text is better structured
            max_length = 1024
            chunks = []
            
            # Split by paragraphs first, then by length if needed
            paragraphs = text.split('\n\n')
            current_chunk = ""
            
            for paragraph in paragraphs:
                if len(current_chunk + paragraph) <= max_length:
                    current_chunk += paragraph + "\n\n"
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = paragraph + "\n\n"
            
            if current_chunk:
                chunks.append(current_chunk.strip())
            
            # If no paragraphs, fall back to simple chunking
            if not chunks:
                chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]
            
            all_entities = []
            for chunk in chunks:
                if chunk.strip():
                    entities = self.ner_pipeline(chunk)
                    all_entities.extend(entities)
            
            return all_entities
        
        except Exception as e:
            self.logger.error(f"Enhanced entity extraction failed: {e}")
            return []
    
    def _analyze_layoutlm_structure(self, text: str) -> Dict[str, str]:
        """Analyze document structure optimized for LayoutLM-extracted text"""
        sections = {}
        lines = text.split('\n')
        
        # Enhanced section patterns for LayoutLM text
        section_patterns = {
            'contact': ['contact', 'personal information', 'personal details'],
            'summary': ['summary', 'profile', 'about', 'overview', 'objective', 'professional summary'],
            'experience': ['experience', 'work experience', 'employment', 'professional experience', 'career history'],
            'education': ['education', 'academic', 'qualification', 'educational background', 'academic background'],
            'skills': ['skills', 'technical skills', 'technologies', 'competencies', 'tech stack', 'technical competencies'],
            'projects': ['projects', 'project experience', 'key projects'],
            'certifications': ['certifications', 'certificates', 'credentials', 'professional certifications']
        }
        
        # Extract contact information from the top (LayoutLM preserves structure better)
        contact_lines = []
        for i, line in enumerate(lines[:10]):  # Check first 10 lines
            if self._is_contact_line(line):
                contact_lines.append(line)
        if contact_lines:
            sections['contact'] = '\n'.join(contact_lines)
        
        # Process lines to identify sections with better LayoutLM structure awareness
        current_section = None
        section_content = []
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            
            # Check if this line is a section header
            found_section = None
            for section_name, patterns in section_patterns.items():
                if any(pattern in line_lower for pattern in patterns):
                    # Enhanced validation for LayoutLM text
                    if self._is_section_header(line, line_lower):
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
    
    def _is_contact_line(self, line: str) -> bool:
        """Enhanced contact line detection for LayoutLM text"""
        # Email pattern
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', line):
            return True
        
        # Phone pattern (enhanced for LayoutLM)
        if re.search(r'[\+]?[\d\s\-\(\)X]{10,}', line):
            return True
        
        # Address indicators
        address_indicators = ['road', 'street', 'avenue', 'city', 'state', 'country', 'pin', 'zip', 'thane', 'mumbai', 'pune']
        if any(indicator in line.lower() for indicator in address_indicators):
            return True
        
        # LinkedIn/social media
        if 'linkedin' in line.lower() or 'github' in line.lower():
            return True
        
        return False
    
    def _is_section_header(self, line: str, line_lower: str) -> bool:
        """Enhanced section header detection for LayoutLM text"""
        # Should be short
        if len(line.split()) > 8:
            return False
        
        # Should not contain detailed info
        if self._is_contact_line(line):
            return False
        
        # Should not be a sentence (no periods in the middle)
        if '.' in line[:-1]:  # Allow period at the end
            return False
        
        # LayoutLM often preserves capitalization better
        if line.isupper() or line.istitle():
            return True
        
        # Check for common header patterns
        header_patterns = [
            r'^[A-Z][A-Z\s]+$',  # All caps
            r'^[A-Z][a-z]+\s+[A-Z][a-z]+$',  # Title Case
        ]
        
        return any(re.match(pattern, line) for pattern in header_patterns)
    
    def _extract_name_layoutlm(self, text: str, entities: List[Dict], sections: Dict[str, str]) -> Tuple[str, str]:
        """Enhanced name extraction optimized for LayoutLM text"""
        # Method 1: From contact section (LayoutLM preserves structure better)
        contact_section = sections.get('contact', '')
        if contact_section:
            lines = contact_section.split('\n')
            for line in lines:
                line = line.strip()
                # Look for name patterns in contact section
                if self._looks_like_name(line):
                    words = line.split()
                    if len(words) >= 2:
                        return words[0], ' '.join(words[1:])
        
        # Method 2: From entities (PERSON type) with better filtering
        person_entities = [e for e in entities if e.get("entity_group") == "PER"]
        if person_entities:
            # Sort by confidence and take the best one
            person_entities.sort(key=lambda x: x.get("score", 0), reverse=True)
            
            for entity in person_entities:
                full_name = entity["word"].strip()
                if self._looks_like_name(full_name):
                    name_parts = full_name.split()
                    if len(name_parts) >= 2:
                        return name_parts[0], " ".join(name_parts[1:])
                    elif len(name_parts) == 1:
                        return name_parts[0], ""
        
        # Method 3: From first few lines with enhanced detection
        lines = text.split('\n')[:8]
        for line in lines:
            line = line.strip()
            if self._looks_like_name(line):
                words = line.split()
                if len(words) >= 2:
                    return words[0], ' '.join(words[1:])
        
        return "", ""
    
    def _looks_like_name(self, text: str) -> bool:
        """Check if text looks like a person's name"""
        if not text or len(text) < 2 or len(text) > 50:
            return False
        
        words = text.split()
        if len(words) < 1 or len(words) > 4:
            return False
        
        # Should not contain contact info
        if self._is_contact_line(text):
            return False
        
        # Should be mostly alphabetic
        alpha_ratio = sum(c.isalpha() or c.isspace() for c in text) / len(text)
        if alpha_ratio < 0.8:
            return False
        
        # Should start with capital letter
        if not text[0].isupper():
            return False
        
        # Common name patterns
        if all(word.istitle() for word in words):
            return True
        
        return False
    
    def _extract_email_layoutlm(self, text: str, sections: Dict[str, str]) -> str:
        """Enhanced email extraction for LayoutLM text"""
        # Search in contact section first
        contact_section = sections.get('contact', '')
        text_to_search = contact_section if contact_section else text[:800]
        
        # Enhanced email patterns
        email_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            r'email[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})',
            r'mail[:\s]*([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})',
        ]
        
        for pattern in email_patterns:
            matches = re.findall(pattern, text_to_search, re.IGNORECASE)
            if matches:
                email = matches[0] if isinstance(matches[0], str) else matches[0]
                # Validate email
                if '@' in email and '.' in email.split('@')[1] and len(email) > 5:
                    return email.strip()
        
        return ""
    
    def _extract_phone_layoutlm(self, text: str, sections: Dict[str, str]) -> str:
        """Enhanced phone extraction for LayoutLM text"""
        contact_section = sections.get('contact', '')
        text_to_search = contact_section if contact_section else text[:800]
        
        # Enhanced phone patterns for LayoutLM text
        patterns = [
            r'\(\+91\)\s*\d{3}[A-Z]*\d{4,7}',  # (+91)889XXXXX28 format
            r'\(\+91\)\s*\d{10}',  # (+91) 1234567890
            r'\+91[-.\s]?\d{10}',  # +91-1234567890
            r'\+91\d{10}',  # +911234567890
            r'\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}',
            r'\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}',
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',
            r'phone[:\s]*(\+?[\d\s\-\(\)]{10,})',
            r'mobile[:\s]*(\+?[\d\s\-\(\)]{10,})',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_to_search, re.IGNORECASE)
            if matches:
                phone = matches[0] if isinstance(matches[0], str) else matches[0]
                # Clean and validate phone
                digits_only = re.sub(r'[^\d]', '', phone)
                if len(digits_only) >= 10:
                    return phone.strip()
        
        return ""
    
    def _extract_address_layoutlm(self, text: str, entities: List[Dict], sections: Dict[str, str]) -> Address:
        """Enhanced address extraction for LayoutLM text"""
        contact_section = sections.get('contact', '')
        text_to_search = contact_section if contact_section else text[:800]
        
        city, state, country = "", "", ""
        
        # Enhanced location lists
        indian_cities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
            'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
            'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
            'Miraroad', 'Mira Road', 'Andheri', 'Borivali', 'Malad'
        ]
        
        indian_states = [
            'Maharashtra', 'MH', 'Karnataka', 'KA', 'Tamil Nadu', 'TN', 'Delhi', 'DL',
            'Gujarat', 'GJ', 'Rajasthan', 'RJ', 'Punjab', 'PB', 'Haryana', 'HR',
            'Uttar Pradesh', 'UP', 'West Bengal', 'WB', 'Madhya Pradesh', 'MP'
        ]
        
        countries = ['India', 'IND', 'IN', 'USA', 'US', 'United States', 'UK', 'Canada']
        
        # Extract from entities first (LayoutLM entities are more accurate)
        locations = [e for e in entities if e.get("entity_group") in ["LOC", "GPE"]]
        for loc in locations:
            loc_text = loc["word"]
            if loc_text in indian_cities and not city:
                city = loc_text
            elif loc_text in indian_states and not state:
                state = loc_text
            elif loc_text in countries and not country:
                country = loc_text
        
        # Extract from text patterns with case-insensitive matching
        text_upper = text_to_search.upper()
        
        if not city:
            for city_name in indian_cities:
                if city_name.upper() in text_upper:
                    city = city_name
                    break
        
        if not state:
            for state_name in indian_states:
                if state_name.upper() in text_upper:
                    state = state_name
                    break
        
        if not country:
            for country_name in countries:
                if country_name.upper() in text_upper:
                    country = country_name
                    break
        
        return Address(city=city, state=state, country=country)

    def _extract_summary_layoutlm(self, text: str, sections: Dict[str, str]) -> str:
        """Enhanced summary extraction for LayoutLM text"""
        summary_section = sections.get('summary', '')
        if summary_section:
            # Clean and return summary section
            lines = [line.strip() for line in summary_section.split('\n') if line.strip()]
            return ' '.join(lines)

        # Look for summary in first few paragraphs
        paragraphs = text.split('\n\n')[:3]
        for paragraph in paragraphs:
            paragraph = paragraph.strip()
            # Skip contact info and headers
            if (len(paragraph) > 50 and
                not self._is_contact_line(paragraph) and
                not paragraph.isupper() and
                '.' in paragraph):
                return paragraph

        return ""

    def _extract_skills_layoutlm(self, text: str, sections: Dict[str, str]) -> List[Skill]:
        """Enhanced skills extraction for LayoutLM text"""
        skills_section = sections.get('skills', '')
        text_to_search = skills_section if skills_section else text

        # Enhanced skill keywords
        skill_keywords = [
            # Programming Languages
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'TypeScript', 'Go', 'Rust', 'PHP', 'Ruby',
            'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash', 'PowerShell',

            # Web Technologies
            'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask',
            'Spring', 'Laravel', 'Rails', 'ASP.NET', 'jQuery', 'Bootstrap', 'Sass', 'Less',
            'Webpack', 'Babel', 'Redux', 'GraphQL', 'REST', 'API',

            # Databases
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
            'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch',

            # Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
            'CI/CD', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Nginx', 'Apache',

            # Data Science & ML
            'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
            'Jupyter', 'Spark', 'Hadoop', 'Kafka', 'Airflow',

            # Mobile Development
            'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin', 'Ionic',

            # Other Technologies
            'Linux', 'Windows', 'macOS', 'Agile', 'Scrum', 'JIRA', 'Confluence', 'Slack',
            'Figma', 'Adobe', 'Photoshop', 'Illustrator'
        ]

        found_skills = []
        text_upper = text_to_search.upper()

        for skill in skill_keywords:
            # Case-insensitive search with word boundaries
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_to_search, re.IGNORECASE):
                found_skills.append(Skill(skill=skill))

        # Look for additional skills in skills section
        if skills_section:
            lines = skills_section.split('\n')
            for line in lines:
                # Extract comma-separated skills
                if ',' in line:
                    potential_skills = [s.strip() for s in line.split(',')]
                    for skill in potential_skills:
                        if (len(skill) > 2 and len(skill) < 30 and
                            skill not in [s.skill for s in found_skills]):
                            found_skills.append(Skill(skill=skill))

        return found_skills

    def _extract_education_layoutlm(self, text: str, entities: List[Dict], sections: Dict[str, str]) -> List[Education]:
        """Enhanced education extraction for LayoutLM text"""
        education_section = sections.get('education', '')
        text_to_search = education_section if education_section else text

        education_list = []
        lines = text_to_search.split('\n')

        # Enhanced patterns for LayoutLM text
        degree_patterns = [
            r'(Bachelor|Master|PhD|Doctorate|Diploma|Certificate)[\s\w]*',
            r'(B\.?[AES]\.?|M\.?[AES]\.?|Ph\.?D\.?|M\.?Tech|B\.?Tech)[\s\w]*',
            r'(BSc|MSc|BA|MA|BCom|MCom|BBA|MBA|BE|ME|BTech|MTech)',
            r'(Engineering|Computer Science|Information Technology|Business|Management)'
        ]

        institution_patterns = [
            r'(University|College|Institute|School|Academy)',
            r'(IIT|NIT|IIIT|BITS|VIT|MIT|Stanford|Harvard|Rajiv Gandhi)',
        ]

        date_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',
            r'(May|June|July|August|September|October|November|December)\s+\d{4}',
            r'\d{4}'
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
                match = re.search(pattern, line, re.IGNORECASE)
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

    def _extract_work_experience_layoutlm(self, text: str, entities: List[Dict], sections: Dict[str, str]) -> List[WorkExperience]:
        """Enhanced work experience extraction for LayoutLM text"""
        experience_section = sections.get('experience', '')
        text_to_search = experience_section if experience_section else text

        work_list = []
        lines = text_to_search.split('\n')

        # Enhanced patterns for LayoutLM text
        company_patterns = [
            r'^[A-Z][A-Z\s&.,]+$',  # All caps like "PROPELLOR AI"
            r'^[A-Z][a-zA-Z\s&.,]+ (Inc|LLC|Corp|Ltd|Co|Company|Technologies|Tech|Solutions)\.?$',
            r'^[A-Z][a-zA-Z\s&.,]+ (Pvt\.? Ltd\.?|Private Limited)$',
            r'^[A-Z][A-Z]+[A-Z\s]*$',  # All caps variations
            r'^[A-Z][a-zA-Z]+\.[A-Z]+',  # Company names with dots
        ]

        title_keywords = [
            "engineer", "developer", "manager", "analyst", "specialist", "consultant",
            "director", "lead", "senior", "junior", "intern", "associate", "founder",
            "software engineer", "frontend", "backend", "full stack", "lecturer"
        ]

        date_patterns = [
            r'(August|September|October|November|December|January|February|March|April|May|June|July)\s+\d{4}\s*[-–]\s*(Present|Current|\d{4})',
            r'\d{4}\s*[-–]\s*(Present|Current)',
            r'\d{4}\s*[-–]\s*\d{4}',
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(Present|Current)',
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

            elif current_work and len(line) > 20 and not is_company and not is_title:
                # Add to description (bullet points, achievements, etc.)
                if current_work.description:
                    current_work.description += " " + line
                else:
                    current_work.description = line

        if current_work:
            work_list.append(current_work)

        return work_list

    def _get_fallback_data(self, text: str) -> ResumeData:
        """Fallback data extraction when enhanced methods fail"""
        try:
            from .transformer_llm import TransformerLLMProvider
            fallback_provider = TransformerLLMProvider()
            return fallback_provider.extract_resume_data(text)
        except Exception:
            return ResumeData()

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the enhanced LayoutLM transformer"""
        if not self.is_available():
            return {"status": "unavailable", "reason": "Models not initialized"}

        return {
            "status": "available",
            "provider": "Enhanced LayoutLM Transformer",
            "device": self.device,
            "features": [
                "LayoutLM-optimized text processing",
                "Enhanced document structure analysis",
                "Improved entity recognition",
                "Better section identification",
                "Advanced pattern matching"
            ]
        }

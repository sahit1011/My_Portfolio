#!/usr/bin/env python3
"""
Debug Education and Work Experience Extraction
Verify that education and work sections are being parsed correctly
"""

import os
import sys
import re
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f"🔍 {title}")
    print("="*80)

def debug_education_work_extraction():
    """Debug education and work experience extraction"""
    
    test_files = [
        "docs/resumes_for_testing/anil_ml_resme.pdf",
        "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
    ]
    
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        processor = ImprovedSmartPDFProcessor()
        
        for test_file in test_files:
            if Path(test_file).exists():
                print_header(f"DEBUGGING: {Path(test_file).name}")
                
                # Extract text
                extracted_text = processor.extract_text(test_file)
                
                print(f"📊 Total characters: {len(extracted_text)}")
                
                # Look for education keywords and sections
                print(f"\n🎓 EDUCATION ANALYSIS:")
                print("-" * 60)
                
                # Check for education keywords
                education_keywords = ['education', 'bachelor', 'master', 'degree', 'university', 'college', 'institute', 'b.tech', 'm.tech', 'intermediate', 'ssc']
                found_keywords = []
                for keyword in education_keywords:
                    if keyword.lower() in extracted_text.lower():
                        found_keywords.append(keyword)
                
                print(f"   Education keywords found: {found_keywords}")
                
                # Look for education section headers
                education_headers = ['EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS', 'EDUCATIONAL BACKGROUND']
                for header in education_headers:
                    if header in extracted_text.upper():
                        print(f"   ✅ Found education header: {header}")
                        
                        # Find the section content
                        pattern = rf'{header}[\s:]*\n(.*?)(?=\n(?:WORK|EXPERIENCE|PROFESSIONAL|SKILLS|PROJECTS|AWARDS)|\n[A-Z]{{3,}}|\Z)'
                        match = re.search(pattern, extracted_text, re.IGNORECASE | re.DOTALL)
                        if match:
                            section_content = match.group(1).strip()
                            print(f"   📝 Education section content ({len(section_content)} chars):")
                            print(f"      {section_content[:200]}...")
                        break
                else:
                    print(f"   ❌ No clear education section header found")
                
                # Look for specific education patterns
                education_patterns = [
                    r'(B\.?\s*Tech|M\.?\s*Tech|Bachelor|Master|PhD|Intermediate|SSC).*?(?:in\s+)?([^,\n]*?)(?:\s*\|\s*|\s*,\s*)?\s*(\d{4})\s*[–-]\s*(\d{4})',
                    r'([^,\n]*(?:University|College|Institute|Technology|School)[^,\n]*?)(?:\s*\|\s*|\s*,\s*)?\s*(\d{4})\s*[–-]\s*(\d{4})',
                    r'(B\.?\s*Tech|M\.?\s*Tech|Bachelor|Master|Intermediate|SSC).*?([^,\n]*(?:Engineering|Science|Arts|Commerce)[^,\n]*)',
                ]
                
                print(f"\n   🔍 Education pattern matches:")
                for i, pattern in enumerate(education_patterns, 1):
                    matches = re.finditer(pattern, extracted_text, re.IGNORECASE)
                    for match in matches:
                        print(f"      Pattern {i}: {match.group(0)}")
                
                # Look for work experience
                print(f"\n💼 WORK EXPERIENCE ANALYSIS:")
                print("-" * 60)
                
                # Check for work keywords
                work_keywords = ['work experience', 'professional experience', 'employment', 'career', 'company', 'intern', 'engineer', 'developer']
                found_work_keywords = []
                for keyword in work_keywords:
                    if keyword.lower() in extracted_text.lower():
                        found_work_keywords.append(keyword)
                
                print(f"   Work keywords found: {found_work_keywords}")
                
                # Look for work section headers
                work_headers = ['WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT', 'CAREER', 'Experience']
                for header in work_headers:
                    if header in extracted_text:
                        print(f"   ✅ Found work header: {header}")
                        
                        # Find the section content
                        pattern = rf'{header}[\s:]*\n(.*?)(?=\n(?:EDUCATION|SKILLS|PROJECTS|AWARDS)|\n[A-Z]{{3,}}|\Z)'
                        match = re.search(pattern, extracted_text, re.IGNORECASE | re.DOTALL)
                        if match:
                            section_content = match.group(1).strip()
                            print(f"   📝 Work section content ({len(section_content)} chars):")
                            print(f"      {section_content[:200]}...")
                        break
                else:
                    print(f"   ❌ No clear work section header found")
                
                # Look for specific work patterns
                work_patterns = [
                    r'([^,\n|]+(?:Pvt|Ltd|Inc|Corp|Company|Solutions|Technologies)[^,\n|]*)\s*(?:\||,|\n)\s*([^,\n|]+)\s*(?:\||,|\n)?\s*([A-Za-z]+\s+\d{4})\s*[–-]\s*([A-Za-z]+\s+\d{4}|Present|Current)',
                    r'([^,\n|]+(?:Engineer|Developer|Analyst|Manager|Intern)[^,\n|]*)\s+(?:at|@)\s+([^,\n|]+)',
                    r'([^,\n|]+(?:Pvt|Ltd|Inc|Corp|Company|Solutions|Technologies)[^,\n|]*)\s*\|\s*([^,\n|]+)',
                ]
                
                print(f"\n   🔍 Work pattern matches:")
                for i, pattern in enumerate(work_patterns, 1):
                    matches = re.finditer(pattern, extracted_text, re.IGNORECASE)
                    for match in matches:
                        print(f"      Pattern {i}: {match.group(0)}")
                
                # Show the full text in sections for manual inspection
                print(f"\n📝 FULL TEXT ANALYSIS:")
                print("-" * 60)
                
                # Split into logical sections
                lines = [line.strip() for line in extracted_text.split('\n') if line.strip()]
                
                # Look for section boundaries
                sections = {}
                current_section = "HEADER"
                current_content = []
                
                section_keywords = {
                    'EDUCATION': ['education', 'academic', 'qualification'],
                    'EXPERIENCE': ['work experience', 'professional experience', 'experience', 'employment'],
                    'SKILLS': ['skills', 'technical skills'],
                    'PROJECTS': ['projects'],
                    'AWARDS': ['awards', 'achievements']
                }
                
                for line in lines:
                    line_lower = line.lower()
                    
                    # Check if this line starts a new section
                    section_found = False
                    for section_name, keywords in section_keywords.items():
                        if any(keyword in line_lower for keyword in keywords):
                            # Save previous section
                            if current_content:
                                sections[current_section] = ' '.join(current_content)
                            
                            # Start new section
                            current_section = section_name
                            current_content = [line]
                            section_found = True
                            break
                    
                    if not section_found:
                        current_content.append(line)
                
                # Save last section
                if current_content:
                    sections[current_section] = ' '.join(current_content)
                
                # Display sections
                for section_name, content in sections.items():
                    print(f"\n   📋 {section_name} SECTION ({len(content)} chars):")
                    preview = content[:300] + "..." if len(content) > 300 else content
                    print(f"      {preview}")
                
                print("\n" + "="*80)
    
    except Exception as e:
        print(f"❌ Error: {e}")

def test_transformer_education_work():
    """Test transformer models specifically for education and work extraction"""
    print_header("Testing Transformer Education & Work Extraction")
    
    test_files = [
        "docs/resumes_for_testing/anil_ml_resme.pdf",
        "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
    ]
    
    try:
        from src.resume_parser import ResumeParser
        parser = ResumeParser()
        
        providers = ['smart_transformer', 'layoutlm_transformer']
        
        for provider in providers:
            print(f"\n🤖 Testing {provider.upper()}")
            print("-" * 60)
            
            for test_file in test_files:
                if not Path(test_file).exists():
                    continue
                    
                print(f"\n📄 File: {Path(test_file).name}")
                
                try:
                    result = parser.parse_resume(test_file, provider)
                    result_dict = result.to_dict()
                    
                    # Education analysis
                    education = result_dict.get('education_history', [])
                    print(f"   🎓 Education: {len(education)} entries")
                    for i, edu in enumerate(education, 1):
                        institution = edu.get('institution', '')
                        degree = edu.get('degree', '')
                        year = edu.get('graduation_year', '')
                        print(f"      {i}. {degree} at {institution} ({year})")
                    
                    # Work analysis
                    work = result_dict.get('work_history', [])
                    print(f"   💼 Work: {len(work)} entries")
                    for i, job in enumerate(work, 1):
                        position = job.get('position', '')
                        company = job.get('company', '')
                        start_date = job.get('start_date', '')
                        end_date = job.get('end_date', '')
                        print(f"      {i}. {position} at {company} ({start_date} - {end_date})")
                    
                    # Skills analysis
                    skills = result_dict.get('skills', [])
                    print(f"   🎯 Skills: {len(skills)} found")
                    if skills:
                        skill_names = [skill.get('name', '') for skill in skills[:5]]
                        print(f"      Top 5: {', '.join(skill_names)}")
                
                except Exception as e:
                    print(f"   ❌ Error: {e}")
    
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main debug function"""
    print("🧪 Debugging Education and Work Experience Extraction")
    print("=" * 80)
    print("🎯 Focus: Verify education and work sections are parsed correctly")
    
    # Debug PDF extraction for education/work content
    debug_education_work_extraction()
    
    # Test transformer models
    test_transformer_education_work()
    
    print_header("Debug Summary")
    print("🔍 Check the analysis above to see:")
    print("   • Whether education/work sections are found in extracted text")
    print("   • Whether patterns match the actual content")
    print("   • Whether transformers extract the right information")
    print("\n💡 If sections are missing, we need to fix the section detection logic")

if __name__ == "__main__":
    main()

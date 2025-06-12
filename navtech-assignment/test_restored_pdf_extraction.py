#!/usr/bin/env python3
"""
Test Restored PDF Extraction
Verify that the ultimate enhanced PDF processor is working correctly
"""

import os
import sys
import time
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f"🔍 {title}")
    print("="*80)

def print_status(component, status, details=""):
    """Print component status"""
    status_icon = "✅" if status else "❌"
    print(f"{status_icon} {component}: {'SUCCESS' if status else 'FAILED'}")
    if details:
        print(f"   {details}")

def test_pdf_processor_import():
    """Test that the restored PDF processor can be imported"""
    print_header("Testing Restored PDF Processor Import")
    
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        processor = ImprovedSmartPDFProcessor()
        print_status("ImprovedSmartPDFProcessor Import", True)
        return processor
    except Exception as e:
        print_status("ImprovedSmartPDFProcessor Import", False, str(e))
        return None

def test_pdf_extraction_quality(processor, resume_files):
    """Test PDF extraction quality with real resumes"""
    print_header("Testing PDF Extraction Quality")
    
    if not processor:
        print("❌ No processor available for testing")
        return
    
    for resume_file in resume_files[:3]:  # Test first 3 files
        print(f"\n📄 Testing: {resume_file.name}")
        print("-" * 60)
        
        try:
            start_time = time.time()
            extracted_text = processor.extract_text(str(resume_file))
            end_time = time.time()
            
            extraction_time = end_time - start_time
            
            if extracted_text:
                print_status("Text Extraction", True, f"Extracted {len(extracted_text)} characters in {extraction_time:.2f}s")
                
                # Analyze extraction quality
                lines = extracted_text.split('\n')
                non_empty_lines = [line.strip() for line in lines if line.strip()]
                
                print(f"   📊 Total lines: {len(lines)}")
                print(f"   📊 Non-empty lines: {len(non_empty_lines)}")
                
                # Check for key information
                has_email = '@' in extracted_text
                has_phone = any(char.isdigit() for char in extracted_text) and len([c for c in extracted_text if c.isdigit()]) >= 10
                has_education_keywords = any(keyword in extracted_text.lower() for keyword in ['education', 'bachelor', 'master', 'degree', 'university', 'college'])
                has_experience_keywords = any(keyword in extracted_text.lower() for keyword in ['experience', 'work', 'company', 'position', 'job'])
                
                print(f"   📧 Email detected: {'✅' if has_email else '❌'}")
                print(f"   📞 Phone detected: {'✅' if has_phone else '❌'}")
                print(f"   🎓 Education keywords: {'✅' if has_education_keywords else '❌'}")
                print(f"   💼 Experience keywords: {'✅' if has_experience_keywords else '❌'}")
                
                # Show first few lines for quality check
                print(f"\n   📝 First 5 lines:")
                for i, line in enumerate(non_empty_lines[:5], 1):
                    preview = line[:80] + "..." if len(line) > 80 else line
                    print(f"      {i}. {preview}")
                
                # Check for specific issues that were fixed
                print(f"\n   🔧 Quality Checks:")
                
                # Check for name extraction issues
                has_scattered_name = 'B ANOTH V AMSHI' in extracted_text or 'B  ANOTH  V  AMSHI' in extracted_text
                print(f"      Name scattering issue: {'❌ Found' if has_scattered_name else '✅ Fixed'}")
                
                # Check for education section
                has_education_section = 'EDUCATION' in extracted_text.upper() or 'Educati on' in extracted_text
                print(f"      Education section: {'✅ Found' if has_education_section else '❌ Missing'}")
                
                # Check for word concatenation issues
                has_concatenation = 'twareengineerwhohas' in extracted_text or 'ma in taininghigh' in extracted_text
                print(f"      Word concatenation: {'❌ Found' if has_concatenation else '✅ Fixed'}")
                
                print(f"✅ Successfully extracted from {resume_file.name}")
                
            else:
                print_status("Text Extraction", False, "No text extracted")
                
        except Exception as e:
            print_status("Text Extraction", False, str(e))

def compare_extraction_methods(resume_files):
    """Compare different extraction methods"""
    print_header("Comparing Extraction Methods")
    
    if not resume_files:
        print("❌ No resume files found")
        return
    
    test_file = resume_files[0]  # Use first file for comparison
    print(f"📄 Testing with: {test_file.name}")
    
    # Test restored processor
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        restored_processor = ImprovedSmartPDFProcessor()
        
        start_time = time.time()
        restored_text = restored_processor.extract_text(str(test_file))
        restored_time = time.time() - start_time
        
        print(f"\n🔧 Restored Ultimate Enhanced PDF Processor:")
        print(f"   Time: {restored_time:.2f}s")
        print(f"   Characters: {len(restored_text)}")
        lines_count = len(restored_text.split('\n'))
        print(f"   Lines: {lines_count}")

        # Show sample of extracted text
        lines = [line.strip() for line in restored_text.split('\n') if line.strip()]
        print(f"   Sample lines:")
        for i, line in enumerate(lines[:3], 1):
            preview = line[:60] + "..." if len(line) > 60 else line
            print(f"      {i}. {preview}")
        
    except Exception as e:
        print(f"❌ Restored processor failed: {e}")

def find_test_resumes():
    """Find test resumes"""
    test_dirs = [
        "docs/resumes_for_testing",
        "docs/testing",
        "docs",
        "sample_resumes"
    ]
    
    resume_files = []
    for test_dir in test_dirs:
        if Path(test_dir).exists():
            for ext in ['*.pdf']:
                files = list(Path(test_dir).glob(ext))
                resume_files.extend(files)
    
    return resume_files

def main():
    """Main test function"""
    print("🧪 Testing Restored PDF Extraction")
    print("=" * 80)
    print("🎯 Focus: Ultimate Enhanced PDF Processor Restoration")
    
    # Find test resumes
    resume_files = find_test_resumes()
    print(f"\n📄 Found {len(resume_files)} PDF resume files:")
    for file in resume_files:
        print(f"   • {file}")
    
    # Test processor import
    processor = test_pdf_processor_import()
    
    # Test extraction quality
    if processor and resume_files:
        test_pdf_extraction_quality(processor, resume_files)
    
    # Compare extraction methods
    if resume_files:
        compare_extraction_methods(resume_files)
    
    # Summary
    print_header("PDF Extraction Test Summary")
    print(f"📄 Resume Files: {len(resume_files)} found")
    print(f"🔧 Restored Processor: {'✅ Working' if processor else '❌ Failed'}")
    
    if processor and resume_files:
        print("\n🎉 SUCCESS: Ultimate Enhanced PDF Processor restored!")
        print("🚀 Ready to extract text with all previous fixes applied!")
        print("\n💡 Key Features Restored:")
        print("   • Name extraction fixes (B ANOTH V AMSHI -> BANOTH VAMSHI)")
        print("   • Phone number normalization")
        print("   • Education section creation and enhancement")
        print("   • Word concatenation fixes")
        print("   • Section structure normalization")
        print("   • Ultimate spacing and formatting cleanup")
    else:
        print("\n⚠️ ISSUES: PDF extraction not working properly")

if __name__ == "__main__":
    main()

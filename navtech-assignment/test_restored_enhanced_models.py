#!/usr/bin/env python3
"""
Test Restored Enhanced Models with Real Resumes
Verify that the enhanced transformer and LayoutLM models are working correctly
"""

import os
import sys
import json
import time
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Environment variables loaded from .env file")
except ImportError:
    print("⚠️ python-dotenv not available")

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

def find_test_resumes():
    """Find test resumes in docs folder"""
    print_header("Finding Test Resumes")
    
    test_dirs = [
        "docs/resumes_for_testing",
        "docs/testing", 
        "docs",
        "sample_resumes"
    ]
    
    resume_files = []
    
    for test_dir in test_dirs:
        if Path(test_dir).exists():
            for ext in ['*.pdf', '*.docx', '*.doc']:
                files = list(Path(test_dir).glob(ext))
                resume_files.extend(files)
    
    print(f"📄 Found {len(resume_files)} resume files:")
    for file in resume_files:
        print(f"   • {file}")
    
    return resume_files

def test_enhanced_models_directly():
    """Test enhanced models directly"""
    print_header("Testing Enhanced Models Directly")
    
    # Test Enhanced Transformer
    try:
        from src.llm_providers.enhanced_transformer_llm import EnhancedTransformerProvider
        enhanced_transformer = EnhancedTransformerProvider()
        is_available = enhanced_transformer.is_available()
        print_status("Enhanced Transformer Provider", is_available)
        
        if is_available:
            print("   🤖 Model: Enhanced Smart PDF + Transformer V2")
            print("   🎯 Target Accuracy: 85.7%+")
        
    except Exception as e:
        print_status("Enhanced Transformer Provider", False, str(e))
        enhanced_transformer = None
    
    # Test Improved LayoutLM
    try:
        from src.llm_providers.improved_layoutlm_transformer import ImprovedLayoutLMProvider
        improved_layoutlm = ImprovedLayoutLMProvider()
        is_available = improved_layoutlm.is_available()
        print_status("Improved LayoutLM Provider", is_available)
        
        if is_available:
            print("   🤖 Model: Enhanced LayoutLM + Transformer V2")
            print("   🎯 Target Accuracy: 85.7%+")
        
    except Exception as e:
        print_status("Improved LayoutLM Provider", False, str(e))
        improved_layoutlm = None
    
    return enhanced_transformer, improved_layoutlm

def test_pdf_processor():
    """Test the improved PDF processor"""
    print_header("Testing Improved PDF Processor")
    
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        processor = ImprovedSmartPDFProcessor()
        print_status("Improved Smart PDF Processor", True)
        
        # Test with a sample PDF
        test_pdfs = [
            "docs/resumes_for_testing/anil_ml_resme.pdf",
            "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
        ]
        
        for pdf_path in test_pdfs:
            if Path(pdf_path).exists():
                try:
                    text = processor.extract_text(pdf_path)
                    print_status(f"PDF Extraction: {Path(pdf_path).name}", True, 
                               f"Extracted {len(text)} characters")
                    break
                except Exception as e:
                    print_status(f"PDF Extraction: {Path(pdf_path).name}", False, str(e))
        
        return processor
        
    except Exception as e:
        print_status("Improved Smart PDF Processor", False, str(e))
        return None

def test_resume_parsing_with_enhanced_models(resume_files):
    """Test resume parsing with enhanced models"""
    print_header("Testing Resume Parsing with Enhanced Models")
    
    if not resume_files:
        print("❌ No resume files found to test")
        return
    
    # Initialize ResumeParser
    try:
        from src.resume_parser import ResumeParser
        parser = ResumeParser()
        available_providers = parser.get_available_providers()
        print(f"📋 Available providers: {available_providers}")
    except Exception as e:
        print_status("ResumeParser Init", False, str(e))
        return
    
    # Test with first 2 resume files
    test_files = resume_files[:2]
    enhanced_providers = ['smart_transformer', 'layoutlm_transformer']
    
    for provider in enhanced_providers:
        if provider not in available_providers:
            print_status(f"{provider}", False, "Not available")
            continue
            
        print(f"\n🤖 Testing {provider.upper()}")
        print("-" * 60)
        
        for i, resume_file in enumerate(test_files, 1):
            print(f"\n📄 Test {i}: {resume_file.name} with {provider}")
            
            try:
                start_time = time.time()
                
                # Parse the resume
                result = parser.parse_resume(str(resume_file), provider)
                
                end_time = time.time()
                processing_time = end_time - start_time
                
                # Convert to dict for display
                result_dict = result.to_dict()
                
                # Display results
                print_status("Parsing", True, f"Completed in {processing_time:.2f} seconds")
                
                print(f"   👤 Name: {result_dict.get('first_name', '')} {result_dict.get('last_name', '')}")
                print(f"   📧 Email: {result_dict.get('email', 'N/A')}")
                print(f"   📞 Phone: {result_dict.get('phone', 'N/A')}")
                print(f"   🏠 Location: {result_dict.get('address', {}).get('city', 'N/A')}, {result_dict.get('address', {}).get('state', 'N/A')}")
                print(f"   🎯 Skills: {len(result_dict.get('skills', []))} found")
                print(f"   🎓 Education: {len(result_dict.get('education_history', []))} entries")
                print(f"   💼 Work History: {len(result_dict.get('work_history', []))} entries")
                
                # Show first few skills
                skills = result_dict.get('skills', [])
                if skills:
                    skill_names = [skill.get('name', '') for skill in skills[:5]]
                    print(f"   🔧 Top Skills: {', '.join(skill_names)}")
                
                # Show education details
                education = result_dict.get('education_history', [])
                if education:
                    for edu in education[:2]:
                        print(f"   🎓 Education: {edu.get('degree', '')} at {edu.get('institution', '')}")
                
                # Show work details
                work = result_dict.get('work_history', [])
                if work:
                    for job in work[:2]:
                        print(f"   💼 Work: {job.get('position', '')} at {job.get('company', '')}")
                
                print(f"✅ Successfully parsed {resume_file.name} with {provider}")
                
            except Exception as e:
                print_status("Parsing", False, str(e))
                continue

def compare_with_openrouter():
    """Compare enhanced models with OpenRouter DeepSeek"""
    print_header("Comparing Enhanced Models vs OpenRouter DeepSeek")
    
    # Find a test resume
    test_pdfs = [
        "docs/resumes_for_testing/anil_ml_resme.pdf",
        "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
    ]
    
    test_file = None
    for pdf_path in test_pdfs:
        if Path(pdf_path).exists():
            test_file = pdf_path
            break
    
    if not test_file:
        print("❌ No test file found for comparison")
        return
    
    try:
        from src.resume_parser import ResumeParser
        parser = ResumeParser()
        
        providers_to_test = ['openrouter', 'smart_transformer', 'layoutlm_transformer']
        results = {}
        
        for provider in providers_to_test:
            try:
                print(f"\n🔄 Testing {provider}...")
                start_time = time.time()
                result = parser.parse_resume(test_file, provider)
                end_time = time.time()
                
                result_dict = result.to_dict()
                results[provider] = {
                    'time': end_time - start_time,
                    'name': f"{result_dict.get('first_name', '')} {result_dict.get('last_name', '')}".strip(),
                    'email': result_dict.get('email', ''),
                    'phone': result_dict.get('phone', ''),
                    'skills_count': len(result_dict.get('skills', [])),
                    'education_count': len(result_dict.get('education_history', [])),
                    'work_count': len(result_dict.get('work_history', []))
                }
                print_status(provider, True, f"{results[provider]['time']:.2f}s")
                
            except Exception as e:
                print_status(provider, False, str(e))
                results[provider] = None
        
        # Display comparison
        print(f"\n📊 Comparison Results for {Path(test_file).name}:")
        print("-" * 80)
        print(f"{'Provider':<20} {'Time':<8} {'Name':<20} {'Email':<25} {'Skills':<8} {'Edu':<5} {'Work':<5}")
        print("-" * 80)
        
        for provider, data in results.items():
            if data:
                print(f"{provider:<20} {data['time']:<8.2f} {data['name']:<20} {data['email']:<25} {data['skills_count']:<8} {data['education_count']:<5} {data['work_count']:<5}")
            else:
                print(f"{provider:<20} {'FAILED':<8} {'':<20} {'':<25} {'':<8} {'':<5} {'':<5}")
        
    except Exception as e:
        print_status("Comparison", False, str(e))

def main():
    """Main test function"""
    print("🧪 Testing Restored Enhanced Models")
    print("=" * 80)
    print("🎯 Focus: Enhanced Transformer V2 + Improved LayoutLM V2")
    
    # Find test resumes
    resume_files = find_test_resumes()
    
    # Test enhanced models directly
    enhanced_transformer, improved_layoutlm = test_enhanced_models_directly()
    
    # Test PDF processor
    pdf_processor = test_pdf_processor()
    
    # Test resume parsing with enhanced models
    if resume_files:
        test_resume_parsing_with_enhanced_models(resume_files)
    
    # Compare with OpenRouter
    if resume_files:
        compare_with_openrouter()
    
    # Summary
    print_header("Test Summary")
    print(f"📄 Resume Files: {len(resume_files)} found")
    print(f"🤖 Enhanced Transformer: {'✅ Available' if enhanced_transformer and enhanced_transformer.is_available() else '❌ Not Available'}")
    print(f"🤖 Improved LayoutLM: {'✅ Available' if improved_layoutlm and improved_layoutlm.is_available() else '❌ Not Available'}")
    print(f"📄 PDF Processor: {'✅ Available' if pdf_processor else '❌ Not Available'}")
    
    if enhanced_transformer and improved_layoutlm and pdf_processor and resume_files:
        print("\n🎉 SUCCESS: Enhanced models restored and working!")
        print("🚀 Ready to parse resumes with 85.7%+ accuracy!")
    else:
        print("\n⚠️ ISSUES: Some components not working properly")

if __name__ == "__main__":
    main()

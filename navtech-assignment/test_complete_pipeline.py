#!/usr/bin/env python3
"""
Test Complete Pipeline with Restored PDF Extraction
Test the full resume parsing pipeline with the restored ultimate PDF processor
"""

import os
import sys
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

def test_complete_pipeline():
    """Test the complete resume parsing pipeline"""
    print_header("Testing Complete Pipeline with Restored PDF Extraction")
    
    # Find test resumes
    test_files = [
        "docs/resumes_for_testing/anil_ml_resme.pdf",
        "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
    ]
    
    available_files = [f for f in test_files if Path(f).exists()]
    
    if not available_files:
        print("❌ No test files found")
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
    
    # Test with enhanced models
    enhanced_providers = ['smart_transformer', 'layoutlm_transformer']
    
    for provider in enhanced_providers:
        if provider not in available_providers:
            print_status(f"{provider}", False, "Not available")
            continue
            
        print(f"\n🤖 Testing {provider.upper()} with Restored PDF Extraction")
        print("=" * 80)
        
        for test_file in available_files:
            print(f"\n📄 Testing: {Path(test_file).name}")
            print("-" * 60)
            
            try:
                start_time = time.time()
                
                # Parse the resume
                result = parser.parse_resume(test_file, provider)
                
                end_time = time.time()
                processing_time = end_time - start_time
                
                # Convert to dict for analysis
                result_dict = result.to_dict()
                
                # Display results
                print_status("Parsing", True, f"Completed in {processing_time:.2f} seconds")
                
                # Detailed analysis
                print(f"\n📋 Extracted Information:")
                print(f"   👤 First Name: '{result_dict.get('first_name', '')}' {'✅' if result_dict.get('first_name') else '❌'}")
                print(f"   👤 Last Name: '{result_dict.get('last_name', '')}' {'✅' if result_dict.get('last_name') else '❌'}")
                print(f"   📧 Email: '{result_dict.get('email', '')}' {'✅' if result_dict.get('email') else '❌'}")
                print(f"   📞 Phone: '{result_dict.get('phone', '')}' {'✅' if result_dict.get('phone') else '❌'}")
                
                # Address details
                address = result_dict.get('address', {})
                print(f"   🏠 City: '{address.get('city', '')}' {'✅' if address.get('city') else '❌'}")
                print(f"   🏠 State: '{address.get('state', '')}' {'✅' if address.get('state') else '❌'}")
                
                # Skills analysis
                skills = result_dict.get('skills', [])
                print(f"   🎯 Skills: {len(skills)} found {'✅' if len(skills) > 0 else '❌'}")
                if skills:
                    skill_names = [skill.get('name', '') for skill in skills[:5]]
                    print(f"      Top 5: {', '.join(skill_names)}")
                
                # Education analysis
                education = result_dict.get('education_history', [])
                print(f"   🎓 Education: {len(education)} entries {'✅' if len(education) > 0 else '❌'}")
                if education:
                    for i, edu in enumerate(education[:2], 1):
                        degree = edu.get('degree', '')
                        institution = edu.get('institution', '')
                        year = edu.get('graduation_year', '')
                        print(f"      {i}. {degree} at {institution} ({year})")
                
                # Work experience analysis
                work = result_dict.get('work_history', [])
                print(f"   💼 Work History: {len(work)} entries {'✅' if len(work) > 0 else '❌'}")
                if work:
                    for i, job in enumerate(work[:2], 1):
                        position = job.get('position', '')
                        company = job.get('company', '')
                        print(f"      {i}. {position} at {company}")
                
                # Summary
                summary = result_dict.get('summary', '')
                print(f"   📝 Summary: {'✅' if summary else '❌'} ({len(summary)} chars)")
                if summary:
                    summary_preview = summary[:100] + "..." if len(summary) > 100 else summary
                    print(f"      Preview: {summary_preview}")
                
                # Overall quality assessment
                quality_score = 0
                quality_checks = [
                    ("Name", bool(result_dict.get('first_name') or result_dict.get('last_name'))),
                    ("Email", bool(result_dict.get('email'))),
                    ("Phone", bool(result_dict.get('phone'))),
                    ("Skills", len(skills) > 0),
                    ("Education", len(education) > 0),
                    ("Work", len(work) > 0)
                ]
                
                for check_name, passed in quality_checks:
                    if passed:
                        quality_score += 1
                
                quality_percentage = (quality_score / len(quality_checks)) * 100
                
                print(f"\n📊 Quality Assessment: {quality_score}/{len(quality_checks)} ({quality_percentage:.1f}%)")
                
                if quality_percentage >= 80:
                    print("🎉 EXCELLENT: High quality extraction!")
                elif quality_percentage >= 60:
                    print("✅ GOOD: Acceptable quality extraction")
                else:
                    print("⚠️ NEEDS IMPROVEMENT: Low quality extraction")
                
                print(f"✅ Successfully parsed {Path(test_file).name} with {provider}")
                
            except Exception as e:
                print_status("Parsing", False, str(e))
                continue

def compare_with_openrouter():
    """Compare enhanced models with OpenRouter for accuracy"""
    print_header("Comparing Enhanced Models vs OpenRouter (Reference)")
    
    test_file = "docs/resumes_for_testing/anil_ml_resme.pdf"
    
    if not Path(test_file).exists():
        print("❌ Test file not found")
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
                    'first_name': result_dict.get('first_name', ''),
                    'last_name': result_dict.get('last_name', ''),
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
        
        # Display comparison table
        print(f"\n📊 Detailed Comparison Results:")
        print("=" * 100)
        print(f"{'Provider':<20} {'Time':<8} {'First Name':<15} {'Last Name':<15} {'Email':<25} {'Skills':<8} {'Edu':<5} {'Work':<5}")
        print("=" * 100)
        
        for provider, data in results.items():
            if data:
                print(f"{provider:<20} {data['time']:<8.2f} {data['first_name']:<15} {data['last_name']:<15} {data['email']:<25} {data['skills_count']:<8} {data['education_count']:<5} {data['work_count']:<5}")
            else:
                print(f"{provider:<20} {'FAILED':<8} {'':<15} {'':<15} {'':<25} {'':<8} {'':<5} {'':<5}")
        
        # Analysis
        print(f"\n🔍 Analysis:")
        if results.get('openrouter') and results.get('smart_transformer'):
            openrouter_data = results['openrouter']
            smart_data = results['smart_transformer']
            
            print(f"   📊 Speed Improvement: {openrouter_data['time'] / smart_data['time']:.1f}x faster with enhanced models")
            
            # Check if names match
            or_name = f"{openrouter_data['first_name']} {openrouter_data['last_name']}".strip()
            st_name = f"{smart_data['first_name']} {smart_data['last_name']}".strip()
            
            if or_name == st_name:
                print(f"   ✅ Name extraction: Perfect match!")
            else:
                print(f"   ⚠️ Name extraction: OpenRouter='{or_name}' vs Enhanced='{st_name}'")
        
    except Exception as e:
        print_status("Comparison", False, str(e))

def main():
    """Main test function"""
    print("🧪 Testing Complete Pipeline with Restored PDF Extraction")
    print("=" * 80)
    print("🎯 Focus: Ultimate PDF Processor + Enhanced Models")
    
    # Test complete pipeline
    test_complete_pipeline()
    
    # Compare with OpenRouter
    compare_with_openrouter()
    
    # Summary
    print_header("Complete Pipeline Test Summary")
    print("🎉 Testing completed!")
    print("\n💡 If you see correct name extraction and all fields populated,")
    print("   your setup has been successfully restored to its previous working state!")

if __name__ == "__main__":
    main()

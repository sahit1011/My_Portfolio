#!/usr/bin/env python3
"""
Test Corrected Transformer Models
Verify that the corrected transformer models extract the right values
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

def test_corrected_transformers():
    """Test the corrected transformer models"""
    print_header("Testing Corrected Transformer Models")
    
    # Test files with expected results
    test_cases = [
        {
            "file": "docs/resumes_for_testing/anil_ml_resme.pdf",
            "expected": {
                "first_name": "Anil Sahith",
                "last_name": "Vallepu", 
                "email": "anilsahithvallepu@gmail.com",
                "phone": "+91 814340 0946"
            }
        },
        {
            "file": "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf",
            "expected": {
                "first_name": "BANOTH",
                "last_name": "VAMSHI",
                "email": "banoth_871934@student.nitw.ac.in", 
                "phone": "939822 2755"
            }
        }
    ]
    
    # Initialize ResumeParser
    try:
        from src.resume_parser import ResumeParser
        parser = ResumeParser()
        available_providers = parser.get_available_providers()
        print(f"📋 Available providers: {available_providers}")
    except Exception as e:
        print_status("ResumeParser Init", False, str(e))
        return
    
    # Test enhanced models
    enhanced_providers = ['smart_transformer', 'layoutlm_transformer']
    
    for provider in enhanced_providers:
        if provider not in available_providers:
            print_status(f"{provider}", False, "Not available")
            continue
            
        print(f"\n🤖 Testing {provider.upper()} with Corrected Extraction")
        print("=" * 80)
        
        for test_case in test_cases:
            test_file = test_case["file"]
            expected = test_case["expected"]
            
            if not Path(test_file).exists():
                print(f"❌ Test file not found: {test_file}")
                continue
                
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
                
                # Display results vs expected
                print_status("Parsing", True, f"Completed in {processing_time:.2f} seconds")
                
                print(f"\n📋 Extraction Results vs Expected:")
                print("-" * 60)
                
                # Check first name
                extracted_first = result_dict.get('first_name', '')
                expected_first = expected['first_name']
                first_match = extracted_first == expected_first
                print(f"   👤 First Name:")
                print(f"      Expected: '{expected_first}'")
                print(f"      Extracted: '{extracted_first}' {'✅' if first_match else '❌'}")
                
                # Check last name
                extracted_last = result_dict.get('last_name', '')
                expected_last = expected['last_name']
                last_match = extracted_last == expected_last
                print(f"   👤 Last Name:")
                print(f"      Expected: '{expected_last}'")
                print(f"      Extracted: '{extracted_last}' {'✅' if last_match else '❌'}")
                
                # Check email
                extracted_email = result_dict.get('email', '')
                expected_email = expected['email']
                email_match = extracted_email == expected_email
                print(f"   📧 Email:")
                print(f"      Expected: '{expected_email}'")
                print(f"      Extracted: '{extracted_email}' {'✅' if email_match else '❌'}")
                
                # Check phone
                extracted_phone = result_dict.get('phone', '')
                expected_phone = expected['phone']
                phone_match = extracted_phone == expected_phone
                print(f"   📞 Phone:")
                print(f"      Expected: '{expected_phone}'")
                print(f"      Extracted: '{extracted_phone}' {'✅' if phone_match else '❌'}")
                
                # Overall accuracy
                matches = [first_match, last_match, email_match, phone_match]
                accuracy = sum(matches) / len(matches) * 100
                
                print(f"\n📊 Accuracy: {accuracy:.1f}% ({sum(matches)}/{len(matches)} fields correct)")
                
                if accuracy == 100:
                    print("🎉 PERFECT: All fields extracted correctly!")
                elif accuracy >= 75:
                    print("✅ GOOD: Most fields extracted correctly")
                else:
                    print("⚠️ NEEDS IMPROVEMENT: Many fields incorrect")
                
                # Additional info
                skills = result_dict.get('skills', [])
                education = result_dict.get('education_history', [])
                work = result_dict.get('work_history', [])
                
                print(f"\n📋 Additional Information:")
                print(f"   🎯 Skills: {len(skills)} found")
                print(f"   🎓 Education: {len(education)} entries")
                print(f"   💼 Work History: {len(work)} entries")
                
                print(f"✅ Completed testing {Path(test_file).name} with {provider}")
                
            except Exception as e:
                print_status("Parsing", False, str(e))
                continue

def compare_with_openrouter():
    """Compare corrected models with OpenRouter for reference"""
    print_header("Comparing Corrected Models vs OpenRouter (Reference)")
    
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
        print(f"{'Provider':<20} {'Time':<8} {'First Name':<15} {'Last Name':<15} {'Email':<25} {'Phone':<15}")
        print("=" * 100)
        
        for provider, data in results.items():
            if data:
                print(f"{provider:<20} {data['time']:<8.2f} {data['first_name']:<15} {data['last_name']:<15} {data['email']:<25} {data['phone']:<15}")
            else:
                print(f"{provider:<20} {'FAILED':<8} {'':<15} {'':<15} {'':<25} {'':<15}")
        
        # Analysis
        print(f"\n🔍 Analysis:")
        if results.get('openrouter') and results.get('smart_transformer'):
            openrouter_data = results['openrouter']
            smart_data = results['smart_transformer']
            
            print(f"   📊 Speed: Enhanced models {openrouter_data['time'] / smart_data['time']:.1f}x faster")
            
            # Check accuracy
            or_name = f"{openrouter_data['first_name']} {openrouter_data['last_name']}".strip()
            st_name = f"{smart_data['first_name']} {smart_data['last_name']}".strip()
            
            if or_name == st_name:
                print(f"   ✅ Name extraction: Perfect match!")
            else:
                print(f"   📝 Name extraction: OpenRouter='{or_name}' vs Enhanced='{st_name}'")
                
            if openrouter_data['email'] == smart_data['email']:
                print(f"   ✅ Email extraction: Perfect match!")
            else:
                print(f"   📝 Email extraction: OpenRouter='{openrouter_data['email']}' vs Enhanced='{smart_data['email']}'")
        
    except Exception as e:
        print_status("Comparison", False, str(e))

def main():
    """Main test function"""
    print("🧪 Testing Corrected Transformer Models")
    print("=" * 80)
    print("🎯 Focus: Correct Name, Phone, Email Extraction")
    
    # Test corrected transformers
    test_corrected_transformers()
    
    # Compare with OpenRouter
    compare_with_openrouter()
    
    # Summary
    print_header("Corrected Transformer Test Summary")
    print("🎉 Testing completed!")
    print("\n💡 Expected Results:")
    print("   • Anil resume: First='Anil Sahith', Last='Vallepu', Phone='+91 814340 0946'")
    print("   • BANOTH resume: First='BANOTH', Last='VAMSHI', Phone='939822 2755'")
    print("\n🚀 If you see 100% accuracy, your transformers are correctly fixed!")

if __name__ == "__main__":
    main()

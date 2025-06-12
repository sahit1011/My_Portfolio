#!/usr/bin/env python3
"""
Verify Setup After Cleanup
Quick test to ensure all essential components are working
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def test_imports():
    """Test that all essential components can be imported"""
    print("🔍 Testing Essential Component Imports...")
    
    try:
        from src.resume_parser import ResumeParser
        print("✅ ResumeParser imported successfully")
    except Exception as e:
        print(f"❌ ResumeParser import failed: {e}")
        return False
    
    try:
        from src.llm_providers.enhanced_transformer_llm import EnhancedTransformerProvider
        print("✅ Enhanced Transformer imported successfully")
    except Exception as e:
        print(f"❌ Enhanced Transformer import failed: {e}")
        return False
    
    try:
        from src.llm_providers.improved_layoutlm_transformer import ImprovedLayoutLMProvider
        print("✅ Improved LayoutLM imported successfully")
    except Exception as e:
        print(f"❌ Improved LayoutLM import failed: {e}")
        return False
    
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        print("✅ Improved PDF Processor imported successfully")
    except Exception as e:
        print(f"❌ Improved PDF Processor import failed: {e}")
        return False
    
    return True

def test_resume_parser():
    """Test ResumeParser initialization"""
    print("\n🔍 Testing ResumeParser Initialization...")
    
    try:
        from src.resume_parser import ResumeParser
        parser = ResumeParser()
        available_providers = parser.get_available_providers()
        print(f"✅ ResumeParser initialized successfully")
        print(f"📋 Available providers: {available_providers}")
        return True
    except Exception as e:
        print(f"❌ ResumeParser initialization failed: {e}")
        return False

def test_flask_app():
    """Test Flask app imports"""
    print("\n🔍 Testing Flask App...")
    
    try:
        import app
        print("✅ Flask app imported successfully")
        return True
    except Exception as e:
        print(f"❌ Flask app import failed: {e}")
        return False

def main():
    """Run verification tests"""
    print("🧪 Verifying Setup After Cleanup")
    print("=" * 50)
    
    tests = [
        ("Essential Imports", test_imports),
        ("ResumeParser", test_resume_parser),
        ("Flask App", test_flask_app)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} test failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✅ ALL TESTS PASSED - Setup is working correctly!")
        print("🎉 Ready for assignment submission!")
    else:
        print("⚠️  Some tests failed - Review issues above")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

#!/usr/bin/env python3
"""
Debug Text Extraction - See what's actually being extracted
"""

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

def debug_pdf_extraction():
    """Debug what's actually being extracted from PDFs"""
    
    test_files = [
        "docs/resumes_for_testing/anil_ml_resme.pdf",
        "docs/resumes_for_testing/BANOTH-VAMSHI-FlowCV-Resume-20240131.pdf"
    ]
    
    try:
        from src.file_processors.improved_smart_pdf_processor import ImprovedSmartPDFProcessor
        processor = ImprovedSmartPDFProcessor()
        
        for test_file in test_files:
            if Path(test_file).exists():
                print(f"\n{'='*80}")
                print(f"📄 DEBUGGING: {Path(test_file).name}")
                print(f"{'='*80}")
                
                # Extract text
                extracted_text = processor.extract_text(test_file)
                
                print(f"📊 Total characters: {len(extracted_text)}")
                lines_count = len(extracted_text.split('\n'))
                print(f"📊 Total lines: {lines_count}")

                # Show the actual extracted text
                print(f"\n📝 ACTUAL EXTRACTED TEXT:")
                print("-" * 80)
                print(extracted_text[:2000])  # First 2000 characters
                print("-" * 80)

                # Break into lines for analysis
                lines = [line.strip() for line in extracted_text.split('\n') if line.strip()]
                print(f"\n📋 LINES BREAKDOWN:")
                for i, line in enumerate(lines[:20], 1):  # First 20 lines
                    print(f"{i:2d}. {line}")
                
                # Look for key patterns
                print(f"\n🔍 KEY PATTERN ANALYSIS:")
                
                # Name patterns
                import re
                name_patterns = [
                    r'([A-Z][a-z]+\s+[A-Z][a-z]+\s+[A-Z][a-z]+)',  # Three word names
                    r'([A-Z][a-z]+\s+[A-Z][a-z]+)',  # Two word names
                    r'^([A-Z][A-Z\s]+)$',  # All caps names
                ]
                
                print("   Names found:")
                for pattern in name_patterns:
                    matches = re.findall(pattern, extracted_text, re.MULTILINE)
                    for match in matches[:3]:
                        print(f"      • {match}")
                
                # Email patterns
                email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
                emails = re.findall(email_pattern, extracted_text)
                print(f"   Emails found: {emails}")
                
                # Phone patterns
                phone_patterns = [
                    r'\+91[\s-]?\d{10}',
                    r'\d{10}',
                    r'\d{3}[\s-]?\d{3}[\s-]?\d{4}'
                ]
                print("   Phones found:")
                for pattern in phone_patterns:
                    phones = re.findall(pattern, extracted_text)
                    for phone in phones[:3]:
                        print(f"      • {phone}")
                
                print("\n" + "="*80)
    
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_pdf_extraction()

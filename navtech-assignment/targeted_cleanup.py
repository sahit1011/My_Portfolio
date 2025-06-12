#!/usr/bin/env python3
"""
Targeted Cleanup Script - Remove specific test/debug files
"""

import os
from pathlib import Path
import glob

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"🧹 {title}")
    print("="*60)

def remove_files_by_pattern(pattern, description):
    """Remove files matching a pattern"""
    files = glob.glob(pattern, recursive=True)
    removed_count = 0
    
    for file_path in files:
        try:
            path = Path(file_path)
            if path.exists() and path.is_file():
                path.unlink()
                print(f"🗑️  Removed: {file_path}")
                removed_count += 1
        except Exception as e:
            print(f"❌ Failed to remove {file_path}: {e}")
    
    print(f"📊 {description}: {removed_count} files removed")
    return removed_count

def main():
    """Main cleanup function"""
    print("🧹 Targeted NavTech Assignment Cleanup")
    print("Removing specific test, debug, and analysis files...")
    
    total_removed = 0
    
    # Remove test files
    print_header("Removing Test Files")
    patterns = [
        "test_*.py",
        "debug_*.py", 
        "*_test.py",
        "simple_*.py",
        "quick_*.py",
        "demo_*.py",
        "check_*.py",
        "verify_*.py"
    ]
    
    for pattern in patterns:
        removed = remove_files_by_pattern(pattern, f"Pattern: {pattern}")
        total_removed += removed
    
    # Remove analysis files
    print_header("Removing Analysis Files")
    analysis_patterns = [
        "*_analysis.py",
        "*_comparison.py",
        "*_review.py",
        "comprehensive_*.py",
        "phase*.py",
        "final_*.py",
        "interactive_*.py",
        "production_*.py",
        "recruiter_*.py",
        "content_quality_*.py",
        "pdf_extraction_*.py",
        "pdf_text_*.py",
        "extract_*.py",
        "get_*.py",
        "start_*.py"
    ]
    
    for pattern in analysis_patterns:
        removed = remove_files_by_pattern(pattern, f"Pattern: {pattern}")
        total_removed += removed
    
    # Remove output files
    print_header("Removing Output Files")
    output_patterns = [
        "*.json",
        "debug_*.txt",
        "improved_*.txt",
        "enhanced_*.txt",
        "smart_*.txt",
        "layoutlm_*.txt",
        "deepseek_*.txt",
        "balanced_*.txt",
        "complete_*.txt",
        "detailed_*.txt",
        "transformer_*.txt",
        "*.log"
    ]
    
    for pattern in output_patterns:
        removed = remove_files_by_pattern(pattern, f"Pattern: {pattern}")
        total_removed += removed
    
    # Remove analysis markdown files (keep essential docs)
    print_header("Removing Analysis Reports")
    md_patterns = [
        "*_ANALYSIS.md",
        "*_REPORT.md",
        "*_SUMMARY.md",
        "*_REVIEW.md",
        "COMPREHENSIVE_*.md",
        "ENHANCED_*.md",
        "FINAL_*.md",
        "IMPROVEMENTS_*.md",
        "SMART_*.md",
        "TEXT_*.md",
        "TRANSFORMER_*.md",
        "FRONTEND_*.md",
        "PDF_*.md",
        "phase*.md"
    ]
    
    for pattern in md_patterns:
        removed = remove_files_by_pattern(pattern, f"Pattern: {pattern}")
        total_removed += removed
    
    # Remove specific unused enhanced model files (keep the ones we're using)
    print_header("Removing Unused Model Files")
    
    # Files to specifically remove (not the ones we're keeping)
    specific_files = [
        "improved_text_processor.py",
        "cleanup_unused_files.py",
        "NavTech_Resume_Parser_Colab.ipynb"
    ]
    
    for file_name in specific_files:
        try:
            path = Path(file_name)
            if path.exists():
                path.unlink()
                print(f"🗑️  Removed: {file_name}")
                total_removed += 1
        except Exception as e:
            print(f"❌ Failed to remove {file_name}: {e}")
    
    print_header("Cleanup Summary")
    print(f"📊 Total files removed: {total_removed}")
    
    # Show what's left
    print("\n✅ Essential files preserved:")
    essential_files = [
        "app.py",
        "src/resume_parser.py", 
        "src/main.py",
        "requirements.txt",
        "README.md",
        "README_WEB_APP.md",
        "ASSIGNMENT_SUMMARY.md",
        "SOLUTION_SUMMARY.md",
        "enhanced_layoutlm_transformer_v2.py",
        "enhanced_transformer_v2.py",
        "ultimate_enhanced_pdf_processor.py"
    ]
    
    for file_path in essential_files:
        if Path(file_path).exists():
            print(f"   ✅ {file_path}")
        else:
            print(f"   ⚠️  {file_path} (not found)")
    
    print("\n🎉 Targeted cleanup completed!")
    print("📋 Project is now clean and ready for submission!")

if __name__ == "__main__":
    main()

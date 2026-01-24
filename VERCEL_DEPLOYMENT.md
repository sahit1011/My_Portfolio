# Vercel Deployment Guide for Resume Parser

## Overview
This guide covers what works and what needs adjustment when deploying to Vercel.

## ✅ What Works on Vercel

1. **API Routes** - All Next.js API routes work perfectly
2. **OpenRouter API** - External API calls work fine
3. **Gemini API** - External API calls work fine
4. **URL-based job description fetching** - Works perfectly
5. **Text input** - Works perfectly
6. **Environment variables** - Can be set in Vercel dashboard

## ⚠️ Limitations on Vercel

### 1. File System Logging
- **Issue**: Vercel serverless functions have a read-only filesystem (except `/tmp`)
- **Impact**: File-based logging to `logs/` directory won't work
- **Solution**: Logging is automatically disabled in production, uses console.log instead

### 2. PDF/File Extraction
- **Issue**: Command-line tools (`pdftotext`, `antiword`, `docx2txt`) are not available
- **Impact**: File upload feature for job descriptions won't work
- **Solution**: Users should use URL or text input instead

### 3. Temporary Files
- **Issue**: `/tmp` directory is available but ephemeral (cleared between invocations)
- **Impact**: File processing might have issues
- **Solution**: File upload is disabled/limited in production

## 🔧 Required Setup

### 1. Environment Variables
Set these in your Vercel project dashboard (Settings → Environment Variables):

```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-key-here (optional)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 2. Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

## 📝 Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**
   - In project settings, add the environment variables listed above
   - Make sure to set them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## 🎯 What Will Work

✅ Resume parser with URL input
✅ Resume parser with text input  
✅ OpenRouter API integration
✅ Gemini API integration (if key is set)
✅ All UI components
✅ Validation and error handling

## ❌ What Won't Work

❌ File upload for job descriptions (PDF/DOC extraction)
❌ File-based logging (automatically disabled)
❌ Logs page viewing files (will show empty or error)

## 🔄 Recommended Changes for Production

The code has been updated to:
- Gracefully handle missing file system access
- Use console.log for logging in production
- Show helpful errors when file extraction fails
- Guide users to use URL or text input instead

## 🧪 Testing After Deployment

1. Test URL input: Paste a job posting URL
2. Test text input: Paste job description text
3. Test file upload: Should show helpful error message
4. Verify API keys are working: Check browser console for errors

## 📞 Support

If you encounter issues:
1. Check Vercel function logs in the dashboard
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Ensure API keys are valid and have credits


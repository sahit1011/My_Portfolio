# Portfolio Content Management System

This document explains how to manage all the content in your portfolio website through a centralized content management system.

## Overview

All editable content in your portfolio is now centralized in two main files:
- `src/data/content.json` - Contains all the text content, personal information, and data
- `src/utils/content.ts` - Provides TypeScript utilities and functions to access the content

## Content Structure

### 1. Personal Information (`personalInfo`)
Contains your basic personal details:
```json
{
  "name": "Vallepu Anil Sahith",
  "displayName": "Anil Sahith",
  "titles": ["Software Engineer", "AI/ML Engineer", "Data Scientist"],
  "email": "anilsahithvallepu@gmail.com",
  "phone": "+91 8143400946",
  "location": "India",
  "github": "sahit1011",
  "linkedin": "anilsahithvallepu"
}
```

### 2. About Section (`about`)
Contains your bio, introduction, and personal statements:
- `greeting` - The greeting text
- `name` - Your display name
- `roles` - Array of role objects with prefix and name
- `bio` - Array of biography paragraphs
- `currentlyExploring` - Technologies you're currently learning
- `education`, `experience`, `technologies` - Summary text for cards

### 3. Experience (`experience`)
Array of work experience objects:
```json
{
  "id": 1,
  "title": "Full-Stack ML Intern",
  "company": "Noccarc Robotics Pvt Ltd.",
  "location": "Pune, Maharashtra",
  "period": "Jun 2024 - Apr 2025",
  "description": ["Description paragraph 1", "Description paragraph 2"],
  "skills": ["Python", "TensorFlow", "CNN"]
}
```

### 4. Education (`education`)
Array of educational background:
```json
{
  "id": 1,
  "degree": "B.Tech in Electrical and Electronics Engineering",
  "institution": "National Institute of Technology (NIT) Warangal",
  "location": "Warangal, Telangana",
  "period": "2021 - 2025",
  "gpa": "",
  "achievements": []
}
```

### 5. Skills (`skills`)
Organized by categories with icon references:
- `programmingLanguages`
- `webTechnologies`
- `aiMl`
- `databases`
- `devOps`
- `tools`

### 6. Projects (`projects`)
Array of project objects:
```json
{
  "id": 1,
  "title": "Custom Stock Trend Predictor",
  "description": "Project description...",
  "image": "/placeholder.jpg",
  "technologies": ["Python", "Flask", "HTML"],
  "github": "https://github.com/sahit1011/custom-stock-trend-predictor",
  "demo": "#",
  "featured": true
}
```

### 7. Resume (`resume`)
Resume-specific content:
- `summary` - Professional summary
- `skills` - Skills organized by category for resume display

### 8. Terminal (`terminal`)
Terminal interface content:
- `welcomeMessage` - Welcome text
- `helpText` - Help instruction
- `prompts` - OS-specific command prompts
- `titles` - OS-specific window titles
- `featuredProjects` - Project names for terminal display

### 9. Contact (`contact`)
Contact page content:
- `heading` - Main heading
- `subheading` - Subtitle
- `availability` - List of availability types
- `formLabels` - Form field labels

### 10. Meta Information (`meta`)
SEO and metadata:
- `title` - Page title
- `description` - Meta description
- `keywords` - SEO keywords

### 11. Navigation (`navigation`)
Navigation menu labels

### 12. Footer (`footer`)
Complete footer content including:
- `description` - Footer description text
- `quickLinks` - Navigation links with titles and hrefs
- `contactSection` - Contact information (email, location, availability)
- `socialLinks` - Social media URLs (GitHub, LinkedIn, Twitter, Email)
- `copyright` - Copyright text

### 13. Loading (`loading`)
Loading page content

## How to Update Content

### Step 1: Edit the JSON File
Open `src/data/content.json` and modify the content you want to change.

### Step 2: Save and Test
The changes will be automatically reflected in your website. No code changes needed!

## Usage Examples

### In React Components
```typescript
import { getPersonalInfo, getAboutInfo, getProjects } from '@/utils/content';

// Get personal info
const personalInfo = getPersonalInfo();
console.log(personalInfo.name); // "Vallepu Anil Sahith"

// Get about info
const aboutInfo = getAboutInfo();
console.log(aboutInfo.bio[0]); // First bio paragraph

// Get projects
const projects = getProjects();
const featuredProjects = projects.filter(p => p.featured);
```

### Helper Functions
```typescript
import {
  getFullName,
  getEmail,
  getGithubUrl,
  getLinkedinUrl,
  getProjectById
} from '@/utils/content';

const name = getFullName(); // "Vallepu Anil Sahith"
const email = getEmail(); // "anilsahithvallepu@gmail.com"
const githubUrl = getGithubUrl(); // "https://github.com/sahit1011"
const project = getProjectById(1); // Get specific project
```

## Benefits

1. **Centralized Management** - All content in one place
2. **Easy Updates** - Change content without touching code
3. **Type Safety** - TypeScript interfaces ensure data consistency
4. **Maintainability** - Clear structure and organization
5. **Reusability** - Content can be used across multiple components

## Common Updates

### Adding a New Project
1. Open `src/data/content.json`
2. Add a new object to the `projects` array
3. Set a unique `id` and fill in all required fields
4. Set `featured: true` if you want it highlighted

### Updating Personal Information
1. Modify the `personalInfo` section
2. Update email, phone, social links as needed

### Adding Work Experience
1. Add a new object to the `experience` array
2. Include job title, company, period, and description

### Updating Skills
1. Modify the appropriate skill category
2. Add/remove skills with their corresponding icon names

## Notes

- Always use unique IDs for projects, experiences, and education entries
- Icon names should match the imports in your components
- Keep descriptions concise but informative
- Test your changes locally before deploying

This system makes it easy to keep your portfolio content up-to-date without needing to modify code files!

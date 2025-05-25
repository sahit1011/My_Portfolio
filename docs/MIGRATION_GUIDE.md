# Migration Guide: Converting Components to Use Content Management System

This guide will help you update your existing components to use the new centralized content management system.

## Quick Start

1. **Import the content utilities** in your component:
```typescript
import { getPersonalInfo, getAboutInfo, getProjects } from '@/utils/content';
```

2. **Replace hardcoded content** with function calls:
```typescript
// Before
const name = "Anil Sahith";
const email = "anilsahithvallepu@gmail.com";

// After  
const personalInfo = getPersonalInfo();
const name = personalInfo.displayName;
const email = personalInfo.email;
```

## Component-by-Component Migration

### 1. Navbar Component (`src/components/layout/Navbar.tsx`)

**Replace these hardcoded values:**
```typescript
// Before
const email = "anilsahithvallepu@gmail.com";
const phone = "+91 8143400946";
const githubUser = "sahit1011";
const linkedinUser = "anilsahithvallepu";

// After
import { getPersonalInfo, getNavigationInfo, getGithubUrl, getLinkedinUrl } from '@/utils/content';

const personalInfo = getPersonalInfo();
const navigation = getNavigationInfo();
```

**Update the JSX:**
```typescript
// Before
<ExpandingText>Anil Sahith</ExpandingText>

// After
<ExpandingText>{personalInfo.displayName}</ExpandingText>

// Before
<AnimatedNavLink href="/about">About</AnimatedNavLink>

// After
<AnimatedNavLink href="/about">{navigation.about}</AnimatedNavLink>
```

### 2. About Page (`src/app/about/page.tsx`)

**Replace hardcoded content:**
```typescript
// Before
const line1Config = { text: "Hello, Myself ", gradientPart: "Anil Sahith" };
const roles = [
  { prefix: "I'm a ", name: "Software Engineer" },
  { prefix: "I'm an ", name: "AI/ML Engineer" },
  { prefix: "I'm a ", name: "Data Scientist" }
];

// After
import { getAboutInfo } from '@/utils/content';

const aboutInfo = getAboutInfo();
const line1Config = { text: aboutInfo.greeting, gradientPart: aboutInfo.name };
const roles = aboutInfo.roles;
```

**Update bio paragraphs:**
```typescript
// Before
<p className="mb-4">
  With strong Computer Science concepts and an eye for detail...
</p>

// After
{aboutInfo.bio.map((paragraph, index) => (
  <p key={index} className="mb-4">{paragraph}</p>
))}
```

### 3. Experience Page (`src/app/experience/page.tsx`)

**Replace the experiences array:**
```typescript
// Before
const experiences = [
  {
    id: 1,
    title: 'Full-Stack ML Intern',
    company: 'Noccarc Robotics Pvt Ltd.',
    // ... rest of hardcoded data
  }
];

// After
import { getExperiences } from '@/utils/content';

const experiences = getExperiences();
```

### 4. Projects Page (`src/app/projects/page.tsx`)

**Replace the projects array:**
```typescript
// Before
const projects = [
  {
    id: 1,
    title: 'Custom Stock Trend Predictor',
    description: 'Designed a web-based tool...',
    // ... rest of hardcoded data
  }
];

// After
import { getProjects, getFeaturedProjects } from '@/utils/content';

const projects = getProjects();
const featuredProjects = getFeaturedProjects();
```

### 5. Skills Page (`src/app/skills/page.tsx`)

**Replace the skillCategories array:**
```typescript
// Before
const skillCategories = [
  {
    id: 1,
    title: 'Programming Languages',
    skills: [
      { name: 'Python', icon: <FaPython /> },
      // ... rest of skills
    ]
  }
];

// After
import { getSkills } from '@/utils/content';

const skills = getSkills();
const skillCategories = [
  {
    id: 1,
    title: 'Programming Languages',
    skills: skills.programmingLanguages
  },
  {
    id: 2,
    title: 'Web Technologies',
    skills: skills.webTechnologies
  },
  // ... other categories
];
```

### 6. Contact Page (`src/app/contact/page.tsx`)

**Replace hardcoded text:**
```typescript
// Before
<h1 className="mb-4">
  Get in <span className="gradient-text">Touch</span>
</h1>
<p>Have a question or want to work together? Feel free to contact me!</p>

// After
import { getContactInfo, getPersonalInfo } from '@/utils/content';

const contactInfo = getContactInfo();
const personalInfo = getPersonalInfo();

<h1 className="mb-4">
  {contactInfo.heading.split(' ').map((word, index) => 
    index === contactInfo.heading.split(' ').length - 1 ? 
    <span key={index} className="gradient-text">{word}</span> : 
    word + ' '
  )}
</h1>
<p>{contactInfo.subheading}</p>
```

### 7. Terminal Component (`src/components/terminal/Terminal.tsx`)

**Replace hardcoded terminal content:**
```typescript
// Before
const welcomeMessage = (
  <>
    <p className="text-green-400">Welcome to Anil's Terminal Portfolio!</p>
    <p className="mt-2">Type <span className="text-yellow-400">help</span> to see available commands.</p>
  </>
);

// After
import { getTerminalInfo, getPersonalInfo } from '@/utils/content';

const terminalInfo = getTerminalInfo();
const personalInfo = getPersonalInfo();

const welcomeMessage = (
  <>
    <p className="text-green-400">{terminalInfo.welcomeMessage}</p>
    <p className="mt-2">{terminalInfo.helpText}</p>
    <p className="mt-2">{terminalInfo.themeText}</p>
  </>
);
```

### 8. Resume Page (`src/app/resume/page.tsx`)

**Replace hardcoded resume content:**
```typescript
// Before
<h2 className="text-2xl font-bold text-blue-600">VALLEPU ANIL SAHITH</h2>
<p>Software Engineer | AI/ML Engineer | Data Scientist</p>
<p>anilsahithvallepu@gmail.com | +91 8143400946 | India</p>

// After
import { getPersonalInfo, getResumeInfo } from '@/utils/content';

const personalInfo = getPersonalInfo();
const resumeInfo = getResumeInfo();

<h2 className="text-2xl font-bold text-blue-600">{personalInfo.name.toUpperCase()}</h2>
<p>{personalInfo.titles.join(' | ')}</p>
<p>{personalInfo.email} | {personalInfo.phone} | {personalInfo.location}</p>
```

### 9. Footer Component (`src/components/layout/Footer.tsx`)

**Replace hardcoded footer content:**
```typescript
// Before
<h3 className="text-2xl font-bold mb-4 gradient-text">Anil Sahith</h3>
<p className="mb-4">
  Software Engineer, AI/ML Engineer, and Data Scientist passionate about building innovative solutions.
</p>

// After
import { getPersonalInfo, getFooterInfo } from '@/utils/content';

const personalInfo = getPersonalInfo();
const footerInfo = getFooterInfo();

<h3 className="text-2xl font-bold mb-4 gradient-text">{personalInfo.displayName}</h3>
<p className="mb-4">{footerInfo.description}</p>
```

### 10. Layout Metadata (`src/app/layout.tsx`)

**Replace hardcoded metadata:**
```typescript
// Before
export const metadata: Metadata = {
  title: "Anil Sahith Portfolio | Software Engineer & AI/ML Engineer",
  description: "Personal portfolio of Anil, a Software Engineer, AI/ML Engineer, and Data Scientist.",
  keywords: ["portfolio", "software engineer", "AI engineer", "ML engineer", "data scientist", "developer"],
};

// After
import { getMetaInfo } from '@/utils/content';

const metaInfo = getMetaInfo();

export const metadata: Metadata = {
  title: metaInfo.title,
  description: metaInfo.description,
  keywords: metaInfo.keywords,
};
```

## Testing Your Changes

1. **Start the development server:**
```bash
npm run dev
```

2. **Check each page** to ensure content displays correctly

3. **Test content updates** by modifying `src/data/content.json` and refreshing the page

4. **Verify TypeScript compilation** - no type errors should occur

## Common Issues and Solutions

### Issue: Component not updating after content change
**Solution:** Restart the development server or check for caching issues

### Issue: TypeScript errors about missing properties
**Solution:** Check that your content.json structure matches the interfaces in content.ts

### Issue: Icons not displaying
**Solution:** Ensure icon names in content.json match the actual icon imports in your components

## Benefits After Migration

✅ **Centralized Content Management** - All content in one place  
✅ **Easy Updates** - Change content without touching code  
✅ **Type Safety** - TypeScript ensures data consistency  
✅ **Maintainability** - Clear separation of content and code  
✅ **Reusability** - Content can be shared across components  

## Next Steps

After migrating all components:
1. Test thoroughly across all pages
2. Update the content.json file with your latest information
3. Consider adding more content sections as needed
4. Document any custom content requirements for future updates

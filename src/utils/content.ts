import contentData from '@/data/content.json';

// Type definitions for better TypeScript support
export interface PersonalInfo {
  name: string;
  displayName: string;
  titles: string[];
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
}

export interface AboutInfo {
  greeting: string;
  name: string;
  roles: Array<{ prefix: string; name: string }>;
  bio: string[];
  chat?: string[];
  currentlyExploring: string[];
  education: string;
  experience: string;
  technologies: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  summary?: string;
  highlights?: string[];
  description: string[];
  skills: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period?: string;  // Made optional
  gpa: string;
  achievements: string[];
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  [key: string]: Skill[];
}

export interface Project {
  id: number;
  title: string;
  slug?: string;
  tag?: string;
  description: string[];
  image?: string;        // legacy/unused — covers now come from `preview`
  preview?: string;      // /projects/<slug>.png — cover screenshot (graceful fallback if missing)
  demoVideo?: string;    // /projects/<slug>.mp4 — optional demo clip (case study)
  technologies: string[];
  github: string;
  demo?: string;
  featured: boolean;
}

export interface ResumeInfo {
  summary: string;
  skills: {
    languages: string;
    frontend: string;
    backend: string;
    databases: string;
    aiMl: string;
    devOps: string;
  };
}

export interface TerminalInfo {
  welcomeMessage: string;
  helpText: string;
  themeText: string;
  prompts: {
    windows: string;
    mac: string;
    linux: string;
  };
  titles: {
    windows: string;
    mac: string;
    linux: string;
  };
  featuredProjects: string[];
}

export interface ContactInfo {
  heading: string;
  subheading: string;
  availability: string[];
  formLabels: {
    name: string;
    email: string;
    subject: string;
    message: string;
    submit: string;
  };
}

export interface MetaInfo {
  title: string;
  description: string;
  keywords: string[];
}

export interface NavigationInfo {
  home: string;
  about: string;
  experience: string;
  projects: string;
  skills: string;
  aiResumeMatch: string;
  contact: string;
  resume: string;
}

export interface FooterInfo {
  description: string;
  quickLinks: {
    title: string;
    links: Array<{ name: string; href: string }>;
  };
  contactSection: {
    title: string;
    email: string;
    location: string;
    availability: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
  };
  copyright: string;
}

export interface LoadingInfo {
  title: string;
  message: string;
  refreshText: string;
  refreshButton: string;
}

// Content access functions
export const getPersonalInfo = (): PersonalInfo => contentData.personalInfo;
export const getAboutInfo = (): AboutInfo => contentData.about;
export const getExperiences = (): Experience[] => contentData.experience;
export const getEducation = (): Education[] => contentData.education;
export const getSkills = (): SkillCategory => contentData.skills;
export const getProjects = (): Project[] => contentData.projects;
export const getFeaturedProjects = (): Project[] => contentData.projects.filter(p => p.featured);
export const getResumeInfo = (): ResumeInfo => contentData.resume;
export const getTerminalInfo = (): TerminalInfo => contentData.terminal;
export const getContactInfo = (): ContactInfo => contentData.contact;
export const getMetaInfo = (): MetaInfo => contentData.meta;
export const getNavigationInfo = (): NavigationInfo => contentData.navigation;
export const getFooterInfo = (): FooterInfo => contentData.footer;
export const getLoadingInfo = (): LoadingInfo => contentData.loading;

// Helper functions for specific use cases
export const getFullName = (): string => getPersonalInfo().name;
export const getDisplayName = (): string => getPersonalInfo().displayName;
export const getEmail = (): string => getPersonalInfo().email;
export const getPhone = (): string => getPersonalInfo().phone;
export const getGithubUsername = (): string => getPersonalInfo().github;
export const getLinkedinUsername = (): string => getPersonalInfo().linkedin;

export const getGithubUrl = (): string => `https://github.com/${getGithubUsername()}`;
export const getLinkedinUrl = (): string => `https://linkedin.com/in/${getLinkedinUsername()}`;

export const getProjectById = (id: number): Project | undefined =>
  getProjects().find(project => project.id === id);

// Stable slug for deep project pages (falls back to a slugified title).
export const getProjectSlug = (project: Project): string =>
  project.slug ||
  project.title
    .split(/[-—]/)[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const getProjectBySlug = (slug: string): Project | undefined =>
  getProjects().find(project => getProjectSlug(project) === slug);

export const getExperienceById = (id: number): Experience | undefined =>
  getExperiences().find(exp => exp.id === id);

// Export the raw content data for direct access if needed
export const rawContentData = contentData;

const contentUtils = {
  getPersonalInfo,
  getAboutInfo,
  getExperiences,
  getEducation,
  getSkills,
  getProjects,
  getFeaturedProjects,
  getResumeInfo,
  getTerminalInfo,
  getContactInfo,
  getMetaInfo,
  getNavigationInfo,
  getFooterInfo,
  getLoadingInfo,
  getFullName,
  getDisplayName,
  getEmail,
  getPhone,
  getGithubUsername,
  getLinkedinUsername,
  getGithubUrl,
  getLinkedinUrl,
  getProjectById,
  getExperienceById,
  rawContentData
};

export default contentUtils;

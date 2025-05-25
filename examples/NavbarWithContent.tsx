'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaAddressBook } from 'react-icons/fa';
import CopyTooltip from '../ui/CopyTooltip';
import ThemeToggle from '../theme/ThemeToggle';
import AnimatedNavLink from '../ui/AnimatedNavLink';
import ExpandingText from '../ui/ExpandingText';

// Import the content management utilities
import { 
  getPersonalInfo, 
  getNavigationInfo, 
  getGithubUrl, 
  getLinkedinUrl 
} from '@/utils/content';

const Navbar = () => {
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

  // Get content from the centralized content management system
  const personalInfo = getPersonalInfo();
  const navigation = getNavigationInfo();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          <ExpandingText
            gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
            expandScale={1.03}
            letterSpacing="0.03em"
            textShadow={true}
            glowIntensity={0.4}
          >
            {personalInfo.displayName}
          </ExpandingText>
        </Link>

        <div className="hidden md:flex space-x-6">
          <AnimatedNavLink href="/" hoverEffect="underline">
            {navigation.home}
          </AnimatedNavLink>
          <AnimatedNavLink href="/about" hoverEffect="underline">
            {navigation.about}
          </AnimatedNavLink>
          <AnimatedNavLink href="/experience" hoverEffect="underline">
            {navigation.experience}
          </AnimatedNavLink>
          <AnimatedNavLink href="/projects" hoverEffect="underline">
            {navigation.projects}
          </AnimatedNavLink>
          <AnimatedNavLink href="/skills" hoverEffect="underline">
            {navigation.skills}
          </AnimatedNavLink>
          <AnimatedNavLink href="/resume-parser" hoverEffect="underline">
            {navigation.aiResumeMatch}
          </AnimatedNavLink>
          <AnimatedNavLink href="/contact" hoverEffect="underline">
            {navigation.contact}
          </AnimatedNavLink>
        </div>

        <div className="flex items-center space-x-4">
          {/* Contact Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsContactDropdownOpen(true)}
            onMouseLeave={() => setIsContactDropdownOpen(false)}
          >
            <button
              className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300 p-2"
              title="Contact Information"
            >
              <FaAddressBook size={22} />
            </button>
            {isContactDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                  <CopyTooltip id="email-tooltip-dropdown" text={personalInfo.email} label={
                    <div className="flex items-center">
                      <FaEnvelope size={18} className="mr-3" /> Email
                    </div>
                  } />
                </div>
                <div className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                  <CopyTooltip id="phone-tooltip-dropdown" text={personalInfo.phone} label={
                     <div className="flex items-center">
                      <FaPhone size={18} className="mr-3" /> Phone
                    </div>
                  } />
                </div>
                <a
                  href={getGithubUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  title="GitHub"
                >
                  <div className="flex items-center">
                    <FaGithub size={18} className="mr-3" /> GitHub
                  </div>
                </a>
                <a
                  href={getLinkedinUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                  title="LinkedIn"
                >
                  <div className="flex items-center">
                    <FaLinkedin size={18} className="mr-3" /> LinkedIn
                  </div>
                </a>
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Mobile menu button - to be implemented */}
          <button className="md:hidden p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

/*
CHANGES MADE TO USE CONTENT MANAGEMENT SYSTEM:

1. Imported content utilities:
   - getPersonalInfo() - for personal details
   - getNavigationInfo() - for navigation labels
   - getGithubUrl() and getLinkedinUrl() - for social links

2. Replaced hardcoded values:
   - personalInfo.displayName instead of "Anil Sahith"
   - navigation.home, navigation.about, etc. instead of hardcoded text
   - personalInfo.email and personalInfo.phone instead of hardcoded values
   - getGithubUrl() and getLinkedinUrl() instead of manually constructed URLs

3. Benefits:
   - All content now comes from the centralized content.json file
   - Easy to update personal info, navigation labels, and social links
   - Type-safe with TypeScript interfaces
   - Consistent data across all components

To update content, simply modify src/data/content.json:
- Change personalInfo.displayName to update the navbar title
- Change navigation labels to update menu items
- Change personalInfo.email/phone to update contact details
- Change personalInfo.github/linkedin to update social links
*/

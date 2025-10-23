'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaAddressBook, FaHome, FaUser, FaBriefcase, FaCode, FaFileAlt, FaAddressCard, FaProjectDiagram } from 'react-icons/fa';
import CopyTooltip from '../ui/CopyTooltip';
import ExpandingText from '../ui/ExpandingText';
import ShinyText from '../ShinyText';

// Import content management utilities
import {
  getPersonalInfo,
  getNavigationInfo,
  getGithubUrl,
  getLinkedinUrl
} from '@/utils/content';

const Navbar = () => {
  const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get content from the centralized content management system
  const personalInfo = getPersonalInfo();
  const navigation = getNavigationInfo();

  // Navigation items with icons
  const navItems = [
    { href: '/', label: navigation.home, icon: FaHome, description: 'Home' },
    { href: '/about', label: navigation.about, icon: FaUser, description: 'About' },
    { href: '/experience', label: navigation.experience, icon: FaBriefcase, description: 'Experience' },
    { href: '/projects', label: navigation.projects, icon: FaProjectDiagram, description: 'Projects' },
    { href: '/skills', label: navigation.skills, icon: FaCode, description: 'Skills' },
    { href: '/resume-parser', label: navigation.aiResumeMatch, icon: FaFileAlt, description: 'AI Resume Parser' },
  ];

  // Handle click outside to close dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContactDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle functions
  const toggleContactDropdown = () => {
    setIsContactDropdownOpen(!isContactDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <>
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none scale-[0.9]">
        <Link href="/" className="text-3xl font-bold pointer-events-auto">
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
      </div>

      {/* Floating Dock */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 scale-[0.9] z-50">
        <div className="relative bg-white/15 dark:bg-white/10 backdrop-blur-lg border border-white/5 dark:border-gray-700/15 rounded-full px-6 py-3 shadow-xl">
          {/* Navigation Icons */}
          <div className="flex items-center space-x-7">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 dark:bg-white/12 hover:bg-white/30 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-125 group"
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <IconComponent size={20} className="text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                  </Link>
                  {/* Tooltip */}
                  {hoveredItem === item.href && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50">
                      <ShinyText
                        speed={2}
                        className="text-lg font-medium"
                      >
                        {item.description}
                      </ShinyText>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Contact Icon */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleContactDropdown}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 dark:bg-white/12 hover:bg-white/30 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-125 group"
                onMouseEnter={() => setHoveredItem('contact')}
                onMouseLeave={() => setHoveredItem(null)}
                title="Contact Information"
              >
                <FaAddressBook size={20} className="text-gray-600 dark:text-gray-400 transition-colors duration-300" />
              </button>
              {/* Tooltip for Contact */}
              {hoveredItem === 'contact' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 z-50">
                  <ShinyText
                    speed={2}
                    className="text-lg font-medium"
                  >
                    Get In Touch
                  </ShinyText>
                </div>
              )}
              {isContactDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-md shadow-xl py-1 z-50 border border-white/15 dark:border-gray-700/15">
                  <div className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-150">
                    <CopyTooltip
                      id="email-tooltip-dropdown"
                      text={personalInfo.email}
                      isEmail={true}
                      label={
                        <div className="flex items-center">
                          <FaEnvelope size={16} className="mr-3" /> Email
                        </div>
                      }
                    />
                  </div>
                  <div className="px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-150">
                    <CopyTooltip id="phone-tooltip-dropdown" text={personalInfo.phone} label={
                       <div className="flex items-center">
                        <FaPhone size={16} className="mr-3" /> Phone
                      </div>
                    } />
                  </div>
                  <a
                    href={getGithubUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-150"
                    title="GitHub"
                  >
                    <div className="flex items-center">
                      <FaGithub size={16} className="mr-3" /> GitHub
                    </div>
                  </a>
                  <a
                    href={getLinkedinUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors duration-150"
                    title="LinkedIn"
                  >
                    <div className="flex items-center">
                      <FaLinkedin size={16} className="mr-3" /> LinkedIn
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-white/5 dark:bg-gray-800/5 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-110"
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/15 dark:border-gray-700/15 rounded-lg shadow-xl">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors duration-300"
                  onClick={closeMobileMenu}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                <FaAddressCard size={18} className="mr-3" />
                {navigation.contact}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

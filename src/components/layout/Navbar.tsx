'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaAddressBook, FaHome, FaUser, FaBriefcase, FaCode, FaFileAlt, FaProjectDiagram } from 'react-icons/fa';
// import CopyTooltip from '../ui/CopyTooltip';
import ExpandingText from '../ui/ExpandingText';
import ShinyText from '../ShinyText';

// Import content management utilities
import {
  // getPersonalInfo,
  getNavigationInfo,
  // getGithubUrl,
  // getLinkedinUrl
} from '@/utils/content';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Get content from the centralized content management system
  // const personalInfo = getPersonalInfo();
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

  // Get current page title
  const getCurrentPageTitle = () => {
    if (pathname === '/contact') return navigation.contact;
    const currentItem = navItems.find(item => item.href === pathname);
    return currentItem ? currentItem.label : 'Home';
  };

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu if clicking outside
      const mobileMenu = document.querySelector('.md\\:hidden.fixed.top-20.right-6');
      if (mobileMenu && !mobileMenu.contains(event.target as Node) && !(event.target as Element).closest('.absolute.top-6.right-6')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle functions
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };



  return (
    <>
      {/* Current Page Title in top left corner */}
      <div className="absolute top-6 left-6 z-50 pointer-events-none scale-[0.9]">
        <div className="text-3xl font-bold pointer-events-auto relative">
          <ExpandingText
            gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
            expandScale={1.03}
            letterSpacing="0.03em"
            textShadow={true}
            glowIntensity={0.4}
          >
            {getCurrentPageTitle()}
          </ExpandingText>
          {/* Underline animation */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>
      </div>

      {/* Desktop Floating Navbar */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:flex">
        <div className="flex space-x-6 bg-white/15 dark:bg-white/10 backdrop-blur-lg border border-white/5 dark:border-gray-700/15 rounded-full px-6 py-3 shadow-xl">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-110"
                >
                  <IconComponent size={20} className="text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                </Link>
                {/* Tooltip on hover */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <ShinyText
                    speed={2}
                    className="text-base font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </ShinyText>
                </div>
              </div>
            );
          })}
          {/* Contact Icon */}
          <div className="relative group">
            <Link
              href="/contact"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-110"
            >
              <FaAddressBook size={20} className="text-gray-600 dark:text-gray-400 transition-colors duration-300" />
            </Link>
            {/* Tooltip for Contact */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <ShinyText
                speed={2}
                className="text-base font-medium whitespace-nowrap"
              >
                Contact
              </ShinyText>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="absolute top-6 right-8 z-50">
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 dark:bg-white/10 backdrop-blur-lg border border-white/5 dark:border-gray-700/15 shadow-xl hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300 hover:scale-110"
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Blur */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />

          <div className="fixed top-20 right-6 z-50">
            <div className="bg-white/15 dark:bg-white/10 backdrop-blur-lg border border-white/5 dark:border-gray-700/15 rounded-lg shadow-xl p-4">
              {/* Navigation Icons - Vertical Layout with Text */}
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className="flex items-center px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconComponent size={18} className="mr-3 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}

                {/* Contact Icon */}
                <div className="relative">
                  <Link
                    href="/contact"
                    className="flex items-center w-full px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaAddressBook size={18} className="mr-3 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                    <span className="text-sm font-medium">Contact</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    </>
  );
};

export default Navbar;

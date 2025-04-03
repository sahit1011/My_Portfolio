'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';
import CopyTooltip from '../ui/CopyTooltip';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md py-4 transition-colors duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold gradient-text">
          Anil Sahith
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/experience" className="nav-link">
            Experience
          </Link>
          <Link href="/projects" className="nav-link">
            Projects
          </Link>
          <Link href="/skills" className="nav-link">
            Skills
          </Link>
          <Link href="/resume-parser" className="nav-link">
            AI Resume Match
          </Link>
          <Link href="/contact" className="nav-link">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300 hidden md:block">
            <CopyTooltip id="email-tooltip" text="your.email@example.com" label={<FaEnvelope size={20} />} />
          </div>
          <div className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300 hidden md:block">
            <CopyTooltip id="phone-tooltip" text="+1 (123) 456-7890" label={<FaPhone size={20} />} />
          </div>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300"
            title="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300"
            title="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100 hover:text-purple-600 transition-colors duration-300"
            title="Twitter"
          >
            <FaTwitter size={20} />
          </a>

          {/* Mobile menu button - to be implemented */}
          <button className="md:hidden">
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

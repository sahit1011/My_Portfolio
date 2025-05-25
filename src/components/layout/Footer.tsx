'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

// Import content management utilities
import {
  getPersonalInfo,
  getFooterInfo,
  getGithubUrl,
  getLinkedinUrl,
  getEmail
} from '@/utils/content';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Get content from the centralized content management system
  const personalInfo = getPersonalInfo();
  const footerInfo = getFooterInfo();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">{personalInfo.displayName}</h3>
            <p className="mb-4">
              {footerInfo.description}
            </p>
            <div className="flex space-x-4">
              <a
                href={getGithubUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
                title="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href={getLinkedinUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
                title="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(getEmail())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
                title="Email"
              >
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">{footerInfo.quickLinks.title}</h4>
            <ul className="space-y-2">
              {footerInfo.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">{footerInfo.contactSection.title}</h4>
            <p className="mb-2">Email: {footerInfo.contactSection.email}</p>
            <p className="mb-2">Location: {footerInfo.contactSection.location}</p>
            <p>{footerInfo.contactSection.availability}</p>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} {personalInfo.displayName}. {footerInfo.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 gradient-text">Anil Sahith</h3>
            <p className="mb-4">
              Software Engineer, AI/ML Engineer, and Data Scientist passionate about building innovative solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="text-dark dark:text-light hover:text-accent transition-colors duration-300"
              >
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-accent transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-accent transition-colors duration-300">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-accent transition-colors duration-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-accent transition-colors duration-300">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/resume" className="hover:text-accent transition-colors duration-300">
                  Resume
                </Link>
              </li>
              <li>
                <Link href="/resume-parser" className="hover:text-accent transition-colors duration-300">
                  AI Resume Match
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Contact</h4>
            <p className="mb-2">Email: your.email@example.com</p>
            <p className="mb-2">Location: City, Country</p>
            <p>Available for freelance and full-time opportunities</p>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} Anil Sahith. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

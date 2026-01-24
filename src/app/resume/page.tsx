'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaDownload, FaEye, FaTrophy, FaUsers, FaGraduationCap, FaBriefcase, FaCode, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import ExpandingText from '@/components/ui/ExpandingText';
import SpotlightCard from '@/components/SpotLightCard';
import ShinyText from '@/components/ShinyText';

const ResumePage = () => {
  const resumeUrl = '/sahith_resume_ai.pdf';
  const resumeDownloadUrl = '/sahith_resume_ai.pdf';

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <ExpandingText
                as="h1"
                className="text-4xl md:text-5xl font-bold"
                gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                expandScale={1.03}
                letterSpacing="0.03em"
                textShadow={true}
                glowIntensity={0.4}
              >
                Resume / CV
              </ExpandingText>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
            <p className="text-lg text-gray-300 mb-8">
              <ShinyText speed={3}>
                Download or view my complete resume
              </ShinyText>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button3D
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="accent"
                size="lg"
                icon={<FaEye />}
                className="gradient-border"
              >
                View Resume
              </Button3D>
              <motion.a
                href={resumeDownloadUrl}
                download="Anil_Sahith_Resume.pdf"
                className="button-3d inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-600 active:bg-blue-700 gradient-border"
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
              >
                <FaDownload className="mr-2" />
                Download Resume
              </motion.a>
            </div>
          </div>

          {/* Main Resume Content Card */}
          <Card3D
            className="p-8 md:p-12 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
            hoverScale={1.005}
            gradientShadow={false}
            glowOnHover={false}
          >
            {/* Header Section */}
            <div className="mb-8 pb-6 border-b border-white/10">
              <div className="relative inline-block mb-4">
                <ExpandingText
                  as="h2"
                  className="text-3xl md:text-4xl font-bold"
                  gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                  expandScale={1.02}
                  letterSpacing="0.02em"
                >
                  VALLEPU ANIL SAHITH
                </ExpandingText>
              </div>
              <p className="text-xl text-gray-300 mb-3">Software Engineer | AI/ML Engineer | Data Scientist</p>
              <p className="text-sm text-gray-400 mb-3">
                <strong>Seeking roles:</strong> Software Engineer, AI Engineer, Machine Learning Engineer, Data Scientist, Quant Developer
              </p>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-purple-400" />
                  <a href="mailto:anilsahithvallepu@gmail.com" className="hover:text-purple-400 transition-colors">
                    anilsahithvallepu@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-purple-400" />
                  <span>+91 8143400946</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaMapMarkerAlt className="text-purple-400" />
                  <span>India</span>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="https://github.com/sahit1011"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <FaGithub /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/anilsahithvallepu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <Card3D
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              hoverScale={1.003}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="relative inline-block mb-4">
                <ExpandingText
                  as="h3"
                  className="text-2xl font-bold"
                  gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                  expandScale={1.02}
                >
                  SUMMARY
                </ExpandingText>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Software Engineer with strong Math and CS foundations, specializing in AI/ML systems and production-grade deployment. 
                Proven expertise in developing and optimizing deep learning models, LLM applications, and RAG systems. Skilled in building 
                low-latency inference pipelines, on-device model optimization, and scalable data architectures.
              </p>
            </Card3D>

            {/* Education Section */}
            <Card3D
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              hoverScale={1.003}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaGraduationCap className="text-2xl text-purple-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    EDUCATION
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="pl-4 border-l-2 border-purple-400/30">
                  <p className="font-bold text-lg text-gray-200 mb-1">Bachelor of Technology</p>
                  <p className="text-gray-300 mb-1">Electrical and Electronics Engineering</p>
                  <p className="text-gray-400 text-sm">National Institute of Technology (NIT) Warangal | Warangal, India</p>
                  <p className="text-purple-400 font-semibold mt-2">May 2024</p>
                </div>
              </div>
            </Card3D>

            {/* Experience Section */}
            <Card3D
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              hoverScale={1.003}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaBriefcase className="text-2xl text-purple-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    EXPERIENCE
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <p className="text-gray-300">
                Detailed work experience, including roles at Noccarc Robotics and Carelon Global Solutions, 
                can be found on the{' '}
                <a href="/experience" className="text-purple-400 hover:text-purple-300 transition-colors underline">
                  Experience page
                </a>.
              </p>
            </Card3D>

            {/* Projects Section */}
            <Card3D
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              hoverScale={1.003}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaCode className="text-2xl text-purple-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    PROJECTS
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <p className="text-gray-300">
                Key projects including the Custom Stock Trend Predictor, Smart ATS Resume Tracker, Quantum Perceptron, 
                and Medical Chat Bot are detailed on the{' '}
                <a href="/projects" className="text-purple-400 hover:text-purple-300 transition-colors underline">
                  Projects page
                </a>.
              </p>
            </Card3D>

            {/* Achievements Section */}
            <SpotlightCard
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              spotlightColor="rgba(139, 92, 246, 0.3)"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaTrophy className="text-2xl text-yellow-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    ACHIEVEMENTS
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Secured 99.3rd percentile in JEE Mains (India) - Top 0.7% among 1 million+ candidates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Recognised with Top 100 Projects at NASA AMES Space Settlement Contest, San Juan, Puerto Rico (2017)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Solved 300+ Data Structures and Algorithms problems (Medium-Hard difficulty) on LeetCode</span>
                </li>
              </ul>
            </SpotlightCard>

            {/* Positions of Responsibility Section */}
            <SpotlightCard
              className="p-6 mb-8 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              spotlightColor="rgba(59, 130, 246, 0.3)"
            >
              <div className="flex items-center gap-3 mb-4">
                <FaUsers className="text-2xl text-blue-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    POSITIONS OF RESPONSIBILITY
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Member, Big Data, Analytics and Consulting Cell (BDACC), NIT Warangal (Aug 2022 - May 2023).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Captain, Inter-NIT Volleyball Team, NIT Warangal (Aug 2022 - May 2023).</span>
                </li>
              </ul>
            </SpotlightCard>

            {/* Skills Section */}
            <Card3D
              className="p-6 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
              hoverScale={1.01}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="flex items-center gap-3 mb-4">
                <FaCode className="text-2xl text-purple-400" />
                <div className="relative inline-block">
                  <ExpandingText
                    as="h3"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    SKILLS
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
              </div>
              <p className="text-gray-300">
                A comprehensive list of technical skills including programming languages, web technologies, databases, AI/ML tools, 
                and more is available on the{' '}
                <a href="/skills" className="text-purple-400 hover:text-purple-300 transition-colors underline">
                  Skills page
                </a>.
              </p>
            </Card3D>
          </Card3D>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default ResumePage;

'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaDownload, FaEye, FaTrophy, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResumePage = () => {
  const resumeUrl = '/anil_ml_resme.pdf'; // Link to PDF in public folder
  const resumeDownloadUrl = '/anil_ml_resme.pdf'; // Link to PDF in public folder for download

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">Resume/CV</h1>

          <div className="flex flex-wrap gap-4 mb-8">
            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye className="mr-2" /> View Resume
            </motion.a>
            <motion.a
              href={resumeDownloadUrl}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500 shadow-md hover:shadow-lg transition-all duration-300"
              download="Anil_Sahith_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaDownload className="mr-2" /> Download Resume
            </motion.a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">VALLEPU ANIL SAHITH</h2>
              <p className="text-gray-700 dark:text-gray-300">Software Engineer | AI/ML Engineer | Data Scientist</p>
              <p className="text-gray-600 dark:text-gray-400">anilsahithvallepu@gmail.com | +91 8143400946 | India</p>
              <p className="text-gray-600 dark:text-gray-400">
                <a href="https://github.com/sahit1011" target="_blank" rel="noopener noreferrer" className="hover:underline">github.com/sahit1011</a> | 
                <a href="https://www.linkedin.com/in/anilsahithvallepu" target="_blank" rel="noopener noreferrer" className="hover:underline"> linkedin.com/in/anilsahithvallepu</a>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">SUMMARY</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Aspiring Software Engineer with a B.Tech in Electrical and Electronics Engineering from NIT Warangal, specializing in AI/ML. 
                Experienced in developing machine learning models, full-stack applications, and data processing pipelines through internships 
                at Noccarc Robotics and Carelon Global Solutions. Proficient in Python, C++, JavaScript, and various AI/ML frameworks.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">EDUCATION</h3>
              <div className="mb-3">
                <p className="font-bold text-gray-800 dark:text-gray-200">Bachelor of Technology (B.Tech), Electrical and Electronics Engineering</p>
                <p className="text-gray-700 dark:text-gray-300">National Institute of Technology, Warangal (NITW) | Warangal, India</p>
                <p className="text-gray-600 dark:text-gray-400">CGPA: 6.5</p>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">Intermediate SSC Class 12th</p>
                <p className="text-gray-700 dark:text-gray-300">Chukka Ramaiah IIT Institute (Vijay Ratna Junior College) | Hyderabad, India</p>
                <p className="text-gray-600 dark:text-gray-400">CGPA: 9.75</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">EXPERIENCE</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Detailed work experience, including roles at Noccarc Robotics and Carelon Global Solutions, 
                can be found on the <a href="/experience" className="text-blue-500 hover:underline">Experience page</a>.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">PROJECTS</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Key projects including the Custom Stock Trend Predictor, Smart ATS Resume Tracker, Quantum Perceptron, 
                and Medical Chat Bot are detailed on the <a href="/projects" className="text-blue-500 hover:underline">Projects page</a>.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center">
                <FaTrophy className="mr-3 text-blue-600 dark:text-blue-400" /> ACHIEVEMENTS
              </h3>
              <ul className="list-disc list-inside space-y-2 mt-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Secured JEE Mains 99.3rd percentile.</li>
                <li>Ranked within the top 100 projects at the NASA AMES Space Settlement Contest (2017).</li>
                <li>Solved 300+ (Medium to Hard) DSA problems on Leetcode.</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 flex items-center">
                <FaUsers className="mr-3 text-blue-600 dark:text-blue-400" /> POSITIONS OF RESPONSIBILITY
              </h3>
              <ul className="list-disc list-inside space-y-2 mt-2 pl-6 text-gray-700 dark:text-gray-300">
                <li>Member, Big Data, Analytics and Consulting Cell (BDACC), NIT Warangal (Aug 2022 - May 2023).</li>
                <li>Captain, Inter-NIT Volleyball Team, NIT Warangal (Aug 2022 - May 2023).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">SKILLS</h3>
              <p className="text-gray-700 dark:text-gray-300">
                A comprehensive list of technical skills including programming languages, web technologies, databases, AI/ML tools, 
                and more is available on the <a href="/skills" className="text-blue-500 hover:underline">Skills page</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ResumePage;

'use client';

import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaDownload, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ResumePage = () => {
  // Replace with your actual Google Drive resume link
  const resumeUrl = 'https://drive.google.com/file/d/YOUR_RESUME_FILE_ID/view';
  const resumeDownloadUrl = 'https://drive.google.com/uc?export=download&id=YOUR_RESUME_FILE_ID';

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
              <p className="text-gray-600 dark:text-gray-400">your.email@example.com | +1 (123) 456-7890 | San Francisco, CA</p>
              <p className="text-gray-600 dark:text-gray-400">github.com/yourusername | linkedin.com/in/yourusername</p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">SUMMARY</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Experienced software engineer with expertise in full-stack development, AI/ML, and data science.
                Passionate about building scalable applications and implementing machine learning solutions to solve complex problems.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">EDUCATION</h3>
              <div className="mb-3">
                <p className="font-bold text-gray-800 dark:text-gray-200">Master of Science in Computer Science</p>
                <p className="text-gray-700 dark:text-gray-300">Stanford University | 2018 - 2020</p>
                <p className="text-gray-600 dark:text-gray-400">GPA: 3.9/4.0 | Specialization in Artificial Intelligence</p>
              </div>

              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">Bachelor of Technology in Computer Science</p>
                <p className="text-gray-700 dark:text-gray-300">Indian Institute of Technology | 2014 - 2018</p>
                <p className="text-gray-600 dark:text-gray-400">GPA: 3.8/4.0 | Minor in Mathematics</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">EXPERIENCE</h3>

              <div className="mb-4">
                <p className="font-bold text-gray-800 dark:text-gray-200">Senior Software Engineer | Tech Innovations Inc.</p>
                <p className="italic text-gray-600 dark:text-gray-400 mb-2">Jan 2021 - Present</p>
                <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
                  <li>Developed and maintained microservices architecture using Node.js and Python</li>
                  <li>Implemented machine learning models for product recommendation system</li>
                  <li>Led a team of 5 engineers for the development of a new data pipeline</li>
                  <li>Reduced API response time by 40% through optimization techniques</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">Software Engineer | DataTech Solutions</p>
                <p className="italic text-gray-600 dark:text-gray-400 mb-2">Jun 2020 - Dec 2020</p>
                <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
                  <li>Built RESTful APIs using Express.js and MongoDB</li>
                  <li>Developed front-end components with React and Redux</li>
                  <li>Implemented CI/CD pipelines using GitHub Actions</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">PROJECTS</h3>

              <div className="mb-4">
                <p className="font-bold text-gray-800 dark:text-gray-200">AI-Powered Recommendation System</p>
                <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
                  <li>Developed a recommendation engine using collaborative filtering and deep learning</li>
                  <li>Achieved 25% improvement in recommendation accuracy</li>
                  <li>Technologies: Python, TensorFlow, Flask, MongoDB</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">Full-Stack E-commerce Platform</p>
                <ul className="list-disc ml-5 text-gray-700 dark:text-gray-300">
                  <li>Built a scalable e-commerce platform with microservices architecture</li>
                  <li>Implemented real-time inventory management and payment processing</li>
                  <li>Technologies: React, Node.js, Express, PostgreSQL, Docker</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">SKILLS</h3>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Languages:</span> Python, JavaScript, TypeScript, Java, SQL</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Frontend:</span> React, Next.js, HTML/CSS, Tailwind CSS, Redux</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Backend:</span> Node.js, Express, Django, Flask, GraphQL</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Databases:</span> MongoDB, PostgreSQL, MySQL, Redis</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">AI/ML:</span> TensorFlow, PyTorch, scikit-learn, NLP, Computer Vision</p>
              <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">DevOps:</span> Docker, Kubernetes, AWS, GCP, CI/CD</p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ResumePage;

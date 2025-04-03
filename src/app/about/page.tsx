'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGraduationCap, FaBriefcase, FaCode, FaLaptopCode, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-dark-lighter dark:text-light-darker">
            Software Engineer, AI/ML Engineer, and Data Scientist passionate about building innovative solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6">Hello, I&apos;m Anil</h2>
            <p className="mb-4">
              I&apos;m a passionate software engineer with expertise in full-stack development,
              artificial intelligence, machine learning, and data science. With a strong
              foundation in computer science and a keen eye for detail, I strive to create
              elegant solutions to complex problems.
            </p>
            <p className="mb-4">
              My journey in technology began with a fascination for how software can transform
              industries and improve lives. This curiosity led me to pursue a degree in Computer
              Science and subsequently specialize in AI and machine learning.
            </p>
            <p className="mb-6">
              When I&apos;m not coding, you can find me exploring new technologies, contributing to
              open-source projects, or sharing my knowledge through technical writing and mentoring.
            </p>

            <div className="mb-8">
              <motion.a
                href="/resume"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEye className="mr-2" /> View Resume/CV
              </motion.a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card flex flex-col items-center p-4">
                <FaGraduationCap className="text-4xl text-accent mb-2" />
                <h3 className="text-lg font-semibold">Education</h3>
                <p className="text-center text-dark-lighter dark:text-light-darker">
                  Computer Science Graduate
                </p>
              </div>

              <div className="card flex flex-col items-center p-4">
                <FaBriefcase className="text-4xl text-accent mb-2" />
                <h3 className="text-lg font-semibold">Experience</h3>
                <p className="text-center text-dark-lighter dark:text-light-darker">
                  5+ Years in Tech
                </p>
              </div>

              <div className="card flex flex-col items-center p-4">
                <FaCode className="text-4xl text-accent mb-2" />
                <h3 className="text-lg font-semibold">Projects</h3>
                <p className="text-center text-dark-lighter dark:text-light-darker">
                  20+ Completed
                </p>
              </div>

              <div className="card flex flex-col items-center p-4">
                <FaLaptopCode className="text-4xl text-accent mb-2" />
                <h3 className="text-lg font-semibold">Technologies</h3>
                <p className="text-center text-dark-lighter dark:text-light-darker">
                  15+ Mastered
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-accent">
              {/* Replace with your profile image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                Profile Image
              </div>
              {/* Uncomment when you have an image */}
              {/* <Image
                src="/images/profile.jpg"
                alt="Anil's Profile"
                fill
                style={{ objectFit: 'cover' }}
              /> */}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

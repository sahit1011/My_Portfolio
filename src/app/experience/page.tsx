'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
// import AnimatedHeading from '@/components/ui/AnimatedHeading';
import Button3D from '@/components/ui/Button3D';
import ShinyText from '@/components/ShinyText';
import ExpandingText from '@/components/ui/ExpandingText';

// Import content management utilities
import { getExperiences } from '@/utils/content';

export default function ExperiencePage() {
  // Get experiences from the centralized content management system
  const experiences = getExperiences();

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-16">
          {/* <p className="text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            My professional journey and the companies I&apos;ve had the pleasure to work with
          </p> */}
          <p className="text-xl max-w-3xl mx-auto">
            <ShinyText>
              My professional journey and the companies I&apos;ve had the pleasure to work with
            </ShinyText>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-pink-500"></div>

            {/* Experience items */}
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative mb-12 md:mb-24 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-auto md:mr-1/2' : 'md:pl-12 md:ml-1/2'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 border-4 border-white/20 dark:border-gray-900 shadow-lg z-10"></div>

                {/* Content */}
                <div className="ml-10 md:ml-0">
                  <Card3D
                    className="relative p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-200"
                    hoverScale={1.005}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    {/* Company name in top-right corner */}
                    <span className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-sm font-medium shadow-lg z-10">
                      {exp.company}
                    </span>
                    
                    <div className="mb-4 text-left" style={{ paddingRight: '140px' }}>
                      <div className="relative inline-block">
                        <ExpandingText
                          as="h3"
                          className="text-2xl font-bold"
                          gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                          expandScale={1.03}
                          letterSpacing="0.03em"
                          textShadow={true}
                          glowIntensity={0.4}
                        >
                          {exp.title}
                        </ExpandingText>
                        {/* Underline animation */}
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                      </div>
                    </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4 text-gray-300">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-400" />
                      {exp.period}
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-purple-400" />
                      {exp.location}
                    </div>
                  </div>

                  <ul className="list-disc list-outside pl-5 mb-4 text-gray-300 text-left space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full text-sm hover:scale-105 hover:border-purple-400/50 transition-all"
                      >
                        <span className="gradient-text">{tech}</span>
                      </span>
                    ))}
                  </div>
                  </Card3D>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="relative mb-4 inline-block">
            <ExpandingText
              as="h2"
              className="text-3xl font-bold"
              gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
              expandScale={1.03}
              letterSpacing="0.03em"
              textShadow={true}
              glowIntensity={0.4}
            >
              Looking for new opportunities
            </ExpandingText>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-300">
            <ShinyText speed={3}>
              I&apos;m always open to discussing new projects, opportunities, and collaborations.
            </ShinyText>
          </p>
          <Button3D
            href="/contact"
            variant="accent"
            size="lg"
            className="gradient-border"
          >
            Get in Touch
          </Button3D>
        </div>
      </section>
    </MainLayout>
  );
};

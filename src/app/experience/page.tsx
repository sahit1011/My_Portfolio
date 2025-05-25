'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
import AnimatedHeading from '@/components/ui/AnimatedHeading';
import Button3D from '@/components/ui/Button3D';

// Import content management utilities
import { getExperiences } from '@/utils/content';

export default function ExperiencePage() {
  // Get experiences from the centralized content management system
  const experiences = getExperiences();

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-16">
          <AnimatedHeading
            as="h1"
            className="mb-4 text-5xl font-bold"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            Work Experience
          </AnimatedHeading>
          <p className="text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            My professional journey and the companies I&apos;ve had the pleasure to work with
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-accent"></div>

            {/* Experience items */}
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative mb-12 md:mb-24 ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-auto md:mr-1/2' : 'md:pl-12 md:ml-1/2'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-accent border-4 border-light dark:border-dark"></div>

                {/* Content */}
                <div className="ml-10 md:ml-0">
                  <Card3D
                    className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    hoverScale={1.03}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
                      <AnimatedHeading
                        as="h3"
                        className="text-2xl font-bold"
                        staggerLetters={false}
                        gradientColors={['#3b82f6', '#8b5cf6']}
                      >
                        {exp.title}
                      </AnimatedHeading>
                      <span className="px-3 py-1 bg-accent text-white rounded-full text-sm">
                        {exp.company}
                      </span>
                    </div>

                  <div className="flex flex-col sm:flex-row gap-4 mb-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-accent" />
                      {exp.period}
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-accent" />
                      {exp.location}
                    </div>
                  </div>

                  <ul className="list-disc list-outside pl-5 mb-4 text-gray-700 dark:text-gray-300 text-left">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-light-darker dark:bg-dark-lighter rounded-full text-sm hover:scale-105 transition-transform"
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
          <AnimatedHeading
            as="h2"
            className="text-3xl font-bold mb-4"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            Looking for new opportunities
          </AnimatedHeading>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700 dark:text-gray-300">
            I&apos;m always open to discussing new projects, opportunities, and collaborations.
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

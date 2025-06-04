'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGithub, FaCode, FaProjectDiagram } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ExpandingText from '@/components/ui/ExpandingText';
import Button3D from '@/components/ui/Button3D';
import SkillTag3D from '@/components/ui/SkillTag3D';
import AnimatedHeading from '@/components/ui/AnimatedHeading';

// Import content management utilities
import { getProjects, getFeaturedProjects } from '@/utils/content';

export default function ProjectsPage() {
  // Get projects from the centralized content management system
  const projects = getProjects();
  const featuredProjects = getFeaturedProjects();
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <AnimatedHeading
            as="h1"
            className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            My Projects
          </AnimatedHeading>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            A showcase of my work, personal projects, and contributions
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <AnimatedHeading
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold inline-block"
              staggerLetters={true}
              underlineWidth={0}
              gradientColors={['#3b82f6', '#8b5cf6']}
            >
              Featured Projects
            </AnimatedHeading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProjects.map(project => (
              <Card3D
                key={project.id}
                className="overflow-hidden flex flex-col h-full bg-gray-100 dark:bg-gray-800 p-0 text-gray-800 dark:text-gray-100"
                hoverScale={1.03}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-400/80 to-purple-500/80 dark:from-blue-600/70 dark:to-purple-700/70 relative flex items-center justify-center">
                  <FaProjectDiagram className="text-white dark:text-gray-100 text-4xl sm:text-6xl opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20 dark:from-blue-900/30 dark:to-purple-900/30"></div>
                </div>

                <div className="p-4 sm:p-6 flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                  <ul className="text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    {project.description.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-accent mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <SkillTag3D
                          key={index}
                          className="text-xs"
                        >
                          {tech}
                        </SkillTag3D>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 pt-0 flex justify-center">
                  <Button3D
                    href={project.github}
                    variant="outline"
                    size="sm"
                    icon={<FaGithub />}
                    className="bg-transparent"
                  >
                    Code
                  </Button3D>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <div className="text-center mb-6 sm:mb-8">
            <AnimatedHeading
              as="h2"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold inline-block"
              staggerLetters={true}
              underlineWidth={0}
              gradientColors={['#3b82f6', '#8b5cf6']}
            >
              Other Projects
            </AnimatedHeading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {otherProjects.map(project => (
              <Card3D
                key={project.id}
                className="p-4 sm:p-6 flex flex-col h-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                hoverScale={1.02}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="flex items-center mb-4">
                  <FaCode className="text-accent text-xl sm:text-2xl mr-3 floating" />
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                </div>

                <ul className="text-gray-700 dark:text-gray-300 mb-4 flex-grow space-y-1">
                  {project.description.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent mr-2 mt-1 text-sm">•</span>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-4 max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <SkillTag3D
                        key={index}
                        className="text-xs"
                      >
                        {tech}
                      </SkillTag3D>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button3D
                    href={project.github}
                    variant="outline"
                    size="sm"
                    icon={<FaGithub />}
                    className="bg-transparent"
                  >
                    Code
                  </Button3D>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <AnimatedHeading
            as="h2"
            className="text-xl sm:text-2xl font-bold mb-4 inline-block"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            Interested in collaborating?
          </AnimatedHeading>
          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-6 text-gray-700 dark:text-gray-300">
            I&apos;m always looking for new projects and challenges. Let&apos;s build something amazing together!
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

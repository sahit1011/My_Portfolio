'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
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
        <div className="text-center mb-12">
          <AnimatedHeading
            as="h1"
            className="mb-4 text-5xl font-bold"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            My Projects
          </AnimatedHeading>
          <p className="text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
            A showcase of my work, personal projects, and contributions
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold inline-block"
              staggerLetters={true}
              underlineWidth={0}
              gradientColors={['#3b82f6', '#8b5cf6']}
            >
              Featured Projects
            </AnimatedHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <Card3D
                key={project.id}
                className="overflow-hidden flex flex-col h-full bg-gray-100 dark:bg-gray-800 p-0 text-gray-800 dark:text-gray-100"
                hoverScale={1.03}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-dark dark:text-light">
                    Project Image
                  </div>
                </div>

                <div className="p-6 flex-grow">
                  <ExpandingText
                    as="h3"
                    className="text-xl font-bold mb-2"
                    staggerChildren={true}
                    expandScale={1.02}
                    letterSpacing="0.01em"
                    gradientColors={['#3b82f6', '#8b5cf6']}
                  >
                    {project.title}
                  </ExpandingText>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
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

                <div className="p-6 pt-0 flex justify-between">
                  <Button3D
                    href={project.github}
                    variant="outline"
                    size="sm"
                    icon={<FaGithub />}
                    className="bg-transparent"
                  >
                    Code
                  </Button3D>
                  <Button3D
                    href={project.demo}
                    variant="accent"
                    size="sm"
                    icon={<FaExternalLinkAlt />}
                  >
                    Demo
                  </Button3D>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div>
          <div className="text-center mb-8">
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold inline-block"
              staggerLetters={true}
              underlineWidth={0}
              gradientColors={['#3b82f6', '#8b5cf6']}
            >
              Other Projects
            </AnimatedHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map(project => (
              <Card3D
                key={project.id}
                className="p-6 flex flex-col h-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                hoverScale={1.02}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="flex items-center mb-4">
                  <FaCode className="text-accent text-2xl mr-3 floating" />
                  <ExpandingText
                    as="h3"
                    className="text-xl font-bold"
                    staggerChildren={true}
                    expandScale={1.02}
                    letterSpacing="0.01em"
                    gradientColors={['#8b5cf6', '#ec4899']}
                  >
                    {project.title}
                  </ExpandingText>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <SkillTag3D
                      key={index}
                      className="text-xs"
                    >
                      {tech}
                    </SkillTag3D>
                  ))}
                  {project.technologies.length > 3 && (
                    <SkillTag3D className="text-xs">
                      +{project.technologies.length - 3} more
                    </SkillTag3D>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button3D
                    href={project.github}
                    variant="outline"
                    size="sm"
                    icon={<FaGithub />}
                    className="bg-transparent"
                  >
                    Code
                  </Button3D>
                  <Button3D
                    href={project.demo}
                    variant="accent"
                    size="sm"
                    icon={<FaExternalLinkAlt />}
                  >
                    Demo
                  </Button3D>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <AnimatedHeading
            as="h2"
            className="text-2xl font-bold mb-4 inline-block"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            Interested in collaborating?
          </AnimatedHeading>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700 dark:text-gray-300">
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

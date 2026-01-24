'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { FaGithub, FaPlay, FaTimes } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import SkillTag3D from '@/components/ui/SkillTag3D';
import ProjectCarousel from '@/components/ui/ProjectCarousel';
// import AnimatedHeading from '@/components/ui/AnimatedHeading';
import ShinyText from '@/components/ShinyText';
import ExpandingText from '@/components/ui/ExpandingText';

// Import content management utilities
import { getProjects, getFeaturedProjects } from '@/utils/content';

export default function ProjectsPage() {
  // Get projects from the centralized content management system
  const projects = getProjects();
  const featuredProjects = getFeaturedProjects();
  const otherProjects = projects.filter(project => !project.featured);

  // Video modal state
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoUrl: string; title: string; description: string[] }>({
    isOpen: false,
    videoUrl: '',
    title: '',
    description: []
  });

  const openVideoModal = (videoUrl: string, title: string, description: string[]) => {
    setVideoModal({ isOpen: true, videoUrl, title, description });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoUrl: '', title: '', description: [] });
  };

  return (
    <MainLayout>
      {/* Video Modal */}
      {videoModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/20">
              <h3 className="text-lg md:text-xl font-semibold text-gray-200">{videoModal.title}</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex justify-center">
                <div className="aspect-video max-h-[50vh] w-full max-w-4xl rounded-lg overflow-hidden border border-white/20">
                  {videoModal.videoUrl.includes('.mp4') ? (
                    <video
                      src={videoModal.videoUrl}
                      title={videoModal.title}
                      className="w-full h-full"
                      controls
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <iframe
                      src={videoModal.videoUrl}
                      title={videoModal.title}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  )}
                </div>
              </div>
              {videoModal.description && videoModal.description.length > 0 && (
                <div className="mt-6 max-w-4xl mx-auto">
                  <h4 className="text-lg font-semibold mb-3 text-gray-200 text-center">Project Description</h4>
                  <ul className="text-gray-300 space-y-2">
                    {videoModal.description.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="section container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-lg sm:text-xl max-w-3xl mx-auto">
            <ShinyText>
              A showcase of my work, personal projects, and contributions
            </ShinyText>
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block">
              <ExpandingText
                as="h2"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                expandScale={1.03}
                letterSpacing="0.03em"
                textShadow={true}
                glowIntensity={0.4}
              >
                Featured Projects
              </ExpandingText>
              {/* Underline animation */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-4 sm:px-0">
            {featuredProjects.map(project => (
              <Card3D
                key={project.id}
                className="overflow-hidden flex flex-col h-full bg-gray-100 dark:bg-gray-800 p-0 text-gray-800 dark:text-gray-100"
                hoverScale={1.03}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="h-40 sm:h-48 relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>

                <div className="p-4 sm:p-6 flex-grow">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                  {project.shortDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
                      {project.shortDescription}
                    </p>
                  )}
                </div>

                <div className="px-4 sm:px-6 mb-0">
                  <div className="max-h-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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

                <div className="p-4 sm:p-6 pt-0 flex justify-center gap-6 mt-4">
                  {project.demo && project.demo !== "#" && (
                    <Button3D
                      onClick={() => openVideoModal(project.demo!, project.title, project.description)}
                      variant="outline"
                      size="sm"
                      icon={<FaPlay />}
                      className="bg-transparent"
                    >
                      Watch Demo
                    </Button3D>
                  )}
                  <Button3D
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
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
        <div className="mt-32 sm:mt-36">
          <div className="text-center mb-8 sm:mb-12">
            <div className="relative inline-block">
              <ExpandingText
                as="h2"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                expandScale={1.03}
                letterSpacing="0.03em"
                textShadow={true}
                glowIntensity={0.4}
              >
                Other Projects
              </ExpandingText>
              {/* Underline animation */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>
          <ProjectCarousel
            projects={otherProjects}
            onVideoModalOpen={openVideoModal}
          />
        </div>

        <div className="text-center mt-12 sm:mt-16">
          <div className="relative mb-4 inline-block">
            <ExpandingText
              as="h2"
              className="text-xl sm:text-2xl font-bold"
              gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
              expandScale={1.03}
              letterSpacing="0.03em"
              textShadow={true}
              glowIntensity={0.4}
            >
              Interested in collaborating?
            </ExpandingText>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          </div>
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

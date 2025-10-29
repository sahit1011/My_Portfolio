'use client';

import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
import { FaGithub, FaPlay, FaChevronLeft, FaChevronRight, FaProjectDiagram } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import SkillTag3D from '@/components/ui/SkillTag3D';
import { Project } from '@/utils/content';

interface ProjectCarouselProps {
  projects: Project[];
  onVideoModalOpen: (videoUrl: string, title: string, description: string[]) => void;
}

export default function ProjectCarousel({ projects, onVideoModalOpen }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Update cards to show based on screen size
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 640) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };

    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(updateCardsToShow, 100);
    window.addEventListener('resize', updateCardsToShow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateCardsToShow);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + cardsToShow >= projects.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, projects.length - cardsToShow) : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const totalDots = Math.max(1, projects.length - cardsToShow + 1);
  const activeDotIndex = Math.min(currentIndex, totalDots - 1);

  // Sliding window for dots (show only 3 dots at a time)
  const dotWindowSize = 3;
  const startDot = Math.max(0, Math.min(totalDots - dotWindowSize, activeDotIndex - 1));
  const endDot = Math.min(totalDots - 1, startDot + dotWindowSize - 1);
  const visibleDots = Array.from({ length: endDot - startDot + 1 }, (_, i) => startDot + i);

  return (
    <div className="relative w-full px-4 sm:px-8 md:px-16">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out h-[550px] sm:h-[500px] md:h-[450px]"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className={`flex-shrink-0 px-3`}
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <Card3D
                className="p-4 sm:p-6 flex flex-col h-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                hoverScale={1.02}
                mouseIntensity={0}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3 border-2 border-accent">
                    <FaProjectDiagram className="text-white text-lg sm:text-xl" />
                  </div>
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

                <div className="flex justify-center gap-6">
                  {project.demo && project.demo !== "#" && (
                    <Button3D
                      onClick={() => onVideoModalOpen(project.demo!, project.title, project.description)}
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
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator and Navigation */}
      {projects.length > cardsToShow && (
        <div className="flex justify-center items-center mt-8 space-x-6">
          <button
            onClick={prevSlide}
            className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:scale-110"
            aria-label="Previous projects"
          >
            <FaChevronLeft className="text-gray-600 dark:text-gray-300" size={20} />
          </button>

          <div className="flex space-x-3">
            {visibleDots.map((index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === activeDotIndex
                    ? 'bg-blue-500 scale-125 shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 hover:scale-110'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:scale-110"
            aria-label="Next projects"
          >
            <FaChevronRight className="text-gray-600 dark:text-gray-300" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
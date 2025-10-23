'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  FaCode, FaServer, FaDatabase, FaTools, FaBrain,
  FaPython, FaJs, FaReact, FaHtml5, FaCss3Alt, FaNodeJs,
  FaDocker, FaGoogle, FaGithub, FaLaptopCode, FaChartBar,
  FaProjectDiagram, FaNetworkWired, FaMicrochip, FaCodeBranch,
  FaRobot, FaLanguage, FaGraduationCap, FaAws, FaCloud
} from 'react-icons/fa';
import {
  SiTypescript, SiNextdotjs, SiDjango, SiFlask,
  SiTensorflow, SiPytorch, SiScikitlearn,
  SiPandas, SiMongodb, SiPostgresql, SiKubernetes,
  SiMysql, SiCplusplus, SiSqlite, SiNumpy,
  SiFigma, SiRedis, SiHuggingface
} from 'react-icons/si';
import Card3D from '@/components/ui/Card3D';
// import AnimatedHeading from '@/components/ui/AnimatedHeading';
import Button3D from '@/components/ui/Button3D';
import ShinyText from '@/components/ShinyText';
import ExpandingText from '@/components/ui/ExpandingText';


// Import content management utilities
import { getSkills } from '@/utils/content';

// Icon mapping for skills
const iconMap: { [key: string]: React.ReactNode } = {
  // Programming Languages
  FaPython: <FaPython className="text-blue-400" size={24} />,
  SiCplusplus: <SiCplusplus className="text-blue-600" size={24} />,
  FaJs: <FaJs className="text-yellow-400" size={24} />,
  SiTypescript: <SiTypescript className="text-blue-500" size={24} />,
  FaDatabase: <FaDatabase className="text-green-400" size={24} />,
  FaLaptopCode: <FaLaptopCode className="text-orange-500" size={24} />,

  // Web Technologies
  FaHtml5: <FaHtml5 className="text-orange-500" size={24} />,
  FaCss3Alt: <FaCss3Alt className="text-blue-500" size={24} />,
  FaReact: <FaReact className="text-blue-400" size={24} />,
  SiNextdotjs: <SiNextdotjs className="text-black dark:text-white" size={24} />,
  FaNodeJs: <FaNodeJs className="text-green-500" size={24} />,
  SiDjango: <SiDjango className="text-green-700" size={24} />,
  SiFlask: <SiFlask className="text-gray-300" size={24} />,
  FaCodeBranch: <FaCodeBranch className="text-teal-400" size={24} />,

  // Databases & Cloud
  SiMysql: <SiMysql className="text-blue-700" size={24} />,
  SiPostgresql: <SiPostgresql className="text-blue-500" size={24} />,
  SiSqlite: <SiSqlite className="text-blue-400" size={24} />,
  SiMongodb: <SiMongodb className="text-green-500" size={24} />,
  SiRedis: <SiRedis className="text-red-500" size={24} />,
  FaDocker: <FaDocker className="text-blue-400" size={24} />,
  SiKubernetes: <SiKubernetes className="text-blue-500" size={24} />,
  FaGithub: <FaGithub className="text-gray-700" size={24} />,
  FaGoogle: <FaGoogle className="text-blue-400" size={24} />,
  FaAws: <FaAws className="text-orange-400" size={24} />,
  FaCloud: <FaCloud className="text-blue-300" size={24} />,

  // AI/ML
  SiTensorflow: <SiTensorflow className="text-orange-500" size={24} />,
  SiPytorch: <SiPytorch className="text-red-500" size={24} />,
  SiScikitlearn: <SiScikitlearn className="text-orange-400" size={24} />,
  SiHuggingface: <SiHuggingface className="text-yellow-400" size={24} />,
  SiPandas: <SiPandas className="text-blue-600" size={24} />,
  SiNumpy: <SiNumpy className="text-blue-500" size={24} />,
  FaChartBar: <FaChartBar className="text-green-500" size={24} />,
  FaBrain: <FaBrain className="text-purple-500" size={24} />,
  FaRobot: <FaRobot className="text-cyan-400" size={24} />,
  FaLanguage: <FaLanguage className="text-lime-400" size={24} />,
  FaGraduationCap: <FaGraduationCap className="text-orange-400" size={24} />,
  FaMicrochip: <FaMicrochip className="text-teal-400" size={24} />,

  // Developer Tools
  FaCode: <FaCode className="text-blue-600" size={24} />,
  SiFigma: <SiFigma className="text-purple-500" size={24} />,

  // Concepts & Systems
  FaServer: <FaServer className="text-gray-600" size={24} />,
  FaNetworkWired: <FaNetworkWired className="text-blue-600" size={24} />,
};

// Skills data based on content management
const getSkillCategories = () => {
  const skills = getSkills();

  return [
    {
      id: 1,
      title: 'Programming Languages',
      icon: <FaCode className="text-4xl text-purple-500 mb-4" />,
      skills: skills.programmingLanguages,
    },
    {
      id: 2,
      title: 'Developer Tools',
      icon: <FaTools className="text-4xl text-gray-500 mb-4" />,
      skills: skills.developerTools,
    },
    {
      id: 3,
      title: 'Concepts & Systems',
      icon: <FaProjectDiagram className="text-4xl text-teal-500 mb-4" />,
      skills: skills.conceptsAndSystems,
    },
    {
      id: 4,
      title: 'Web Technologies',
      icon: <FaLaptopCode className="text-4xl text-green-500 mb-4" />,
      skills: skills.webTechnologies,
    },
    {
      id: 5,
      title: 'Databases & Cloud',
      icon: <FaDatabase className="text-4xl text-blue-500 mb-4" />,
      skills: skills.databasesAndCloud,
    },
    {
      id: 6,
      title: 'AI & Machine Learning',
      icon: <FaBrain className="text-4xl text-pink-500 mb-4" />,
      skills: skills.aiMl,
    },
  ];
};

// Skill component with icon
const SkillItem = ({ name, iconName }: { name: string; iconName: string }) => {
  const icon = iconMap[iconName] || <FaCode className="text-gray-500" size={24} />;

  return (
    <div className="mb-3 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default function SkillsPage() {
  // Get skill categories from content management system
  const skillCategories = getSkillCategories();

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xl max-w-3xl mx-auto">
            <ShinyText>
              A comprehensive overview of my technical skills and expertise based on my resume.
            </ShinyText>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map(category => (
            <Card3D
              key={category.id}
              className="p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-full"
              hoverScale={1.03}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="text-center mb-6">
                {category.icon}
                <div className="relative inline-block">
                  <ExpandingText
                    as="h2"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.03}
                    letterSpacing="0.03em"
                    textShadow={true}
                    glowIntensity={0.4}
                  >
                    {category.title}
                  </ExpandingText>
                  {/* Underline animation */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
                </div>
              </div>

              <div>
                {category.skills.map((skill, index) => (
                  <SkillItem key={index} name={skill.name} iconName={skill.icon} />
                ))}
              </div>
            </Card3D>
          ))}
        </div>

        <div className="mt-16 text-center">
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
              Continuous Learning
            </ExpandingText>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700 dark:text-gray-300">
            I&apos;m constantly expanding my skill set and staying up-to-date with the latest technologies.
            {/* Original learning: Rust, WebAssembly, and advanced MLOps. Can be updated if needed. */}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button3D
              href="/projects"
              variant="primary"
              size="lg"
              className="gradient-border"
            >
              View My Projects
            </Button3D>
            <Button3D
              href="/contact"
              variant="outline"
              size="lg"
              className="gradient-border"
            >
              Get in Touch
            </Button3D>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

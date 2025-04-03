import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  FaCode, FaServer, FaDatabase, FaCloud, FaTools, FaBrain,
  FaPython, FaJs, FaJava,
  FaReact, FaHtml5, FaCss3Alt,
  FaNodeJs, FaDocker, FaAws, FaGoogle
} from 'react-icons/fa';
import {
  SiTypescript, SiNextdotjs, SiTailwindcss,
  SiDjango, SiFlask, SiExpress,
  SiTensorflow, SiPytorch, SiScikitlearn, SiHuggingface,
  SiPandas, SiNumpy, SiMongodb, SiPostgresql,
  SiKubernetes, SiRedux, SiGraphql, SiRedis, SiMysql
} from 'react-icons/si';

// Skills data
const skillCategories = [
  {
    id: 1,
    title: 'Frontend Development',
    icon: <FaCode className="text-4xl text-purple-500 mb-4" />,
    skills: [
      { name: 'React.js', icon: <FaReact className="text-blue-400" size={24} /> },
      { name: 'Next.js', icon: <SiNextdotjs className="text-gray-300" size={24} /> },
      { name: 'JavaScript', icon: <FaJs className="text-yellow-400" size={24} /> },
      { name: 'TypeScript', icon: <SiTypescript className="text-blue-500" size={24} /> },
      { name: 'HTML', icon: <FaHtml5 className="text-orange-500" size={24} /> },
      { name: 'CSS', icon: <FaCss3Alt className="text-blue-500" size={24} /> },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="text-cyan-400" size={24} /> },
      { name: 'Redux', icon: <SiRedux className="text-purple-600" size={24} /> },
    ],
  },
  {
    id: 2,
    title: 'Backend Development',
    icon: <FaServer className="text-4xl text-green-500 mb-4" />,
    skills: [
      { name: 'Node.js', icon: <FaNodeJs className="text-green-500" size={24} /> },
      { name: 'Express.js', icon: <SiExpress className="text-gray-400" size={24} /> },
      { name: 'Python', icon: <FaPython className="text-blue-400" size={24} /> },
      { name: 'Django', icon: <SiDjango className="text-green-700" size={24} /> },
      { name: 'Flask', icon: <SiFlask className="text-gray-300" size={24} /> },
      { name: 'RESTful APIs', icon: <FaServer className="text-teal-500" size={24} /> },
      { name: 'GraphQL', icon: <SiGraphql className="text-pink-600" size={24} /> },
      { name: 'Microservices', icon: <FaServer className="text-blue-500" size={24} /> },
    ],
  },
  {
    id: 3,
    title: 'Database & Data',
    icon: <FaDatabase className="text-4xl text-blue-500 mb-4" />,
    skills: [
      { name: 'MongoDB', icon: <SiMongodb className="text-green-500" size={24} /> },
      { name: 'PostgreSQL', icon: <SiPostgresql className="text-blue-500" size={24} /> },
      { name: 'MySQL', icon: <SiMysql className="text-blue-700" size={24} /> },
      { name: 'Redis', icon: <SiRedis className="text-red-500" size={24} /> },
      { name: 'SQL', icon: <FaDatabase className="text-green-400" size={24} /> },
      { name: 'Data Modeling', icon: <FaDatabase className="text-indigo-500" size={24} /> },
      { name: 'ETL Processes', icon: <FaDatabase className="text-orange-400" size={24} /> },
      { name: 'Data Analysis', icon: <FaDatabase className="text-blue-400" size={24} /> },
    ],
  },
  {
    id: 4,
    title: 'AI & Machine Learning',
    icon: <FaBrain className="text-4xl text-pink-500 mb-4" />,
    skills: [
      { name: 'TensorFlow', icon: <SiTensorflow className="text-orange-500" size={24} /> },
      { name: 'PyTorch', icon: <SiPytorch className="text-red-500" size={24} /> },
      { name: 'scikit-learn', icon: <SiScikitlearn className="text-orange-400" size={24} /> },
      { name: 'Hugging Face', icon: <SiHuggingface className="text-yellow-300" size={24} /> },
      { name: 'NLP', icon: <FaBrain className="text-green-400" size={24} /> },
      { name: 'Computer Vision', icon: <FaBrain className="text-blue-400" size={24} /> },
      { name: 'Deep Learning', icon: <FaBrain className="text-purple-400" size={24} /> },
      { name: 'Data Preprocessing', icon: <SiPandas className="text-blue-300" size={24} /> },
    ],
  },
  {
    id: 5,
    title: 'DevOps & Cloud',
    icon: <FaCloud className="text-4xl text-blue-400 mb-4" />,
    skills: [
      { name: 'Docker', icon: <FaDocker className="text-blue-400" size={24} /> },
      { name: 'Kubernetes', icon: <SiKubernetes className="text-blue-500" size={24} /> },
      { name: 'AWS', icon: <FaAws className="text-orange-400" size={24} /> },
      { name: 'GCP', icon: <FaGoogle className="text-blue-400" size={24} /> },
      { name: 'CI/CD', icon: <FaCloud className="text-green-500" size={24} /> },
      { name: 'Git', icon: <FaCode className="text-orange-600" size={24} /> },
      { name: 'Linux', icon: <FaCode className="text-yellow-600" size={24} /> },
      { name: 'Serverless', icon: <FaCloud className="text-purple-400" size={24} /> },
    ],
  },
  {
    id: 6,
    title: 'Tools & Methodologies',
    icon: <FaTools className="text-4xl text-gray-500 mb-4" />,
    skills: [
      { name: 'Agile/Scrum', icon: <FaTools className="text-blue-500" size={24} /> },
      { name: 'Jira', icon: <FaTools className="text-blue-400" size={24} /> },
      { name: 'Test-Driven Development', icon: <FaTools className="text-green-500" size={24} /> },
      { name: 'VS Code', icon: <FaTools className="text-blue-600" size={24} /> },
      { name: 'Postman', icon: <FaTools className="text-orange-500" size={24} /> },
      { name: 'Figma', icon: <FaTools className="text-purple-500" size={24} /> },
      { name: 'Problem Solving', icon: <FaTools className="text-yellow-500" size={24} /> },
      { name: 'Technical Writing', icon: <FaTools className="text-gray-500" size={24} /> },
    ],
  },
];

// Skill component with icon
const SkillItem = ({ name, icon }: { name: string; icon: React.ReactNode }) => {
  return (
    <div className="mb-3 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg hover:shadow-md transition-all duration-300">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
};

export default function SkillsPage() {
  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            My <span className="gradient-text">Skills</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-dark-lighter dark:text-light-darker">
            A comprehensive overview of my technical skills and expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map(category => (
            <div key={category.id} className="card">
              <div className="text-center mb-6">
                {category.icon}
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <div>
                {category.skills.map((skill, index) => (
                  <SkillItem key={index} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Continuous Learning</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-dark-lighter dark:text-light-darker">
            I'm constantly expanding my skill set and staying up-to-date with the latest technologies.
            Currently learning: Rust, WebAssembly, and advanced MLOps.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="/projects" className="btn btn-primary">
              View My Projects
            </a>
            <a href="/contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

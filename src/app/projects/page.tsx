import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGithub, FaExternalLinkAlt, FaCode } from 'react-icons/fa';

// Projects data
const projects = [
  {
    id: 1,
    title: 'AI-Powered Recommendation System',
    description: 'A machine learning-based recommendation system that analyzes user behavior to provide personalized content suggestions. Implemented using collaborative filtering and neural networks.',
    image: '/placeholder.jpg',
    technologies: ['Python', 'TensorFlow', 'Flask', 'React', 'MongoDB'],
    github: 'https://github.com/yourusername/recommendation-system',
    demo: 'https://demo-recommendation.example.com',
    featured: true,
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with features like product catalog, shopping cart, user authentication, payment processing, and order management.',
    image: '/placeholder.jpg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API'],
    github: 'https://github.com/yourusername/ecommerce-platform',
    demo: 'https://demo-ecommerce.example.com',
    featured: true,
  },
  {
    id: 3,
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex datasets with customizable charts, filters, and real-time updates. Designed for business intelligence applications.',
    image: '/placeholder.jpg',
    technologies: ['D3.js', 'React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/yourusername/data-dashboard',
    demo: 'https://demo-dashboard.example.com',
    featured: true,
  },
  {
    id: 4,
    title: 'Natural Language Processing API',
    description: 'A RESTful API for natural language processing tasks including sentiment analysis, entity recognition, and text classification using state-of-the-art models.',
    image: '/placeholder.jpg',
    technologies: ['Python', 'FastAPI', 'Hugging Face', 'Docker', 'Redis'],
    github: 'https://github.com/yourusername/nlp-api',
    demo: 'https://demo-nlp-api.example.com',
    featured: false,
  },
  {
    id: 5,
    title: 'Task Management Application',
    description: 'A productivity application for managing tasks, projects, and deadlines with features like drag-and-drop organization, reminders, and team collaboration.',
    image: '/placeholder.jpg',
    technologies: ['React', 'Redux', 'Firebase', 'Material UI', 'PWA'],
    github: 'https://github.com/yourusername/task-manager',
    demo: 'https://demo-task-manager.example.com',
    featured: false,
  },
  {
    id: 6,
    title: 'Blockchain Voting System',
    description: 'A secure and transparent voting system built on blockchain technology to ensure vote integrity and prevent fraud in elections.',
    image: '/placeholder.jpg',
    technologies: ['Solidity', 'Ethereum', 'Web3.js', 'React', 'Node.js'],
    github: 'https://github.com/yourusername/blockchain-voting',
    demo: 'https://demo-voting.example.com',
    featured: false,
  },
];

export default function ProjectsPage() {
  // Separate featured projects
  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-dark-lighter dark:text-light-darker">
            A showcase of my work, personal projects, and contributions
          </p>
        </div>
        
        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map(project => (
              <div key={project.id} className="card overflow-hidden flex flex-col h-full transform transition-transform hover:scale-105">
                <div className="h-48 bg-gray-300 dark:bg-gray-700 relative">
                  {/* Replace with actual project image */}
                  <div className="absolute inset-0 flex items-center justify-center text-dark dark:text-light">
                    Project Image
                  </div>
                  {/* Uncomment when you have images */}
                  {/* <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  /> */}
                </div>
                
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-dark-lighter dark:text-light-darker mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-light-darker dark:bg-dark-lighter rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 pt-0 flex justify-between">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-accent hover:text-accent-dark transition-colors"
                  >
                    <FaGithub className="mr-1" /> Code
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-accent hover:text-accent-dark transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-1" /> Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Other Projects */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Other Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map(project => (
              <div key={project.id} className="card p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <FaCode className="text-accent text-2xl mr-3" />
                  <h3 className="text-xl font-bold">{project.title}</h3>
                </div>
                
                <p className="text-dark-lighter dark:text-light-darker mb-4 flex-grow">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-light-darker dark:bg-dark-lighter rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-light-darker dark:bg-dark-lighter rounded-full text-xs">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-accent hover:text-accent-dark transition-colors"
                  >
                    <FaGithub className="mr-1" /> Code
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-accent hover:text-accent-dark transition-colors"
                  >
                    <FaExternalLinkAlt className="mr-1" /> Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Interested in collaborating?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-dark-lighter dark:text-light-darker">
            I'm always looking for new projects and challenges. Let's build something amazing together!
          </p>
          <a href="/contact" className="btn btn-accent">
            Get in Touch
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

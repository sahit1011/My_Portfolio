import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Experience data
const experiences = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Innovators Inc.',
    location: 'San Francisco, CA',
    period: 'Jan 2022 - Present',
    description: [
      'Led the development of a machine learning platform that increased prediction accuracy by 35%',
      'Architected and implemented microservices using Node.js, Express, and MongoDB',
      'Mentored junior developers and conducted code reviews to ensure code quality',
      'Collaborated with product managers to define and implement new features',
    ],
    technologies: ['React', 'Node.js', 'Python', 'TensorFlow', 'AWS', 'Docker'],
  },
  {
    id: 2,
    title: 'AI/ML Engineer',
    company: 'DataMind Solutions',
    location: 'Boston, MA',
    period: 'Mar 2020 - Dec 2021',
    description: [
      'Developed and deployed machine learning models for natural language processing',
      'Created data pipelines for efficient data processing and model training',
      'Implemented recommendation systems that improved user engagement by 28%',
      'Collaborated with cross-functional teams to integrate AI solutions into existing products',
    ],
    technologies: ['Python', 'PyTorch', 'scikit-learn', 'Pandas', 'SQL', 'GCP'],
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebSphere Technologies',
    location: 'Austin, TX',
    period: 'Jun 2018 - Feb 2020',
    description: [
      'Built responsive web applications using React and Node.js',
      'Designed and implemented RESTful APIs for client-server communication',
      'Optimized database queries resulting in 40% faster page load times',
      'Participated in agile development processes including daily stand-ups and sprint planning',
    ],
    technologies: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
  },
];

export default function ExperiencePage() {
  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="mb-4">
            Work <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-dark-lighter dark:text-light-darker">
            My professional journey and the companies I've had the pleasure to work with
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
                <div className="ml-10 md:ml-0 card">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4">
                    <h3 className="text-2xl font-bold">{exp.title}</h3>
                    <span className="px-3 py-1 bg-accent text-white rounded-full text-sm">
                      {exp.company}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-4 text-dark-lighter dark:text-light-darker">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-accent" />
                      {exp.period}
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-accent" />
                      {exp.location}
                    </div>
                  </div>
                  
                  <ul className="list-disc list-inside mb-4 space-y-2 text-dark-lighter dark:text-light-darker">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-light-darker dark:bg-dark-lighter rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Looking for new opportunities</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-dark-lighter dark:text-light-darker">
            I'm always open to discussing new projects, opportunities, and collaborations.
          </p>
          <a href="/contact" className="btn btn-accent">
            Get in Touch
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

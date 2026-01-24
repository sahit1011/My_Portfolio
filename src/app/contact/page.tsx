'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import ExpandingText from '@/components/ui/ExpandingText';
import ShinyText from '@/components/ShinyText';
import SpotlightCard from '@/components/SpotLightCard';

// Import content management utilities
import {
  getPersonalInfo,
  getContactInfo,
  getGithubUrl,
  getLinkedinUrl
} from '@/utils/content';

export default function ContactPage() {
  // Get content from the centralized content management system
  const personalInfo = getPersonalInfo();
  const contactInfo = getContactInfo();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus({
        success: false,
        message: 'There was an error sending your message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <ExpandingText
              as="h1"
              className="text-4xl md:text-5xl font-bold"
              gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
              expandScale={1.03}
              letterSpacing="0.03em"
              textShadow={true}
              glowIntensity={0.4}
            >
              Get in Touch
            </ExpandingText>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          <p className="text-xl max-w-3xl mx-auto text-gray-300">
            <ShinyText speed={3}>
              Have a question or want to work together? Feel free to contact me!
            </ShinyText>
          </p>
        </div>

        {/* Wrapper for the two-column layout, centered with max-width */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column: Contact Information Block */}
            <div className="space-y-6">
              <Card3D
                className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
                hoverScale={1.005}
                gradientShadow={false}
                glowOnHover={false}
              >
                <div className="relative inline-block mb-6">
                  <ExpandingText
                    as="h2"
                    className="text-2xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    Contact Information
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>
                
                <div className="space-y-6">
                  <Card3D
                    className="p-4 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
                    hoverScale={1.003}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded-full text-white shrink-0">
                        <FaEnvelope />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Email</h3>
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
                          title="Open in Gmail"
                        >
                          {personalInfo.email}
                        </a>
                      </div>
                    </div>
                  </Card3D>

                  <Card3D
                    className="p-4 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
                    hoverScale={1.003}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-3 rounded-full text-white shrink-0">
                        <FaPhone />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Phone</h3>
                        <p className="text-gray-300">{personalInfo.phone}</p>
                      </div>
                    </div>
                  </Card3D>

                  <Card3D
                    className="p-4 bg-white/5 dark:bg-white/3 backdrop-blur-sm border border-white/10 rounded-lg"
                    hoverScale={1.003}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-teal-400 to-green-500 p-3 rounded-full text-white shrink-0">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Location</h3>
                        <p className="text-gray-300">{personalInfo.location}</p>
                      </div>
                    </div>
                  </Card3D>
                </div>
              </Card3D>

              <Card3D
                className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
                hoverScale={1.005}
                gradientShadow={false}
                glowOnHover={false}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Connect with me</h3>
                <div className="flex gap-4">
                  <Card3D
                    className="inline-block"
                    hoverScale={1.1}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <a
                      href={getGithubUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 p-4 rounded-full text-gray-300 hover:text-white transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaGithub size={24} />
                    </a>
                  </Card3D>
                  <Card3D
                    className="inline-block"
                    hoverScale={1.1}
                    gradientShadow={false}
                    glowOnHover={false}
                  >
                    <a
                      href={getLinkedinUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 p-4 rounded-full text-gray-300 hover:text-white transition-colors duration-300 flex items-center justify-center"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  </Card3D>
                </div>
              </Card3D>

              <SpotlightCard
                className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Available for</h3>
                <ul className="space-y-2 text-gray-300">
                  {contactInfo.availability.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </div>

            {/* Right Column: Contact Form */}
            <Card3D
              className="p-6 md:p-8 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
              hoverScale={1.005}
              gradientShadow={false}
              glowOnHover={false}
            >
              <div className="relative inline-block mb-6">
                <ExpandingText
                  as="h2"
                  className="text-2xl font-bold"
                  gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                  expandScale={1.02}
                >
                  Send Me a Message
                </ExpandingText>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>

              {submitStatus && (
                <div className={`p-4 mb-6 rounded-lg backdrop-blur-sm border ${
                  submitStatus.success 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-200">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-200">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium text-gray-200">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-gray-800">Select a subject</option>
                    <option value="Job Opportunity" className="bg-gray-800">Job Opportunity</option>
                    <option value="Project Inquiry" className="bg-gray-800">Project Inquiry</option>
                    <option value="Collaboration" className="bg-gray-800">Collaboration</option>
                    <option value="Other" className="bg-gray-800">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-200">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    placeholder="Hello, I'd like to talk about..."
                  ></textarea>
                </div>
                <Button3D
                  type="submit"
                  disabled={isSubmitting}
                  variant="accent"
                  size="lg"
                  fullWidth
                  className="gradient-border"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button3D>
              </form>
            </Card3D>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

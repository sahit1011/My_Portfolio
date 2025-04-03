'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function ContactPage() {
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

    // Simulate form submission
    try {
      // In a real application, you would send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitStatus({
        success: true,
        message: 'Your message has been sent successfully! I will get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
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
          <h1 className="mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-dark-lighter dark:text-light-darker">
            Have a question or want to work together? Feel free to contact me!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-accent p-3 rounded-full text-white mr-4">
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-dark-lighter dark:text-light-darker">your.email@example.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent p-3 rounded-full text-white mr-4">
                  <FaPhone />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-dark-lighter dark:text-light-darker">+1 (123) 456-7890</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-accent p-3 rounded-full text-white mr-4">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Location</h3>
                  <p className="text-dark-lighter dark:text-light-darker">San Francisco, CA</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Connect with me</h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light-dark dark:bg-dark-light p-3 rounded-full text-dark dark:text-light hover:text-accent transition-colors duration-300"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="https://linkedin.com/in/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light-dark dark:bg-dark-light p-3 rounded-full text-dark dark:text-light hover:text-accent transition-colors duration-300"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-light-dark dark:bg-dark-light p-3 rounded-full text-dark dark:text-light hover:text-accent transition-colors duration-300"
                >
                  <FaTwitter size={24} />
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-light-dark dark:bg-dark-light rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Available for</h3>
              <ul className="list-disc list-inside space-y-2 text-dark-lighter dark:text-light-darker">
                <li>Full-time positions</li>
                <li>Contract work</li>
                <li>Freelance projects</li>
                <li>Consulting</li>
                <li>Speaking engagements</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send Me a Message</h2>

            {submitStatus && (
              <div className={`p-4 mb-6 rounded-lg ${
                submitStatus.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-dark dark:bg-dark-light border border-light-darker dark:border-dark-lighter focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-dark dark:bg-dark-light border border-light-darker dark:border-dark-lighter focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-2 font-medium">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-light-dark dark:bg-dark-light border border-light-darker dark:border-dark-lighter focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select a subject</option>
                  <option value="Job Opportunity">Job Opportunity</option>
                  <option value="Project Inquiry">Project Inquiry</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-light-dark dark:bg-dark-light border border-light-darker dark:border-dark-lighter focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Hello, I'd like to talk about..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-accent w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

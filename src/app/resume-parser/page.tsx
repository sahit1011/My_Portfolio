'use client';

import React, { useState, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaTimes, FaLink, FaFileUpload, FaFileAlt, FaClipboard, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { analyzeJobDescription } from '@/utils/geminiApi';

type InputMethod = 'text' | 'url' | 'file';

export default function ResumeParserPage() {
  // Input method state
  const [activeTab, setActiveTab] = useState<InputMethod>('text');

  // Job description states
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isUrlFetching, setIsUrlFetching] = useState(false);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results state
  const [results, setResults] = useState<{
    overallMatch: number;
    skillsMatch: Array<{ skill: string; match: number; required: boolean }>;
    missingSkills: string[];
    candidateSummary: string;
    recommendedProjects: Array<{
      id: number;
      title: string;
      description: string;
      skills: string[];
      image: string;
      link: string;
      github: string;
      relevanceScore?: number;
    }>;
  } | null>(null);

  // Function to fetch job description from URL
  const fetchFromUrl = async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return null;
    }

    setIsUrlFetching(true);
    setError(null);

    try {
      const response = await fetch('/api/fetch-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job description from URL');
      }

      const data = await response.json();
      return data.text;
    } catch (err) {
      setError('Failed to fetch job description from URL. Please check the URL and try again.');
      console.error(err);
      return null;
    } finally {
      setIsUrlFetching(false);
    }
  };

  // Function to extract text from uploaded file
  const extractFromFile = async (file: File) => {
    if (!file) {
      setError('Please upload a file');
      return null;
    }

    setIsFileProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-file-text', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to extract text from file');
      }

      const data = await response.json();
      return data.text;
    } catch (err) {
      setError('Failed to extract text from file. Please try a different file or input method.');
      console.error(err);
      return null;
    } finally {
      setIsFileProcessing(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setJobDescriptionFile(files[0]);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setJobDescriptionFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Main submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let textToAnalyze = '';

    setIsLoading(true);
    setError(null);

    try {
      // Get text based on active tab
      switch (activeTab) {
        case 'text':
          if (!jobDescription.trim()) {
            setError('Please enter a job description');
            setIsLoading(false);
            return;
          }
          textToAnalyze = jobDescription;
          break;

        case 'url':
          if (!jobDescriptionUrl.trim()) {
            setError('Please enter a URL');
            setIsLoading(false);
            return;
          }
          const urlText = await fetchFromUrl(jobDescriptionUrl);
          if (!urlText) {
            setIsLoading(false);
            return;
          }
          textToAnalyze = urlText;
          break;

        case 'file':
          if (!jobDescriptionFile) {
            setError('Please upload a file');
            setIsLoading(false);
            return;
          }
          const fileText = await extractFromFile(jobDescriptionFile);
          if (!fileText) {
            setIsLoading(false);
            return;
          }
          textToAnalyze = fileText;
          break;
      }

      // Call our utility function to analyze the job description
      const analysisResult = await analyzeJobDescription(textToAnalyze);
      setResults(analysisResult);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">AI Resume Match Analyzer</h1>
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            Recruiters: Paste your job description below to see how well Anil Sahith&apos;s profile matches your requirements.
            Our AI will analyze the job description and provide insights on skill match and overall fit.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            {/* Tabs for different input methods */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                type="button"
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'text' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('text')}
              >
                <FaClipboard className="mr-2" /> Paste Text
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'url' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('url')}
              >
                <FaLink className="mr-2" /> Enter URL
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg ${activeTab === 'file' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('file')}
              >
                <FaFileUpload className="mr-2" /> Upload File
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Text Input Tab */}
              {activeTab === 'text' && (
                <div className="mb-6">
                  <label htmlFor="jobDescription" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono whitespace-pre-wrap"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                </div>
              )}

              {/* URL Input Tab */}
              {activeTab === 'url' && (
                <div className="mb-6">
                  <label htmlFor="jobDescriptionUrl" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Job Posting URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="jobDescriptionUrl"
                      name="jobDescriptionUrl"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      placeholder="https://www.linkedin.com/jobs/view/..."
                      value={jobDescriptionUrl}
                      onChange={(e) => setJobDescriptionUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                      onClick={async () => {
                        if (!jobDescriptionUrl.trim()) {
                          setError('Please enter a URL');
                          return;
                        }
                        const text = await fetchFromUrl(jobDescriptionUrl);
                        if (text) {
                          setJobDescription(text);
                          setActiveTab('text');
                        }
                      }}
                      disabled={isUrlFetching}
                    >
                      {isUrlFetching ? (
                        <>
                          <FaSpinner className="animate-spin mr-2 inline" /> Fetching...
                        </>
                      ) : (
                        'Fetch'
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Enter the URL of a job posting (works with LinkedIn, Indeed, and other major job sites)
                  </p>
                </div>
              )}

              {/* File Upload Tab */}
              {activeTab === 'file' && (
                <div className="mb-6">
                  <label htmlFor="jobDescriptionFile" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    Upload Job Description File
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('jobDescriptionFile')?.click()}
                  >
                    <input
                      type="file"
                      id="jobDescriptionFile"
                      name="jobDescriptionFile"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                    />

                    {jobDescriptionFile ? (
                      <div className="flex items-center justify-center">
                        <FaFileAlt className="text-blue-500 text-2xl mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">{jobDescriptionFile.name}</span>
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setJobDescriptionFile(null);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaFileUpload className="text-gray-400 text-4xl mx-auto mb-2" />
                        <p className="text-gray-700 dark:text-gray-300">Drag and drop a file here, or click to select a file</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports PDF, Word documents, and text files</p>
                      </>
                    )}

                    {isFileProcessing && (
                      <div className="mt-4">
                        <FaSpinner className="animate-spin text-blue-500 mx-auto" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Processing file...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center">
                  <FaTimes className="mr-2" /> {error}
                </div>
              )}

              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center w-1/2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading || isUrlFetching || isFileProcessing}
                >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Analyzing...
                  </>
                ) : (
                  <>
                    <FaUpload className="mr-2" /> Check Profile Match
                  </>
                )}
                </motion.button>
              </div>
            </form>
          </div>

          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Analysis Results</h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Overall Candidate Compatibility</h3>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 dark:text-gray-300 italic">&quot;{results.candidateSummary}&quot;</p>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-2">
                    <div
                      className={`h-4 rounded-full ${
                        results.overallMatch >= 80 ? 'bg-green-500' :
                        results.overallMatch >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${results.overallMatch}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-bold">{results.overallMatch}%</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Skill Matches</h3>
                <div className="grid grid-cols-2 gap-4">
                  {results.skillsMatch
                    .filter((skill) => skill.match >= 70)
                    .map((skill, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="font-medium">
                          {skill.skill} {skill.required && <span className="text-xs text-blue-500">(Required)</span>}
                        </span>
                      </div>
                  ))}
                </div>
              </div>

              {results.missingSkills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Skills Not Found in Profile</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.missingSkills.map((skill: string, index: number) => (
                      <li key={index} className="text-red-500 dark:text-red-400">{skill}</li>
                    ))}
                  </ul>
                </div>
              )}



              <div>
                <h3 className="text-xl font-semibold mb-4">Hiring Insights</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Based on the analysis, Anil Sahith is a
                  <span className={`font-bold ${results.overallMatch >= 80 ? 'text-green-600 dark:text-green-400' :
                    results.overallMatch >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'}`}>
                    {results.overallMatch >= 85 ? ' excellent ' :
                     results.overallMatch >= 75 ? ' strong ' :
                     results.overallMatch >= 65 ? ' good ' :
                     results.overallMatch >= 50 ? ' potential ' : ' limited '}
                  </span>
                  match for this position with an overall compatibility score of {results.overallMatch}%.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {results.overallMatch >= 80 ?
                    'The candidate has most of the required skills and experience for this role.' :
                    results.overallMatch >= 60 ?
                    'The candidate has many of the required skills but may need some training in specific areas.' :
                    'The candidate may require significant training or may not be the best fit for this specific role.'}
                </p>
              </div>

              {/* Recommended Projects Section */}
              {results.recommendedProjects && results.recommendedProjects.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-6">Relevant Projects to Review</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Based on the job requirements, here are some of Anil Sahith&apos;s projects that showcase relevant skills:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.recommendedProjects.map((project) => (
                      <div key={project.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden shadow-md">
                        <div className="p-5">
                          <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies:</h5>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-gray-900 dark:skill-tag-gradient text-blue-800 dark:text-blue-300 rounded text-xs border border-transparent dark:border-blue-900/50 transition-colors"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between mt-4">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <FaExternalLinkAlt className="mr-1" size={12} /> View Project
                            </a>
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:underline"
                            >
                              <FaGithub className="mr-1" size={14} /> Source Code
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}



'use client';

import React, { useState, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUpload,
  FaSpinner,
  FaTimes,
  FaLink,
  FaFileUpload,
  FaFileAlt,
  FaClipboard,
  FaGithub,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaLightbulb,
  FaStar,
  FaCode,
  FaDownload,
  FaPrint,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
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
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    skills: true,
    missing: true,
    projects: true,
    insights: true
  });

  // Results state
  const [results, setResults] = useState<{
    overallMatch: number;
    matchBreakdown: {
      technicalSkills: number;
      experienceLevel: number;
      locationPreference: number;
      projectRelevance: number;
    };
    warnings: string[];
    skillsMatch: Array<{ skill: string; match: number; required: boolean }>;
    missingSkills: string[];
    candidateSummary: string;
    recommendedProjects: Array<{
      id: number;
      title: string;
      description: string | string[];
      image: string;
      github: string;
      relevanceScore?: number;
    }>;
  } | null>(null);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get match level color and label
  const getMatchLevel = (score: number) => {
    if (score >= 85) return { label: 'Excellent Match', color: 'green', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-500' };
    if (score >= 75) return { label: 'Strong Match', color: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500' };
    if (score >= 65) return { label: 'Good Match', color: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-500' };
    if (score >= 50) return { label: 'Potential Match', color: 'orange', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-500' };
    return { label: 'Limited Match', color: 'red', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-500' };
  };

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

  const matchLevel = results ? getMatchLevel(results.overallMatch) : null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
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
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${activeTab === 'text' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('text')}
              >
                <FaClipboard className="mr-2" /> Paste Text
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${activeTab === 'url' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('url')}
              >
                <FaLink className="mr-2" /> Enter URL
              </button>
              <button
                type="button"
                className={`flex items-center px-4 py-2 font-medium text-sm rounded-t-lg transition-all ${activeTab === 'file' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
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
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-all"
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center"
                >
                  <FaTimes className="mr-2" /> {error}
                </motion.div>
              )}

              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center w-1/2 shadow-lg hover:shadow-xl transition-shadow"
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

          <AnimatePresence>
            {results && matchLevel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Header with Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete profile analysis for your job opening</p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      onClick={() => window.print()}
                    >
                      <FaPrint /> Print
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload /> Export PDF
                    </motion.button>
                  </div>
                </div>

                {/* Overall Match Score - Hero Section */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`bg-gradient-to-br from-${matchLevel.color}-50 to-${matchLevel.color}-100 dark:from-gray-800 dark:to-gray-800 rounded-lg shadow-lg p-8`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${matchLevel.bg} flex items-center justify-center`}>
                        {results.overallMatch >= 75 ? (
                          <FaCheckCircle className={`text-3xl ${matchLevel.text}`} />
                        ) : results.overallMatch >= 60 ? (
                          <FaExclamationTriangle className={`text-3xl ${matchLevel.text}`} />
                        ) : (
                          <FaTimesCircle className={`text-3xl ${matchLevel.text}`} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{matchLevel.label}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Overall Candidate Compatibility</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-6xl font-bold ${matchLevel.text}`}>{results.overallMatch}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Match Score</div>
                    </div>
                  </div>

                  {/* Match Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{results.matchBreakdown.technicalSkills}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tech Skills Match</div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{results.matchBreakdown.experienceLevel}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Experience Level Match</div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{results.matchBreakdown.locationPreference}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Location & Work Pref Match</div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{results.matchBreakdown.projectRelevance}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Project Portfolio Relevance</div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Summary */}
                  <div className={`${matchLevel.bg} rounded-lg p-4 border ${matchLevel.border}`}>
                    <div className="flex items-start gap-3">
                      <FaLightbulb className={`text-xl ${matchLevel.text} mt-1 flex-shrink-0`} />
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">&quot;{results.candidateSummary}&quot;</p>
                    </div>
                  </div>
                </motion.div>

                {/* Skills Match Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('skills')}
                    className="w-full p-6 flex justify-between items-center transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 text-2xl" />
                      <div className="text-left">
                        <h3 className="text-xl font-bold">Matched Skills</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {results.skillsMatch.filter(s => s.match >= 70).length} skills match your requirements
                        </p>
                      </div>
                    </div>
                    {expandedSections.skills ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  <AnimatePresence>
                    {expandedSections.skills && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.skillsMatch
                            .filter((skill) => skill.match >= 70)
                            .sort((a, b) => b.match - a.match)
                            .map((skill, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 rounded-lg p-4 border border-green-200 dark:border-green-800"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-gray-800 dark:text-gray-100">{skill.skill.replace(/\b\w/g, l => l.toUpperCase())}</span>
                                  {skill.required && (
                                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Required</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <FaStar
                                      key={i}
                                      className={`text-sm ${
                                        i < Math.round((skill.match / 100) * 5)
                                          ? 'text-yellow-500'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Missing Skills Section */}
                {results.missingSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection('missing')}
                      className="w-full p-6 flex justify-between items-center transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                        <div className="text-left">
                          <h3 className="text-xl font-bold">Skills Gap Analysis</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.missingSkills.length} skills not found in current profile
                          </p>
                        </div>
                      </div>
                      {expandedSections.missing ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    <AnimatePresence>
                      {expandedSections.missing && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                These skills were mentioned in your job description but not prominently featured in the candidate&apos;s profile. 
                                Consider discussing these during the interview or as training opportunities.
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {results.missingSkills.map((skill: string, index: number) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                                >
                                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                  <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Recommended Projects Section */}
                {results.recommendedProjects && results.recommendedProjects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection('projects')}
                      className="w-full p-6 flex justify-between items-center transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FaCode className="text-purple-500 text-2xl" />
                        <div className="text-left">
                          <h3 className="text-xl font-bold">Relevant Projects Portfolio</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {results.recommendedProjects.length} projects showcase relevant skills for this role
                          </p>
                        </div>
                      </div>
                      {expandedSections.projects ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    <AnimatePresence>
                      {expandedSections.projects && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="p-6">
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                These projects demonstrate the candidate&apos;s practical experience with technologies and skills relevant to your job opening.
                                Review these to understand their hands-on capabilities.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {results.recommendedProjects.map((project, idx) => (
                                <motion.div
                                  key={project.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-600"
                                >
                                  {project.relevanceScore && (
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 flex items-center justify-between">
                                      <span className="text-white text-sm font-semibold flex items-center gap-2">
                                        <FaStar /> Relevance Score
                                      </span>
                                      <span className="text-white text-lg font-bold">{project.relevanceScore}%</span>
                                    </div>
                                  )}
                                  
                                  <div className="p-6">
                                    <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">{project.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                      {Array.isArray(project.description) ? project.description.join(' ') : project.description}
                                    </p>

                                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                                      <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
                                      >
                                        <FaGithub size={14} /> View Source Code
                                      </a>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Hiring Insights Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('insights')}
                    className="w-full p-6 flex justify-between items-center transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaChartBar className="text-blue-500 text-2xl" />
                      <div className="text-left">
                        <h3 className="text-xl font-bold">Hiring Recommendation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          AI-powered insights and next steps
                        </p>
                      </div>
                    </div>
                    {expandedSections.insights ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  <AnimatePresence>
                    {expandedSections.insights && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-6">
                          <div className={`${matchLevel.bg} border-l-4 ${matchLevel.border} rounded-lg p-6 mb-6`}>
                            <div className="flex items-start gap-4">
                              <FaLightbulb className={`text-2xl ${matchLevel.text} mt-1 flex-shrink-0`} />
                              <div>
                                <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Overall Assessment</h4>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                  Anil Sahith is a
                                  <span className={`font-bold ${matchLevel.text}`}>
                                    {results.overallMatch >= 85 ? ' excellent ' :
                                     results.overallMatch >= 75 ? ' strong ' :
                                     results.overallMatch >= 65 ? ' good ' :
                                     results.overallMatch >= 50 ? ' potential ' : ' limited '}
                                  </span>
                                  match for this position with an overall compatibility score of <span className="font-bold">{results.overallMatch}%</span>.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {results.overallMatch >= 80 ?
                                    'The candidate demonstrates strong alignment with most required skills and would likely excel in this role with minimal onboarding time.' :
                                    results.overallMatch >= 60 ?
                                    'The candidate shows solid foundational skills and could succeed in this role with targeted training in specific areas identified in the skills gap analysis.' :
                                    'While the candidate has valuable skills, there may be a significant learning curve for this specific role. Consider if training resources are available or if alternative roles might be a better fit.'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Warnings Section */}
                          {results.warnings && results.warnings.length > 0 && (
                            <div className="mb-6">
                              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <FaExclamationTriangle className="text-orange-600 dark:text-orange-400 text-xl mt-1 flex-shrink-0" />
                                  <div>
                                    <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Important Considerations</h5>
                                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                                      {results.warnings.map((warning, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                          <span className="text-orange-500 mt-1">•</span>
                                          <span>{warning}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 mb-2">
                                <FaCheckCircle className="text-green-600 dark:text-green-400" />
                                <h5 className="font-semibold text-gray-800 dark:text-gray-100">Strengths</h5>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {results.skillsMatch.filter(s => s.match >= 70).length} matched skills with proven project experience
                              </p>
                            </div>

                            {results.missingSkills.length > 0 && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400" />
                                  <h5 className="font-semibold text-gray-800 dark:text-gray-100">Consider</h5>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {results.missingSkills.length} skills may require training or verification during interview
                                </p>
                              </div>
                            )}

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 mb-2">
                                <FaStar className="text-blue-600 dark:text-blue-400" />
                                <h5 className="font-semibold text-gray-800 dark:text-gray-100">Next Steps</h5>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {results.overallMatch >= 75 ? 'Schedule interview' : results.overallMatch >= 60 ? 'Technical assessment' : 'Additional screening'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </MainLayout>
  );
}

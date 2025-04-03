'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import { analyzeJobDescription } from '@/utils/geminiApi';

export default function ResumeParserPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our utility function to analyze the job description
      const analysisResult = await analyzeJobDescription(jobDescription);
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
            Recruiters: Paste your job description below to see how well Anil Sahith's profile matches your requirements.
            Our AI will analyze the job description and provide insights on skill match and overall fit.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="jobDescription" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center">
                  <FaTimes className="mr-2" /> {error}
                </div>
              )}

              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
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
                <div className="flex justify-center mb-4">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{results.overallMatch}%</span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={`${results.overallMatch >= 80 ? '#10b981' : results.overallMatch >= 60 ? '#f59e0b' : '#ef4444'}`}
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45 * results.overallMatch / 100} ${2 * Math.PI * 45 * (1 - results.overallMatch / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-300">
                  Overall Match Score
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Overall Candidate Compatibility</h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 italic">"{results.candidateSummary}"</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Skills Match</h3>
                <div className="grid grid-cols-2 gap-4">
                  {results.skillsMatch
                    .filter((skill: any) => skill.match >= 70)
                    .map((skill: any, index: number) => (
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

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Key Strengths for This Role</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {results.skillsMatch
                    .filter((skill: any) => skill.match >= 80)
                    .map((skill: any, index: number) => (
                      <li key={index} className="text-green-600 dark:text-green-400">
                        Strong proficiency in <span className="font-semibold">{skill.skill}</span>
                        {skill.required && ' (required skill)'}
                      </li>
                  ))}
                </ul>
              </div>

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
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}

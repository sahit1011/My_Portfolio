'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaFile, FaDownload, FaSpinner, FaLock, FaUnlock } from 'react-icons/fa';

interface LogFile {
  name: string;
  path: string;
  created: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogFile[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Only fetch logs if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logs?action=list');
      const data = await response.json();
      setLogs(data.files || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewLog = async (filename: string) => {
    setSelectedLog(filename);
    setIsLoading(true);
    try {
      const response = await fetch(`/api/logs?file=${filename}`);
      const text = await response.text();
      setLogContent(text);
    } catch (error) {
      console.error('Error fetching log content:', error);
      setLogContent('Error loading log file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in a real app, you would use a more secure method
    // The password is 'admin123' - this is just for demonstration purposes
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setSelectedLog(null);
    setLogContent('');
    setLogs([]);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Analysis Logs</h1>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                <FaUnlock className="mr-2" /> Logout
              </button>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <div className="flex justify-center mb-6">
                <FaLock className="text-5xl text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-6">Developer Access Only</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                This page contains debugging logs and is only accessible to the developer.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Enter developer password"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <FaLock className="mr-2" /> Unlock Access
                </button>
              </form>
            </div>
          ) : (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Log Files</h2>

              {isLoading && !selectedLog ? (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 py-4">No log files found</p>
              ) : (
                <ul className="space-y-2">
                  {logs.map((log) => (
                    <li key={log.name}>
                      <button
                        onClick={() => viewLog(log.name)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center ${
                          selectedLog === log.name
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <FaFile className="mr-2" />
                        <div className="overflow-hidden">
                          <div className="truncate">{log.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log.created).toLocaleString()}
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <button
                  onClick={fetchLogs}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Refresh Logs
                </button>
              </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {selectedLog ? selectedLog : 'Log Content'}
                </h2>
                {selectedLog && (
                  <a
                    href={`/logs/${selectedLog}`}
                    download
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FaDownload />
                  </a>
                )}
              </div>

              <div className="p-6">
                {isLoading && selectedLog ? (
                  <div className="flex justify-center items-center py-8">
                    <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                  </div>
                ) : selectedLog ? (
                  <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[600px] text-sm">
                    {logContent}
                  </pre>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Select a log file to view its content
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}

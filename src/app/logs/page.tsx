'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaFile, FaDownload, FaSpinner, FaLock, FaUnlock } from 'react-icons/fa';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import ExpandingText from '@/components/ui/ExpandingText';
import ShinyText from '@/components/ShinyText';

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
      <section className="section container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-12">
            <div className="relative inline-block">
              <ExpandingText
                as="h1"
                className="text-3xl md:text-4xl font-bold"
                gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                expandScale={1.03}
                letterSpacing="0.03em"
                textShadow={true}
                glowIntensity={0.4}
              >
                Analysis Logs
              </ExpandingText>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
            {isAuthenticated && (
              <Button3D
                onClick={handleLogout}
                variant="outline"
                size="md"
                icon={<FaUnlock />}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Logout
              </Button3D>
            )}
          </div>

          {!isAuthenticated ? (
            <Card3D
              className="p-8 md:p-12 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl max-w-md mx-auto"
              hoverScale={1.01}
              gradientShadow={true}
              glowOnHover={true}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 rounded-full">
                  <FaLock className="text-5xl text-white" />
                </div>
              </div>
              <div className="relative inline-block mb-6 w-full">
                <ExpandingText
                  as="h2"
                  className="text-2xl font-bold text-center"
                  gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                  expandScale={1.02}
                >
                  Developer Access Only
                </ExpandingText>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
              <p className="text-gray-300 text-center mb-8">
                <ShinyText speed={3}>
                  This page contains debugging logs and is only accessible to the developer.
                </ShinyText>
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter developer password"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <Button3D
                  type="submit"
                  variant="accent"
                  size="lg"
                  fullWidth
                  icon={<FaLock />}
                  className="gradient-border"
                >
                  Unlock Access
                </Button3D>
              </form>
            </Card3D>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Log Files List */}
              <Card3D
                className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
                hoverScale={1.01}
                gradientShadow={true}
                glowOnHover={true}
              >
                <div className="relative inline-block mb-6">
                  <ExpandingText
                    as="h2"
                    className="text-xl font-bold"
                    gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                    expandScale={1.02}
                  >
                    Log Files
                  </ExpandingText>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                </div>

                {isLoading && !selectedLog ? (
                  <div className="flex justify-center items-center py-8">
                    <FaSpinner className="animate-spin text-purple-400 text-2xl" />
                  </div>
                ) : logs.length === 0 ? (
                  <p className="text-gray-400 py-4 text-center">No log files found</p>
                ) : (
                  <ul className="space-y-2 mb-4">
                    {logs.map((log) => (
                      <li key={log.name}>
                        <button
                          onClick={() => viewLog(log.name)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center transition-all ${
                            selectedLog === log.name
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                          }`}
                        >
                          <FaFile className="mr-2 shrink-0" />
                          <div className="overflow-hidden min-w-0">
                            <div className="truncate font-medium">{log.name}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(log.created).toLocaleString()}
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <Button3D
                  onClick={fetchLogs}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="mt-4"
                >
                  Refresh Logs
                </Button3D>
              </Card3D>

              {/* Log Content Viewer */}
              <Card3D
                className="md:col-span-2 p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl"
                hoverScale={1.01}
                gradientShadow={true}
                glowOnHover={true}
              >
                <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-center">
                  <div className="relative inline-block">
                    <ExpandingText
                      as="h2"
                      className="text-xl font-bold"
                      gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
                      expandScale={1.02}
                    >
                      {selectedLog ? selectedLog : 'Log Content'}
                    </ExpandingText>
                    {selectedLog && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    )}
                  </div>
                  {selectedLog && (
                    <a
                      href={`/logs/${selectedLog}`}
                      download
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FaDownload size={20} />
                    </a>
                  )}
                </div>

                <div className="min-h-[400px]">
                  {isLoading && selectedLog ? (
                    <div className="flex justify-center items-center py-16">
                      <FaSpinner className="animate-spin text-purple-400 text-3xl" />
                    </div>
                  ) : selectedLog ? (
                    <pre className="bg-black/30 backdrop-blur-sm p-4 rounded-lg overflow-auto max-h-[600px] text-sm text-gray-300 font-mono border border-white/10">
                      {logContent}
                    </pre>
                  ) : (
                    <div className="text-center py-16 text-gray-400">
                      <FaFile className="text-5xl mx-auto mb-4 opacity-50" />
                      <p>Select a log file to view its content</p>
                    </div>
                  )}
                </div>
              </Card3D>
            </div>
          )}
        </motion.div>
      </section>
    </MainLayout>
  );
}

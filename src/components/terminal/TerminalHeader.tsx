'use client';

import React from 'react';

type OSTheme = 'windows' | 'linux' | 'mac';

interface TerminalHeaderProps {
  osTheme: OSTheme;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  osTheme
}) => {
  // Windows CMD header
  if (osTheme === 'windows') {
    return (
      <div className="flex items-center p-1 bg-blue-900 text-white">
        <div className="flex-grow flex items-center">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20V20H4V4Z" fill="white" />
          </svg>
          <span className="text-sm font-medium">Command Prompt</span>
        </div>
        <div className="flex">
          <button className="px-2 hover:bg-blue-700">_</button>
          <button className="px-2 hover:bg-blue-700">□</button>
          <button className="px-2 hover:bg-red-600">×</button>
        </div>
      </div>
    );
  }

  // Linux Bash header
  if (osTheme === 'linux') {
    return (
      <div className="flex flex-col">
        <div className="flex items-center p-1 bg-gray-800 text-gray-200">
          <span className="text-sm font-medium ml-2">Terminal - bash</span>
          <div className="flex-grow"></div>
          <button className="px-2 hover:bg-gray-700">_</button>
          <button className="px-2 hover:bg-gray-700">□</button>
          <button className="px-2 hover:bg-red-600">×</button>
        </div>
        <div className="flex bg-gray-700 text-gray-200 text-xs p-1">
          <button className="px-2 hover:bg-gray-600">File</button>
          <button className="px-2 hover:bg-gray-600">Edit</button>
          <button className="px-2 hover:bg-gray-600">View</button>
          <button className="px-2 hover:bg-gray-600">Terminal</button>
          <button className="px-2 hover:bg-gray-600">Help</button>
        </div>
      </div>
    );
  }

  // macOS Terminal header
  return (
    <div className="flex flex-col">
      <div className="flex items-center p-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 rounded-t-lg">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
        </div>
        <div className="flex-grow text-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">brew — zsh</span>
        </div>
      </div>
    </div>
  );
};

export default TerminalHeader;

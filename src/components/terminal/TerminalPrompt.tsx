'use client';

import React from 'react';

interface TerminalPromptProps {
  input: string;
  prompt?: string;
}

const TerminalPrompt: React.FC<TerminalPromptProps> = ({ input, prompt = 'anil@portfolio:~$' }) => {
  return (
    <div className="flex">
      <div className="text-purple-400 mr-2">{prompt}</div>
      <div>{input}</div>
    </div>
  );
};

export default TerminalPrompt;

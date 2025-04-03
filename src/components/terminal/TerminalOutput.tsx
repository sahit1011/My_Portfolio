'use client';

import React from 'react';

interface TerminalOutputProps {
  output: string | React.ReactNode;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ output }) => {
  return (
    <div className="ml-4 mt-1">
      {output}
    </div>
  );
};

export default TerminalOutput;

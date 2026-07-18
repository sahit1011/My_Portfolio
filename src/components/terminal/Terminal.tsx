'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TerminalHeader from './TerminalHeader';
import TerminalPrompt from './TerminalPrompt';
import TerminalOutput from './TerminalOutput';
import ThemeToggle from './ThemeToggle';
import ScanLines from './ScanLines';

// Import skill icons
import {
  FaPython, FaJs, FaDatabase,
  FaReact, FaNodeJs, FaDocker, FaGoogle
} from 'react-icons/fa';
import {
  SiTypescript, SiNextdotjs, SiTailwindcss,
  SiDjango, SiFlask,
  SiTensorflow, SiPytorch, SiScikitlearn, SiHuggingface,
  SiMongodb, SiPostgresql,
  SiRedis, SiMysql, SiCplusplus
} from 'react-icons/si';

import {
  getPersonalInfo,
  getFeaturedProjects,
  getGithubUrl,
  getLinkedinUrl,
} from '@/utils/content';

type OSTheme = 'windows' | 'linux' | 'mac';

interface Command {
  input: string;
  output: string | React.ReactNode;
}

const Terminal: React.FC = () => {
  // Initialize with default welcome message to avoid empty initial render
  const welcomeMessage = (
    <>
      <p className="text-green-400">Welcome to Anil&apos;s Terminal Portfolio!</p>
      <p className="mt-2">Type <span className="text-yellow-400">help</span> to see available commands.</p>
      <p className="mt-2">Use the OS icons in the top-right corner to change the terminal theme.</p>
    </>
  );

  // Use state initialization with default values
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([{ input: '', output: welcomeMessage }]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [osTheme, setOsTheme] = useState<OSTheme>('linux');
  const [isLoaded] = useState(true); // Start with loaded=true for immediate rendering
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Initialize the terminal immediately after component mounts
  useEffect(() => {
    // Focus the input after the terminal is loaded
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Auto-scroll to bottom on initial render
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    // Log for debugging
    console.log('Terminal component mounted and initialized');
  }, []);

  // This effect runs when the component is about to unmount
  useEffect(() => {
    return () => {
      console.log('Terminal component unmounting');
    };
  }, []);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Auto-scroll to bottom on initial render
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current && isLoaded) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isLoaded]);

  // Focus input on terminal click
  const focusInput = () => {
    if (inputRef.current && isLoaded) {
      inputRef.current.focus();
    }
  };

  // Process commands
  const processCommand = (cmd: string) => {
    const command = cmd.trim().toLowerCase();
    let output: string | React.ReactNode;

    switch (command) {
      case 'help':
        output = (
          <div>
            <p className="font-bold text-accent-light text-lg">Available commands:</p>

            <p className="font-semibold text-blue-400 mt-3 mb-1">Visit my Portfolio:</p>
            <ul className="ml-4 mb-3">
              <li><span className="text-yellow-400">portfolio</span> - Go to the main portfolio</li>
              <li><span className="text-yellow-400">resume</span> - View my resume</li>
              <li><span className="text-yellow-400">whoami</span> - Display my full name</li>
            </ul>

            <p className="font-semibold text-blue-400 mb-1">Other Commands:</p>
            <ul className="ml-4">
              <li><span className="text-yellow-400">help</span> - Show available commands</li>
              <li><span className="text-yellow-400">about</span> - Learn about me</li>
              <li><span className="text-yellow-400">skills</span> - View my technical skills</li>
              <li><span className="text-yellow-400">projects</span> - See my projects</li>
              <li><span className="text-yellow-400">contact</span> - Get my contact information</li>
              <li><span className="text-yellow-400">clear</span> - Clear the terminal</li>
              <li><span className="text-yellow-400">github</span> - Visit my GitHub profile</li>
              <li><span className="text-yellow-400">linkedin</span> - Visit my LinkedIn profile</li>
            </ul>
          </div>
        );
        break;

      case 'about':
        output = (
          <div>
            <p className="font-bold text-accent-light">About Me:</p>
            <p className="mt-1">
              I&apos;m Anil, a Software Engineer, AI/ML Engineer, and Data Scientist with a passion for building innovative solutions.
              I specialize in full-stack development, machine learning, and data analysis.
            </p>
            <p className="mt-1">
              Type <span className="text-yellow-400">portfolio</span> to see my full portfolio.
            </p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-4">
            {/* AI & Machine Learning */}
            <div>
              <p className="font-semibold text-pink-400 mb-1">AI &amp; Machine Learning:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-4">
                <div className="flex items-center gap-2">
                  <SiTensorflow className="text-orange-500" size={18} /> TensorFlow / TF-Lite
                </div>
                <div className="flex items-center gap-2">
                  <SiPytorch className="text-red-500" size={18} /> PyTorch
                </div>
                <div className="flex items-center gap-2">
                  <SiScikitlearn className="text-orange-400" size={18} /> scikit-learn
                </div>
                <div className="flex items-center gap-2">
                  <SiHuggingface className="text-yellow-300" size={18} /> Hugging Face
                </div>
                <div className="flex items-center gap-2">
                  <FaPython className="text-blue-400" size={18} /> Deep Learning / CV / NLP
                </div>
                <div className="flex items-center gap-2">
                  <FaPython className="text-blue-400" size={18} /> Agentic AI / LangChain
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <p className="font-semibold text-purple-400 mb-1">Languages:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-4">
                <div className="flex items-center gap-2">
                  <FaPython className="text-blue-400" size={18} /> Python
                </div>
                <div className="flex items-center gap-2">
                  <SiCplusplus className="text-blue-600" size={18} /> C++
                </div>
                <div className="flex items-center gap-2">
                  <SiTypescript className="text-blue-500" size={18} /> TypeScript
                </div>
                <div className="flex items-center gap-2">
                  <FaJs className="text-yellow-400" size={18} /> JavaScript
                </div>
                <div className="flex items-center gap-2">
                  <FaDatabase className="text-green-400" size={18} /> SQL
                </div>
              </div>
            </div>

            {/* Web & Backend */}
            <div>
              <p className="font-semibold text-yellow-500 mb-1">Web &amp; Backend:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-4">
                <div className="flex items-center gap-2">
                  <FaReact className="text-blue-400" size={18} /> React
                </div>
                <div className="flex items-center gap-2">
                  <SiNextdotjs className="text-gray-300" size={18} /> Next.js
                </div>
                <div className="flex items-center gap-2">
                  <SiTailwindcss className="text-cyan-400" size={18} /> Tailwind CSS
                </div>
                <div className="flex items-center gap-2">
                  <FaNodeJs className="text-green-500" size={18} /> Node.js
                </div>
                <div className="flex items-center gap-2">
                  <SiDjango className="text-green-700" size={18} /> Django
                </div>
                <div className="flex items-center gap-2">
                  <SiFlask className="text-gray-300" size={18} /> Flask / FastAPI
                </div>
              </div>
            </div>

            {/* Data & Infra */}
            <div>
              <p className="font-semibold text-blue-400 mb-1">Data &amp; Infra:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 ml-4">
                <div className="flex items-center gap-2">
                  <SiMongodb className="text-green-500" size={18} /> MongoDB
                </div>
                <div className="flex items-center gap-2">
                  <SiPostgresql className="text-blue-500" size={18} /> PostgreSQL
                </div>
                <div className="flex items-center gap-2">
                  <SiMysql className="text-blue-700" size={18} /> MySQL
                </div>
                <div className="flex items-center gap-2">
                  <SiRedis className="text-red-500" size={18} /> Redis
                </div>
                <div className="flex items-center gap-2">
                  <FaDocker className="text-blue-400" size={18} /> Docker
                </div>
                <div className="flex items-center gap-2">
                  <FaGoogle className="text-blue-400" size={18} /> GCP
                </div>
              </div>
            </div>

            <p className="mt-1 text-gray-400">
              Full breakdown &rarr; type <span className="text-yellow-400">portfolio</span> or visit the Skills page.
            </p>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div>
            <p className="font-bold text-green-400">Featured Projects:</p>
            <ul className="ml-4 mt-1 space-y-1">
              {getFeaturedProjects().map((p, i) => (
                <li key={p.id}>
                  <span className="text-yellow-400">{i + 1}.</span>{' '}
                  <span className="text-gray-100">{p.title}</span>
                  <span className="text-gray-400">
                    {' '}— {p.technologies.slice(0, 4).join(', ')}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-gray-300">
              Type <span className="text-yellow-400">portfolio</span> for full project details &amp; links.
            </p>
          </div>
        );
        break;

      case 'contact': {
        const info = getPersonalInfo();
        output = (
          <div>
            <p className="font-bold text-green-400">Contact Information:</p>
            <p className="mt-1"><span className="text-yellow-400">Email:</span> {info.email}</p>
            <p><span className="text-yellow-400">Phone:</span> {info.phone}</p>
            <p><span className="text-yellow-400">Location:</span> {info.location}</p>
            <p><span className="text-yellow-400">GitHub:</span> {getGithubUrl().replace('https://', '')}</p>
            <p><span className="text-yellow-400">LinkedIn:</span> {getLinkedinUrl().replace('https://', '')}</p>
          </div>
        );
        break;
      }

      case 'clear':
        setHistory([]);
        return;

      case 'portfolio':
        output = <p>Redirecting to portfolio...</p>;
        setTimeout(() => {
          router.push('/');
        }, 1000);
        break;

      case 'resume': {
        const info = getPersonalInfo();
        output = (
          <div className="font-mono text-sm">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-green-400">{info.name.toUpperCase()}</h2>
              <p>AI/ML Engineer | Software Engineer | Data Scientist</p>
              <p>{info.email} | {info.phone} | {info.location}</p>
              <p>{getGithubUrl().replace('https://', '')} | {getLinkedinUrl().replace('https://', '')}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-yellow-400">SUMMARY</h3>
              <p className="border-b border-gray-600 mb-2"></p>
              <p>AI/ML Engineer with a B.Tech from NIT Warangal. I&apos;ve shipped real-time
              ML on embedded patient monitors, multi-agent learning platforms, and document
              automation pipelines — across Noccarc Robotics, Carelon (Elevance), and freelance work.</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-yellow-400">EDUCATION</h3>
              <p className="border-b border-gray-600 mb-2"></p>
              <p className="font-bold">B.Tech, Electrical &amp; Electronics Engineering</p>
              <p>National Institute of Technology (NIT) Warangal</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-yellow-400">EXPERIENCE</h3>
              <p className="border-b border-gray-600 mb-2"></p>
              <p className="font-bold">Junior AI Engineer — Noccarc Robotics</p>
              <p className="text-gray-400">Real-time arrhythmia detection (CNN-GRU + attention) on embedded monitors, 95%+ accuracy.</p>
              <p className="font-bold mt-2">AI/ML Intern — Carelon Global Solutions (Elevance)</p>
              <p className="text-gray-400">OCR + YOLOv8 document pipeline processing ~700 docs/hr at 95% accuracy.</p>
            </div>

            <div className="mt-4">
              <p>Full resume &rarr; type <span className="text-yellow-400">portfolio</span> or download the PDF from the Resume page.</p>
            </div>
          </div>
        );
        break;
      }

      case 'github':
        output = <p>Opening GitHub profile…</p>;
        window.open(getGithubUrl(), '_blank', 'noopener,noreferrer');
        break;

      case 'linkedin':
        output = <p>Opening LinkedIn profile…</p>;
        window.open(getLinkedinUrl(), '_blank', 'noopener,noreferrer');
        break;

      case 'whoami':
        output = (
          <div>
            <p className="text-xl font-bold text-green-400 mb-2">Vallepu Anil Sahith</p>
            <p className="text-gray-300">Software Engineer & AI/ML Enthusiast</p>
          </div>
        );
        break;

      case '':
        output = '';
        break;

      default:
        output = (
          <p className="text-red-500">
            Command not found: {command}. Type <span className="text-yellow-400">help</span> to see available commands.
          </p>
        );
    }

    setHistory(prev => [...prev, { input: cmd, output }]);
    setInput('');
    setHistoryIndex(-1);
  };

  // Handle input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
  };

  // Handle key navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].input);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex].input);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (osTheme) {
      case 'windows':
        return {
          bg: 'bg-black',
          text: 'text-white',
          prompt: 'C:\\Users\\anil>',
          fontFamily: 'font-mono',
          headerBg: 'bg-blue-900',
          headerText: 'text-white',
          title: 'Command Prompt',
        };
      case 'mac':
        return {
          bg: 'bg-black',
          text: 'text-green-400',
          prompt: 'anil@macbook ~ %',
          fontFamily: 'font-mono',
          headerBg: 'bg-gray-200 dark:bg-gray-800',
          headerText: 'text-gray-700 dark:text-gray-300',
          title: 'brew — zsh',
        };
      case 'linux':
      default:
        return {
          bg: 'bg-gray-900',
          text: 'text-gray-100',
          prompt: 'anil@ubuntu:~$',
          fontFamily: 'font-mono',
          headerBg: 'bg-gray-800',
          headerText: 'text-gray-300',
          title: 'Terminal - bash',
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Terminal mouse tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!terminalContainerRef.current) return;

    const rect = terminalContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate normalized position (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);

    setMousePosition({ x: normalizedX * 2, y: normalizedY * 2 });
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center perspective-container"
      ref={terminalContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ThemeToggle currentTheme={osTheme} onThemeChange={setOsTheme} />

      {/* Enhanced 3D Terminal */}
      <motion.div
        className={`w-full h-[65vh] overflow-hidden flex flex-col rounded-lg terminal-3d gradient-shadow ${themeStyles.bg} ${themeStyles.text} ${themeStyles.fontFamily}`}
        onClick={focusInput}
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          rotateX: -mousePosition.y * 3,
          rotateY: mousePosition.x * 3,
          boxShadow: `
            0 20px 50px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(103, 232, 249, 0.1),
            inset 0 0 15px rgba(255, 255, 255, 0.05)
          `
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.5
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
      <TerminalHeader osTheme={osTheme} />

      {/* Add scan lines effect */}
      <ScanLines opacity={osTheme === 'mac' ? 0.1 : 0.15} />

      {isLoaded ? (
        <div
          ref={terminalRef}
          className="flex-grow overflow-y-auto p-4"
        >
          {history.map((item, index) => (
            <div key={index} className="mb-2">
              {item.input && (
                <TerminalPrompt input={item.input} prompt={themeStyles.prompt} />
              )}
              <TerminalOutput output={item.output} />
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center">
            <div className={`mr-2 ${osTheme === 'mac' ? 'text-green-400' : osTheme === 'windows' ? 'text-white' : 'text-purple-400'}`}>
              {themeStyles.prompt}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-grow"
              autoFocus
            />
          </form>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-lg">Initializing terminal...</div>
            <div className="mt-2 text-sm text-gray-400">Please wait</div>
          </div>
        </div>
      )}
      </motion.div>
    </div>
  );
};

export default Terminal;

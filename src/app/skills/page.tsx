'use client';

import React, { useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  FaCode, FaServer, FaDatabase, FaTools, FaBrain,
  FaPython, FaJs,
  FaDocker, FaGoogle, FaGithub, FaLaptopCode, FaChartBar,
  FaProjectDiagram, FaNetworkWired, FaMicrochip,
  FaRobot, FaLanguage, FaGraduationCap, FaAws, FaCloud,
  FaChevronDown
} from 'react-icons/fa';
import {
  SiTypescript, SiNextdotjs, SiNodedotjs, SiDjango, SiFlask, SiFastapi,
  SiTensorflow, SiPytorch, SiScikitlearn,
  SiPandas, SiMongodb, SiPostgresql, SiKubernetes,
  SiMysql, SiCplusplus, SiSqlite, SiNumpy,
  SiFigma, SiRedis, SiHuggingface, SiOnnx, SiNvidia,
  SiRabbitmq, SiApachekafka, SiMinio, SiSupabase,
  SiArgo, SiGithubactions, SiPrometheus, SiGrafana, SiTemporal
} from 'react-icons/si';
import Card3D from '@/components/ui/Card3D';
// import AnimatedHeading from '@/components/ui/AnimatedHeading';
import Button3D from '@/components/ui/Button3D';
import ShinyText from '@/components/ShinyText';
import ExpandingText from '@/components/ui/ExpandingText';


// Import content management utilities
import { getSkills } from '@/utils/content';

const customIconClass = 'w-6 h-6';

// Icon mapping for skills
const iconMap: { [key: string]: React.ReactNode } = {
  // Programming Languages
  FaPython: <FaPython className="text-blue-400" size={24} />,
  SiCplusplus: <SiCplusplus className="text-blue-600" size={24} />,
  FaJs: <FaJs className="text-yellow-400" size={24} />,
  SiTypescript: <SiTypescript className="text-blue-500" size={24} />,
  FaDatabase: <FaDatabase className="text-green-400" size={24} />,
  FaLaptopCode: <FaLaptopCode className="text-orange-500" size={24} />,

  // Backend
  SiNextdotjs: <SiNextdotjs className="text-black dark:text-white" size={24} />,
  SiNodedotjs: <SiNodedotjs className="text-green-500" size={24} />,
  SiDjango: <SiDjango className="text-green-700" size={24} />,
  SiFlask: <SiFlask className="text-gray-300" size={24} />,
  SiFastapi: <SiFastapi className="text-teal-400" size={24} />,
  SiRabbitmq: <SiRabbitmq className="text-orange-500" size={24} />,
  SiApachekafka: <SiApachekafka className="text-black dark:text-white" size={24} />,
  CustomZeroMQ: (
    <svg viewBox="0 0 24 24" className={`${customIconClass} text-slate-700 dark:text-slate-200`} fill="currentColor" aria-hidden="true">
      <path d="m22.088 5.499l1.894-1.894L20.395.018l-1.894 1.894A11.943 11.943 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.396.702 4.627 1.912 6.501L.018 20.395l3.587 3.587l1.894-1.894A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12c0-2.396-.702-4.627-1.912-6.501zM4.569 12a7.431 7.431 0 0 1 10.577-6.733l-9.88 9.88A7.409 7.409 0 0 1 4.569 12zM12 19.431a7.387 7.387 0 0 1-3.146-.698l9.88-9.88A7.433 7.433 0 0 1 12 19.431z" />
    </svg>
  ),
  CustomTensorZero: (
    <svg viewBox="0 0 500 500" className={customIconClass} aria-hidden="true">
      <circle cx="250" cy="250" r="250" fill="#FF4F00" />
      <path d="M340 282.765C340 300.469 337.964 316.198 333.892 329.954C329.82 343.582 323.966 355.045 316.331 364.343C308.696 373.768 299.343 380.9 288.271 385.74C277.2 390.58 264.539 393 250.286 393C236.161 393 223.499 390.644 212.301 385.931C201.103 381.091 191.622 373.895 183.86 364.343C176.098 355.045 170.18 343.582 166.108 329.954C162.036 316.198 160 300.469 160 282.765V217.617C160 199.913 162.036 184.247 166.108 170.619C170.18 156.864 176.098 145.273 183.86 135.848C191.495 126.423 200.848 119.291 211.919 114.451C223.118 109.484 235.779 107 249.905 107C264.157 107 276.819 109.484 287.89 114.451C299.088 119.291 308.568 126.423 316.331 135.848C323.966 145.273 329.82 156.864 333.892 170.619C337.964 184.247 340 199.913 340 217.617V282.765ZM195.504 275.696L303.733 192.59C302.715 183.42 300.87 175.332 298.197 168.327C295.652 161.194 292.153 155.272 287.699 150.559C283.372 145.719 278.028 142.089 271.665 139.669C265.429 137.249 258.176 136.039 249.905 136.039C241.506 136.039 234.062 137.377 227.572 140.051C221.209 142.599 215.801 146.356 211.347 151.323C206.002 157.564 201.994 165.652 199.321 175.587C196.776 185.394 195.504 196.793 195.504 209.784V256.4C195.504 259.584 195.504 262.768 195.504 265.953C195.504 269.137 195.504 272.385 195.504 275.696ZM304.496 290.216V250.86C304.496 248.949 304.496 245.319 304.496 239.97C304.496 234.493 304.496 229.972 304.496 226.405L196.458 309.13C197.603 318.427 199.639 326.642 202.566 333.775C205.493 340.78 209.311 346.575 214.019 351.16C218.346 355.491 223.563 358.802 229.671 361.095C235.779 363.26 242.651 364.343 250.286 364.343C258.303 364.343 265.429 363.133 271.665 360.713C277.9 358.293 283.181 354.79 287.508 350.205C293.362 343.964 297.625 335.813 300.297 325.751C303.096 315.689 304.496 303.844 304.496 290.216Z" fill="#FFFFFF" />
    </svg>
  ),

  // Databases & Cloud
  SiMysql: <SiMysql className="text-blue-700" size={24} />,
  SiPostgresql: <SiPostgresql className="text-blue-500" size={24} />,
  SiSqlite: <SiSqlite className="text-blue-400" size={24} />,
  SiMongodb: <SiMongodb className="text-green-500" size={24} />,
  SiRedis: <SiRedis className="text-red-500" size={24} />,
  SiMinio: <SiMinio className="text-red-600" size={24} />,
  SiSupabase: <SiSupabase className="text-emerald-500" size={24} />,
  CustomPinecone: (
    <svg viewBox="0 0 818 818" className={`${customIconClass} text-[#002BFF] dark:text-[#1E86EE]`} fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M471.826 24.0936C464.116 14.9134 450.95 12.5551 440.534 18.4886L430.803 24.0322L430.679 24.0093L430.659 24.1139L325.85 83.8204L350.42 126.977L418.874 87.9814L402.035 179.236L450.859 188.251L467.791 96.4974L518.212 156.532L556.227 124.585L479.472 33.1965L479.503 33.0244L479.295 32.9859L471.826 24.0936ZM324.08 794.824C349.328 794.824 369.795 774.868 369.795 750.25C369.795 725.633 349.328 705.676 324.08 705.676C298.833 705.676 278.366 725.633 278.366 750.25C278.366 774.868 298.833 794.824 324.08 794.824ZM385.561 550.209L369.091 642.069L320.221 633.302L336.586 542.025L268.375 581.205L243.651 538.136L348.033 478.18L348.056 478.049L348.212 478.077L358.011 472.449C368.389 466.488 381.541 468.781 389.29 477.903L396.851 486.803L396.926 486.816L396.915 486.879L474.358 578.039L436.524 610.2L385.561 550.209ZM425.11 330.935L408.652 422.737L359.782 413.971L376.085 323.035L308.091 361.894L283.461 318.771L387.51 259.306L387.617 258.708L388.331 258.836L397.847 253.398C408.224 247.468 421.351 249.774 429.086 258.887L436.356 267.451L436.487 267.475L436.467 267.583L513.866 358.765L476.019 390.91L425.11 330.935ZM104.667 693.368L104.394 693.554L104.171 693.225L94.0456 690.317C83.3324 687.24 76.2404 677.074 77.0484 665.954L86.0484 542.094L133.05 545.511L127.574 620.869L200.8 571.19L227.251 610.203L155.455 658.912L228.701 679.952L215.694 725.26L104.667 693.368ZM590.296 744.836L590.301 744.844L590.291 744.852L586.988 755.721C583.802 766.205 573.813 773.109 562.883 772.383L552.56 771.698L551.9 772.167L551.517 771.629L436.444 763.986L439.566 716.95L516.258 722.044L466.25 651.718L504.651 624.395L555.789 696.309L577.921 623.484L623.009 637.195L590.296 744.836ZM725.177 489.19L725.322 489.215L725.29 489.393L730.774 499.22C736.394 509.291 734.104 521.931 725.309 529.389L717.018 536.42L716.96 536.747L716.688 536.699L627.257 612.532L596.06 575.717L654.901 525.823L566.796 510.314L575.158 462.783L663.903 478.404L626.686 411.712L668.814 388.189L725.177 489.19ZM634.493 282.027L554.909 324.863L532.047 282.364L610.263 240.264L538.372 211.176L556.464 166.435L665.478 210.544L665.964 210.283L666.279 210.868L676.146 214.861C686.737 219.146 692.871 230.276 690.839 241.522L688.81 252.753L688.826 252.782L688.802 252.795L668.319 366.171L620.841 357.589L634.493 282.027ZM100.963 381.58L189.25 396.607L181.156 444.185L92.111 429.029L130.083 495.958L88.1229 519.778L30.7057 418.577L30.665 418.57L30.6735 418.52L25.1727 408.825C19.4828 398.796 21.6815 386.142 30.4207 378.621L38.6678 371.524L38.7583 370.992L39.1988 371.067L127.517 295.067L158.982 331.653L100.963 381.58ZM234.324 175.801L293.072 241.268L257.168 273.506L197.06 206.523L183.065 282.822L135.61 274.113L156.332 161.138L156.228 161.021L156.379 160.886L158.474 149.463C160.507 138.378 169.941 130.177 181.199 129.708L191.582 129.276L192.131 128.783L192.539 129.236L310.473 124.33L312.478 172.55L234.324 175.801Z" />
    </svg>
  ),
  FaDocker: <FaDocker className="text-blue-400" size={24} />,
  SiKubernetes: <SiKubernetes className="text-blue-500" size={24} />,
  SiArgo: <SiArgo className="text-sky-500" size={24} />,
  SiGithubactions: <SiGithubactions className="text-blue-500" size={24} />,
  SiPrometheus: <SiPrometheus className="text-orange-500" size={24} />,
  SiGrafana: <SiGrafana className="text-orange-400" size={24} />,
  SiTemporal: <SiTemporal className="text-black dark:text-white" size={24} />,
  CustomCubeAPM: (
    <svg viewBox="0 0 32 32" className={`${customIconClass} text-[#0F62E6]`} fill="currentColor" aria-hidden="true">
      <path d="M31 31H1V1H31V19H25V7H7V25H31Z" />
      <path d="M13 13H19V19H13Z" />
    </svg>
  ),
  FaGithub: <FaGithub className="text-gray-700" size={24} />,
  FaGoogle: <FaGoogle className="text-blue-400" size={24} />,
  FaAws: <FaAws className="text-orange-400" size={24} />,
  FaCloud: <FaCloud className="text-blue-300" size={24} />,

  // AI/ML
  SiTensorflow: <SiTensorflow className="text-orange-500" size={24} />,
  SiPytorch: <SiPytorch className="text-red-500" size={24} />,
  SiOnnx: <SiOnnx className="text-black dark:text-white" size={24} />,
  SiNvidia: <SiNvidia className="text-green-500" size={24} />,
  SiScikitlearn: <SiScikitlearn className="text-orange-400" size={24} />,
  SiHuggingface: <SiHuggingface className="text-yellow-400" size={24} />,
  SiPandas: <SiPandas className="text-blue-600" size={24} />,
  SiNumpy: <SiNumpy className="text-blue-500" size={24} />,
  FaChartBar: <FaChartBar className="text-green-500" size={24} />,
  FaBrain: <FaBrain className="text-purple-500" size={24} />,
  FaRobot: <FaRobot className="text-cyan-400" size={24} />,
  FaLanguage: <FaLanguage className="text-lime-400" size={24} />,
  FaGraduationCap: <FaGraduationCap className="text-orange-400" size={24} />,
  FaMicrochip: <FaMicrochip className="text-teal-400" size={24} />,

  // Developer Tools
  FaCode: <FaCode className="text-blue-600" size={24} />,
  SiFigma: <SiFigma className="text-purple-500" size={24} />,

  // Concepts & Systems
  FaServer: <FaServer className="text-gray-600" size={24} />,
  FaNetworkWired: <FaNetworkWired className="text-blue-600" size={24} />,
};

// Skills data based on content management
const getSkillCategories = () => {
  const skills = getSkills();

  return [
    {
      id: 1,
      title: 'Programming Languages',
      icon: <FaCode className="text-4xl text-purple-500 mb-4" />,
      skills: skills.programmingLanguages,
    },
    {
      id: 2,
      title: 'Developer Tools',
      icon: <FaTools className="text-4xl text-gray-500 mb-4" />,
      skills: skills.developerTools,
    },
    {
      id: 3,
      title: 'Concepts & Systems',
      icon: <FaProjectDiagram className="text-4xl text-teal-500 mb-4" />,
      skills: skills.conceptsAndSystems,
    },
    {
      id: 4,
      title: 'Backend',
      icon: <FaServer className="text-4xl text-green-500 mb-4" />,
      skills: skills.backend,
    },
    {
      id: 5,
      title: 'Databases & Cloud',
      icon: <FaDatabase className="text-4xl text-blue-500 mb-4" />,
      skills: skills.databasesAndCloud,
    },
    {
      id: 6,
      title: 'AI & Machine Learning',
      icon: <FaBrain className="text-4xl text-pink-500 mb-4" />,
      skills: skills.aiMl,
    },
  ];
};

// Skill component with icon
const SkillItem = ({ name, iconName }: { name: string; iconName: string }) => {
  const icon = iconMap[iconName] || <FaCode className="text-gray-500" size={24} />;

  return (
    <div className="mb-3 flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  );
};

// Skill Category Card Component
const SkillCategoryCard = ({ category }: { category: ReturnType<typeof getSkillCategories>[0] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card3D
      className="p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-800 dark:text-gray-100 h-full"
      hoverScale={1.03}
      gradientShadow={false}
      glowOnHover={false}
    >
      <div className="text-center mb-6">
        {category.icon}
        <div className="relative inline-block">
          <ExpandingText
            as="h2"
            className="text-2xl font-bold"
            gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
            expandScale={1.03}
            letterSpacing="0.03em"
            textShadow={true}
            glowIntensity={0.4}
          >
            {category.title}
          </ExpandingText>
          {/* Underline animation */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 pb-8"
        >
          <div className="grid grid-cols-1 gap-3">
            {category.skills.map((skill, index) => (
              <SkillItem key={index} name={skill.name} iconName={skill.icon} />
            ))}
          </div>
        </div>
        {category.skills.length > 7 && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-t from-white dark:from-gray-800 via-white/80 dark:via-gray-800/80 to-transparent h-16 w-full flex items-end justify-center pb-2">
              <button
                onClick={handleScrollDown}
                className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity group"
                aria-label="Scroll down for more skills"
              >
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300">Scroll for more</span>
                <FaChevronDown className="text-gray-500 dark:text-gray-400 animate-bounce group-hover:text-gray-700 dark:group-hover:text-gray-300" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card3D>
  );
};

export default function SkillsPage() {
  // Get skill categories from content management system
  const skillCategories = getSkillCategories();

  return (
    <MainLayout>
      <section className="section container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xl max-w-3xl mx-auto">
            <ShinyText>
              A comprehensive overview of my technical skills and expertise based on my resume.
            </ShinyText>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map(category => (
            <SkillCategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="relative mb-4 inline-block">
            <ExpandingText
              as="h2"
              className="text-3xl font-bold"
              gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
              expandScale={1.03}
              letterSpacing="0.03em"
              textShadow={true}
              glowIntensity={0.4}
            >
              Continuous Learning
            </ExpandingText>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
          </div>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700 dark:text-gray-300">
            I&apos;m constantly expanding my skill set and staying up-to-date with the latest technologies.
            {/* Original learning: Rust, WebAssembly, and advanced MLOps. Can be updated if needed. */}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button3D
              href="/projects"
              variant="primary"
              size="lg"
              className="gradient-border"
            >
              View My Projects
            </Button3D>
            <Button3D
              href="/contact"
              variant="outline"
              size="lg"
              className="gradient-border"
            >
              Get in Touch
            </Button3D>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};


'use client';

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGraduationCap, FaBriefcase, FaLaptopCode, FaEye, FaLightbulb, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SiReact, SiNextdotjs, SiJavascript, SiNodedotjs, SiTailwindcss, SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiPandas, SiOpenai, SiFlask, SiStreamlit, SiPostgresql, SiMongodb, SiNumpy, SiScipy, SiFigma, SiPostman, SiPycharm } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import ShinyText from '@/components/ShinyText';
import LogoLoop from '@/components/LogoLoop';
import GradualBlur from '@/components/GradualBlur';
import SpotlightCard from '@/components/SpotLightCard';

// Import content management utilities
import { getAboutInfo, getPersonalInfo } from '@/utils/content';

export default function AboutPage() {
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [animationCycleComplete, setAnimationCycleComplete] = useState(false);
  const [hoverTriggered, setHoverTriggered] = useState(false);

  const typingSpeed = 100;
  const erasingSpeed = 50;
  const interRoleDelay = 1500;
  const interLineDelay = 500;

  // Get content from the centralized content management system
  const aboutInfo = getAboutInfo();
  const personalInfo = getPersonalInfo();
  const line1Config = useMemo(() => ({ text: aboutInfo.greeting + " ", gradientPart: aboutInfo.name }), [aboutInfo.greeting, aboutInfo.name]);
  const roles = aboutInfo.roles;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (typedLine1.length < (line1Config.text + line1Config.gradientPart).length) {
      timeoutId = setTimeout(() => {
        setTypedLine1((line1Config.text + line1Config.gradientPart).substring(0, typedLine1.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    }

    if (typedLine1.length === (line1Config.text + line1Config.gradientPart).length) {
      const currentRoleConfig = roles[currentRoleIndex];
      const line2StaticText = currentRoleConfig.prefix;
      const currentRoleName = currentRoleConfig.name;
      const fullLine2Text = line2StaticText + currentRoleName;

      if (animationCycleComplete && !hoverTriggered && !isErasing) {
        if (typedLine2 !== fullLine2Text) {
             setTypedLine2(fullLine2Text);
        }
        return;
      }

      if (isErasing) {
        if (typedLine2.length > line2StaticText.length) {
          timeoutId = setTimeout(() => {
            setTypedLine2(prev => prev.substring(0, prev.length - 1));
          }, erasingSpeed);
        } else {
          setIsErasing(false);
          setCurrentRoleIndex(prev => (prev + 1) % roles.length);
        }
      } else {
        if (typedLine2.length < fullLine2Text.length) {
          const initialDelay = typedLine2.length === 0 && currentRoleIndex === 0 && !animationCycleComplete ? interLineDelay : 0;
          timeoutId = setTimeout(() => {
            setTypedLine2(fullLine2Text.substring(0, typedLine2.length + 1));
          }, initialDelay || typingSpeed);
        } else {
          if (!animationCycleComplete && currentRoleIndex === roles.length - 1) {
            setAnimationCycleComplete(true);
            setHoverTriggered(false);
          } else if (hoverTriggered) {
            setHoverTriggered(false);
          } else if (!animationCycleComplete) {
            timeoutId = setTimeout(() => {
              setIsErasing(true);
            }, interRoleDelay);
          }
        }
      }
      return () => clearTimeout(timeoutId);
    }
  }, [
    typedLine1, typedLine2, currentRoleIndex, isErasing,
    animationCycleComplete, hoverTriggered,
    roles, line1Config,
    typingSpeed, erasingSpeed, interRoleDelay, interLineDelay
  ]);

  const handleMouseEnter = () => {
    const currentRoleConfig = roles[currentRoleIndex];
    if (animationCycleComplete && !hoverTriggered && !isErasing &&
        typedLine2 === (currentRoleConfig.prefix + currentRoleConfig.name)) {
      setHoverTriggered(true);
      setIsErasing(true);
    }
  };

  const renderLine1 = () => {
    const staticPartLength = line1Config.text.length;
    let displayedStatic = '';
    let displayedGradient = '';
    let emojiPart = '';

    if (typedLine1.length <= staticPartLength) {
      displayedStatic = typedLine1;
    } else {
      displayedStatic = line1Config.text;
      const fullGradient = typedLine1.substring(staticPartLength);
      // Split the gradient part to separate name and emoji
      const emojiIndex = fullGradient.indexOf('👋');
      if (emojiIndex !== -1) {
        displayedGradient = fullGradient.substring(0, emojiIndex);
        emojiPart = '👋';
      } else {
        displayedGradient = fullGradient;
      }
    }
    const showCursor = typedLine1.length < (line1Config.text + line1Config.gradientPart).length;

    return (
      <>
        {displayedStatic}
        <span className="gradient-text">{displayedGradient}</span>
        {emojiPart && <span className="text-yellow-400">{emojiPart}</span>}
        {showCursor && <span className="animate-blink">|</span>}
      </>
    );
  };

  const renderLine2 = () => {
    if (typedLine1.length < (line1Config.text + line1Config.gradientPart).length) {
      return <>&nbsp;</>;
    }

    const currentRoleConfig = roles[currentRoleIndex];
    const line2StaticTextForRender = currentRoleConfig.prefix;
    const currentRoleNameForRender = currentRoleConfig.name;
    const staticPartLength = line2StaticTextForRender.length;

    let displayedStatic = '';
    let displayedGradient = '';

    if (typedLine2.length <= staticPartLength) {
        displayedStatic = typedLine2;
    } else {
        displayedStatic = line2StaticTextForRender;
        displayedGradient = typedLine2.substring(staticPartLength);
    }

    const currentFullRoleText = line2StaticTextForRender + currentRoleNameForRender;
    const showCursor = typedLine2.length < currentFullRoleText.length ||
                       (isErasing && typedLine2.length > line2StaticTextForRender.length);

    return (
      <>
        {displayedStatic}
        <span
          className="gradient-text"
          onMouseEnter={animationCycleComplete ? handleMouseEnter : undefined}
        >
          {displayedGradient}
        </span>
        {showCursor && <span className="animate-blink">|</span>}
      </>
    );
  };

  return (
    <MainLayout>
      {/* <FloatingSymbols /> */}
      <GradualBlur
        position="bottom"
        strength={1.5}
        height="4rem"
        divCount={4}
        animated="scroll"
        opacity={0.6}
        curve="ease-out"
        target="page"
      />
      
      <section className="section container mx-auto px-4 py-16 max-w-7xl relative">
        {/* LightRays Background Effect - Disabled */}
        {/* <div style={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div> */}

        {/* Content Container with higher z-index */}
        <div className="relative z-10">
          {/* Hero Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            {/* Left: Text Content */}
            <div className="space-y-6">
              {/* Small Badge */}
              <div className="inline-block">
                <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30">
                  Ready to Innovate
                </span>
              </div>

              {/* Main Heading - Compact */}
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight cursor-default">
                {renderLine1()}
              </h1>
              
              {/* Subheading with Role - Single Line */}
              <h2 className="text-2xl lg:text-3xl font-medium cursor-default text-gray-300 min-h-[2.5rem]">
                {renderLine2()}
              </h2>

              {/* Bio - Compact */}
              <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                <ShinyText
                  speed={3}
                  className="text-lg text-gray-400 leading-relaxed"
                >
                  With strong Computer Science concepts and an eye for detail, I enjoy creating effective solutions to challenging problems. I&apos;m always excited to use new technologies to build impactful applications
                </ShinyText>
              </p>

              {/* AI/ML Tech Logos Loop */}
              <div className="pt-4">
                <div style={{ height: '60px', position: 'relative', overflow: 'hidden' }}>
                  <LogoLoop
                    logos={[
                      { node: <SiReact />, title: "React", href: "https://react.dev" },
                      { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
                      { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
                      { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
                      { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
                      { node: <SiFlask />, title: "Flask", href: "https://flask.palletsprojects.com" },
                      { node: <SiPython />, title: "Python", href: "https://python.org" },
                      { node: <SiPostgresql />, title: "PostgreSQL", href: "https://postgresql.org" },
                      { node: <SiMongodb />, title: "MongoDB", href: "https://mongodb.com" },
                      { node: <SiPandas />, title: "Pandas", href: "https://pandas.pydata.org" },
                      { node: <SiNumpy />, title: "NumPy", href: "https://numpy.org" },
                      { node: <SiScipy />, title: "SciPy", href: "https://scipy.org" },
                      { node: <SiTensorflow />, title: "TensorFlow", href: "https://tensorflow.org" },
                      { node: <SiPytorch />, title: "PyTorch", href: "https://pytorch.org" },
                      { node: <SiScikitlearn />, title: "Scikit-learn", href: "https://scikit-learn.org" },
                      { node: <SiOpenai />, title: "OpenAI", href: "https://openai.com" },
                      { node: <SiFigma />, title: "Figma", href: "https://figma.com" },
                      { node: <SiPostman />, title: "Postman", href: "https://postman.com" },
                      { node: <VscCode />, title: "VS Code", href: "https://code.visualstudio.com" },
                      { node: <SiPycharm />, title: "PyCharm", href: "https://jetbrains.com/pycharm" },
                      { node: <SiStreamlit />, title: "Streamlit", href: "https://streamlit.io" },
                    ]}
                    speed={80}
                    direction="left"
                    logoHeight={40}
                    gap={50}
                    pauseOnHover
                    scaleOnHover
                    fadeOut={false}
                    ariaLabel="AI/ML and Web Technologies"
                  />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Card3D
                  className="inline-block"
                  hoverScale={1.05}
                  gradientShadow={false}
                  glowOnHover={false}
                >
                  <a
                    href="/resume"
                    className="inline-flex items-center px-6 py-3 bg-purple-700 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    <FaEye className="mr-2" /> View Resume
                  </a>
                </Card3D>

                <Card3D
                  className="inline-block mr-4"
                  hoverScale={1.05}
                  gradientShadow={false}
                  glowOnHover={false}
                >
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gray-700 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Contact
                  </a>
                </Card3D>

                {/* Social Icons */}
                <div className="flex gap-4">
                  <a
                    href={`https://github.com/${personalInfo.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-medium transition-all duration-300 hover:opacity-80"
                  >
                    <Card3D
                      className="inline-block"
                      hoverScale={1.05}
                      gradientShadow={false}
                      glowOnHover={false}
                    >
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <FaGithub className="text-xl" />
                      </div>
                    </Card3D>
                    <ShinyText
                      speed={3}
                      className="text-base text-gray-300"
                    >
                      GitHub
                    </ShinyText>
                  </a>

                  <a
                    href={`https://linkedin.com/in/${personalInfo.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white font-medium transition-all duration-300 hover:opacity-80"
                  >
                    <Card3D
                      className="inline-block"
                      hoverScale={1.05}
                      gradientShadow={false}
                      glowOnHover={false}
                    >
                      <div className="p-3 bg-blue-700 rounded-lg">
                        <FaLinkedinIn className="text-xl" />
                      </div>
                    </Card3D>
                    <ShinyText
                      speed={3}
                      className="text-base text-gray-300"
                    >
                      LinkedIn
                    </ShinyText>
                  </a>
                </div>
              </div>

            </div>

            {/* Right: Profile Image */}
            <div className="flex justify-center lg:justify-center items-center mt-8 lg:-mt-8 lg:-ml-8">
              <Card3D
                className="w-full max-w-[200px] sm:max-w-[240px] lg:max-w-xs profile-image-container"
                hoverScale={1.02}
                gradientShadow={true}
                glowOnHover={true}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
                  <Image
                    src="/images/updated_profile_pic_v2.png"
                    alt={aboutInfo.name}
                    width={300}
                    height={300}
                    className="profile-image rounded-2xl object-cover w-full h-auto"
                    priority
                  />
                </div>
              </Card3D>
            </div>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="custom-spotlight-card flex flex-col items-center justify-center p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-200 h-48 rounded-xl" spotlightColor="rgba(139, 92, 246, 0.3)">
              <FaGraduationCap className="text-5xl text-purple-400 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-200">Education</h3>
              <p className="text-center text-sm text-gray-300">
                {aboutInfo.education}
              </p>
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card flex flex-col items-center justify-center p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-200 h-48 rounded-xl" spotlightColor="rgba(59, 130, 246, 0.3)">
              <FaBriefcase className="text-5xl text-blue-400 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-200">Experience</h3>
              <p className="text-center text-sm text-gray-300">
                {aboutInfo.experience}
              </p>
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card flex flex-col items-center justify-center p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-200 h-48 rounded-xl" spotlightColor="rgba(34, 197, 94, 0.3)">
              <FaLaptopCode className="text-5xl text-green-400 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-200">Technologies</h3>
              <p className="text-center text-sm text-gray-300">
                {aboutInfo.technologies}
              </p>
            </SpotlightCard>

            <SpotlightCard className="custom-spotlight-card flex flex-col items-center justify-center p-6 bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 text-gray-200 h-48 rounded-xl" spotlightColor="rgba(250, 204, 21, 0.3)">
              <FaLightbulb className="text-5xl text-yellow-400 mb-3" />
              <h3 className="text-lg font-bold mb-2 text-gray-200">Exploring</h3>
              <p className="text-center text-sm text-gray-300">
                {aboutInfo.currentlyExploring.join(', ')}
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
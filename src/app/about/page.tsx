'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FaGraduationCap, FaBriefcase, FaLaptopCode, FaEye, FaLightbulb } from 'react-icons/fa';
import Image from 'next/image';
import Card3D from '@/components/ui/Card3D';
import AnimatedHeading from '@/components/ui/AnimatedHeading';

// Import content management utilities
import { getAboutInfo } from '@/utils/content';

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
  const line1Config = { text: aboutInfo.greeting + " ", gradientPart: aboutInfo.name };
  const roles = aboutInfo.roles;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Typing Line 1
    if (typedLine1.length < (line1Config.text + line1Config.gradientPart).length) {
      timeoutId = setTimeout(() => {
        setTypedLine1((line1Config.text + line1Config.gradientPart).substring(0, typedLine1.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    }

    // Typing/Erasing Line 2 (Roles)
    if (typedLine1.length === (line1Config.text + line1Config.gradientPart).length) {
      const currentRoleConfig = roles[currentRoleIndex];
      const line2StaticText = currentRoleConfig.prefix;
      const currentRoleName = currentRoleConfig.name;
      const fullLine2Text = line2StaticText + currentRoleName;

      // Pause condition: initial cycle done AND not triggered by hover to advance, AND not currently erasing
      if (animationCycleComplete && !hoverTriggered && !isErasing) {
        if (typedLine2 !== fullLine2Text) { // Ensure the paused role is fully displayed
             setTypedLine2(fullLine2Text);
        }
        return;
      }

      if (isErasing) {
        if (typedLine2.length > line2StaticText.length) { // Erase only the role name part
          timeoutId = setTimeout(() => {
            setTypedLine2(prev => prev.substring(0, prev.length - 1));
          }, erasingSpeed);
        } else { // Finished erasing current role name
          setIsErasing(false);
          setCurrentRoleIndex(prev => (prev + 1) % roles.length);
          // If hoverTriggered was true, the new role will start typing.
          // If it was the initial cycle, the new role will start typing.
        }
      } else { // Typing
        if (typedLine2.length < fullLine2Text.length) {
          const initialDelay = typedLine2.length === 0 && currentRoleIndex === 0 && !animationCycleComplete ? interLineDelay : 0;
          timeoutId = setTimeout(() => {
            setTypedLine2(fullLine2Text.substring(0, typedLine2.length + 1));
          }, initialDelay || typingSpeed);
        } else { // Finished typing current role
          if (!animationCycleComplete && currentRoleIndex === roles.length - 1) {
            // Just finished the *initial* full cycle (typed the last role)
            setAnimationCycleComplete(true);
            setHoverTriggered(false); // Ready for hover trigger, will pause here on the last role.
          } else if (hoverTriggered) {
            // Finished typing a role that was triggered by hover
            setHoverTriggered(false); // Pause now until next hover
          } else if (!animationCycleComplete) {
            // Still in the initial cycle, not the last role yet. Prepare to erase.
            timeoutId = setTimeout(() => {
              setIsErasing(true);
            }, interRoleDelay);
          }
          // If animationCycleComplete is true and hoverTriggered became false, it will pause.
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
    // Trigger if:
    // 1. Initial cycle is complete.
    // 2. Not currently in an animation triggered by a previous hover (hoverTriggered is false).
    // 3. Not currently erasing.
    // 4. The current role is fully typed.
    if (animationCycleComplete && !hoverTriggered && !isErasing &&
        typedLine2 === (currentRoleConfig.prefix + currentRoleConfig.name)) {
      setHoverTriggered(true);
      setIsErasing(true); // Start by erasing the current role to move to the next
    }
  };

  const renderLine1 = () => {
    const staticPartLength = line1Config.text.length;
    let displayedStatic = '';
    let displayedGradient = '';

    if (typedLine1.length <= staticPartLength) {
      displayedStatic = typedLine1;
    } else {
      displayedStatic = line1Config.text;
      displayedGradient = typedLine1.substring(staticPartLength);
    }
    const showCursor = typedLine1.length < (line1Config.text + line1Config.gradientPart).length;

    return (
      <>
        {displayedStatic}
        <span className="gradient-text">{displayedGradient}</span>
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
      <section className="section container mx-auto px-4">
        <div className="text-center mb-24">
          <AnimatedHeading
            as="h1"
            className="mb-4 text-6xl font-bold"
            staggerLetters={true}
            underlineWidth={0}
            gradientColors={['#3b82f6', '#8b5cf6']}
          >
            About Me
          </AnimatedHeading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          <div className="order-2 md:order-1">
            <h2
              className="text-3xl font-bold mb-6 cursor-default"
            >
              <span className="text-4xl md:text-5xl">{renderLine1()}</span>
              <br />
              <br />
              <br />
              {renderLine2()}
            </h2>
            {aboutInfo.bio.map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}

            <div className="mb-8">
              <Card3D
                className="inline-block"
                hoverScale={1.05}
                gradientShadow={false}
                glowOnHover={false}
              >
                <a
                  href="/resume"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow-md transition-all duration-300"
                >
                  <FaEye className="mr-2" /> View Resume/CV
                </a>
              </Card3D>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card3D
                className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-48"
                hoverScale={1.05}
                gradientShadow={false}
                glowOnHover={false}
              >
                <FaGraduationCap className="text-5xl text-accent mb-3" />
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                  {aboutInfo.education}
                </p>
              </Card3D>

              <Card3D
                className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-48"
                hoverScale={1.05}
                gradientShadow={false}
                glowOnHover={false}
              >
                <FaBriefcase className="text-5xl text-accent mb-3" />
                <h3 className="text-xl font-semibold mb-2">Experience</h3>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                  {aboutInfo.experience}
                </p>
              </Card3D>

              <Card3D
                className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-48"
                hoverScale={1.05}
                gradientShadow={false}
                glowOnHover={false}
              >
                <FaLaptopCode className="text-5xl text-accent mb-3" />
                <h3 className="text-xl font-semibold mb-2">Technologies</h3>
                <p className="text-center text-sm text-gray-700 dark:text-gray-300">
                  {aboutInfo.technologies}
                </p>
              </Card3D>

              <Card3D
                className="flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-48"
                hoverScale={1.05}
                gradientShadow={false}
                glowOnHover={false}
              >
                <FaLightbulb className="text-5xl text-yellow-400 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Currently Exploring</h3>
                <ul className="text-center text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  {aboutInfo.currentlyExploring.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Card3D>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:items-start">
            <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden md:-mt-96">
              <Image
                src="/images/1746994095136.jpg"
                alt="Anil's Profile"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full filter brightness-90"
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

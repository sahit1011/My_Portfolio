import React from 'react';
import AnimatedHeading from '@/components/ui/AnimatedHeading';
import ExpandingText from '@/components/ui/ExpandingText';

const TitleAnimationTest = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">🎨 Title Animation Test Suite</h1>

      {/* Test AnimatedHeading with staggered letters */}
      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-purple-600">AnimatedHeading with Staggered Letters:</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Two words - first normal, second gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold"
              staggerLetters={true}
              gradientColors={['#3b82f6', '#8b5cf6']}
              underlineWidth={0}
            >
              About Me
            </AnimatedHeading>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Two words - different gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold"
              staggerLetters={true}
              gradientColors={['#8b5cf6', '#ec4899']}
              underlineWidth={0}
            >
              My Projects
            </AnimatedHeading>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Two words - purple-blue gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold"
              staggerLetters={true}
              gradientColors={['#3b82f6', '#8b5cf6']}
              underlineWidth={0}
            >
              Work Experience
            </AnimatedHeading>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Three words - last two with gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-3xl font-bold"
              staggerLetters={true}
              gradientColors={['#10b981', '#3b82f6']}
              underlineWidth={0}
            >
              Featured Projects Section
            </AnimatedHeading>
          </div>
        </div>
      </div>

      {/* Test ExpandingText */}
      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-purple-600">ExpandingText with Gradient:</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Staggered children with gradient:</p>
            <ExpandingText
              className="text-3xl font-bold"
              gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
              staggerChildren={true}
            >
              Anil Sahith
            </ExpandingText>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Standard expanding text with gradient:</p>
            <ExpandingText
              className="text-2xl font-bold"
              gradientColors={['#f59e0b', '#ef4444']}
              staggerChildren={false}
            >
              Portfolio Title
            </ExpandingText>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Long text with staggered animation:</p>
            <ExpandingText
              className="text-xl font-bold"
              gradientColors={['#10b981', '#3b82f6', '#8b5cf6']}
              staggerChildren={true}
            >
              Software Engineer
            </ExpandingText>
          </div>
        </div>
      </div>

      {/* Test AnimatedHeading without staggered letters */}
      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-purple-600">AnimatedHeading without Staggered Letters:</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Standard heading with gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-3xl font-bold"
              staggerLetters={false}
              gradientColors={['#3b82f6', '#8b5cf6']}
              underlineWidth={0}
            >
              Contact Information
            </AnimatedHeading>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Single word with gradient:</p>
            <AnimatedHeading
              as="h2"
              className="text-4xl font-bold"
              staggerLetters={false}
              gradientColors={['#ec4899', '#8b5cf6']}
              underlineWidth={0}
            >
              Skills
            </AnimatedHeading>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Hover over each title to see the letter-by-letter animation</li>
          <li>The second word should maintain its gradient color throughout the animation</li>
          <li>No text should disappear during the hover animation</li>
          <li>Letters should move smoothly from left to right</li>
        </ul>
      </div>
    </div>
  );
};

export default TitleAnimationTest;

/*
COMPREHENSIVE FIXES APPLIED TO ALL HEADING COMPONENTS:

1. **AnimatedHeading.tsx**:
   ✅ Fixed staggered letter animation with gradient inheritance
   ✅ Added `color: 'inherit'` to preserve parent gradient styling
   ✅ Added `backgroundImage: 'inherit'`, `WebkitBackgroundClip: 'inherit'`, `backgroundClip: 'inherit'`
   ✅ Fixed both staggered and non-staggered animations
   ✅ Fixed fallback section for single words

2. **ExpandingText.tsx**:
   ✅ Fixed staggered children section with proper gradient handling
   ✅ Added `opacity: 1` to prevent disappearing issues
   ✅ Fixed both staggered and standard animations
   ✅ Ensured gradient properties are always applied with inline styles

3. **CSS Fixes (3d-effects.css)**:
   ✅ Removed conflicting gradient overrides in `.expanding-text:hover`
   ✅ Removed color overrides in `.staggered-text:hover span`
   ✅ Let components handle their own gradient styling

4. **Root Causes Fixed**:
   ✅ motion.span was overriding parent gradient styling
   ✅ CSS classes were conflicting with component gradient logic
   ✅ Letter-by-letter animations were losing gradient properties
   ✅ Opacity and color transitions were causing text to disappear

5. **Results**:
   ✅ All gradient text stays visible during animations
   ✅ Letter-by-letter animations work smoothly from left to right
   ✅ No more disappearing text during hover
   ✅ Consistent behavior across all heading components
   ✅ Works with both staggered and non-staggered animations
   ✅ Supports multiple words with different gradient applications

6. **Components Fixed**:
   ✅ AnimatedHeading (all variants)
   ✅ ExpandingText (all variants)
   ✅ CSS classes (.expanding-text, .staggered-text)
   ✅ All letter-by-letter animations throughout the portfolio
*/

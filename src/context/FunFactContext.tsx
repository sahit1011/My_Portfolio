'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import funFactsData from '@/data/funFacts.json';

interface FunFact {
  id: number;
  category: string;
  text: string;
}

interface FunFactContextType {
  currentFact: FunFact | null;
  showFact: boolean;
  dismissFact: () => void;
  disableAllFacts: () => void;
  areFactsEnabled: boolean;
}

const FunFactContext = createContext<FunFactContextType | undefined>(undefined);

export const useFunFact = () => {
  const context = useContext(FunFactContext);
  if (context === undefined) {
    throw new Error('useFunFact must be used within a FunFactProvider');
  }
  return context;
};

export const FunFactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentFact, setCurrentFact] = useState<FunFact | null>(null);
  const [showFact, setShowFact] = useState<boolean>(false);
  const [factsEnabled, setFactsEnabled] = useState<boolean>(true);
  const [shownFactIds, setShownFactIds] = useState<number[]>([]);

  // Refs to avoid dependency issues in useEffect
  const factsEnabledRef = useRef(factsEnabled);
  const shownFactIdsRef = useRef(shownFactIds);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const factIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update refs when state changes
  useEffect(() => {
    factsEnabledRef.current = factsEnabled;
  }, [factsEnabled]);

  useEffect(() => {
    shownFactIdsRef.current = shownFactIds;
  }, [shownFactIds]);

  // Get a random fact that hasn't been shown yet
  const getRandomFact = () => {
    const currentShownIds = shownFactIdsRef.current;
    const availableFacts = funFactsData.facts.filter(fact => !currentShownIds.includes(fact.id));

    // If all facts have been shown or almost all, reset the shown facts
    if (availableFacts.length <= 5) {
      return {
        fact: funFactsData.facts[Math.floor(Math.random() * funFactsData.facts.length)],
        resetIds: true
      };
    }

    return {
      fact: availableFacts[Math.floor(Math.random() * availableFacts.length)],
      resetIds: false
    };
  };

  // Dismiss the current fact
  const dismissFact = () => {
    setShowFact(false);

    // Clear any existing timeout
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
    }

    // After animation completes, clear the current fact
    dismissTimeoutRef.current = setTimeout(() => {
      setCurrentFact(null);
      dismissTimeoutRef.current = null;
    }, 300);
  };

  // Disable all facts
  const disableAllFacts = () => {
    setFactsEnabled(false);
    dismissFact();

    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('funFactsEnabled', 'false');
    }

    // Clear any existing interval
    if (factIntervalRef.current) {
      clearInterval(factIntervalRef.current);
      factIntervalRef.current = null;
    }
  };

  // Show a new fact
  const showNewFact = useCallback(() => {
    if (!factsEnabledRef.current) return;

    const { fact, resetIds } = getRandomFact();

    // Update state
    setCurrentFact(fact);

    if (resetIds) {
      setShownFactIds([fact.id]);
    } else {
      setShownFactIds(prev => [...prev, fact.id]);
    }

    setShowFact(true);

    // Clear any existing timeout
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
    }

    // Auto-dismiss after 20 seconds
    dismissTimeoutRef.current = setTimeout(() => {
      dismissFact();
      dismissTimeoutRef.current = null;
    }, 20000);
  }, [dismissFact, getRandomFact]);

  // Check if facts are enabled from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPreference = localStorage.getItem('funFactsEnabled');
      if (storedPreference === 'false') {
        setFactsEnabled(false);
      }
    }

    // Cleanup function
    return () => {
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }
    };
  }, []);

  // Set up the interval for showing facts
  useEffect(() => {
    if (!factsEnabled) return;

    // Set initial delay of 20 seconds before showing facts
    const initialTimer = setTimeout(() => {
      // Show first fact
      showNewFact();

      // Set interval for subsequent facts
      factIntervalRef.current = setInterval(showNewFact, 45000); // 20 seconds
    }, 20000); // 20 seconds initial delay

    // Cleanup function
    return () => {
      clearTimeout(initialTimer);
      if (factIntervalRef.current) {
        clearInterval(factIntervalRef.current);
      }
    };
  }, [factsEnabled, showNewFact]);

  return (
    <FunFactContext.Provider
      value={{
        currentFact,
        showFact,
        dismissFact,
        disableAllFacts,
        areFactsEnabled: factsEnabled
      }}
    >
      {children}
    </FunFactContext.Provider>
  );
};

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Prompt } from './types';
import { CATEGORIES, PLATFORMS, COUNTRIES } from './constants';
import { generatePrompts } from './services/geminiService';
import { viralPrompts } from './services/viralPromptsDb';
import Header from './components/Header';
import PromptCard from './components/PromptCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('Global');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const headerElement = headerRef.current;
    if (headerElement) {
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          setHeaderHeight(entry.contentRect.height);
        }
      });
      observer.observe(headerElement);
      return () => observer.disconnect();
    }
  }, []);
  
  const fetchAndSetPrompts = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedTags([]); // Reset tags on new fetch

    try {
      let promptsData: Prompt[] = [];
      if (category === 'Viral Trends') {
        // Load from local DB, no API call
        promptsData = viralPrompts;
      } else if (category === 'All') {
        // Load viral from DB and fetch others from API
        const generated = await generatePrompts('All');
        promptsData = [...viralPrompts, ...generated];
      } else {
        // Fetch specific category from API
        promptsData = await generatePrompts(category);
      }
      setPrompts(promptsData);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to generate prompts: ${e.message}. Please check your API key and try again.`);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(e);
      setPrompts([]); // Clear prompts on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch prompts when category changes
  useEffect(() => {
    fetchAndSetPrompts(selectedCategory);
  }, [selectedCategory, fetchAndSetPrompts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPlatform('All'); // Reset platform filter
    setSelectedTags([]); // Reset tags
    setDateRange(null); // Reset date range
  };

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    prompts.forEach(prompt => {
        prompt.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter(prompt => 
        selectedCategory === 'All' || prompt.category === selectedCategory
      )
      .filter(prompt => { // Client-side filtering for Viral Trends
        if (prompt.category === 'Viral Trends') {
          const countryMatch = selectedCountry === 'Global' || prompt.country === selectedCountry;
          const platformMatch = selectedPlatform === 'All' || prompt.platform === selectedPlatform;
          const dateMatch = !dateRange || (
            prompt.trendingDate &&
            new Date(prompt.trendingDate) >= new Date(dateRange.start) &&
            new Date(prompt.trendingDate) <= new Date(dateRange.end)
          );
          return countryMatch && platformMatch && dateMatch;
        }
        return true;
      })
      .filter(prompt => {
        if (selectedTags.length > 0) {
          if (!prompt.tags || prompt.tags.length === 0) return false;
          return selectedTags.every(tag => prompt.tags.includes(tag));
        }
        return true;
      })
      .filter(prompt => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        if (!lowerCaseSearchTerm) return true;
        const inPromptText = prompt.promptText.toLowerCase().includes(lowerCaseSearchTerm);
        const inTargetModel = prompt.targetModel.toLowerCase().includes(lowerCaseSearchTerm);
        const inTags = prompt.tags?.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm));
        return inPromptText || inTargetModel || inTags;
      });
  }, [prompts, searchTerm, selectedCategory, selectedPlatform, selectedTags, selectedCountry, dateRange]);

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark text-gray-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header
        ref={headerRef}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={CATEGORIES}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        platforms={PLATFORMS}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        countries={COUNTRIES}
        onDateRangeApply={setDateRange}
        allTags={allTags}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="container mx-auto px-4 pb-8 transition-all duration-300" style={{ paddingTop: `${headerHeight + 32}px` }}>
        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay message={error} />}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrompts.map((prompt, index) => (
              <PromptCard key={prompt.id} prompt={prompt} index={index} />
            ))}
          </div>
        )}
         {!isLoading && !error && filteredPrompts.length === 0 && (
           <div className="text-center py-16 text-gray-500 dark:text-slate-500">
             <h2 className="text-2xl font-bold">No Prompts Found</h2>
             <p className="mt-2">Try adjusting your search or filter criteria.</p>
           </div>
         )}
      </main>
    </div>
  );
};

export default App;

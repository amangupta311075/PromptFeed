import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Prompt } from './types';
import { CATEGORIES, PLATFORMS, COUNTRIES } from './constants';
import { generatePrompts } from './services/geminiService';
import Header from './components/Header';
import PromptCard from './components/PromptCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('Global');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const fetchPrompts = useCallback(async (country: string, dateRange?: { start: string; end: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedTags([]); // Reset tags on new fetch
      const generatedPrompts = await generatePrompts(country, dateRange);
      setPrompts(generatedPrompts);
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
  
  // Initial fetch and fetch on country change
  useEffect(() => {
    fetchPrompts(selectedCountry);
  }, [selectedCountry, fetchPrompts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedPlatform('All'); // Reset platform filter when category changes
    setSelectedTags([]); // Reset tags when category changes
  };

  const handleDateRangeApply = (dateRange: { start: string; end: string }) => {
    fetchPrompts(selectedCountry, dateRange);
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
      .filter(prompt =>
        selectedCategory !== 'Viral Trends' || selectedPlatform === 'All' || prompt.platform === selectedPlatform
      )
      .filter(prompt => {
        // Tag filtering: prompt must have all selected tags
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
        // Note: We don't search tags here anymore as it's handled by the dedicated tag filter
        return inPromptText || inTargetModel;
      });
  }, [prompts, searchTerm, selectedCategory, selectedPlatform, selectedTags]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header
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
        onDateRangeApply={handleDateRangeApply}
        allTags={allTags}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
      />
      <main className="container mx-auto px-4 py-8 pt-64 sm:pt-48 md:pt-40">
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
           <div className="text-center py-16 text-slate-500">
             <h2 className="text-2xl font-bold">No Prompts Found</h2>
             <p className="mt-2">Try adjusting your search or filter criteria.</p>
           </div>
         )}
      </main>
    </div>
  );
};

export default App;
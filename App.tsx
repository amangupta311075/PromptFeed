
import React, { useState, useEffect, useMemo } from 'react';
import type { Prompt } from './types';
import { CATEGORIES } from './constants';
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

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedPrompts = await generatePrompts();
        setPrompts(generatedPrompts);
      } catch (e) {
        if (e instanceof Error) {
          setError(`Failed to generate prompts: ${e.message}. Please check your API key and try again.`);
        } else {
          setError('An unknown error occurred.');
        }
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter(prompt => 
        selectedCategory === 'All' || prompt.category === selectedCategory
      )
      .filter(prompt => 
        prompt.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.targetModel.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [prompts, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={CATEGORIES}
      />
      <main className="container mx-auto px-4 py-8 pt-28 sm:pt-32">
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
             <p className="mt-2">Try adjusting your search or category filters.</p>
           </div>
         )}
      </main>
    </div>
  );
};

export default App;

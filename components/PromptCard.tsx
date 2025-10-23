import React, { useState } from 'react';
import type { Prompt } from '../types';
import { CATEGORY_COLORS, PLATFORM_COLORS } from '../constants';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import GlobeIcon from './icons/GlobeIcon';
import CalendarIcon from './icons/CalendarIcon';

interface PromptCardProps {
  prompt: Prompt;
  index: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const categoryColor = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['default'];
  const platformColor = prompt.platform ? (PLATFORM_COLORS[prompt.platform] || PLATFORM_COLORS['default']) : '';

  return (
    <div 
      className="bg-white dark:bg-brand-dark-blue rounded-lg border border-gray-200 dark:border-slate-800 p-5 flex flex-col justify-between transition-all duration-300 hover:border-brand-blue hover:shadow-2xl hover:shadow-brand-blue/10 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div>
        <div className="flex justify-between items-start mb-3 gap-2">
           <div className="flex flex-wrap gap-2 items-center">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
              {prompt.category}
            </span>
            {prompt.platform && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${platformColor}`}>
                {prompt.platform}
              </span>
            )}
            {prompt.country && prompt.country !== 'Global' && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300 border border-gray-200 dark:border-slate-600">
                <GlobeIcon />
                {prompt.country}
              </span>
            )}
            {prompt.trendingDate && (
                 <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-700/50 dark:text-slate-300 border border-gray-200 dark:border-slate-600">
                    <CalendarIcon />
                    {prompt.trendingDate}
                 </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-500 font-mono bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded shrink-0">
            {prompt.targetModel}
          </span>
        </div>
        <p className="text-gray-700 dark:text-slate-300 text-base leading-relaxed">
          {prompt.promptText}
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                {prompt.tags.map(tag => (
                <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                    #{tag}
                </span>
                ))}
            </div>
        )}
        <button
          onClick={handleCopy}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            isCopied
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-brand-blue hover:text-white dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-brand-blue dark:hover:text-white'
          }`}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          {isCopied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
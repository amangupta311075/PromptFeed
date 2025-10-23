import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';
import TagSearchBar from './TagSearchBar';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  platforms: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: string[];
  onDateRangeApply: (dateRange: { start: string; end: string }) => void;
  allTags: string[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedPlatform,
  onPlatformChange,
  platforms,
  selectedCountry,
  onCountryChange,
  countries,
  onDateRangeApply,
  allTags,
  selectedTags,
  onSelectedTagsChange,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApplyClick = () => {
    if (startDate && endDate) {
      onDateRangeApply({ start: startDate, end: endDate });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-10 p-4 transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Prompt<span className="text-brand-blue">Feed</span>
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative">
                <select
                    value={selectedCountry}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full sm:w-auto bg-slate-800 border border-slate-700 rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors cursor-pointer"
                    aria-label="Filter by country"
                >
                    {countries.map((country) => (
                        <option key={country} value={country}>
                          {country === 'Global' ? '🌎 ' : ''}{country}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>
         <div className="mt-4 flex flex-col md:flex-row items-center gap-2 w-full">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search prompt text..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                <SearchIcon />
              </div>
            </div>
            <div className="relative w-full md:w-2/3">
              <TagSearchBar 
                allTags={allTags}
                selectedTags={selectedTags}
                onSelectedTagsChange={onSelectedTagsChange}
              />
            </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategory === 'Viral Trends' && (
          <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-col items-center gap-3 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-2">
                {platforms.map((platform) => (
                <button
                    key={platform}
                    onClick={() => onPlatformChange(platform)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                    selectedPlatform === platform
                        ? 'bg-brand-pink text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    {platform}
                </button>
                ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                <span>to</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                <button onClick={handleApplyClick} disabled={!startDate || !endDate} className="px-3 py-1.5 bg-brand-blue text-white rounded-lg font-semibold disabled:bg-slate-700 disabled:cursor-not-allowed">Apply</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
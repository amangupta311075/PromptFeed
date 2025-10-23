import React, { useState, forwardRef } from 'react';
import SearchIcon from './icons/SearchIcon';
import TagSearchBar from './TagSearchBar';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import AllIcon from './icons/AllIcon';
import ImageIcon from './icons/ImageIcon';
import WritingIcon from './icons/WritingIcon';
import CodeIcon from './icons/CodeIcon';
import TrendingIcon from './icons/TrendingIcon';
import TikTokIcon from './icons/TikTokIcon';
import InstagramIcon from './icons/InstagramIcon';
import FacebookIcon from './icons/FacebookIcon';
import RedditIcon from './icons/RedditIcon';
import LogoIcon from './icons/LogoIcon';
import RefreshIcon from './icons/RefreshIcon';

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
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRefreshPrompts: () => void;
  isLoading: boolean;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'All': <AllIcon />,
  'Image Generation': <ImageIcon />,
  'Writing': <WritingIcon />,
  'Code': <CodeIcon />,
  'Viral Trends': <TrendingIcon />,
};

const platformIcons: { [key: string]: React.ReactNode } = {
  'All': <AllIcon size={20} />,
  'TikTok': <TikTokIcon />,
  'Instagram': <InstagramIcon />,
  'Facebook': <FacebookIcon />,
  'Reddit': <RedditIcon />,
};

const Header = forwardRef<HTMLElement, HeaderProps>(({
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
  theme,
  onToggleTheme,
  onRefreshPrompts,
  isLoading,
}, ref) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleApplyClick = () => {
    if (startDate && endDate) {
      onDateRangeApply({ start: startDate, end: endDate });
    }
  };

  const toggleSearch = () => setIsSearchVisible(prev => !prev);

  const isRefreshDisabled = selectedCategory === 'Viral Trends' || isLoading;

  return (
    <header ref={ref} className="fixed top-0 left-0 right-0 bg-brand-light/80 dark:bg-brand-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 z-10 p-4 transition-all duration-300">
      <div className="container mx-auto">
        <div className="flex justify-between items-center gap-4">
           <div className="flex items-center gap-2">
            <LogoIcon />
            <h1 className="text-2xl font-bold text-brand-dark dark:text-white tracking-tight">
              Prompt<span className="text-brand-blue">Feed</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="relative">
                <select
                    value={selectedCountry}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className="w-full sm:w-auto bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors cursor-pointer text-gray-800 dark:text-gray-200"
                    aria-label="Filter by country"
                >
                    {countries.map((country) => (
                        <option key={country} value={country}>
                          {country === 'Global' ? '🌎 ' : ''}{country}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 text-brand-dark dark:text-brand-light hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={onRefreshPrompts}
              disabled={isRefreshDisabled}
              className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 text-brand-dark dark:text-brand-light hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh prompts"
            >
              <RefreshIcon className={isLoading && selectedCategory !== 'Viral Trends' ? 'animate-spin' : ''} />
            </button>
             <button
              onClick={toggleSearch}
              className={`p-2 rounded-full transition-colors ${
                isSearchVisible 
                  ? 'bg-brand-blue/20 text-brand-blue' 
                  : 'bg-gray-200 dark:bg-slate-800 text-brand-dark dark:text-brand-light hover:bg-gray-300 dark:hover:bg-slate-700'
              }`}
              aria-label="Toggle search"
            >
              <SearchIcon />
            </button>
          </div>
        </div>
         <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSearchVisible ? 'max-h-40 mt-4' : 'max-h-0'}`}>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                <div className="relative w-full md:w-1/3">
                <input
                    type="text"
                    placeholder="Search prompt text..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-slate-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-500">
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
         </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
             <div key={category} className="relative group">
              <button
                onClick={() => onCategoryChange(category)}
                className={`p-3 rounded-full transition-all duration-200 ease-in-out ${
                  selectedCategory === category
                    ? 'bg-brand-blue text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
                aria-label={category}
              >
                {categoryIcons[category]}
              </button>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-brand-dark-blue text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {category}
              </div>
            </div>
          ))}
        </div>
        {selectedCategory === 'Viral Trends' && (
          <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-slate-800/50 flex flex-col items-center gap-3 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-3">
                {platforms.map((platform) => (
                  <div key={platform} className="relative group">
                    <button
                        onClick={() => onPlatformChange(platform)}
                        className={`p-2.5 rounded-full transition-all duration-200 ease-in-out ${
                        selectedPlatform === platform
                            ? 'bg-brand-pink text-white shadow-md scale-110'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                        }`}
                        aria-label={platform}
                    >
                      {platformIcons[platform]}
                    </button>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-brand-dark-blue text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        {platform}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="cursor-pointer bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 dark:text-gray-200" style={{ colorScheme: theme }} />
                <span>to</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="cursor-pointer bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue text-gray-800 dark:text-gray-200" style={{ colorScheme: theme }} />
                <button onClick={handleApplyClick} disabled={!startDate || !endDate} className="px-3 py-1.5 bg-brand-blue text-white rounded-lg font-semibold disabled:bg-slate-700 disabled:cursor-not-allowed">Apply</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
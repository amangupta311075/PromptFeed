
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-10 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Prompt<span className="text-brand-blue">Feed</span>
          </h1>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue transition-colors"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </div>
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
      </div>
    </header>
  );
};

export default Header;

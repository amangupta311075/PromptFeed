import React, { useState, useEffect, useRef } from 'react';
import XIcon from './icons/XIcon';

interface TagSearchBarProps {
    allTags: string[];
    selectedTags: string[];
    onSelectedTagsChange: (tags: string[]) => void;
}

const TagSearchBar: React.FC<TagSearchBarProps> = ({ allTags, selectedTags, onSelectedTagsChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputValue) {
            const filteredSuggestions = allTags
                .filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase()))
                .filter(tag => !selectedTags.includes(tag))
                .slice(0, 10); // Limit suggestions
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [inputValue, allTags, selectedTags]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectTag = (tag: string) => {
        onSelectedTagsChange([...selectedTags, tag]);
        setInputValue('');
        setSuggestions([]);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onSelectedTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const showSuggestions = isFocused && suggestions.length > 0;

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="flex flex-wrap items-center w-full bg-slate-800 border border-slate-700 rounded-lg p-1 pr-2 focus-within:ring-2 focus-within:ring-brand-blue transition-colors">
                <div className="flex flex-wrap gap-1 items-center">
                    {selectedTags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 bg-brand-blue/30 text-brand-blue text-xs font-semibold px-2 py-1 rounded">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="text-brand-blue hover:text-white">
                                <XIcon />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder={selectedTags.length > 0 ? "Add more tags..." : "Search by tags..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="flex-grow bg-transparent p-1 pl-2 text-sm focus:outline-none min-w-[120px]"
                />
            </div>
            {showSuggestions && (
                <ul className="absolute z-20 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in">
                    {suggestions.map(tag => (
                        <li
                            key={tag}
                            onClick={() => handleSelectTag(tag)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-brand-blue hover:text-white"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagSearchBar;

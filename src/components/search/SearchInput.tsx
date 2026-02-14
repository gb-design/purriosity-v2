import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import SearchResultsDropdown from './SearchResultsDropdown';
import { cn } from '../../lib/utils'; // Assuming you have a utils file for merging classes

interface SearchInputProps {
    className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
    const { searchTerm, setSearchTerm, results, suggestions, isLoading } = useSearch();
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const showDropdown = isFocused && searchTerm.trim().length > 0;

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Suche nach Produkten..."
                    className="w-full pl-10 pr-10 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all [&::-webkit-search-cancel-button]:hidden"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <SearchResultsDropdown
                results={results}
                suggestions={suggestions}
                isLoading={isLoading}
                isVisible={showDropdown}
                onClose={() => setIsFocused(false)}
                onSelectSuggestion={(term: string) => {
                    setSearchTerm(term);
                    // Keep focus to allow refined search or just execute
                }}
            />
        </div>
    );
}

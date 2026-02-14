import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { Loader2 } from 'lucide-react';

interface SearchResultsDropdownProps {
    results: Product[];
    suggestions: string[];
    isLoading: boolean;
    isVisible: boolean;
    onClose: () => void;
    onSelectSuggestion: (term: string) => void;
}

export default function SearchResultsDropdown({ results, suggestions, isLoading, isVisible, onClose, onSelectSuggestion }: SearchResultsDropdownProps) {
    if (!isVisible) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
            {isLoading ? (
                <div className="p-4 flex justify-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Suche...</span>
                </div>
            ) : (
                <div className="py-2">
                    {/* Suggestions Section */}
                    {suggestions.length > 0 && (
                        <div className="border-b border-border pb-2 mb-2">
                            <h3 className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Vorschläge
                            </h3>
                            {suggestions.map((term) => (
                                <button
                                    key={term}
                                    onClick={() => onSelectSuggestion(term)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2"
                                >
                                    <span className="text-primary">🔍</span>
                                    <span>{term}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Products Section */}
                    {results.length > 0 ? (
                        <>
                            {suggestions.length > 0 && (
                                <h3 className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                                    Produkte
                                </h3>
                            )}
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                                    onClick={onClose}
                                >
                                    <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            Mehr Infos
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </>
                    ) : (
                        suggestions.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Keine Ergebnisse gefunden.
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}


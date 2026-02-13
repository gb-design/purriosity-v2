import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { Loader2 } from 'lucide-react';

interface SearchResultsDropdownProps {
    results: Product[];
    isLoading: boolean;
    isVisible: boolean;
    onClose: () => void;
}

export default function SearchResultsDropdown({ results, isLoading, isVisible, onClose }: SearchResultsDropdownProps) {
    if (!isVisible) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden z-50">
            {isLoading ? (
                <div className="p-4 flex justify-center text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Searching...</span>
                </div>
            ) : results.length > 0 ? (
                <div className="py-2">
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
                                    {product.price} {product.currency}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                    No results found.
                </div>
            )}
        </div>
    );
}

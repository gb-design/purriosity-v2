import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
                            Purriosity
                        </h1>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Suche nach Produkten..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        disabled
                    >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Login</span>
                    </button>
                </div>

                {/* Search Bar - Mobile */}
                <div className="md:hidden mt-4">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Suche nach Produkten..."
                            className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            disabled
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import SearchInput from '../search/SearchInput';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

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
                        <SearchInput />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-primary" />
                            ) : (
                                <Sun className="h-5 w-5 text-primary" />
                            )}
                        </button>

                        {/* Login Button - Desktop */}
                        <button
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            disabled
                        >
                            <User className="h-4 w-4" />
                            <span>Login</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-primary"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 top-[73px] z-50 bg-background/95 backdrop-blur animate-in slide-in-from-top-5 duration-300 md:hidden flex flex-col p-6 overflow-y-auto h-[calc(100vh-73px)]">
                        <nav className="flex flex-col gap-6 text-xl font-medium text-center mt-8">
                            <Link to="/" className="hover:text-primary transition-colors py-2">
                                Startseite
                            </Link>
                            <Link to="/story" className="hover:text-primary transition-colors py-2">
                                Unsere Story
                            </Link>
                            <Link to="/login" className="hover:text-primary transition-colors py-2">
                                Login / Registrieren
                            </Link>
                        </nav>

                        <div className="mt-12 flex justify-center">
                            <p className="text-sm text-muted-foreground/50">
                                © 2024 Purriosity
                            </p>
                        </div>
                    </div>
                )}

                {/* Search Bar - Mobile */}
                <div className="md:hidden mt-4">
                    <SearchInput />
                </div>
            </div>
        </header>
    );
}

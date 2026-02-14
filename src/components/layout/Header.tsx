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
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
            <div className="container mx-auto px-4 py-3">

                {/* Main Header Row */}
                <div className="flex items-center justify-between gap-2 md:gap-4">

                    {/* LEFT: Logo */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">
                            Purriosity
                        </h1>
                    </Link>

                    {/* CENTER: Search Bar (Desktop Only - Flexible Width) */}
                    <div className="hidden md:flex flex-1 max-w-2xl px-2 lg:px-6 justify-center">
                        <div className="w-full">
                            <SearchInput />
                        </div>
                    </div>

                    {/* RIGHT: Nav & Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 mr-2 xl:mr-4">
                            <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                                Magazin
                            </Link>
                            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors whitespace-nowrap">
                                Über uns
                            </Link>
                        </nav>

                        {/* Login Button (Hidden on small mobile) */}
                        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap text-sm font-medium">
                            <User className="h-4 w-4" />
                            <span>Login</span>
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5 text-foreground" />
                            ) : (
                                <Sun className="h-5 w-5 text-foreground" />
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-foreground"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar (Always Visible Stacked) */}
                <div className="md:hidden mt-3 pb-1 w-full">
                    <SearchInput />
                </div>
            </div>

            {/* Mobile Menu Overlay (Nav Links Only) */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background border-b border-border p-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-4 text-center">
                        <Link to="/" className="text-lg font-medium hover:text-primary py-2 block" onClick={() => setIsMenuOpen(false)}>
                            Startseite
                        </Link>
                        <Link to="/blog" className="text-lg font-medium hover:text-primary py-2 block" onClick={() => setIsMenuOpen(false)}>
                            Magazin
                        </Link>
                        <Link to="/about" className="text-lg font-medium hover:text-primary py-2 block" onClick={() => setIsMenuOpen(false)}>
                            Über uns
                        </Link>
                        <div className="border-t border-border pt-4">
                            <Link to="/login" className="text-lg font-medium hover:text-primary py-2 block text-primary" onClick={() => setIsMenuOpen(false)}>
                                Login / Registrieren
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

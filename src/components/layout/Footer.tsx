import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background-secondary mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="font-display text-2xl font-bold text-primary mb-4">Purriosity</h2>
                        <p className="text-text-secondary text-sm mb-4">
                            Die verrückteste Fundgrube für Katzenliebhaber. Kuratierte Produkte, die du
                            nirgendwo anders findest.
                        </p>
                        {/* Newsletter */}
                        <div className="flex gap-2 max-w-sm">
                            <input
                                type="email"
                                placeholder="Deine E-Mail"
                                className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                disabled
                            />
                            <button
                                className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                                disabled
                            >
                                Abonnieren
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Über uns</h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors">
                                    Unsere Story
                                </Link>
                            </li>
                            <li>
                                <Link to="/disclaimer" className="hover:text-primary transition-colors">
                                    Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link to="/impressum" className="hover:text-primary transition-colors">
                                    Impressum
                                </Link>
                            </li>
                            <li>
                                <Link to="/datenschutz" className="hover:text-primary transition-colors">
                                    Datenschutz
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Folge uns</h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:hello@purriosity.com"
                                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="E-Mail"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-border text-center text-sm text-text-secondary">
                    <p>© {new Date().getFullYear()} Purriosity. Alle Rechte vorbehalten.</p>
                    <p className="mt-2 text-xs">
                        * Affiliate-Links: Wir erhalten eine kleine Provision, wenn du über unsere Links
                        einkaufst. Für dich entstehen keine zusätzlichen Kosten.
                    </p>
                </div>
            </div>
        </footer>
    );
}

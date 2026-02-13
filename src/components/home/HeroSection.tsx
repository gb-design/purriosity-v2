export default function HeroSection() {
    const scrollToGrid = () => {
        const gridElement = document.getElementById('product-grid');
        if (gridElement) {
            gridElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative bg-gradient-to-br from-background via-background-secondary to-accent-yellow/10 py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                {/* Main Claim */}
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
                    Die verrückteste Fundgrube für{' '}
                    <span className="text-primary">Katzenliebhaber</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto text-balance">
                    Kuratierte Katzenprodukte, die du nirgendwo anders findest – von süß bis skurril,
                    von praktisch bis luxuriös.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={scrollToGrid}
                        className="px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 font-semibold text-lg shadow-lg"
                    >
                        Entdecke unsere Fundgrube
                    </button>
                    <a
                        href="/about"
                        className="px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 font-semibold text-lg"
                    >
                        Unsere Story
                    </a>
                </div>

                {/* Decorative Element (optional) */}
                <div className="mt-12 text-6xl animate-bounce">🐱</div>
            </div>
        </section>
    );
}

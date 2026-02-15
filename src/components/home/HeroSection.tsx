export default function HeroSection() {
  const scrollToGrid = () => {
    const gridElement = document.getElementById('product-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full py-20 px-4 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background-secondary to-background text-center">
      {/* Background Pattern */}
      <div className="bg-pattern-overlay opacity-100" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Main Claim */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
          Die verrückteste Fundgrube für <span className="text-primary">Katzenfans</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto text-balance">
          Kuratierte Katzenprodukte, die du nirgendwo anders findest – von süß bis skurril, von
          praktisch bis luxuriös.
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
        <div className="mt-25 text-6xl animate-bounce">🐱</div>
      </div>
    </div>
  );
}

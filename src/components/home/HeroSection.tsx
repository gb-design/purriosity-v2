import ShinyText from '../ui/ShinyText';
import { RevealItem, RevealSection } from '../motion/ScrollReveal';

export default function HeroSection() {
  const scrollToGrid = () => {
    const gridElement = document.getElementById('product-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full py-20 px-4 md:py-32 overflow-hidden bg-gradient-to-b from-background via-background-secondary to-background text-center">
      {/* Background Pattern */}
      <div className="bg-pattern-overlay opacity-100" />

      <RevealSection className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Main Claim */}
        <RevealItem>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance">
            Die verrückteste Fundgrube für{' '}
            <ShinyText
              text="Katzenfans"
              speed={3}
              delay={0}
              color="#bb71dc"
              shineColor="#F2D5FF"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover
              disabled={false}
            />
          </h1>
        </RevealItem>

        {/* Subheadline */}
        <RevealItem soft>
          <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto text-balance">
            Kuratierte Katzenprodukte, die du nirgendwo anders findest – von süß bis skurril, von
            praktisch bis luxuriös.
          </p>
        </RevealItem>

        {/* CTAs */}
        <RevealItem soft>
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
        </RevealItem>

        {/* Decorative Element (optional) */}
        <RevealItem>
          <div className="mt-[2rem] md:mt-[1.5rem] text-6xl hero-cat-float">🐱</div>
        </RevealItem>
      </RevealSection>
    </section>
  );
}

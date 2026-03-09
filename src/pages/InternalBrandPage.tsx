type ColorToken = {
  name: string;
  usage: string;
  cssVar: string;
  hex: string;
  hsl: string;
};

const lightColors: ColorToken[] = [
  { name: 'Background', usage: 'Seitenhintergrund', cssVar: '--background', hex: '#FFF9F0', hsl: '36 100% 97%' },
  { name: 'Background Secondary', usage: 'Sektionen / Panels', cssVar: '--background-secondary', hex: '#FFF5E6', hsl: '36 100% 95%' },
  { name: 'Text Primary', usage: 'Standard-Fliesstext', cssVar: '--text', hex: '#2C2C2C', hsl: '0 0% 17%' },
  { name: 'Text Secondary', usage: 'Meta-Texte', cssVar: '--text-secondary', hex: '#6B6B6B', hsl: '0 0% 42%' },
  { name: 'Primary', usage: 'Buttons / CTAs / Links', cssVar: '--primary', hex: '#9B59B6', hsl: '282 44% 53%' },
  { name: 'Primary Light', usage: 'Hover / Flache Highlights', cssVar: '--primary-light', hex: '#BB8FCE', hsl: '282 44% 68%' },
  { name: 'Primary Dark', usage: 'Kontrast in Akzenten', cssVar: '--primary-dark', hex: '#7D3C98', hsl: '282 44% 42%' },
  { name: 'Accent Yellow', usage: 'Highlight-Chips', cssVar: '--accent-yellow', hex: '#FFD93D', hsl: '48 100% 62%' },
  { name: 'Accent Orange', usage: 'Warnung / Promo-Elemente', cssVar: '--accent-orange', hex: '#FF9F45', hsl: '29 100% 64%' },
  { name: 'Border', usage: 'Linien / Inputs', cssVar: '--border', hex: '#F4E5D1', hsl: '39 50% 90%' },
];

const darkColors: ColorToken[] = [
  { name: 'Background', usage: 'Seitenhintergrund', cssVar: '--background', hex: '#16121A', hsl: '280 10% 8%' },
  { name: 'Background Secondary', usage: 'Sektionen / Panels', cssVar: '--background-secondary', hex: '#221D26', hsl: '280 10% 12%' },
  { name: 'Text Primary', usage: 'Standard-Fliesstext', cssVar: '--text', hex: '#F7F3EE', hsl: '36 30% 96%' },
  { name: 'Text Secondary', usage: 'Meta-Texte', cssVar: '--text-secondary', hex: '#B8B0C2', hsl: '280 10% 70%' },
  { name: 'Primary', usage: 'Buttons / CTAs / Links', cssVar: '--primary', hex: '#C37BDB', hsl: '282 60% 65%' },
  { name: 'Primary Light', usage: 'Hover / Flache Highlights', cssVar: '--primary-light', hex: '#D9A8EA', hsl: '282 60% 75%' },
  { name: 'Primary Dark', usage: 'Kontrast in Akzenten', cssVar: '--primary-dark', hex: '#AD5FD0', hsl: '282 60% 55%' },
  { name: 'Accent Yellow', usage: 'Highlight-Chips', cssVar: '--accent-yellow', hex: '#F5D43D', hsl: '48 90% 60%' },
  { name: 'Accent Orange', usage: 'Warnung / Promo-Elemente', cssVar: '--accent-orange', hex: '#F49A42', hsl: '29 90% 60%' },
  { name: 'Border', usage: 'Linien / Inputs', cssVar: '--border', hex: '#3D2E45', hsl: '280 20% 20%' },
];

function ColorCard({ color }: { color: ColorToken }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div
        className="h-14 w-full rounded-xl border border-border"
        style={{ backgroundColor: `hsl(var(${color.cssVar}))` }}
      />
      <div className="mt-3 space-y-1">
        <p className="font-semibold text-sm text-foreground">{color.name}</p>
        <p className="text-xs text-text-secondary">{color.usage}</p>
        <p className="text-xs text-text-secondary font-mono">{color.hex}</p>
        <p className="text-xs text-text-secondary font-mono">{color.cssVar}: {color.hsl}</p>
      </div>
    </div>
  );
}

export default function InternalBrandPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="bg-pattern-overlay opacity-40" aria-hidden="true" />

      <section className="relative z-10 container mx-auto px-4 py-14 md:py-20">
        <div className="rounded-3xl border border-border bg-background/85 backdrop-blur-sm p-6 md:p-10 shadow-sm">
          <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Internes Brand Profil
          </p>
          <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-foreground leading-tight">
            Purriosity in einem Blick
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg text-text-secondary leading-relaxed">
            Purriosity ist die kuratierte Produktwelt fuer Katzenliebhaber: verspielt, warm und glaubwuerdig.
            Der Markenkern verbindet Editorial-Qualitaet mit einem freundlichen, entdeckungsorientierten Einkaufserlebnis.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Mission</p>
              <p className="mt-2 text-sm text-foreground">Produkte sichtbar machen, die Katzen und Menschen Freude bringen.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Tonality</p>
              <p className="mt-2 text-sm text-foreground">Herzlich, intelligent, leicht verspielt. Keine Buzzword-Sprache.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Design Prinzip</p>
              <p className="mt-2 text-sm text-foreground">Sanfte Flaechen, klarer Fokus, markanter violetter CTA-Akzent.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">Farbpalette Light Mode</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {lightColors.map((color) => (
            <ColorCard key={color.cssVar} color={color} />
          ))}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">Farbpalette Dark Mode</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {darkColors.map((color) => (
            <ColorCard key={`dark-${color.cssVar}`} color={color} />
          ))}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground">Typografie</h3>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Primary Font</p>
                <p className="mt-2 text-2xl font-semibold">Outfit</p>
                <p className="mt-1 text-sm text-text-secondary">Einsatz fuer Headlines, Navigation und Body (aktuell als `font-sans`).</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Fallback Stack</p>
                <p className="mt-2 text-sm font-mono text-foreground">Outfit, system-ui, sans-serif</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h3 className="text-xl font-semibold text-foreground">UI-Bausteine</h3>
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                  Primary CTA
                </button>
                <button className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground">
                  Secondary
                </button>
                <span className="inline-flex items-center rounded-full bg-accent-yellow/30 px-4 py-2 text-xs font-semibold text-foreground">
                  Highlight Tag
                </span>
              </div>
              <div className="rounded-2xl bg-background-secondary p-4">
                <p className="text-sm text-text-secondary">
                  Radius-Standard: <span className="font-mono text-foreground">12px (0.75rem)</span>.
                  Cards und Panels sind weich gerundet, Schatten bleiben dezent.
                </p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-text-secondary">Bildsprache</p>
                <p className="mt-2 text-sm text-foreground">
                  Hell, warm, produktfokussiert. Katzen bleiben emotionaler Kontext, nicht visuelle Ueberladung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

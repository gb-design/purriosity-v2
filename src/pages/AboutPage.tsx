import { Sparkles, Heart, PawPrint, Star, Users, Rocket } from 'lucide-react';
import Silk from '../components/ui/Silk';
import { motion } from 'motion/react';
import { RevealItem, RevealSection } from '../components/motion/ScrollReveal';

const teamMembers = [
  {
    name: 'Mila Stern',
    role: 'Cat Curator',
    bio: 'Sucht weltweit nach den verrücktesten Produkten für Fellnasen.',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Leo Berg',
    role: 'Story Creator',
    bio: 'Verleiht jedem Produkt eine Portion Charme und Persönlichkeit.',
    image:
      'https://images.unsplash.com/photo-1544723795-432537f10232?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nia Walker',
    role: 'Community Wizard',
    bio: 'Pflegt die Purriosity-Familie und sammelt Feedback aus der Community.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  },
];

const milestones = [
  { year: '2023', text: 'Purriosity startet als kuratierter Newsletter für Katzenfans.' },
  { year: '2024', text: 'Launch der Fundgrube mit 100+ handverlesenen Produkten.' },
  { year: 'Heute', text: 'Community wächst täglich, neue Kategorien, neue Missionen.' },
];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
        </div>
        <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <RevealSection className="container mx-auto px-4 py-16 lg:py-24 relative z-10 grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <RevealItem>
              <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
                Über uns
              </p>
            </RevealItem>
            <RevealItem>
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                Wir feiern die verrückteste Liebe der Welt: die zu unseren Katzen.
              </h1>
            </RevealItem>
            <RevealItem soft>
              <p className="text-lg text-text-secondary">
                Purriosity ist ein Herzensprojekt. Wir kuratieren Fundstücke, erzählen Geschichten
                und schaffen einen digitalen Spielplatz für alle, die ihre Katzen mehr feiern wollen
                als alles andere.
              </p>
            </RevealItem>
            <RevealItem soft>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 shadow">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Handverlesen</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 shadow">
                  <Heart className="h-4 w-4 text-rose-500" />
                  <span className="text-sm font-semibold">Community First</span>
                </div>
              </div>
            </RevealItem>
          </div>
          <div className="grid gap-4">
            <RevealItem>
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/60">
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  <PawPrint className="h-5 w-5" />
                  Mission
                </div>
                <p className="mt-3 text-text-secondary">
                  Katzenprodukte, die wirklich Freude machen – kuratiert, getestet, mit Humor
                  erklärt.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/60">
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  <Rocket className="h-5 w-5" />
                  Vision
                </div>
                <p className="mt-3 text-text-secondary">
                  Die erste Adresse für Cat-Content, Cat-Commerce und Cat-Community in Europa.
                </p>
              </div>
            </RevealItem>
            <RevealItem>
              <div className="bg-card rounded-3xl p-6 shadow-inner border border-border/60">
                <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                  <Star className="h-5 w-5" />
                  Unser Versprechen
                </div>
                <p className="mt-3 text-text-secondary">
                  Transparent kuratiert, liebevoll verpackt und immer ein bisschen verspielt.
                </p>
              </div>
            </RevealItem>
          </div>
        </RevealSection>
      </section>

      <section className="container mx-auto px-4 py-16">
        <RevealSection className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Heart className="h-6 w-6 text-rose-500" />,
              label: 'Community-Liebe',
              value: '25k+',
            },
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              label: 'Empfohlene Shops',
              value: '120+',
            },
            {
              icon: <PawPrint className="h-6 w-6 text-amber-500" />,
              label: 'Katze-l approved',
              value: '∞',
            },
          ].map((stat) => (
            <RevealItem
              key={stat.label}
              className="bg-card rounded-2xl border border-border/60 p-6 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3 text-text-secondary text-sm font-semibold">
                <motion.span
                  whileInView={{ rotate: [0, -10, 0], scale: [1, 1.08, 1] }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                >
                  {stat.icon}
                </motion.span>
                {stat.label}
              </div>
              <p className="text-3xl font-display font-bold">{stat.value}</p>
            </RevealItem>
          ))}
        </RevealSection>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <RevealSection>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <RevealItem>
              <p className="uppercase text-xs tracking-[0.4em] text-primary font-semibold">
                Unser Team
              </p>
            </RevealItem>
            <RevealItem>
              <h2 className="text-3xl font-display font-bold mt-2">Die Menschen hinter Purriosity</h2>
            </RevealItem>
            <RevealItem soft>
              <p className="text-text-secondary mt-4">
                Wir sind kleine Katzennerds mit großen Ideen. Hier ist eine Auswahl des Kernteams –
                der Rest sitzt vermutlich gerade auf einem Karton.
              </p>
            </RevealItem>
          </div>
        </RevealSection>
        <RevealSection className="grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <RevealItem
              key={member.name}
              className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden"
            >
              <img src={member.image} alt={member.name} className="h-60 w-full object-cover" />
              <div className="p-6 space-y-2">
                <p className="text-sm uppercase tracking-wide text-primary font-semibold">
                  {member.role}
                </p>
                <h3 className="text-xl font-display font-bold">{member.name}</h3>
                <p className="text-text-secondary text-sm">{member.bio}</p>
              </div>
            </RevealItem>
          ))}
        </RevealSection>
      </section>

      <section className="bg-card border-y border-border/60">
        <RevealSection className="container mx-auto px-4 py-16 space-y-10">
          <div className="text-center">
            <RevealItem>
              <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
                Milestones
              </p>
            </RevealItem>
            <RevealItem>
              <h2 className="text-3xl font-display font-bold mt-2">Unser Weg</h2>
            </RevealItem>
          </div>
          <RevealItem className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="grid gap-10 md:grid-cols-2">
              {milestones.map((item, index) => (
                <RevealItem
                  key={item.year}
                  className={`bg-background border border-border/60 rounded-2xl p-6 shadow-sm ${index % 2 === 0 ? 'md:translate-y-6' : ''}`}
                >
                  <p className="text-primary font-semibold">{item.year}</p>
                  <p className="mt-2 text-lg font-display">{item.text}</p>
                </RevealItem>
              ))}
            </div>
          </RevealItem>
        </RevealSection>
      </section>

      <section className="container mx-auto px-4 py-16">
        <RevealSection className="bg-gradient-to-r from-primary to-rose-500 text-white rounded-3xl p-10 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-from),_transparent_45%)] animate-pulse" />
          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <RevealItem>
                <p className="uppercase text-xs tracking-[0.4em] mb-4">Community</p>
              </RevealItem>
              <RevealItem>
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Werde Teil der Purriosity-Crew
                </h2>
              </RevealItem>
              <RevealItem soft>
                <p className="mt-4 text-lg">
                  Melde dich für den Newsletter an, teile Produkte mit uns oder schicke uns dein
                  Lieblingsfoto – wir wollen alles sehen.
                </p>
              </RevealItem>
            </div>
            <div className="flex flex-col gap-4">
              <RevealItem soft className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                <PawPrint className="h-6 w-6" />
                <span className="text-lg font-semibold">Tägliche Inspiration</span>
              </RevealItem>
              <RevealItem soft className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                <Heart className="h-6 w-6" />
                <span className="text-lg font-semibold">Giveaways & Events</span>
              </RevealItem>
              <RevealItem>
                <button className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold text-lg shadow-lg hover:scale-105 transition-all">
                  Newsletter abonnieren
                </button>
              </RevealItem>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}

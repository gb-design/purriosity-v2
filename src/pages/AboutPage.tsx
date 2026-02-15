import { Sparkles, Heart, PawPrint, Star, Users, Rocket } from 'lucide-react';

const teamMembers = [
  {
    name: 'Mila Stern',
    role: 'Cat Curator',
    bio: 'Sucht weltweit nach den verrücktesten Produkten für Fellnasen.',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Leo Berg',
    role: 'Story Creator',
    bio: 'Verleiht jedem Produkt eine Portion Charme und Persönlichkeit.',
    image: 'https://images.unsplash.com/photo-1544723795-432537f10232?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nia Walker',
    role: 'Community Wizard',
    bio: 'Pflegt die Purriosity-Familie und sammelt Feedback aus der Community.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
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
        <div className="absolute -top-32 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10 grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">Über uns</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Wir feiern die verrückteste Liebe der Welt: die zu unseren Katzen.
            </h1>
            <p className="text-lg text-text-secondary">
              Purriosity ist ein Herzensprojekt. Wir kuratieren Fundstücke, erzählen Geschichten und schaffen einen digitalen Spielplatz für alle, die ihre Katzen mehr feiern wollen als alles andere.
            </p>
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
          </div>
          <div className="grid gap-4">
            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/60">
              <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                <PawPrint className="h-5 w-5" />
                Mission
              </div>
              <p className="mt-3 text-text-secondary">
                Katzenprodukte, die wirklich Freude machen – kuratiert, getestet, mit Humor erklärt.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-6 shadow-lg border border-border/60">
              <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                <Rocket className="h-5 w-5" />
                Vision
              </div>
              <p className="mt-3 text-text-secondary">
                Die erste Adresse für Cat-Content, Cat-Commerce und Cat-Community in Europa.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-6 shadow-inner border border-border/60">
              <div className="flex items-center gap-3 text-sm font-semibold text-primary">
                <Star className="h-5 w-5" />
                Unser Versprechen
              </div>
              <p className="mt-3 text-text-secondary">
                Transparent kuratiert, liebevoll verpackt und immer ein bisschen verspielt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <Heart className="h-6 w-6 text-rose-500" />, label: 'Community-Liebe', value: '25k+' },
            { icon: <Users className="h-6 w-6 text-primary" />, label: 'Empfohlene Shops', value: '120+' },
            { icon: <PawPrint className="h-6 w-6 text-amber-500" />, label: 'Katze-l approved', value: '∞' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border/60 p-6 flex flex-col gap-2">
              <div className="flex items-center gap-3 text-text-secondary text-sm font-semibold">
                {stat.icon}
                {stat.label}
              </div>
              <p className="text-3xl font-display font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="uppercase text-xs tracking-[0.4em] text-primary font-semibold">Unser Team</p>
          <h2 className="text-3xl font-display font-bold mt-2">Die Menschen hinter Purriosity</h2>
          <p className="text-text-secondary mt-4">
            Wir sind kleine Katzennerds mit großen Ideen. Hier ist eine Auswahl des Kernteams – der Rest sitzt vermutlich gerade auf einem Karton.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden">
              <img src={member.image} alt={member.name} className="h-60 w-full object-cover" />
              <div className="p-6 space-y-2">
                <p className="text-sm uppercase tracking-wide text-primary font-semibold">{member.role}</p>
                <h3 className="text-xl font-display font-bold">{member.name}</h3>
                <p className="text-text-secondary text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border-y border-border/60">
        <div className="container mx-auto px-4 py-16 space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">Milestones</p>
            <h2 className="text-3xl font-display font-bold mt-2">Unser Weg</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="grid gap-10 md:grid-cols-2">
              {milestones.map((item, index) => (
                <div key={item.year} className={`bg-background border border-border/60 rounded-2xl p-6 shadow-sm ${index % 2 === 0 ? 'md:translate-y-6' : ''}`}>
                  <p className="text-primary font-semibold">{item.year}</p>
                  <p className="mt-2 text-lg font-display">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-rose-500 text-white rounded-3xl p-10 lg:p-14 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-from),_transparent_45%)] animate-pulse" />
          <div className="relative z-10 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <p className="uppercase text-xs tracking-[0.4em] mb-4">Community</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Werde Teil der Purriosity-Crew</h2>
              <p className="mt-4 text-lg">
                Melde dich für den Newsletter an, teile Produkte mit uns oder schicke uns dein Lieblingsfoto – wir wollen alles sehen.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                <PawPrint className="h-6 w-6" />
                <span className="text-lg font-semibold">Tägliche Inspiration</span>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
                <Heart className="h-6 w-6" />
                <span className="text-lg font-semibold">Giveaways & Events</span>
              </div>
              <button className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold text-lg shadow-lg hover:scale-105 transition-all">
                Newsletter abonnieren
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

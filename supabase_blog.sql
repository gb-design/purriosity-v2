-- Create the blog_posts table
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null, -- Markdown content
  cover_image text,
  author_name text default 'Dr. Mauz',
  tags text[] default '{}',
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Public Read Policy
create policy "Blog posts are viewable by everyone"
  on public.blog_posts for select
  using ( true );

-- Insert Dummy Content (Content Agent Style: Witty, Engaging, Cat-Focus)
insert into public.blog_posts (title, slug, excerpt, content, cover_image, tags)
values
  (
    'Warum dein Kater dich insgeheim beurteilt (und wie du damit lebst)',
    'warum-dein-kater-dich-beurteilt',
    'Fühlst du dich beobachtet? Das bildest du dir nicht ein. Eine psycho-analytische Betrachtung des "Juge-Face" deiner Katze.',
    '# Der Blick des Urteils

Es ist 7:00 Uhr morgens. Du öffnest die Augen. Und da ist es: Das Gesicht. Dein Kater sitzt auf deiner Brust, starrt dich an und du *weißt*, was er denkt.

"Schon wieder dieses Pyjama? Wirklich, Linda?"

Katzen sind Meister der stillen Kritik. Wir untersuchen heute, warum sie das tun und ob es Hoffnung für uns Dosenöffner gibt.

## 1. Die Futter-Verzögerung
Jede Sekunde, die der Napf leer bleibt, ist ein direkter Angriff auf seine Würde. Sein Blick sagt nicht nur "Ich habe Hunger", er sagt "Ich bin von Inkompetenz umgeben".

## 2. Die falsche Streichel-Technik
Zwei Zentimeter zu weit links? Strafe. Zu fest? Strafe. Zu weich? Glaub es oder nicht: Strafe.

**Fazit:**
Akzeptiere es. Du wirst niemals gut genug sein. Aber er liebt dich trotzdem. Vielleicht. Wenn du Tunfisch hast.',
    'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Humor', 'Psychologie', 'Kater-Life']
  ),
  (
    'Die 5 Phasen der "Zoomies": Eine wissenschaftliche Analyse',
    '5-phasen-der-zoomies',
    'Von 0 auf 100 in 0,3 Sekunden. Wir analysieren das Phänomen der nächtlichen Sprints.',
    '# Mitten in der Nacht...
BAMM! Etwas ist gegen die Tür gerannt.
KRATZ! Der Teppich wird ermordet.
MIAU! Der Gesang der Leere.

Wir nennen es "Die 5 Minuten". Wissenschaftler nennen es "FRAP" (Frenetic Random Activity Periods). Wir nennen es: Chaos.

## Phase 1: Der irre Blick
Die Pupillen weiten sich. Die Ohren drehen sich wie Radarstationen. Nichts ist passiert, aber die Katze sieht Geister.

## Phase 2: Der Startschuss
Ohne Vorwarnung explodiert die Katze. Sie ist jetzt flüssig und besteht zu 50% aus Krallen und zu 50% aus Geschwindigkeit.

## Phase 3: Parkour
Wände? Nur vertikale Böden. Vorhänge? Klettergerüste. Dein Gesicht? Ein Trampolin.

## Phase 4: Der Absturz
So schnell wie es kam, ist es vorbei. Die Katze sitzt da und putzt sich die Pfote als wäre nichts gewesen.

## Phase 5: Der tiefe Schlaf
Bis morgen Nacht, Mensch. Bis morgen Nacht.',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Wissenschaft', 'Humor', 'Training']
  ),
  (
    'Luxus vs. Karton: Warum du dein Geld verbrennst',
    'luxus-vs-karton',
    'Du hast das teuerste Katzenbett gekauft. Deine Katze schläft im Amazon-Karton. Warum?',
    '# Das Karton-Paradoxon

Du kaufst ein 150€Design-Bett aus Bio-Baumwolle.
Es kommt an.
Du packst es aus.
Die Katze springt in den Karton.
Das Bett wird ignoriert.

**Warum tun sie uns das an?**

1. **Sicherheit:** Ein Karton hat Wände. Das Weltall nicht.
2. **Wärme:** Pappe isoliert hervorragend.
3. **Provokation:** Sie wissen genau, was das Bett gekostet hat.

*Pro-Tipp:* Kauf einfach nichts mehr für die Katze. Bestell Pizza. Die Katze bekommt den Karton, du die Pizza. Win-Win.',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Lifehacks', 'Shopping', 'Fail']
  ),
   (
    'Geschenk-Guide für die Katze, die alles hasst',
    'geschenke-fuer-hater',
    'Schwieriger Kunde? Hier sind 3 Dinge, die sogar Grumpy Cat gemocht hätte.',
    '# Mission Impossible?

Deine Katze ist kein einfacher Fall. Spielzeug ist "langweilig", Leckerlis sind "unter ihrer Würde". Was schenkt man so jemandem?

1. **Ein anderes Futter**
Nicht besser. Nur anders. Für genau 2 Tage. Dann ist es wieder Gift.

2. **Ein Sonnenstrahl**
Kostenlos, aber schwer zu verpacken.

3. **Deine ungeteilte Aufmerksamkeit (aber nur genau 3 Sekunden)**
Nicht 2. Nicht 4. Genau 3. Sonst Blutbad.

Viel Glück!',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Geschenke', 'Humor']
  ),
   (
    'Das große Schnurr-Mysterium',
    'schnurr-mysterium',
    'Heilt Schnurren Knochenbrüche? Vielleicht. Macht es glücklich? Definitiv.',
    '# Der Motor der Liebe

Wusstest du, dass Katzen schnurren, wenn sie glücklich sind, aber auch, wenn sie Schmerzen haben? Es ist ihre Art zu sagen: "Alles wird gut."

Frequenzen zwischen 25 und 150 Hertz können angeblich die Heilung von Knochen fördern. Deine Katze ist also nicht nur faul, sie ist medizinisches Personal.

Also, wenn dir das nächste Mal alles zu viel wird: Katze schnappen, Gesicht ins Fell drücken (Vorsicht!) und die Vibrationen genießen. Es ist Therapie.',
    'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ARRAY['Gesundheit', 'Wissen', 'Love']
  );

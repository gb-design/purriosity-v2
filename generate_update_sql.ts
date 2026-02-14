
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using anon key, hope RLS allows update or I need service role. 
// RLS usually blocks updates from anon. I might need to disable RLS or use a service role if available. 
// Wait, the user provided VITE_SUPABASE_ANON_KEY. Usually this can't update.
// However, I can check if RLS allows it. If not, I will output the SQL commands for the user to run in Supabase SQL Editor.

// Actually, generating SQL is improved because I don't have the service role key.
console.log("-- SQL Script to update blog content with images and headings");
console.log("");

const richContent = [
    {
        slug: 'warum-dein-kater-dich-beurteilt',
        content: `# Der Blick des Urteils

Es ist 7:00 Uhr morgens. Du öffnest die Augen. Und da ist es: Das Gesicht. Dein Kater sitzt auf deiner Brust, starrt dich an und du *weißt*, was er denkt. "Schon wieder dieses Pyjama? Wirklich, Linda?"

Katzen sind Meister der stillen Kritik. Wir untersuchen heute, warum sie das tun und ob es Hoffnung für uns Dosenöffner gibt.

![Der urteilende Blick](https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=1200&q=80)
*Klassischer 'Ich bin enttäuscht'-Blick*

## 1. Die Futter-Verzögerung

Jede Sekunde, die der Napf leer bleibt, ist ein direkter Angriff auf seine Würde. Sein Blick sagt nicht nur "Ich habe Hunger", er sagt "Ich bin von Inkompetenz umgeben". Wissenschaftler haben herausgefunden, dass Katzen ein Zeitgefühl haben, das +- 2 Sekunden genau ist, wenn es um Futter geht.

### Warnsignale erkennen
*   **Stufe 1:** Sanftes Pföteln im Gesicht.
*   **Stufe 2:** Singen des "Liedes meines Volkes" (lautes Miauen).
*   **Stufe 3:** "Unfälle" mit Vasen.

![Hungrige Katze](https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=80)

## 2. Die falsche Streichel-Technik

Zwei Zentimeter zu weit links? Strafe. Zu fest? Strafe. Zu weich? Glaub es oder nicht: Strafe. Die "Belly Trap" (Bauchfalle) ist der Endgegner.

> "Der Bauch einer Katze ist das weichste Material im Universum, aber er wird von 5 spitzen Enden bewacht."

## 3. Akzeptanz ist der Schlüssel

Versuche gar nicht erst, perfekt zu sein. Deine Katze weiß, dass du nur ein Mensch bist. Ein nützlicher Mensch (Dosenöffner/Wärmflasche), aber eben fehlerhaft.

![Entspannte Katze](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80)

**Fazit:**
Akzeptiere es. Du wirst niemals gut genug sein. Aber er liebt dich trotzdem. Vielleicht. Wenn du Tunfisch hast.`
    },
    {
        slug: '5-phasen-der-zoomies',
        content: `# Mitten in der Nacht...

BAMM! Etwas ist gegen die Tür gerannt.
KRATZ! Der Teppich wird ermordet.
MIAU! Der Gesang der Leere.

Wir nennen es "Die 5 Minuten". Wissenschaftler nennen es "FRAP" (Frenetic Random Activity Periods). Wir nennen es: Chaos.

![Zoomies im Anmarsch](https://images.unsplash.com/photo-1495360019602-e001921678fe?auto=format&fit=crop&w=1200&q=80)

## Phase 1: Der irre Blick

Die Pupillen weiten sich. Die Ohren drehen sich wie Radarstationen. Nichts ist passiert, aber die Katze sieht Geister. Sie starrt eine leere Ecke an. Du bekommst Gänsehaut. Was ist da?

## Phase 2: Der Startschuss

Ohne Vorwarnung explodiert die Katze. Sie ist jetzt flüssig und besteht zu 50% aus Krallen und zu 50% aus reiner kinetischer Energie.

![Rennende Katze](https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1200&q=80)

## Phase 3: Parkour Extrem

Wände? Nur vertikale Böden. Vorhänge? Klettergerüste. Dein Gesicht im Schlaf? Ein perfektes Trampolin. Die Physik scheint für kurze Zeit ausgesetzt zu sein.

> "Warum den Boden benutzen, wenn man auch über Möbel fliegen kann?"

## Phase 4: Der Absturz

So schnell wie es kam, ist es vorbei. Die Katze sitzt da, atmet schwer und putzt sich die Pfote als wäre absolut nichts gewesen. Wenn du sie ansprichst ("Was war das denn?!"), schaut sie dich nur verwirrt an.

![Müde Katze](https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=1200&q=80)

## Phase 5: Der tiefe Schlaf

Bis morgen Nacht, Mensch. Bis morgen Nacht.`
    },
    {
        slug: 'luxus-vs-karton',
        content: `# Das Karton-Paradoxon

Du kaufst ein 150€ Design-Bett aus Bio-Baumwolle, handgewebt von Mönchen. Es kommt an. Du packst es aus. Die Vorfreude steigt.
Die Katze kommt, schnüffelt... und springt in den Versandkarton.
Das Bett wird ignoriert. Für immer.

![Katze im Karton](https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80)

**Warum tun sie uns das an?**

Wir haben die Wissenschaft befragt (und unsere weinenden Bankkonten).

## 1. Sicherheit & Festung

Ein Karton hat Wände. Hohe Wände. Wer im Karton sitzt, kann nicht von hinten angegriffen werden (vom fiesen Staubsauger zum Beispiel). Es ist eine strategische Position.

## 2. Wärme-Isolierung

Pappe isoliert fantastisch. Dein Design-Bett ist vielleicht weich, aber Pappe reflektiert die Körperwärme sofort zurück. Katzen sind Wärmebildkameras auf Beinen – sie finden immer den wärmsten Spot.

![Kuschelige Katze](https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80)
*Kein Karton, aber akzeptabel.*

## 3. Die Textur

Man kann Pappe so wunderbar kratzen und zerreißen. Es ist Bett *und* Spielzeug *und* Snack (bitte nicht essen lassen) in einem.

### Lösungsvorschläge für verzweifelte Besitzer

1.  Stell das teure Bett IN den Karton.
2.  Gib auf. Deine Wohnung gehört jetzt DHL.
3.  Kauf einfach nur noch Kartons.`
    }
];

richContent.forEach(item => {
    // Generate SQL update statements
    // Using $$ quoting to handle single quotes in text easily
    console.log(`UPDATE public.blog_posts SET content = $$${item.content}$$ WHERE slug = '${item.slug}';`);
});

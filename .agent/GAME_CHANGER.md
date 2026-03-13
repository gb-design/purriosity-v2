# 🚀 Purriosity – Game Changer Roadmap

> Stand: März 2026 · Stack: React 18 + TypeScript · Supabase · Vite · Tailwind CSS

---

## Inhalt

1. [Frontend – UX & Features](#1-frontend--ux--features)
2. [Admin Dashboard](#2-admin-dashboard)
3. [Backend & Supabase](#3-backend--supabase)
4. [Supabase Security](#4-supabase-security)
5. [Code-Qualität & Performance](#5-code-qualität--performance)
6. [Priorisierung](#6-priorisierung)

---

## 1. Frontend – UX & Features

### 1.1 Produktentdeckung
- [ ] **Infinite Scroll / Load More** – Produkte paginiert nachladen statt alles auf einmal (Performance + UX)
- [ ] **Sortierung** – Nach Neuheit, Beliebtheit (Purr-Count), Preis sortierbar
- [ ] **Mehrfach-Filter kombinieren** – AND/OR-Logik beim Tag-Filter wählbar (aktuell: AND)
- [ ] **Aktive Filter als Chips** – Oberhalb des Grids sichtbar, einzeln entfernbar
- [ ] **Produkt-Vorschau (Hover-Peek)** – Kurze Beschreibung & CTA beim Hover auf Desktop
- [ ] **"Zufälliges Produkt"** – Button zum zufälligen Entdecken eines Produkts
- [ ] **Kürzlich angesehen** – LocalStorage-basierte Historie der letzten 5–10 Produkte

### 1.2 Suche
- [ ] **Volltextsuche auf Supabase** – `tsvector`-Index auf `title` + `description` statt Client-side Filtering
- [ ] **Suchvorschläge mit Debounce** – Live-Vorschläge bereits während der Eingabe
- [ ] **Suchverlauf** – Letzte Suchanfragen (LocalStorage) im Dropdown anzeigen
- [ ] **Keine-Ergebnisse-State** – Smarter Fallback mit Alternativvorschlägen

### 1.3 Produktdetail
- [ ] **Ähnliche Produkte** – "Das könnte dir auch gefallen" Sektion (gleiche Kategorie)
- [ ] **Bildergalerie mit Zoom** – Lightbox mit Pinch-to-Zoom auf Mobile
- [ ] **Produktbewertung (intern)** – Sterne-Anzeige basierend auf Purr-Count-Ratio
- [ ] **Preisverlauf-Anzeige** – Falls historische Preisdaten erfasst werden (Zukunft)
- [ ] **Share-Button** – Native Share API (Mobile) + Clipboard Copy Link

### 1.4 User-Experience
- [ ] **Onboarding-Flow** – Kurze Kategorieauswahl beim ersten Besuch → personalisierter Feed
- [ ] **Gespeicherte Produkte offline** – PWA + Service Worker für Offline-Ansicht der Favoritenliste
- [ ] **Toast-System ausbauen** – Konsistentes Feedback für alle Aktionen (Purr, Save, Share)
- [ ] **Skeleton Loaders** – Statt "Lädt Produkte..." echte Skeleton-Karten zeigen
- [ ] **Dark/Light Mode persistieren** – Theme-Wahl in LocalStorage/Supabase speichern
- [ ] **Keyboard Navigation** – Vollständige Tastatursteuerung für Produkt-Grid und Filter
- [ ] **Cookie-Banner / Consent** – DSGVO-konformes Consent-Management (mind. für Analytics)

### 1.5 Blog
- [ ] **Lesezeit-Anzeige** – "5 Min. Lesezeit" basierend auf Wortanzahl
- [ ] **Tag-Filter im Blog** – Analog zum Produkt-Filter
- [ ] **Social Share** – Teilen-Buttons je Blogpost
- [ ] **Verwandte Artikel** – Am Ende jedes Posts basierend auf gemeinsamen Tags
- [ ] **Kommentarfunktion** – Einfache Supabase-backed Kommentare (optional mit Moderation)

---

## 2. Admin Dashboard

### 2.1 Analytics & Insights
- [ ] **Produkt-Performance-Tabelle** – Sortierbar nach Views, Purrs, Saves, Klicks (CTR)
- [ ] **Zeitreihen-Diagramme** – Views/Purrs pro Tag (letzte 30/90 Tage) – Chart.js oder Recharts
- [ ] **Top-10 Produkte** – Nach allen KPIs getrennt auswertbar
- [ ] **Suchanalyse** – Welche Begriffe werden gesucht, ohne Ergebnisse zu liefern
- [ ] **Funnel-Ansicht** – Views → Purrs → Saves → Affiliate-Klicks pro Produkt
- [ ] **Exportfunktion** – CSV-Export für alle Analytics-Daten

### 2.2 Produktverwaltung
- [ ] **Bulk-Aktionen** – Mehrere Produkte gleichzeitig aktivieren/deaktivieren/löschen
- [ ] **Duplicate Product** – Produkt klonen als Basis für ähnliche Einträge
- [ ] **Drag-&-Drop Sortierung** – Manuelle Reihenfolge der Featured-Produkte
- [ ] **Produkt-Status-Workflow** – Draft → Review → Published (statt nur active/inactive)
- [ ] **Versionierung** – Letzte Änderungen mit Timestamp und Admin-User protokollieren
- [ ] **Produkt-Import** – CSV/JSON Massenimport mit Validierung
- [ ] **Image Optimization Pipeline** – Automatisches Resizing & WebP-Konvertierung beim Upload

### 2.3 Blog-Verwaltung
- [ ] **Vorschau im Editor** – Split-View Markdown ↔ Vorschau
- [ ] **Scheduled Publishing** – Artikel zu einem zukünftigen Datum veröffentlichen
- [ ] **SEO-Felder** – Meta Title, Meta Description, OG-Image pro Post
- [ ] **Bild-Bibliothek** – Hochgeladene Bilder wiederverwenden statt erneut uploaden

### 2.4 User-Management
- [ ] **User-Übersicht** – Alle registrierten User mit Aktivität (Purrs, Saves)
- [ ] **Admin-Rollen** – Unterschied zwischen Super-Admin und Editor (Inhalt vs. Settings)
- [ ] **User sperren/löschen** – Moderationsfunktion
- [ ] **Einladungs-System** – Admins per E-Mail einladen statt manueller DB-Einträge

### 2.5 Allgemein
- [ ] **Aktivitäts-Log** – Alle Admin-Aktionen mit User + Timestamp protokollieren
- [ ] **Benachrichtigungen** – In-App Alerts bei z.B. neuem User, Fehler, etc.
- [ ] **Dashboard Widgets** – Konfigurierbare Kacheln (einblenden/ausblenden)
- [ ] **Zwei-Faktor-Authentifizierung (2FA)** – TOTP für Admin-Login

---

## 3. Backend & Supabase

### 3.1 Datenbankstruktur
- [ ] **`product_clicks` Tabelle** – Affiliate-Link-Klicks tracken (product_id, user_id?, timestamp, referrer)
- [ ] **`search_queries` Tabelle** – Suchanfragen loggen (query, results_count, created_at)
- [ ] **`admin_logs` Tabelle** – Audit-Trail für alle Admin-Aktionen
- [ ] **`product_versions` Tabelle** – History-Tracking für Produktänderungen
- [ ] **`notifications` Tabelle** – In-App Benachrichtigungen für Admins
- [ ] **Soft Delete** – `deleted_at`-Spalte statt hartem DELETE für Produkte und Posts

### 3.2 Supabase Edge Functions
- [ ] **Affiliate-Click-Handler** – Server-side Redirect + Tracking statt direkter Frontend-Links
  ```
  GET /functions/v1/redirect?id=<product_id>
  → Log click → Redirect to affiliate_url
  ```
- [ ] **Täglicher Report** – Scheduled Function, die eine Analytics-E-Mail an Admins sendet
- [ ] **Image Processing** – Edge Function für automatische WebP-Konvertierung & Thumbnail-Erstellung
- [ ] **Sitemap Generator** – Dynamische `sitemap.xml` aus Produkten + Blogposts

### 3.3 Performance
- [ ] **Materialized Views** – Für teure Aggregationen (top products, daily stats)
- [ ] **Supabase Realtime** – Live-Updates für Purr-Counter und Dashboard-Stats
- [ ] **CDN-Caching** – Supabase Storage mit Cache-Control Headers für Bilder
- [ ] **Produkt-Pagination** – `LIMIT`/`OFFSET` oder Cursor-based Pagination in der DB-Query

### 3.4 SEO & Crawler
- [ ] **Server-Side Rendering (SSR)** oder **Prerendering** – Für bessere SEO (Vite SSR oder Prerender-Plugin)
- [ ] **Dynamische OG-Images** – Edge Function generiert OG-Image pro Produkt (mit Satori)
- [ ] **Structured Data** – `Product`-Schema (JSON-LD) auf Produktdetailseiten
- [ ] **`robots.txt` & `sitemap.xml`** – Sauber gepflegt, Admin-Seiten ausgeschlossen

---

## 4. Supabase Security

### 4.1 Row Level Security (RLS) – Härtung
- [ ] **RLS auf allen Tabellen verifizieren** – Audit aller Policies, keine unbeabsichtigte Public-Writes
- [ ] **`product_clicks` mit Rate-Limiting** – Verhindert Klick-Inflation (max. 1 Klick/Produkt/User/Stunde)
- [ ] **`product_likes` Duplicate-Guard** – DB-Level UNIQUE Constraint auf `(user_id, product_id)`
- [ ] **Kein direkter Supabase-Key im Frontend** – Nur `anon`-Key; service_role Key nur in Edge Functions
- [ ] **JWT-Claims für Admin-Check** – `is_admin` als Custom Claim im JWT statt nur Profiles-Query

### 4.2 API & Auth
- [ ] **Supabase Auth – E-Mail Confirmation erzwingen** – Kein Login ohne bestätigte E-Mail
- [ ] **Rate Limiting für Auth** – Supabase Auth Rate-Limiting konfigurieren (Brute-Force-Schutz)
- [ ] **Refresh Token Rotation** – In `supabase.ts` explizit konfigurieren
- [ ] **Content Security Policy (CSP)** – Strikte CSP-Header in `index.html` oder via Hosting
- [ ] **`storage` Bucket auf Private stellen** – Produkt-Bilder über signierte URLs statt public

### 4.3 Input-Validierung
- [ ] **Zod-Schemas** – Für alle Formulare im Admin-Dashboard (statt nur TypeScript-Types)
- [ ] **URL-Validierung erweitern** – Affiliate-URLs gegen eine Allowlist von Plattformen prüfen
- [ ] **HTML-Sanitization** – Blog-Markdown-Output mit `DOMPurify` bereinigen vor dem Rendern
- [ ] **File-Upload Validierung** – MIME-Type + Größe serverseitig (Edge Function) prüfen

### 4.4 Monitoring & Auditing
- [ ] **Supabase Vault** – Secrets (API Keys für zukünftige Integrationen) in Supabase Vault
- [ ] **DB-Level Audit Logs** – PostgreSQL-Trigger für kritische Tabellen (Löschvorgänge)
- [ ] **Error-Tracking** – Sentry oder ähnliches für Frontend + Edge Function Errors
- [ ] **Uptime-Monitoring** – Externer Ping-Monitor (z.B. UptimeRobot) für die Live-URL

---

## 5. Code-Qualität & Performance

### 5.1 Architektur
- [ ] **Custom Hooks konsolidieren** – `useProductPurr` + `useSavedProducts` in einen `useProductActions`-Hook
- [ ] **`productService.ts` ausbauen** – Alle Supabase-Calls dorthin auslagern (aktuell: gemischt)
- [ ] **`ProductDetailPage.tsx` vs `ProductDetail.tsx`** – Duplikat bereinigen, eine Seite entfernen
- [ ] **Zentrales Error-Boundary** – React Error Boundary auf App-Ebene für unerwartete Fehler
- [ ] **Environment-Variablen typisieren** – `import.meta.env` mit einem Typ-Wrapper absichern

### 5.2 Testing
- [ ] **Unit Tests** – Vitest für Utilities (`normalizeCategory`, `productMapper`, `security.ts`)
- [ ] **Component Tests** – React Testing Library für kritische Komponenten (ProductCard, TagFilter)
- [ ] **E2E Tests** – Playwright für kritische User-Flows (Filter, Purr, Save, Admin Login)
- [ ] **Supabase lokal mit `supabase cli`** – Lokale Dev-Umgebung mit `supabase start`

### 5.3 Build & CI/CD
- [ ] **GitHub Actions Pipeline** – Lint → Type-Check → Build bei jedem PR
- [ ] **Automatisches Deployment** – Vercel/Netlify mit Preview-Deployments pro Branch
- [ ] **Bundle-Analyse** – `vite-bundle-analyzer` zum Identifizieren von zu großen Dependencies
- [ ] **Lazy Loading** – Admin-Routen per `React.lazy()` aus dem Initial-Bundle auslagern

### 5.4 Accessibility (a11y)
- [ ] **Focus Trapping in Modals** – ProductModal mit korrektem Focus Management
- [ ] **ARIA-Labels für Icons** – Alle Lucide-Icon-Buttons mit aussagekräftigen Labels
- [ ] **Kontrastverhältnisse prüfen** – WCAG 2.1 AA für alle Text/Hintergrund-Kombinationen
- [ ] **`prefers-reduced-motion`** – Animationen für Nutzer mit Bewegungsempfindlichkeit deaktivieren

---

## 6. Priorisierung

| Priorität | Feature | Aufwand | Impact |
|-----------|---------|---------|--------|
| 🔴 Hoch | Affiliate-Click-Tracking (Edge Function) | M | Hoch – direkte Monetarisierung |
| 🔴 Hoch | Volltext-Suche (Supabase tsvector) | S | Hoch – Kernfunktion |
| 🔴 Hoch | Skeleton Loaders | S | Mittel – sofort sichtbare UX |
| 🔴 Hoch | Zod-Validierung Admin-Formulare | S | Hoch – Datensicherheit |
| 🟡 Mittel | Infinite Scroll / Pagination | M | Hoch – Performance |
| 🟡 Mittel | Produkt-Analytics Tabelle im Dashboard | M | Hoch – Entscheidungsgrundlage |
| 🟡 Mittel | Bulk-Aktionen Produktverwaltung | M | Mittel – Admin-Effizienz |
| 🟡 Mittel | RLS Audit & JWT-Claims | M | Hoch – Security |
| 🟡 Mittel | OG-Images dynamisch | L | Mittel – SEO |
| 🟢 Niedrig | PWA / Service Worker | L | Mittel – Engagement |
| 🟢 Niedrig | Kommentarfunktion Blog | L | Niedrig |
| 🟢 Niedrig | 2FA für Admins | M | Mittel – Security |
| 🟢 Niedrig | Onboarding-Flow | L | Mittel – Retention |

> Aufwand: **S** = < 1 Tag · **M** = 1–3 Tage · **L** = > 3 Tage

---

*Dieses Dokument ist lebendig – Features hinzufügen, priorisieren und als erledigt markieren sobald umgesetzt.*

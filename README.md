# Purriosity V2 🐱

Die verrückteste Fundgrube für Katzenliebhaber – eine kuratierte Discovery-Plattform für außergewöhnliche Katzenprodukte.

## 🚀 Quick Start

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Build für Production
npm run build

# Preview Production Build
npm run preview
```

Der Development Server läuft auf `http://localhost:5173`

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 + shadcn/ui
- **Routing**: React Router 7
- **Icons**: Lucide React
- **Layout**: react-masonry-css

## 📁 Projekt-Struktur

```
purriosity-v2/
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TagFilter.tsx
│   │   │   └── MasonryGrid.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── products/
│   │       └── ProductCard.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── data/
│   │   └── mockProducts.ts
│   ├── types/
│   │   └── product.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── vite.svg
├── .agent/
│   └── skills/
│       └── ... (Agent-Instructions)
└── package.json
```

## 🎨 Design-System

### Farben
- **Background**: Warmes Beige (#FFF9F0)
- **Primary**: Lila (#9B59B6)
- **Accent**: Gelb (#FFD93D) & Orange (#FF9F45)

### Typografie
- **Display**: Outfit (Headlines)
- **Body**: Inter (Text)

### Komponenten
- Weiche Radien (0.75rem)
- Subtile Schatten
- Smooth Hover-Animationen

## 📝 Features (Phase 1)

✅ **Implementiert**:
- Hero-Bereich mit Claim und CTAs
- Tag-Filter (horizontal scrollbar)
- Masonry-Grid (Pinterest-Stil)
- Produktkarten mit Purr-Button & Save-Button
- Responsive Design (Desktop/Tablet/Mobile)
- Mock-Daten (20 Produkte)

🚧 **In Arbeit**:
- Produkt-Detailseite
- Git Repository Setup

⏳ **Geplant** (Phase 2+):
- Supabase Backend
- Authentifizierung (Google OAuth)
- Echte Purr/Save-Funktionalität
- Blog-Integration
- Admin-Dashboard

## 🧪 Scripts

```bash
# Linting
npm run lint

# Type-Check
npm run type-check

# Format Code (Prettier)
npx prettier --write .
```

## 📚 Dokumentation

Weitere Dokumentation findest du in:
- `/.agent/AGENT_GUIDE.md` - Agent Skills Guide
- `/.agent/skills/` - Spezialisierte Agent-Instructions

## 🎯 Roadmap

**Phase 1**: Fundament & Hauptseite ✅ (In Arbeit)
**Phase 2**: Backend & Authentifizierung
**Phase 3**: Blog & Content-Integration
**Phase 4**: Admin-Dashboard
**Phase 5**: Erweiterte Features

## 👥 Team

- **Vali** & **Georg** - Gründer
- **Leya**, **Luke**, **Gini** & **Kenzo** - Die wahren Chefs (Katzen 🐱)

## 📄 Lizenz

Alle Rechte vorbehalten © 2026 Purriosity

---

Made with 💜 and 🐱 by cat lovers, for cat lovers.

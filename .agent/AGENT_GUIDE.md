
# Purriosity - Agent Skills Guide

## 🤖 Wie du die Agenten verwendest

Alle Agent-Instructions sind jetzt in deinem Projekt unter `.agent/skills/` verfügbar.

### Verfügbare Agenten

```
.agent/skills/
├── README.md                    # Übersicht aller Agenten
├── project-manager/SKILL.md     # 🎯 Orchestrator & Quality Guardian
├── frontend/SKILL.md            # 💻 UI/UX Development
├── backend/SKILL.md             # 🗄️ Database & API
├── content/SKILL.md             # 📝 Content & SEO
├── devops/SKILL.md              # 🚀 Deployment & Infrastructure
└── qa/SKILL.md                  # ✅ Testing & Quality
```

---

## 📖 Wie du einen Agenten aktivierst

### Option 1: Skill direkt ansprechen
```
"Verwende den Frontend Skill und implementiere die Product Card Komponente"
```

### Option 2: SKILL.md öffnen
1. Öffne die entsprechende `SKILL.md` Datei
2. Der Agent liest automatisch die Instructions
3. Arbeite mit dem spezialisierten Agenten

---

## 🎯 Wann welchen Agenten verwenden?

### Project Manager Agent
**Wann**: 
- Feature-Planung
- Code Reviews
- Performance-Optimierung
- Koordination mehrerer Agenten

**Beispiel**: 
```
"Als Project Manager: Plane das Feature 'Public Collections' 
und koordiniere alle beteiligten Agenten"
```

---

### Frontend Agent
**Wann**:
- UI-Komponenten bauen
- Styling & Responsive Design
- Animationen & Micro-Interactions
- State Management

**Beispiel**:
```
"Als Frontend Agent: Implementiere den Purr Button mit Animation"
```

---

### Backend Agent
**Wann**:
- Database Schema ändern
- API-Endpoints erstellen
- Migrations schreiben
- RLS Policies definieren

**Beispiel**:
```
"Als Backend Agent: Erstelle eine Migration für die Collections-Tabelle"
```

---

### Content Agent
**Wann**:
- Produkte kuratieren
- Blog-Artikel schreiben
- SEO-Optimierung
- Pinterest-Content erstellen

**Beispiel**:
```
"Als Content Agent: Schreibe einen Blog-Post über 
'Die 10 verrücktesten Katzenprodukte 2026'"
```

---

### DevOps Agent
**Wann**:
- Deployment-Probleme
- CI/CD Pipeline anpassen
- Monitoring einrichten
- Environment Variables konfigurieren

**Beispiel**:
```
"Als DevOps Agent: Richte die GitHub Actions Pipeline ein"
```

---

### QA Agent
**Wann**:
- Tests schreiben
- Accessibility prüfen
- Performance testen
- Bug-Reports analysieren

**Beispiel**:
```
"Als QA Agent: Schreibe E2E-Tests für den Purr-Flow"
```

---

## 🔄 Multi-Agent Workflows

Für komplexe Features kannst du mehrere Agenten kombinieren:

```
"Als Project Manager: Koordiniere folgendes Feature:
1. Backend Agent: API für Collections
2. Frontend Agent: UI für Collections
3. QA Agent: Tests schreiben
4. DevOps Agent: Deployment"
```

---

## 📚 Weitere Ressourcen

- **README.md**: Komplette Agent-Übersicht mit Workflows
- **Jede SKILL.md**: Detaillierte Instructions für den jeweiligen Agenten

---

## 🚀 Los geht's!

Du bist jetzt bereit, mit spezialisierten Agenten zu arbeiten. 

**Tipp**: Starte mit dem **Project Manager Agent** für die Planung, 
dann delegiere an die spezialisierten Agenten!

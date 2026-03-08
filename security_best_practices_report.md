# Security Best Practices Report

## Executive Summary

Es wurden mehrere konkrete Security-Risiken im Frontend- und Supabase-Setup gefunden und gehaertet. Die wichtigsten Punkte waren Open-Redirect-Risiken im Login/OAuth-Flow, unzureichend validierte externe URLs und eine zu breite Kategorien-RLS-Policy in einer SQL-Datei. Die kritischen Pfade wurden angepasst und lokal per `eslint` und `tsc --noEmit` verifiziert.

## High Severity

### SBP-001 - Open Redirect ueber `redirect` Query/State im Login-Flow
- Rule ID: REACT-REDIRECT-001
- Severity: High
- Location: `src/pages/LoginPage.tsx:14`, `src/contexts/AuthContext.tsx:71`
- Evidence: Redirect-Ziel wurde direkt aus Query/State uebernommen und in Navigation/OAuth weitergereicht.
- Impact: Angreifer koennen Nutzer nach Login auf externe/phishing Seiten umleiten.
- Fix: Zentraler Redirect-Sanitizer (`getSafeRedirectPath`) eingefuehrt; erlaubt nur sichere same-origin Pfade.
- Mitigation: OAuth-Callback-URLs in Supabase weiterhin strikt auf erlaubte Domains beschraenken.
- Status: Fixed

### SBP-002 - Kategorien-RLS in Legacy-SQL erlaubte Write fuer alle Authenticated User
- Rule ID: SUPABASE-RLS-LEAST-PRIVILEGE
- Severity: High
- Location: `supabase_tags_settings.sql:26`, `supabase_tags_settings.sql:37`, `supabase_tags_settings.sql:55`
- Evidence: Policy-Checks nutzten nur `auth.role() = 'authenticated'`.
- Impact: Jeder eingeloggte User konnte Kategorien mutieren/loeschen.
- Fix: Admin-Pruefung via `public.profiles.is_admin = true` eingefuehrt und RLS explizit aktiviert.
- Mitigation: Nur die gehaerteten SQL-Skripte in Deployments verwenden.
- Status: Fixed

## Medium Severity

### SBP-003 - Externe Produktlinks nicht strikt validiert
- Rule ID: REACT-URL-001
- Severity: Medium
- Location: `src/components/products/ProductDetailView.tsx:115`, `src/pages/admin/ProductManagement.tsx:219`, `src/pages/admin/ProductManagement.tsx:430`
- Evidence: `affiliate_url` wurde direkt verwendet.
- Impact: `javascript:`/ungueltige URLs koennen zu unerwartetem Verhalten oder Missbrauch fuehren.
- Fix: `getSafeExternalUrl` eingefuehrt, nur `http/https` erlaubt; invalid URLs werden blockiert.
- Mitigation: DB-Constraint fuer URL-Format serverseitig ergaenzen.
- Status: Fixed

### SBP-004 - Markdown Links/Bilder ohne harte URL-Allowlist
- Rule ID: REACT-XSS-001 / REACT-URL-002
- Severity: Medium
- Location: `src/pages/BlogPost.tsx:119`, `src/pages/BlogPost.tsx:133`
- Evidence: Markdown-Renderer nahm Links/Bilder aus Content an.
- Impact: Unsichere Schemes oder ungueltige Targets koennen gerendert werden.
- Fix: Href/Src-Validierung mit `getSafeExternalUrl`; unsafe Eintraege werden nicht als klickbare/externe Ressourcen gerendert.
- Mitigation: Optional serverseitige Sanitization des Blog-Contents.
- Status: Fixed

## Low Severity

### SBP-005 - `.env` nicht in `.gitignore`
- Rule ID: REACT-CONFIG-001
- Severity: Low
- Location: `.gitignore:14`
- Evidence: `.env` wurde vorher nicht ausgeschlossen.
- Impact: Erhoehte Gefahr, lokale Konfigurationswerte versehentlich zu committen.
- Fix: `.env`, `.env.*` ausgeschlossen; `.env.example` explizit erlaubt.
- Mitigation: Falls `.env` jemals committed wurde: Historie pruefen und Keys rotieren.
- Status: Fixed

### SBP-006 - RLS nur aktiviert, aber nicht erzwungen (Defense-in-Depth)
- Rule ID: SUPABASE-RLS-HARDENING
- Severity: Low
- Location: `supabase_security_cleanup.sql:42`, `supabase_security_cleanup.sql:99`, `supabase_security_cleanup.sql:156`, `supabase_security_cleanup.sql:221`, `supabase_security_cleanup.sql:246`, `supabase_security_cleanup.sql:272`
- Evidence: `force row level security` fehlte.
- Impact: Potenziell weniger strikte Durchsetzung in Sonderfaellen mit privilegierten Rollen.
- Fix: `force row level security` fuer relevante Tabellen hinzugefuegt.
- Mitigation: Nach Ausfuehrung im Supabase SQL Editor Policies mit echten `anon/authenticated` Requests verifizieren.
- Status: Fixed

## Residual Risk / Follow-up

1. Sicherheits-Header (v. a. CSP, `X-Content-Type-Options`, `Referrer-Policy`) sind im Repo nicht zentral konfiguriert; wahrscheinlich am Hosting/Edge zu setzen.
2. SQL-Haertung wirkt erst nach Ausfuehrung der aktualisierten Skripte in Supabase.
3. Diese Pruefung ist statisch im Code erfolgt; ein dynamischer Pentest war nicht Teil des Umfangs.

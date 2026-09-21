# Git-CMS – Vorlage für die Aufgaben 13.1 bis 13.3

Vorlage für die Aufgaben des Moduls *IT-13 Content Management Systeme*: ein **Git-basiertes CMS** mit Astro.
Die Inhalte liegen als Markdown-Dateien in `src/content/beitraege/`, die Website wird daraus **statisch gebaut**.
Die genauen Aufgabenstellungen und die Abgaben in Teams stehen in den Teams-Assignments.

```
Markdown im Repo ──git push──► GitHub Actions baut die Seite ──► GitHub Pages (Static Site)
        ▲
  Pages CMS (Eingabemaske im Browser) schreibt ebenfalls per Commit ins Repo
```

## So startest du
1. Lokal: `npm install`, dann `npm run dev` ➔ **http://localhost:4321** (Codespace: Port 4321 öffnen).
2. Inhalte: Dateien in `src/content/beitraege/`. Schema: `src/content.config.ts`.
3. Bauen: `npm run build` (prüft dabei automatisch das Schema).

## Tests ausführen
```bash
npm test              # Aufgabe 13.1: Schema & Inhalte
npm run test:deploy   # Aufgabe 13.2: Deployment (GitHub Actions)
npm run test:cms      # Aufgabe 13.3: Pages CMS
```
Nach jedem `git push` prüft GitHub die Tests automatisch (✅ / ❌). Die Tests von späteren Aufgaben sind am Anfang noch rot – das ist normal.

## Hinweis Repository & Veröffentlichung
Für GitHub Pages im kostenlosen Account muss das Repository **öffentlich (public)** sein. Schreibe deshalb nie persönliche Daten
(Adresse, Telefonnummer, Fotos von Mitschüler:innen) in deine Beiträge.

## Abgabe-Screenshots
Speichere Screenshots im Ordner `docs/` und committe sie mit.

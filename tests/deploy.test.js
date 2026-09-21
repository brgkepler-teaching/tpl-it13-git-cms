// Automatische Prüfung für Aufgabe 13.2 (Deployment mit GitHub Actions).  Ausführen: npm run test:deploy
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const WORKFLOW = new URL("../.github/workflows/deploy.yml", import.meta.url);
const CONFIG = readFileSync(new URL("../astro.config.mjs", import.meta.url), "utf-8");

test("astro.config.mjs: site und base sind eingetragen (nicht auskommentiert)", () => {
  assert.match(CONFIG, /^\s*site\s*:\s*['"]https:\/\/[\w.-]+\.github\.io['"]/m, "Trage site: 'https://<name>.github.io' ein");
  assert.match(CONFIG, /^\s*base\s*:\s*['"]\/[\w.-]+['"]/m, "Trage base: '/<repo-name>' ein");
});

test("Workflow-Datei .github/workflows/deploy.yml existiert", () => {
  assert.ok(existsSync(WORKFLOW), "Lege die Datei .github/workflows/deploy.yml an");
});

const yml = existsSync(WORKFLOW) ? readFileSync(WORKFLOW, "utf-8") : "";

test("Workflow startet bei Push auf main", () => {
  assert.match(yml, /^on:/m, "Fehlt: on:");
  assert.match(yml, /push:/, "Fehlt: push:");
  assert.match(yml, /branches:\s*\[\s*main\s*\]|branches:\s*\n\s*-\s*main/, "Der Workflow soll bei Push auf main laufen");
});

test("Workflow hat die nötigen Rechte für GitHub Pages", () => {
  assert.match(yml, /pages:\s*write/, "permissions: pages: write fehlt");
  assert.match(yml, /id-token:\s*write/, "permissions: id-token: write fehlt");
});

test("Workflow baut die Seite und veröffentlicht sie", () => {
  assert.match(yml, /actions\/checkout@/, "Schritt 'checkout' fehlt");
  assert.match(yml, /withastro\/action@|npm run build/, "Bau-Schritt fehlt (withastro/action oder npm run build)");
  assert.match(yml, /actions\/deploy-pages@/, "Schritt 'actions/deploy-pages' fehlt");
  assert.match(yml, /needs:\s*build/, "Der Job deploy braucht: needs: build");
});

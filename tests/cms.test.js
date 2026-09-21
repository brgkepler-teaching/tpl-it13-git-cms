// Automatische Prüfung für Aufgabe 13.3 (Redaktionssystem im Browser: Pages CMS).  Ausführen: npm run test:cms
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const PAGES = new URL("../.pages.yml", import.meta.url);
const SCHEMA = readFileSync(new URL("../src/content.config.ts", import.meta.url), "utf-8");

test(".pages.yml existiert", () => {
  assert.ok(existsSync(PAGES), "Die Datei .pages.yml fehlt im Repository");
});

const yml = existsSync(PAGES) ? readFileSync(PAGES, "utf-8") : "";

test(".pages.yml verweist auf den Inhaltsordner", () => {
  assert.match(yml, /path:\s*src\/content\/beitraege/, "path: src/content/beitraege fehlt");
  assert.match(yml, /type:\s*collection/, "type: collection fehlt");
});

test("jedes Schema-Feld hat ein Formularfeld in .pages.yml", () => {
  const block = SCHEMA.match(/z\.object\(\{([\s\S]*?)\n\s*\}\)/);
  const felder = block ? [...block[1].matchAll(/^\s*(\w+)\s*:\s*z\./gm)].map((m) => m[1]) : [];
  assert.ok(felder.length >= 5, "Schema hat zu wenige Felder");
  for (const feld of felder) {
    assert.match(yml, new RegExp(`name:\\s*${feld}\\b`), `In .pages.yml fehlt ein Formularfeld für "${feld}"`);
  }
  assert.match(yml, /name:\s*body/, 'Das Feld "body" (Haupttext) fehlt');
});

test("es gibt mehr als 3 Beiträge (mind. einer wurde im Redaktionssystem geschrieben)", async () => {
  const { readdirSync } = await import("node:fs");
  const anzahl = readdirSync(new URL("../src/content/beitraege/", import.meta.url)).filter((f) => f.endsWith(".md")).length;
  assert.ok(anzahl >= 4, `Nur ${anzahl} Beiträge – schreibe einen weiteren im Pages CMS`);
});

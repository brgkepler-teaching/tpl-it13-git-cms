// Automatische Prüfung für Aufgabe 13.1 (Schema & Inhalte).  Ausführen: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const ORDNER = new URL("../src/content/beitraege/", import.meta.url);
const SCHEMA = readFileSync(new URL("../src/content.config.ts", import.meta.url), "utf-8");

function leseBeitrag(dateiname) {
  const text = readFileSync(new URL(dateiname, ORDNER), "utf-8").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  assert.ok(m, `${dateiname}: Frontmatter fehlt (Datei muss mit --- beginnen und mit --- enden)`);
  const daten = {};
  for (const zeile of m[1].split("\n")) {
    const kv = zeile.match(/^([\w-]+):\s*(.*)$/);
    if (kv) daten[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return { dateiname, daten, text: m[2].trim() };
}

// Felder aus dem Block  z.object({ ... })  lesen
function schemaFelder() {
  const block = SCHEMA.match(/z\.object\(\{([\s\S]*?)\n\s*\}\)/);
  return block ? [...block[1].matchAll(/^\s*(\w+)\s*:\s*z\./gm)].map((m) => m[1]) : [];
}

const beitraege = readdirSync(ORDNER).filter((f) => f.endsWith(".md")).map(leseBeitrag);

test("Schema: title, date, author und summary sind definiert", () => {
  const felder = schemaFelder();
  for (const feld of ["title", "date", "author", "summary"]) {
    assert.ok(felder.includes(feld), `Im Schema (z.object) fehlt das Feld "${feld}"`);
  }
});

test("Schema: mindestens 5 Felder (4 Pflichtfelder + 1 eigenes Feld)", () => {
  const felder = schemaFelder();
  assert.ok(felder.length >= 5, `Nur ${felder.length} Felder gefunden – ergänze ein eigenes Feld (z. B. kategorie)`);
});

test("mindestens 3 Beiträge vorhanden", () => {
  assert.ok(beitraege.length >= 3, `Nur ${beitraege.length} Beitrag/Beiträge – lege mindestens 3 an`);
});

test("jeder Beitrag hat vollständiges Frontmatter", () => {
  for (const b of beitraege) {
    for (const feld of ["title", "date", "author", "summary"]) {
      assert.ok(b.daten[feld], `${b.dateiname}: Feld "${feld}" fehlt oder ist leer`);
    }
    assert.match(b.daten.date, /^\d{4}-\d{2}-\d{2}$/, `${b.dateiname}: date muss so aussehen: 2026-10-05`);
  }
});

test("jeder Beitrag hat einen Text (mindestens 40 Wörter)", () => {
  for (const b of beitraege) {
    const woerter = b.text.split(/\s+/).filter(Boolean).length;
    assert.ok(woerter >= 40, `${b.dateiname}: nur ${woerter} Wörter im Text (mindestens 40)`);
  }
});

test("Beiträge haben unterschiedliche Titel", () => {
  const titel = beitraege.map((b) => b.daten.title);
  assert.equal(new Set(titel).size, titel.length, "Zwei Beiträge haben denselben Titel");
});

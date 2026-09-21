import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Das Schema ist der "Bauplan" für jeden Beitrag: Astro prüft beim Bauen, ob alle Felder stimmen.
// 🎯 TODO (Aufgabe 13.1): Ergänze die Felder  date (Datum), author (Text), summary (Text)
//    und ein EIGENES fünftes Feld, z. B.  kategorie: z.enum(['schule', 'technik', 'freizeit']).default('schule')
//    Typen:  z.string() Text | z.coerce.date() Datum | z.number() Zahl | z.boolean() Ja/Nein | z.enum([...]) Auswahl
const beitraege = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/beitraege' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { beitraege };

# ror-timeline# ror-timeline

Timeline per campagna di **Rise of the Runelords**.

## Struttura

- `index.html` → pagina principale
- `styles.css` → stile generale
- `app.js` → caricamento eventi, filtri, render
- `events.json` → archivio degli eventi

## Come aggiornare gli eventi

Apri `events.json` e aggiungi un nuovo oggetto seguendo questo schema:

```json
{
  "year": -5000,
  "date": "-5000 AR",
  "title": "Titolo evento",
  "category": "empire",
  "categoryLabel": "Impero",
  "description": "Descrizione dell'evento",
  "notes": "Nota opzionale"
}
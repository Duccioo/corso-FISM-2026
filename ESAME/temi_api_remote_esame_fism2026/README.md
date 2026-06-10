# Temi API remote — Esame FISM 2026

Questo archivio contiene 20 temi d'esame con API remote.

Ogni cartella contiene:

- `testo_esercizio.md`: consegna del tema.
- `script.js`: script JavaScript pronto da usare/adattare.
- `data.json`: dati locali di fallback se la API remota non risponde.

Nota pratica: per usare `fetch("data.json")` può essere necessario avviare un server locale:

```bash
python -m http.server 8000
```

Poi aprire nel browser:

```text
http://localhost:8000
```

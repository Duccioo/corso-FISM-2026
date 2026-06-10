# Tema 02 — Planner viaggio meteo

## Obiettivo

Realizzare un sito che aiuta a scegliere una destinazione di viaggio in base alle previsioni meteo.

## API remota da usare

API: **Open-Meteo Forecast API**

Documentazione ufficiale: https://open-meteo.com/en/docs

Endpoint consigliati:

- `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`

## Campi principali da usare

| Campo | Significato |
|---|---|
| `daily.temperature_2m_max` | Temperatura massima |
| `daily.temperature_2m_min` | Temperatura minima |
| `daily.precipitation_probability_max` | Probabilità pioggia |

## Pagine consigliate

Crea almeno 3 pagine HTML. Puoi usare questi nomi:

- `index.html`
- `destinazioni.html`
- `consigli.html`

## Cosa deve mostrare il sito

- Mostrare almeno 3 destinazioni.
- Associare a ogni destinazione un consiglio di viaggio.

## Struttura minima richiesta

La repository deve contenere almeno:

```text
nome-progetto/
├── README.md
├── index.html
├── pagina-1.html
├── pagina-2.html
├── style.css
├── script.js
├── data.json
├── docs/
│   ├── installazione.md
│   ├── faq.md
│   └── api.md
└── assets/
    └── immagini/
```

Il file `data.json` serve come dati di fallback se la API remota non risponde. Il sito deve provare prima a usare la API remota e poi, in caso di errore, usare i dati locali.

## Elementi HTML richiesti per lo script

Nella pagina in cui vuoi mostrare i dati dinamici inserisci almeno:

```html
<div id="status-message"></div>
<div id="data-container" class="row g-4"></div>
```

Collega lo script prima della chiusura di `body`:

```html
<script src="script.js"></script>
```

## Requisiti tecnici

- Sito multipagina con almeno 3 pagine HTML.
- Navbar funzionante e coerente in tutte le pagine.
- Uso di Bootstrap per layout, card, bottoni, alert o tabelle.
- File `style.css` personalizzato.
- Dati caricati da API remota tramite JavaScript.
- Fallback da `data.json` se la API non risponde.
- Messaggio di errore o avviso leggibile usando un alert Bootstrap.
- Percorsi relativi corretti per CSS, JS, immagini e documenti.

## Documentazione obbligatoria

Il progetto deve contenere:

- `README.md`: descrizione del progetto, tecnologie usate, requisiti necessari, struttura della repository, link ai documenti.
- `docs/installazione.md`: come clonare/aprire il progetto, avviare il server locale e aprire la pagina corretta.
- `docs/faq.md`: almeno 5 domande frequenti con risposte utili.
- `docs/api.md`: nome API, endpoint usati, campi principali, dove vengono mostrati nel sito, fallback locale.

## Bonus possibili

- +5 se il sito è bello, curato e coerente graficamente.
- +5 se GitHub Pages funziona ed è linkato nel README.
- +5 se è presente una licenza e viene spiegato perché è stata scelta.
- +5 se la documentazione contiene screenshot e/o GIF utili.

## Checklist finale

- [ ] La navbar collega tutte le pagine.
- [ ] Bootstrap è caricato correttamente.
- [ ] `style.css` è collegato.
- [ ] `script.js` è collegato.
- [ ] I dati della API vengono mostrati nella pagina.
- [ ] Se la API non risponde, vengono mostrati i dati di `data.json`.
- [ ] Il README linka `docs/installazione.md`, `docs/faq.md` e `docs/api.md`.
- [ ] I percorsi relativi funzionano.

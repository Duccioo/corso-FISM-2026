/*
  Script generico per esercizi FISM 2026 con data.json locale.

  Come usarlo nella pagina HTML:
  1. Collegare questo file prima della chiusura di </body>:
     <script src="script.js"></script>

  2. Inserire nella pagina gli elementi con questi ID:
     - status-message: area messaggi/errore
     - search-input: campo di ricerca opzionale
     - category-filter: select opzionale per categorie
     - items-count: numero elementi mostrati opzionale
     - cards-container: contenitore delle card
     - table-container: contenitore tabella opzionale

  Nota importante:
  fetch("data.json") spesso non funziona aprendo index.html con doppio click.
  Avviare un server locale, ad esempio:
     python -m http.server 8000
  Poi aprire http://localhost:8000 nel browser.
*/

const DATA_URL = "data.json";

const state = {
  items: [],
  filteredItems: [],
  columns: []
};

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return "";
  }, obj);
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

function showStatus(message, type = "info") {
  const status = document.querySelector("#status-message");
  if (!status) return;

  status.innerHTML = `
    <div class="alert alert-${type}" role="alert">
      ${escapeHTML(message)}
    </div>
  `;
}

function clearStatus() {
  const status = document.querySelector("#status-message");
  if (status) status.innerHTML = "";
}

function renderCategories(items) {
  const select = document.querySelector("#category-filter");
  if (!select) return;

  const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort();
  select.innerHTML = `<option value="">Tutte le categorie</option>`;

  categories.forEach(category => {
    select.innerHTML += `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`;
  });
}

function renderCards(items) {
  const container = document.querySelector("#cards-container");
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning">Nessun elemento trovato.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const details = Object.entries(item.fields || {})
      .slice(0, 4)
      .map(([key, value]) => `
        <li class="list-group-item d-flex justify-content-between gap-3">
          <span class="text-body-secondary">${escapeHTML(key)}</span>
          <strong class="text-end">${escapeHTML(value)}</strong>
        </li>
      `)
      .join("");

    return `
      <div class="col-md-6 col-lg-4">
        <article class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
              <h3 class="card-title h5 mb-0">${escapeHTML(item.title)}</h3>
              <span class="badge text-bg-primary">${escapeHTML(item.category)}</span>
            </div>
            <p class="text-body-secondary small mb-2">${escapeHTML(item.subtitle)}</p>
            <p class="card-text flex-grow-1">${escapeHTML(item.description)}</p>
            <ul class="list-group list-group-flush border rounded mt-2">
              ${details}
            </ul>
          </div>
        </article>
      </div>
    `;
  }).join("");
}

function renderTable(items) {
  const container = document.querySelector("#table-container");
  if (!container || state.columns.length === 0) return;

  const headers = state.columns
    .map(column => `<th scope="col">${escapeHTML(column.label)}</th>`)
    .join("");

  const rows = items.map(item => {
    const cells = state.columns
      .map(column => `<td>${escapeHTML(getNestedValue(item, column.key))}</td>`)
      .join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>${headers}</tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function updateCount(items) {
  const count = document.querySelector("#items-count");
  if (count) count.textContent = items.length;
}

function applyFilters() {
  const searchValue = normalizeText(document.querySelector("#search-input")?.value || "");
  const categoryValue = document.querySelector("#category-filter")?.value || "";

  state.filteredItems = state.items.filter(item => {
    const searchableText = normalizeText([
      item.title,
      item.subtitle,
      item.category,
      item.description,
      ...Object.values(item.fields || {})
    ].join(" "));

    const matchesSearch = !searchValue || searchableText.includes(searchValue);
    const matchesCategory = !categoryValue || item.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderCards(state.filteredItems);
  renderTable(state.filteredItems);
  updateCount(state.filteredItems);
}

async function loadData() {
  try {
    showStatus("Caricamento dati in corso...", "info");

    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }

    const data = await response.json();
    state.items = Array.isArray(data.items) ? data.items : [];
    state.columns = data.meta?.columns || [];

    renderCategories(state.items);
    applyFilters();
    clearStatus();
  } catch (error) {
    console.error(error);
    showStatus(
      "Impossibile caricare data.json. Controlla di aver avviato un server locale e che il file esista.",
      "danger"
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#search-input")?.addEventListener("input", applyFilters);
  document.querySelector("#category-filter")?.addEventListener("change", applyFilters);
  loadData();
});

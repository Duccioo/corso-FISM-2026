#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-ESAME/testi_esame}"

if ! command -v pandoc >/dev/null 2>&1; then
    echo "Errore: pandoc non trovato. Installa pandoc e riprova." >&2
    exit 1
fi

if ! command -v wkhtmltopdf >/dev/null 2>&1; then
    echo "Errore: wkhtmltopdf non trovato. Installa wkhtmltopdf e riprova." >&2
    exit 1
fi

if [[ ! -d "$ROOT_DIR" ]]; then
    echo "Errore: cartella non trovata: $ROOT_DIR" >&2
    exit 1
fi

TEMP_DIR="$(mktemp -d)"
CSS_FILE="$TEMP_DIR/tema-chiaro-esame.css"
trap 'rm -rf "$TEMP_DIR"' EXIT

cat > "$CSS_FILE" <<'CSS'
@page {
    size: A4;
    margin: 14mm 13mm;
}

html,
body {
    margin: 0;
    padding: 0;
    color: #1f2937;
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
    font-size: 10.2pt;
    line-height: 1.45;
}

body {
    max-width: 100%;
}

* {
    box-sizing: border-box;
}

h1,
h2,
h3,
h4 {
    color: #111827;
    line-height: 1.14;
    page-break-after: avoid;
}

h1 {
    margin: 0 0 8mm;
    padding-bottom: 4mm;
    border-bottom: 1.5px solid #dbe3ef;
    color: #1d4ed8;
    font-size: 21pt;
    letter-spacing: -0.01em;
}

h2 {
    margin: 7mm 0 3mm;
    color: #0f766e;
    font-size: 14.5pt;
}

h3 {
    margin: 5mm 0 2mm;
    color: #4f46e5;
    font-size: 12pt;
}

p,
ul,
ol,
pre,
table {
    margin-top: 0;
    margin-bottom: 3.2mm;
}

ul,
ol {
    padding-left: 6mm;
}

li {
    margin-bottom: 1.1mm;
}

a {
    color: #2563eb;
    text-decoration: none;
}

strong {
    color: #111827;
}

code {
    padding: 0.4mm 1.2mm;
    border: 1px solid #dbe3ef;
    border-radius: 3px;
    color: #9f1239;
    background: #f8fafc;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 8.9pt;
}

pre {
    padding: 3mm;
    border: 1px solid #dbe3ef;
    border-radius: 6px;
    color: #1f2937;
    background: #f8fafc;
    white-space: pre-wrap;
    page-break-inside: avoid;
}

pre code {
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
}

table {
    width: 100%;
    border-collapse: collapse;
    page-break-inside: avoid;
}

th,
td {
    padding: 1.8mm 2.2mm;
    border: 1px solid #dbe3ef;
    vertical-align: top;
}

th {
    color: #111827;
    background: #eef2ff;
}

td {
    background: #ffffff;
}

tr:nth-child(even) td {
    background: #f8fafc;
}

blockquote {
    margin: 0 0 3.2mm;
    padding: 2mm 3mm;
    border-left: 3px solid #0f766e;
    color: #475569;
    background: #f0fdfa;
}

hr {
    border: 0;
    border-top: 1px solid #dbe3ef;
}

input[type="checkbox"] {
    width: 10px;
    height: 10px;
}
CSS

count=0

while IFS= read -r -d '' markdown_file; do
    output_pdf="${markdown_file%.md}.pdf"
    temp_html="$TEMP_DIR/$(printf '%s' "$markdown_file" | tr '/ ' '__').html"
    title="$(sed -n 's/^# //p' "$markdown_file" | head -n 1)"
    if [[ -z "$title" ]]; then
        title="$(basename "$(dirname "$markdown_file")")"
    fi

    pandoc "$markdown_file" \
        --from=gfm+smart \
        --to=html5 \
        --standalone \
        --metadata "title=$title" \
        --css "$CSS_FILE" \
        --output "$temp_html"

    wkhtmltopdf \
        --quiet \
        --enable-local-file-access \
        --encoding utf-8 \
        --page-size A4 \
        --margin-top 14mm \
        --margin-right 13mm \
        --margin-bottom 14mm \
        --margin-left 13mm \
        "$temp_html" \
        "$output_pdf"

    count=$((count + 1))
    echo "Creato: $output_pdf"
done < <(find "$ROOT_DIR" -name 'testo_esercizio.md' -print0 | sort -z)

echo "PDF generati: $count"

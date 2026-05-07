# Comando:
Crea una struttura di cartelle per un progetto web che includa le directory "css", "js", "images" e un file index.html nella directory principale.

# Risoluzione:
    # Creiamo la directory principale del progetto
    mkdir progetto_web

    # Entriamo nella directory del progetto
    cd progetto_web

    # Creiamo le sottodirectory necessarie
    mkdir css js images

    mkdir css
    mkdir js
    mkdir images

    mkdir progetto_web progetto_web/css progetto_web/js progetto/web/images

    # Creiamo il file index.html vuoto
    touch index.html

    # Verifichiamo la struttura creata
    ls -la
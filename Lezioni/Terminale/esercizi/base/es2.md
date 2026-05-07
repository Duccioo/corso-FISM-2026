# Comando:
Crea un file chiamato "note.txt" con alcune frasi a tua scelta, poi conta quante parole contiene.


# Risoluzione:

    # Creiamo il file note.txt con un po' di contenuto
    echo "Questo è un file di esempio per imparare a usare il terminale. Git e GitHub sono strumenti essenziali per lo sviluppo software moderno." > note.txt

    

    # Contiamo le parole nel file
    wc -w note.txt

    # L'output sarà simile a: "20 note.txt" (il numero può variare in base al testo inserito)
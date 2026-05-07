# Comando:
Crea uno script che visualizzi alcune informazioni sul sistema usando variabili d'ambiente.


# Risoluzione:
    # Creiamo lo script
    echo '#!/bin/bash
    echo "Informazioni sul sistema:"
    echo "----------------------"
    echo "Nome utente: $USER"
    echo "Home directory: $HOME"
    echo "Shell in uso: $SHELL"
    echo "Sistema operativo: $(uname -s)"
    echo "Nome host: $(hostname)"
    echo "Path di sistema: $PATH"
    ' > sysinfo.sh

    # Rendiamo lo script eseguibile
    chmod +x sysinfo.sh

    # Eseguiamo lo script
    ./sysinfo.sh
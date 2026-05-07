# Comando:
Crea un alias temporaneo chiamato "ll" che esegua il comando "ls -la" e testalo.


# Risoluzione:
    # Creiamo l'alias
    alias ll='ls -la'

    # Testiamo l'alias
    ll

    # Nota: questo alias sarà disponibile solo nella sessione corrente del terminale
    # Per renderlo permanente, aggiungerlo al file .bashrc o .zshrc
# Comando:
Crea uno script bash chiamato "saluto.sh" che stampi "Ciao, mondo!" e rendilo eseguibile.


# Risoluzione:
    # Creiamo lo script
    
    echo '#!/bin/bash
    echo "Ciao, mondo!"' > saluto.sh

    # Rendiamo lo script eseguibile
    chmod +x saluto.sh

    # Eseguiamo lo script
    ./saluto.sh

    # L'output dovrebbe essere: "Ciao, mondo!"
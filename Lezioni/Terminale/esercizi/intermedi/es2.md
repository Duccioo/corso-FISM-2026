# Comando:
Crea tre file .txt con contenuto diverso, poi cerca in tutti i file quelli che contengono la parola "progetto".


# Risoluzione:
    # Creiamo i file con contenuto diverso
    echo "Questo è il primo file di testo per il nostro progetto." > file1.txt
    echo "Questo secondo file contiene informazioni varie." > file2.txt
    echo "Nel terzo file parliamo ancora del progetto Git." > file3.txt
    

    # Cerchiamo la parola "progetto" in tutti i file .txt
    grep -l "progetto" *.txt

    # L'output dovrebbe mostrare file1.txt e file3.txt
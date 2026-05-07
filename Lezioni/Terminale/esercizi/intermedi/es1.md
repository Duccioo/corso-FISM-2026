# Comando:
Elenca tutti i processi in esecuzione, filtra solo quelli relativi al browser e conta quanti sono.


# Risoluzione:
    # Su sistemi Unix-like (Linux/macOS)
    # Sostituisci "firefox" con il nome del tuo browser (chrome, safari, ecc.)
    ps aux | grep -i "firefox" | grep -v "grep" | wc -l

    # Su Windows PowerShell
    # Get-Process | Where-Object { $_.Name -like "*firefox*" } | Measure-Object | Select-Object -ExpandProperty Count
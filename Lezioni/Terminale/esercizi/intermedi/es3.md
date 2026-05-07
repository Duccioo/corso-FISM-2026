# Comando:
Crea uno script bash che accetti un parametro (nome di una directory) e mostri i 5 file più grandi in quella directory.


# Risoluzione:
# Mostra i 5 file più grandi
echo "I 5 file più grandi in $1:"
du -h "$1"/* 2>/dev/null | sort -rh | head -n 5
' > find_largest.sh

# Rendiamo lo script eseguibile
chmod +x find_largest.sh

# Eseguiamo lo script (ad esempio sulla directory corrente)
./find_largest.sh .
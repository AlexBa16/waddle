#!/usr/bin/env bash
# Exportiert stündlich alle Zeiteinträge aus der Waddle-Datenbank als CSV (eine Datei pro Projekt)
set -euo pipefail

# ---- Konfiguration -------------------------------------------------
DB_CONTAINER="waddle-db"                      # container_name aus compose.yaml
BACKUP_DIR="./waddle-backups"   # Zielordner anpassen falls gewünscht
# ---------------------------------------------------------------------

mkdir -p "$BACKUP_DIR"

if ! docker inspect "$DB_CONTAINER" >/dev/null 2>&1; then
    echo "$(date '+%F %T') FEHLER: Container '$DB_CONTAINER' läuft nicht." >&2
    exit 1
fi

DB_USER=$(docker exec "$DB_CONTAINER" printenv POSTGRES_USER)
DB_NAME=$(docker exec "$DB_CONTAINER" printenv POSTGRES_DB)

# Liste aller Projekte (id|projectname) holen
PROJECT_LIST_SQL="SELECT id, project_name FROM project ORDER BY id;"
mapfile -t PROJECT_LINES < <(
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -t -A -F'|' <<< "$PROJECT_LIST_SQL"
)

COUNT=0
for line in "${PROJECT_LINES[@]}"; do
    [ -z "$line" ] && continue
    PID="${line%%|*}"
    PNAME="${line#*|}"

    # Dateinamen filesystem-sicher machen, ID als Suffix gegen Namenskollisionen
    SAFE_NAME=$(echo "$PNAME" | tr -c 'A-Za-z0-9_-' '_')
    OUTFILE="$BACKUP_DIR/${SAFE_NAME}_project${PID}.csv"

    SQL=$(cat <<SQLEOF
COPY (
    SELECT te.id                                          AS "ID",
           to_char(te.start_time, 'DD.MM.YYYY')            AS "Datum",
           to_char(te.start_time, 'HH24:MI')                AS "Von",
           to_char(te.end_time, 'HH24:MI')                  AS "Bis",
           to_char(te.end_time - te.start_time, 'HH24:MI')  AS "Dauer",
           te.description                                  AS "Beschreibung",
           u.username                                       AS "Nutzer"
    FROM time_entry te
    JOIN "user" u ON u.id = te.tracked_by_id
    WHERE te.project_id = $PID
    ORDER BY te.start_time
) TO STDOUT WITH CSV HEADER
SQLEOF
)

    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<< "$SQL" > "$OUTFILE"
    COUNT=$((COUNT + 1))
done

echo "$(date '+%F %T') Backup abgeschlossen: $COUNT Projekt(e) -> $BACKUP_DIR"

## Crontab
# 0 * * * * /pfad/zu/waddle-csv-backup.sh >> /var/log/waddle-backup.log 2>&1
